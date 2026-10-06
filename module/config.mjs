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
 * Core rules v0.34: the six rolled Saves, one per Statistic, in display order.
 * Each Save rolls 1d20 + its stat + the primary gateway's profile step.
 */
export const SAVE_KEYS = ["withstand", "fortitude", "reflexes", "composure", "resolve", "poise"];

/** The Statistic each Save is rolled on. */
export const SAVE_STATS = {
  withstand: "str",
  fortitude: "con",
  reflexes: "dex",
  composure: "int",
  resolve: "wis",
  poise: "cha"
};

/** Display names for the six Saves. */
export const SAVE_LABELS = {
  withstand: "Withstand",
  fortitude: "Fortitude",
  reflexes: "Reflexes",
  composure: "Composure",
  resolve: "Resolve",
  poise: "Poise"
};
