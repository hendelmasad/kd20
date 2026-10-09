/**
 * The KD20 Character actor data model.
 *
 * Implements Implementation Spec sections 2 (Statistics), 3 (Derived Statistics)
 * and 6 (Action Dice).
 *
 * Two kinds of values live here:
 *
 *  - STORED values are in `defineSchema()`. These are saved to the database and
 *    are the only things a player ever types into.
 *  - COMPUTED values are assigned in `prepareDerivedData()`. These are rebuilt
 *    from scratch every time the actor changes, so they can never drift out of
 *    sync with the stored values. They are deliberately NOT in the schema.
 */

import {
  STAT_KEYS, STAT_LABELS, SAVE_KEYS, SAVE_STATS, SAVE_LADDER, HARDENED_SAVE_COST, hardenedSaveCap,
  ARMOUR_CATEGORIES, ARMOUR_TRAINING_MAX
} from "../config.mjs";

const fields = foundry.data.fields;

export default class KD20CharacterData extends foundry.abstract.TypeDataModel {

  /** Lets Foundry pull field labels out of lang/en.json under KD20.Character. */
  static LOCALIZATION_PREFIXES = ["KD20.Character"];

  /* -------------------------------------------- */
  /*  Stored data                                 */
  /* -------------------------------------------- */

  static defineSchema() {

    /** A whole number that is never null, so arithmetic can never produce NaN. */
    const int = (initial, extra = {}) => new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial,
      ...extra
    });

    return {

      // Spec section 2: six raw Statistic scores, typically 3-20.
      stats: new fields.SchemaField(Object.fromEntries(STAT_KEYS.map(key => [
        key,
        new fields.SchemaField({ score: int(10, { min: 0 }) })
      ]))),

      // Spec section 3: HP is a current/max pair. Only `value` is stored;
      // `max` is computed below.
      hp: new fields.SchemaField({
        value: int(10, { min: 0 })
      }),

      // Spec section 3: the one manual AC contribution left. Armour and shield
      // come from equipped Armour items (see #prepareAc).
      defence: new fields.SchemaField({
        misc: int(0)
      }),

      // Spec section 6: the spendable Action Dice pool.
      actionDice: new fields.SchemaField({
        value: int(5, { min: 0 }),
        refresh: int(5, { min: 0 })
      }),

      // Spec section 7: v1 keeps these deliberately simple and unautomated.
      xp: int(0, { min: 0 }),
      conditions: new fields.StringField({ required: true, blank: true, initial: "" }),
      biography: new fields.HTMLField({ required: true, blank: true, initial: "" })
    };
  }

  /* -------------------------------------------- */
  /*  Computed data                               */
  /* -------------------------------------------- */

  /**
   * Runs automatically whenever the actor changes. Foundry calls this AFTER
   * embedded items have been prepared, so reading `this.parent.items` here is
   * safe (verified against the v14 source: ClientDocument#prepareData calls
   * prepareEmbeddedDocuments() before system.prepareDerivedData()).
   */
  prepareDerivedData() {

    // Spec section 2: bonus = floor((score - 10) / 2).
    // 10-11 -> +0, 12-13 -> +1, ... and negative below 10: 8-9 -> -1.
    for ( const key of STAT_KEYS ) {
      const stat = this.stats[key];
      stat.bonus = Math.floor((stat.score - 10) / 2);
    }

    // Spec section 3: the Gateway item supplies an HP bonus; 0 if none. A
    // character with no Gateway is valid: HP, the Saves and (via Unarmored
    // Defense's themed stat) AC are the only derived values a Gateway touches,
    // and each treats a missing Gateway as contributing nothing.
    const gateway = this.parent?.items?.find(i => i.type === "gateway");
    const hpBonus = gateway?.system?.hpBonus;
    this.gatewayHpBonus = Number.isFinite(hpBonus) ? hpBonus : 0;

    // Owned feats that the sheet computes (core rules v0.37/v0.39), grouped by
    // `system.mechanic.kind`. Each owned copy is one purchase.
    const feats = { hardenedSave: [], armourTraining: [], unarmoredDefense: [] };
    for ( const item of this.parent?.items ?? [] ) {
      if ( item.type !== "feat" ) continue;
      const kind = item.system?.mechanic?.kind;
      if ( kind in feats ) feats[kind].push(item);
    }

    // Spec section 3: the three derived statistics.
    this.armour = KD20CharacterData.equippedArmour(this.parent?.items ?? []);
    this.ac = this.#prepareAc(gateway, feats);

    this.hp.max = 10 + this.stats.con.bonus + this.stats.wis.bonus + this.gatewayHpBonus;

    // Core rules v0.34: the six rolled Saves. Each is 1d20 + stat + the gateway's
    // profile step (+ Hardened Save steps, v0.37); only the static part is
    // computed here, the d20 is rolled at the table. A missing gateway or profile
    // value counts 0.
    // TODO: with several gateways, read the PRIMARY gateway's profile only (for
    // now this is simply the first gateway).
    this.gatewayName = gateway?.name ?? null;
    this.saves = {};
    for ( const key of SAVE_KEYS ) {
      const stat = SAVE_STATS[key];
      const step = gateway?.system?.saveProfile?.[key];
      const profile = Number.isFinite(step) ? step : 0;
      const statBonus = this.stats[stat].bonus;
      const owned = feats.hardenedSave.filter(f => f.system.mechanic.save === key).length;
      const hardened = KD20CharacterData.climbSave(profile, owned);
      this.saves[key] = {
        stat, statBonus, profile, hardened,
        total: statBonus + profile + hardened.bonus
      };
    }
    // Hardened Save copies with no Save chosen raise nothing; the sheet flags them.
    this.unassignedHardenedSaves = feats.hardenedSave.filter(f => !SAVE_KEYS.includes(f.system.mechanic.save)).length;

    // Initiative stores only the BONUS. The actual roll is 1d20 + this, made
    // fresh each round.
    this.initiative = { bonus: Math.max(this.stats.dex.bonus, this.stats.wis.bonus) };

    // Never let current HP sit above a max that just shrank.
    this.hp.value = Math.min(this.hp.value, this.hp.max);
  }

  /* -------------------------------------------- */

  /**
   * Core rules v0.39: what the character has equipped. Equipped gear is the
   * source of truth for AC and for the AC feats' armour gate.
   *
   * One body armour and one shield count. If several of either are equipped,
   * the one with the highest bonus counts and the rest are reported as `extra`
   * (the sheet's equip toggle prevents this; a drag-and-drop can still cause it).
   *
   * @param {Iterable<Item>} items   The actor's owned items.
   * @returns {{category: string, body: {name: string, category: string, bonus: number}|null,
   *            shield: {name: string, bonus: number}|null, extraBody: number, extraShields: number}}
   */
  static equippedArmour(items) {
    const equipped = [...items].filter(i => (i.type === "armour") && i.system?.equipped);
    const best = list => list.reduce((top, i) => (!top || (i.system.armourBonus > top.system.armourBonus)) ? i : top, null);
    const bodies = equipped.filter(i => !i.system.isShield);
    const shields = equipped.filter(i => i.system.isShield);
    const body = best(bodies);
    const shield = best(shields);
    const bonusOf = i => (Number.isFinite(i.system.armourBonus) ? i.system.armourBonus : 0);
    const category = body?.system.category ?? "none";
    return {
      category,
      body: body ? { name: body.name, category, bonus: bonusOf(body) } : null,
      shield: shield ? { name: shield.name, bonus: bonusOf(shield) } : null,
      extraBody: Math.max(bodies.length - 1, 0),
      extraShields: Math.max(shields.length - 1, 0)
    };
  }

  /* -------------------------------------------- */

  /**
   * Core rules v0.39: AC, from equipped gear and the two AC feats.
   *
   *  - Normally AC = 10 + dex + equipped armour + equipped shield + misc, plus
   *    +1 per Armour Training (max +2) while the equipped armour is medium or
   *    heavy. Dex always applies, whatever the category.
   *  - Unarmored Defense, while light or no armour is equipped and the gateway
   *    names a themed stat, REPLACES the armour term: 10 + dex + themed stat +
   *    shield + misc (a shield is fine).
   *
   * The two feats' requirements are opposites, so at most one ever applies.
   * The ~20 soft cap is a GM target, not a clamp, so nothing is capped here.
   *
   * Reads `this.armour` (see equippedArmour). Records `this.acParts` (the
   * breakdown, for the sheet) and `this.acFeats` (each feat's state and, if it
   * is not applying, why not).
   *
   * @param {Item|undefined} gateway
   * @param {{armourTraining: Item[], unarmoredDefense: Item[]}} feats
   * @returns {number}
   */
  #prepareAc(gateway, feats) {
    const { category, body, shield } = this.armour;
    const heavierThanLight = (category === "medium") || (category === "heavy");
    const dex = this.stats.dex.bonus;

    const training = { owned: feats.armourTraining.length, bonus: 0, reason: null };
    if ( training.owned ) {
      if ( !heavierThanLight ) training.reason = "Needs medium or heavy armour equipped.";
      else {
        training.bonus = Math.min(training.owned, ARMOUR_TRAINING_MAX);
        if ( training.owned > ARMOUR_TRAINING_MAX ) {
          training.reason = `Only ${ARMOUR_TRAINING_MAX} purchases count (max +${ARMOUR_TRAINING_MAX} AC).`;
        }
      }
    }

    const statKey = gateway?.system?.unarmoredStat || null;
    const unarmored = { owned: feats.unarmoredDefense.length, active: false, stat: statKey, reason: null };
    if ( unarmored.owned ) {
      if ( !STAT_KEYS.includes(statKey) ) unarmored.reason = "Your gateway names no Unarmored Defense stat.";
      else if ( heavierThanLight ) unarmored.reason = "Needs light or no armour equipped.";
      else unarmored.active = true;
    }
    this.acFeats = { armourTraining: training, unarmoredDefense: unarmored };

    const parts = [{ label: "Base", value: 10 }, { label: "Dexterity", value: dex }];
    if ( unarmored.active ) {
      parts.push({ label: `Unarmored Defense (${STAT_LABELS[statKey]})`, value: this.stats[statKey].bonus });
      if ( body ) parts.push({ label: `${body.name} (replaced by Unarmored Defense)`, value: 0 });
    } else {
      if ( body ) parts.push({ label: `${body.name} (${ARMOUR_CATEGORIES[body.category]})`, value: body.bonus });
      if ( training.bonus ) parts.push({ label: "Armour Training", value: training.bonus });
    }
    if ( shield ) parts.push({ label: shield.name, value: shield.bonus });
    parts.push({ label: "Misc", value: this.defence.misc });
    this.acParts = parts;
    return parts.reduce((sum, p) => sum + p.value, 0);
  }

  /* -------------------------------------------- */

  /**
   * Core rules v0.37: climb a Save up the Modifier Ladder with Hardened Save.
   *
   * Each purchase buys the next rung above the current value (-3 -> 0 -> +1 ->
   * +3 -> +5), up to the cap the gateway profile allows (see hardenedSaveCap).
   * Purchases beyond the cap raise nothing and are reported as `wasted`.
   *
   * @param {number} profile   The gateway profile step for this Save.
   * @param {number} owned     How many Hardened Save copies target this Save.
   * @returns {{owned: number, applied: number, wasted: number, bonus: number, cap: number,
   *            steps: Array<{from: number, to: number, cost: number}>}}
   */
  static climbSave(profile, owned) {
    const cap = hardenedSaveCap(profile);
    const steps = [];
    let value = profile;
    for ( let i = 0; i < owned; i++ ) {
      const next = SAVE_LADDER.find(rung => rung > value);
      if ( (next === undefined) || (next > cap) ) break;
      steps.push({ from: value, to: next, cost: HARDENED_SAVE_COST[next] });
      value = next;
    }
    return { owned, applied: steps.length, wasted: owned - steps.length, bonus: value - profile, cap, steps };
  }

  /* -------------------------------------------- */

  // TODO (post-v1, spec section 7): threat/NPC actor type, automated
  // States/conditions, magic trapping automation, general equipment (armour is
  // done, v0.39), XP automation, and the Master Feat's die-stacking.
}
