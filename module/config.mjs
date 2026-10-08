/**
 * Shared KD20 constants.
 *
 * Defined in one place so the data models, the sheets and the templates can
 * never disagree about what the six Statistics are called or which dice exist.
 */

/** Spec section 2: the six Statistics, in display order. */
export const STAT_KEYS = ["str", "dex", "con", "int", "wis", "cha"];

/** Full names for the six Statistics. */
export const STAT_LABELS = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma"
};

/** Dice a weapon's damage or precision die may use (spec section 4c). */
export const DIE_CHOICES = {
  d4: "d4",
  d6: "d6",
  d8: "d8",
  d10: "d10",
  d12: "d12"
};

/** Spec section 4b: feat categories. v1 only stores these. */
export const FEAT_TYPES = {
  cluster: "Cluster",
  master: "Master",
  resist: "Resist"
};

/**
 * Core rules v0.34: the six rolled Saves, one per Statistic, in display order
 * (the same order as STAT_KEYS). Each Save rolls 1d20 + its stat + the primary
 * gateway's profile step + any Hardened Save steps.
 *
 * Core rules v0.36 renamed the Saves to bare stat names ("Strength Save", ...).
 * The keys are the retired flavour names, kept as stable data keys so the
 * rename only touches labels: withstand = Strength, reflexes = Dexterity,
 * fortitude = Constitution, composure = Intelligence, resolve = Wisdom,
 * poise = Charisma. Never show a key to a player; use SAVE_LABELS.
 */
export const SAVE_KEYS = ["withstand", "reflexes", "fortitude", "composure", "resolve", "poise"];

/** The Statistic each Save is rolled on. */
export const SAVE_STATS = {
  withstand: "str",
  reflexes: "dex",
  fortitude: "con",
  composure: "int",
  resolve: "wis",
  poise: "cha"
};

/** Display names for the six Saves (core rules v0.36). */
export const SAVE_LABELS = {
  withstand: "Strength Save",
  reflexes: "Dexterity Save",
  fortitude: "Constitution Save",
  composure: "Intelligence Save",
  resolve: "Wisdom Save",
  poise: "Charisma Save"
};

/**
 * What each Save defends against (core rules v0.36, Defenses table). The three
 * mental Saves split as Int = the mind, Wis = perception, Cha = the will.
 */
export const SAVE_COVERAGE = {
  withstand: "Being shoved, grappled, tripped, overborne, moved against your will.",
  reflexes: "Area effects, blasts, traps — anything you dodge clear of.",
  fortitude: "Poison, disease, exhaustion, raw bodily assault.",
  composure: "The mind — telepathy, mind-reading, memory tampering, logic-scrambling confusion.",
  resolve: "Perception — illusion, deception, sensing wrongness, spotting the trap.",
  poise: "The self, force of will — domination, compulsion, possession, fear, intimidation, a crowd turning."
};

/**
 * Core rules v0.37, Hardened Save: the Modifier-Ladder rungs a Save climbs (one
 * purchase per rung), and the XP price keyed by the rung being bought:
 * -3 -> 0 costs 20, 0 -> +1 costs 20, +1 -> +3 costs 30, +3 -> +5 costs 40.
 */
export const SAVE_LADDER = [-3, 0, 1, 3, 5];
export const HARDENED_SAVE_COST = { 0: 20, 1: 20, 3: 30, 5: 40 };

/**
 * The highest value Hardened Save may lift a Save to, given its gateway profile
 * step (core rules v0.37): Major (+5) only on a gateway-Solid (+3) Save, and a
 * gateway hindrance lifts toward neutral only (to 0).
 * @param {number} profile   The gateway profile step.
 * @returns {number}
 */
export function hardenedSaveCap(profile) {
  if ( profile < 0 ) return 0;
  if ( profile >= 3 ) return 5;
  return 3;
}

/**
 * Worn armour categories (core rules v0.39). The AC feats are gated on these:
 * Armour Training needs armour heavier than light, Unarmored Defense needs light
 * or none. The armour's AC value is still typed in separately.
 */
export const ARMOUR_TYPES = {
  none: "None",
  light: "Light",
  medium: "Medium",
  heavy: "Heavy"
};

/** Core rules v0.39: Armour Training may be taken up to twice, max +2 AC. */
export const ARMOUR_TRAINING_MAX = 2;

/**
 * Feats whose effect the character sheet computes (core rules v0.37/v0.39).
 * Every other feat is descriptive, the blank choice. A feat item opts in by
 * setting `system.mechanic.kind` to one of these keys.
 */
export const FEAT_MECHANICS = {
  "": "None (descriptive only)",
  hardenedSave: "Hardened Save",
  armourTraining: "Armour Training",
  unarmoredDefense: "Unarmored Defense"
};
