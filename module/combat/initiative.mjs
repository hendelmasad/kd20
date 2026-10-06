/**
 * KD20 initiative — pure logic, no Foundry calls, so it can be unit tested.
 *
 * Core rules, Initiative: turn order is rolled fresh EACH ROUND as
 * 1d20 + the better of the dex or wis bonus. Highest acts first. Ties go to the
 * higher bonus; if still tied the actors act simultaneously (or the GM calls it).
 *
 * The bonus itself is computed by the Character data model as
 * `system.initiative.bonus`. The Foundry document classes that use these helpers
 * live in ../documents/combat.mjs.
 */

/**
 * The formula advertised to core and to other modules (system.json "initiative"
 * and CONFIG.Combat.initiative). Roll data is `actor.system`, so the path is
 * `@initiative.bonus` — not `@system.initiative.bonus`.
 */
export const INITIATIVE_FORMULA = "1d20 + @initiative.bonus";

/**
 * Read an actor's prepared KD20 initiative bonus.
 * @param {Actor|null|undefined} actor
 * @returns {number|null}   The bonus, or null if the actor has no KD20 data.
 */
export function getInitiativeBonus(actor) {
  const bonus = actor?.system?.initiative?.bonus;
  return Number.isFinite(bonus) ? bonus : null;
}

/**
 * Build the initiative formula for one actor.
 *
 * The bonus is written into the formula as a literal number rather than an
 * `@` reference, so a missing data path can never leave an unresolved term in
 * the roll. An actor without KD20 data rolls a bare 1d20 and is flagged so the
 * caller can warn.
 *
 * @param {Actor|null|undefined} actor
 * @returns {{formula: string, bonus: number, missing: boolean}}
 */
export function initiativeFormula(actor) {
  const found = getInitiativeBonus(actor);
  const bonus = found ?? 0;
  let formula = "1d20";
  if ( bonus > 0 ) formula = `1d20 + ${bonus}`;
  else if ( bonus < 0 ) formula = `1d20 - ${Math.abs(bonus)}`;
  return { formula, bonus, missing: found === null };
}

/**
 * Sort comparator for combatants: descending initiative, ties broken by the
 * higher initiative bonus, then by id so the order is at least stable.
 *
 * Core passes this to Array#sort unbound, so it must not rely on `this`.
 *
 * @param {{id: string, initiative: number|null, actor?: Actor}} a
 * @param {{id: string, initiative: number|null, actor?: Actor}} b
 * @returns {number}
 */
export function compareCombatants(a, b) {
  const ia = Number.isFinite(a.initiative) ? a.initiative : -Infinity;
  const ib = Number.isFinite(b.initiative) ? b.initiative : -Infinity;
  // Compare with !== first: -Infinity - -Infinity is NaN, not 0.
  if ( ia !== ib ) return ib - ia;

  const ba = getInitiativeBonus(a.actor) ?? -Infinity;
  const bb = getInitiativeBonus(b.actor) ?? -Infinity;
  if ( ba !== bb ) return bb - ba;

  return a.id > b.id ? 1 : -1;
}

/**
 * Shape the per-round summary card's rows, highest first.
 * @param {Array<{id: string, name: string, actor?: Actor, d20: number, bonus: number, total: number,
 *   missing: boolean}>} entries
 * @returns {object[]}
 */
export function buildInitiativeRows(entries) {
  return entries
    .map(e => ({ ...e, initiative: e.total }))
    .sort(compareCombatants)
    .map((e, i) => ({
      rank: i + 1,
      name: e.name,
      d20: e.d20,
      bonus: e.bonus,
      total: e.total,
      missing: e.missing
    }));
}
