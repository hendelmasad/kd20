/**
 * Feat item data model — spec section 4b.
 *
 * A trained capability. In v1 feats are displayed, not auto-triggered: when a
 * player makes a roll they tick "apply a Specialization Die" themselves and the
 * system adds one d6. Auto-detecting which feat applies is a later enhancement.
 *
 * The exception is the defensive-height feats (Hardened Save, Armour Training,
 * Unarmored Defense): they are flat and always on, so `mechanic` tells the
 * character model to fold them into the computed Saves and AC.
 */

import { FEAT_TYPES, FEAT_MECHANICS, SAVE_LABELS } from "../config.mjs";

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
      }),

      // Core rules v0.37/v0.39: the few feats the character sheet computes.
      // Blank `kind` = descriptive only. Each owned copy is one purchase:
      // Hardened Save raises `save` one ladder step; Armour Training adds +1 AC
      // (max 2 copies count); Unarmored Defense swaps the AC formula. Their
      // requirements are checked in the character model, not here.
      mechanic: new fields.SchemaField({
        kind: new fields.StringField({
          required: true, blank: true, initial: "", choices: FEAT_MECHANICS
        }),
        // Hardened Save only: which Save this purchase raises.
        save: new fields.StringField({
          required: true, blank: true, initial: "",
          choices: { "": "(none)", ...SAVE_LABELS }
        })
      })
    };
  }

  // TODO (post-v1, spec section 7): the Master feat's die-stacking. We store
  // featType "master" but do not yet grant a second Specialization Die.
}
