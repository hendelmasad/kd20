/**
 * Armour item data model — core rules v0.39, Universal Actor Baseline.
 *
 * Body armour or a shield. Only EQUIPPED armour counts: the character's AC adds
 * the equipped body armour's bonus and the equipped shield's bonus, and the body
 * armour's category gates the AC feats (Armour Training, Unarmored Defense).
 * Dex always applies on top, whatever the category — armour never caps it.
 */

import { ARMOUR_CATEGORIES } from "../config.mjs";

const fields = foundry.data.fields;

export default class KD20ArmourData extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["KD20.Armour"];

  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true, blank: true, initial: "" }),

      // Ignored for shields; a shield never sets the armour category.
      category: new fields.StringField({
        required: true, blank: false, initial: "light", choices: ARMOUR_CATEGORIES
      }),

      // The AC this piece adds while equipped. Values are kept tight (+1 to +3,
      // shield +1) so the AC feats can sit on top within the ~20 soft cap.
      armourBonus: new fields.NumberField({
        required: true, nullable: false, integer: true, initial: 1, min: 0
      }),

      isShield: new fields.BooleanField({ required: true, initial: false }),

      equipped: new fields.BooleanField({ required: true, initial: false })
    };
  }
}
