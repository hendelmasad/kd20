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

import { STAT_KEYS, SAVE_KEYS, SAVE_STATS } from "../config.mjs";

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

      // Spec section 3: manual AC contributions. Equipment automation is out of
      // scope for v1, so these are typed in by hand.
      defence: new fields.SchemaField({
        armour: int(0),
        shield: int(0),
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
    // character with no Gateway is valid: HP and the Saves are the only derived
    // values a Gateway touches, and every other derived stat ignores it.
    const gateway = this.parent?.items?.find(i => i.type === "gateway");
    const hpBonus = gateway?.system?.hpBonus;
    this.gatewayHpBonus = Number.isFinite(hpBonus) ? hpBonus : 0;

    // Spec section 3: the three derived statistics.
    this.ac = 10 + this.stats.dex.bonus
      + this.defence.armour + this.defence.shield + this.defence.misc;

    this.hp.max = 10 + this.stats.con.bonus + this.stats.wis.bonus + this.gatewayHpBonus;

    // Core rules v0.34: the six rolled Saves. Each is 1d20 + stat + the gateway's
    // profile step; only the static part (stat + profile) is computed here, the
    // d20 is rolled at the table. A missing gateway or profile value counts 0.
    // TODO: feat-based Save bonuses; with several gateways, read the PRIMARY
    // gateway's profile only (for now this is simply the first gateway).
    this.gatewayName = gateway?.name ?? null;
    this.saves = {};
    for ( const key of SAVE_KEYS ) {
      const stat = SAVE_STATS[key];
      const step = gateway?.system?.saveProfile?.[key];
      const profile = Number.isFinite(step) ? step : 0;
      const statBonus = this.stats[stat].bonus;
      this.saves[key] = { stat, statBonus, profile, total: statBonus + profile };
    }

    // Initiative stores only the BONUS. The actual roll is 1d20 + this, made
    // fresh each round.
    this.initiative = { bonus: Math.max(this.stats.dex.bonus, this.stats.wis.bonus) };

    // Never let current HP sit above a max that just shrank.
    this.hp.value = Math.min(this.hp.value, this.hp.max);
  }

  /* -------------------------------------------- */

  // TODO (post-v1, spec section 7): threat/NPC actor type, automated
  // States/conditions, magic trapping automation, equipment and armour tables,
  // XP automation, and the Master Feat's die-stacking.
}
