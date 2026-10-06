/**
 * The KD20 Item sheet.
 *
 * One class serves all three item types. The template is chosen at render time
 * from the item's own type, so Gateway, Feat and Weapon each get their own
 * layout without needing three separate sheet classes.
 */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

import { FEAT_TYPES, DIE_CHOICES, STAT_KEYS, STAT_LABELS, SAVE_KEYS, SAVE_LABELS, SAVE_STATS }
  from "../config.mjs";

export default class KD20ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["kd20", "item"],
    position: { width: 520, height: "auto" },
    window: { resizable: true },
    form: { submitOnChange: true }
  };

  /** The template here is a placeholder; _configureRenderParts swaps it. */
  static PARTS = {
    body: { template: "systems/kd20/templates/item/gateway.hbs" }
  };

  /* -------------------------------------------- */

  /** Pick the template that matches this item's type. */
  _configureRenderParts(options) {
    const parts = super._configureRenderParts(options);
    parts.body.template = `systems/kd20/templates/item/${this.document.type}.hbs`;
    return parts;
  }

  /* -------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.system = this.document.system;

    // Dropdown choices, passed in so the templates stay free of hardcoded lists.
    context.choices = {
      featTypes: FEAT_TYPES,
      dice: DIE_CHOICES,
      diceWithDefault: { "": "(same as damage die)", ...DIE_CHOICES },
      stats: Object.fromEntries(STAT_KEYS.map(k => [k, STAT_LABELS[k]]))
    };

    // Gateways: the six Save-profile steps, shaped into a list for one loop.
    if ( this.document.type === "gateway" ) {
      context.saveProfile = SAVE_KEYS.map(key => ({
        key,
        label: SAVE_LABELS[key],
        stat: SAVE_STATS[key],
        value: this.document.system.saveProfile[key]
      }));
    }

    // Rich-text fields (description, effect, benefit) are edited with a toggled
    // <prose-mirror> editor, which displays this enriched HTML while closed.
    context.systemFields = this.document.system.schema.fields;
    context.disabled = !this.isEditable;
    context.enriched = {};
    for ( const [key, field] of Object.entries(context.systemFields) ) {
      if ( !(field instanceof foundry.data.fields.HTMLField) ) continue;
      context.enriched[key] = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        this.document.system[key], { relativeTo: this.document, secrets: this.document.isOwner }
      );
    }

    return context;
  }
}
