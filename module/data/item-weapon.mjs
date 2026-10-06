/**
 * Weapon item data model — spec section 4c.
 *
 * Attack and damage rolls arrive in build step 5; this model stores the numbers
 * those rolls will use.
 */

import { STAT_KEYS, STAT_LABELS, DIE_CHOICES } from "../config.mjs";

const fields = foundry.data.fields;

export default class KD20WeaponData extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["KD20.Weapon"];

  static defineSchema() {

    /** Which stat bonus a weapon uses. All six are offered. */
    const statChoice = initial => new fields.StringField({
      required: true,
      blank: false,
      initial,
      choices: Object.fromEntries(STAT_KEYS.map(k => [k, STAT_LABELS[k]]))
    });

    return {
      description: new fields.HTMLField({ required: true, blank: true, initial: "" }),

      damageDie: new fields.StringField({
        required: true, blank: false, initial: "d6", choices: DIE_CHOICES
      }),

      // The bonus die added on a Decisive or Supreme hit. Left blank, it
      // defaults to matching the damage die (resolved in prepareDerivedData).
      precisionDie: new fields.StringField({
        required: true, blank: true, initial: "", choices: { "": "(same as damage die)", ...DIE_CHOICES }
      }),

      // Finesse weapons may allow str OR dex. In v1 a single choice is stored;
      // swap it on the item when you want the other.
      attackStat: statChoice("str"),
      damageStat: statChoice("str"),

      reach: new fields.NumberField({
        required: true, nullable: false, integer: true, initial: 1, min: 0
      }),

      // e.g. "Parry". Display only in v1.
      properties: new fields.StringField({ required: true, blank: true, initial: "" })
    };
  }

  /* -------------------------------------------- */

  prepareDerivedData() {
    // Spec section 4c: precision die defaults to equal the damage die.
    // `effectivePrecisionDie` is what rolls should actually use.
    this.effectivePrecisionDie = this.precisionDie || this.damageDie;
  }
}
