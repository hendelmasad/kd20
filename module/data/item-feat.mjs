/**
 * Feat item data model — spec section 4b.
 *
 * A trained capability. In v1 feats are displayed, not auto-triggered: when a
 * player makes a roll they tick "apply a Specialization Die" themselves and the
 * system adds one d6. Auto-detecting which feat applies is a later enhancement.
 */

import { FEAT_TYPES } from "../config.mjs";

const fields = foundry.data.fields;

export default class KD20FeatData extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["KD20.Feat"];

  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true, blank: true, initial: "" }),

      // v1 just stores the category.
      featType: new fields.StringField({
        required: true,
        blank: false,
        initial: "cluster",
        choices: FEAT_TYPES
      }),

      // When the feat's die or effect applies. Not auto-detected in v1 — the
      // GM and player decide.
      trigger: new fields.StringField({ required: true, blank: true, initial: "" }),

      effect: new fields.HTMLField({ required: true, blank: true, initial: "" }),

      // If true, this is a feat a player may invoke to add a d6 to a roll.
      grantsSpecializationDie: new fields.BooleanField({ required: true, initial: true }),

      // Display only in v1.
      prerequisite: new fields.StringField({ required: true, blank: true, initial: "" }),

      costXp: new fields.NumberField({
        required: true, nullable: false, integer: true, initial: 20, min: 0
      })
    };
  }

  // TODO (post-v1, spec section 7): the Master feat's die-stacking. We store
  // featType "master" but do not yet grant a second Specialization Die.
}
