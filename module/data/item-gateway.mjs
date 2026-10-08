/**
 * Gateway item data model — spec section 4a.
 *
 * A character's calling, profession or culture. Its mechanical effects are the
 * HP bonus it contributes to the owning character's maximum Hit Points, and
 * (core rules v0.34) its Save profile — the Modifier-Ladder step it applies to
 * each of the six rolled Saves. A gateway may also (v0.39) name the stat its
 * Unarmored Defense adds to AC.
 */

import { SAVE_KEYS, STAT_LABELS } from "../config.mjs";

const fields = foundry.data.fields;

export default class KD20GatewayData extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["KD20.Gateway"];

  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true, blank: true, initial: "" }),

      // Provisional values from spec section 3: fragile +2, mid +4, hardy +6.
      hpBonus: new fields.NumberField({
        required: true, nullable: false, integer: true, initial: 4, min: 0
      }),

      // Core rules v0.34, Gateway Save Profiles: one Modifier-Ladder step per
      // Save. The fixed template is two +3, one +1, two 0 and one -3; it is not
      // enforced here so a GM can experiment. Range is the ladder: -3 to +5.
      saveProfile: new fields.SchemaField(Object.fromEntries(SAVE_KEYS.map(key => [
        key,
        new fields.NumberField({
          required: true, nullable: false, integer: true, initial: 0, min: -3, max: 5
        })
      ]))),

      // Core rules v0.39: the themed stat Unarmored Defense adds to AC (Monk wis,
      // Rogue/Swashbuckler cha, Barbarian con). The gateway names it, the player
      // doesn't choose. Blank = this calling has no Unarmored Defense, so the
      // feat does nothing for it. None of the five built gateways set one.
      unarmoredStat: new fields.StringField({
        required: true, blank: true, initial: "",
        choices: { "": "(none)", ...STAT_LABELS }
      }),

      // The always-on gateway benefit. Displayed only; not automated in v1.
      benefit: new fields.HTMLField({ required: true, blank: true, initial: "" }),

      costXp: new fields.NumberField({
        required: true, nullable: false, integer: true, initial: 30, min: 0
      })
    };
  }
}
