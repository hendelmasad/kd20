/**
 * Weapon item data model — spec section 4c.
 *
 * Attack and damage rolls arrive in build step 5; this model stores the numbers
 * those rolls will use.
 */

import { STAT_KEYS, STAT_LABELS, DIE_CHOICES, isValidDamageDice, largestDamageDie } from "../config.mjs";

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

      // v0.9.0: a full dice expression ("d6", "2d8", "1d10+1d6"), not just one
      // die. Older single-die values ("d6") are already valid and roll as 1d6.
      damageDie: new fields.StringField({
        required: true, blank: false, initial: "d6",
        validate: value => {
          if ( !isValidDamageDice(value) ) {
            throw new Error(`"${value}" is not a damage dice expression (e.g. d6, 2d8, 1d10+1d6)`);
          }
        }
      }),

      // The bonus die added on a Decisive or Supreme hit — always ONE die. Left
      // blank, it defaults to the largest die in the damage expression
      // (resolved in prepareDerivedData).
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
    // Spec section 4c: precision die defaults to equal the damage die. With a
    // multi-die expression it is the largest die in it ("2d8" -> d8).
    // `effectivePrecisionDie` is what rolls should actually use.
    this.effectivePrecisionDie = this.precisionDie || largestDamageDie(this.damageDie) || "d6";
  }
}
