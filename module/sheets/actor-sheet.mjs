/**
 * The KD20 Character sheet.
 *
 * Built on ApplicationV2 + HandlebarsApplicationMixin, which is the modern
 * Foundry v14 way. No ApplicationV1 anywhere.
 *
 * Drag-and-drop of items onto this sheet is inherited from ActorSheetV2, which
 * already handles creating the dropped item on the actor and re-sorting items
 * dragged within the sheet. We only add the create / open / delete buttons.
 */

const { HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

import { STAT_KEYS, STAT_LABELS, SAVE_KEYS, SAVE_LABELS, SAVE_COVERAGE, ARMOUR_TYPES } from "../config.mjs";
import { rollCheck, rollSave, rollAttack, refreshActionDice, promptRollOptions, promptAttackOptions }
  from "../dice/kd20-roll.mjs";

export default class KD20CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["kd20", "actor", "character"],
    position: { width: 600, height: 760 },
    window: { resizable: true },
    // Save as soon as a field changes, so computed values update live.
    // This merges with the inherited form handler rather than replacing it.
    form: { submitOnChange: true },
    actions: {
      itemCreate: KD20CharacterSheet.#onItemCreate,
      itemEdit: KD20CharacterSheet.#onItemEdit,
      itemDelete: KD20CharacterSheet.#onItemDelete,
      rollStat: KD20CharacterSheet.#onRollStat,
      rollSave: KD20CharacterSheet.#onRollSave,
      rollAttack: KD20CharacterSheet.#onRollAttack,
      refreshActionDice: KD20CharacterSheet.#onRefreshActionDice
    }
  };

  static PARTS = {
    body: { template: "systems/kd20/templates/actor/character.hbs" }
  };

  /* -------------------------------------------- */

  /** Assemble the values the template needs. */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const system = this.document.system;

    context.system = system;

    // Shape the six stats into a list so the template can loop once instead of
    // repeating near-identical markup six times.
    context.stats = STAT_KEYS.map(key => ({
      key,
      label: STAT_LABELS[key],
      score: system.stats[key].score,
      bonus: system.stats[key].bonus
    }));

    // Core rules v0.34: the six Saves, with a hover breakdown of stat + profile
    // (+ Hardened Save, v0.37) and what the Save defends against (v0.36).
    const profileSource = system.gatewayName ?? "Gateway";
    const signed = n => (n < 0 ? `−${-n}` : `+${n}`);
    context.saves = SAVE_KEYS.map(key => {
      const save = system.saves[key];
      const terms = [`${save.stat} ${signed(save.statBonus)}`, `${profileSource} profile ${signed(save.profile)}`];
      if ( save.hardened.applied ) terms.push(`Hardened Save ×${save.hardened.applied} ${signed(save.hardened.bonus)}`);
      return {
        key,
        label: SAVE_LABELS[key],
        stat: save.stat,
        total: save.total,
        hardened: save.hardened.applied,
        breakdown: `${terms.join(", ")}\n${SAVE_COVERAGE[key]}`
      };
    });

    // Feat rules the sheet could not apply, so the player knows why a number
    // did not move. Core rules v0.37 (Hardened Save) and v0.39 (AC feats).
    const warnings = [];
    for ( const key of SAVE_KEYS ) {
      const { wasted, cap } = system.saves[key].hardened;
      if ( wasted ) warnings.push(`${SAVE_LABELS[key]}: ${wasted} Hardened Save purchase(s) beyond its `
        + `${signed(cap)} cap raise nothing (Major +5 needs a gateway-Solid Save; a −3 lifts only to 0).`);
    }
    if ( system.unassignedHardenedSaves ) {
      warnings.push(`${system.unassignedHardenedSaves} Hardened Save feat(s) have no Save chosen — `
        + "open the feat and pick one.");
    }
    for ( const [label, feat] of [["Armour Training", system.acFeats.armourTraining],
      ["Unarmored Defense", system.acFeats.unarmoredDefense]] ) {
      if ( feat.reason ) warnings.push(`${label}: ${feat.reason}`);
    }
    context.featWarnings = warnings;

    // Core rules v0.39: AC breakdown and the armour category that gates the AC feats.
    context.acBreakdown = system.acParts.map(p => `${p.label} ${signed(p.value)}`).join(", ");
    context.armourTypes = ARMOUR_TYPES;
    context.saveLabels = SAVE_LABELS;

    // Split the actor's owned items into the three KD20 categories.
    context.gateways = this.actor.items.filter(i => i.type === "gateway");
    context.feats = this.actor.items.filter(i => i.type === "feat");
    context.weapons = this.actor.items.filter(i => i.type === "weapon");

    // Spec section 4a: a character normally has one Gateway. We do not enforce
    // that in v1, but we do warn if there are several, because only the first
    // one contributes its HP bonus.
    context.multipleGateways = context.gateways.length > 1;

    return context;
  }

  /* -------------------------------------------- */
  /*  Event handlers                              */
  /* -------------------------------------------- */

  /**
   * Create a new embedded item of the type named on the button.
   * @this {KD20CharacterSheet}
   */
  static async #onItemCreate(event, target) {
    const type = target.dataset.itemType;
    const label = game.i18n.localize(`TYPES.Item.${type}`);
    await foundry.documents.Item.implementation.create(
      { name: `New ${label}`, type },
      { parent: this.actor, renderSheet: true }
    );
  }

  /* -------------------------------------------- */

  /**
   * Open the sheet of the clicked item.
   * @this {KD20CharacterSheet}
   */
  static #onItemEdit(event, target) {
    const item = this.#getItem(target);
    item?.sheet.render({ force: true });
  }

  /* -------------------------------------------- */

  /**
   * Delete the clicked item, after confirming.
   * @this {KD20CharacterSheet}
   */
  static async #onItemDelete(event, target) {
    const item = this.#getItem(target);
    if ( !item ) return;
    const confirmed = await DialogV2.confirm({
      window: { title: "Delete Item" },
      content: `<p>Delete <strong>${foundry.utils.escapeHTML(item.name)}</strong> from
                ${foundry.utils.escapeHTML(this.actor.name)}?</p>`
    });
    if ( confirmed ) await item.delete();
  }

  /* -------------------------------------------- */
  /*  Rolling (spec sections 1, 5 and 6)          */
  /* -------------------------------------------- */

  /**
   * Roll a basic check on the clicked Statistic.
   * @this {KD20CharacterSheet}
   */
  static async #onRollStat(event, target) {
    const statKey = target.dataset.stat;
    if ( !statKey ) return;
    const options = await promptRollOptions(`${STAT_LABELS[statKey]} Check`, "DC");
    if ( !options ) return;
    await rollCheck({ actor: this.actor, statKey, ...options });
  }

  /* -------------------------------------------- */

  /**
   * Roll the clicked Save. Core rules v0.34: the target is usually the
   * attacker's total, since a Save is a contest.
   * @this {KD20CharacterSheet}
   */
  static async #onRollSave(event, target) {
    const saveKey = target.dataset.save;
    if ( !SAVE_KEYS.includes(saveKey) ) return;
    const options = await promptRollOptions(SAVE_LABELS[saveKey], "Attacker's total / DC");
    if ( !options ) return;
    await rollSave({ actor: this.actor, saveKey, ...options });
  }

  /* -------------------------------------------- */

  /**
   * Roll an attack with the clicked Weapon.
   * @this {KD20CharacterSheet}
   */
  static async #onRollAttack(event, target) {
    const weapon = this.#getItem(target);
    if ( !weapon ) return;
    // Targeted tokens pre-fill (or, if several, replace) the Target AC.
    const options = await promptAttackOptions(`${weapon.name} Attack`);
    if ( !options ) return;
    await rollAttack({ actor: this.actor, weapon, ...options });
  }

  /* -------------------------------------------- */

  /**
   * Spec section 6: raise the Action Dice pool to its refresh rate.
   * @this {KD20CharacterSheet}
   */
  static async #onRefreshActionDice() {
    await refreshActionDice(this.actor);
  }

  /* -------------------------------------------- */

  /** Find the item belonging to a clicked row. */
  #getItem(target) {
    const row = target.closest("[data-item-id]");
    return row ? this.actor.items.get(row.dataset.itemId) : null;
  }
}
