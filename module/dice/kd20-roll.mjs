/**
 * The KD20 core roll — Implementation Spec sections 1, 5 and 6.
 *
 * Every check has the same shape:
 *
 *   total = 1d20 + stat bonus + [one Specialization Die (d6), if a feat applies]
 *                             + [any Action Dice (Nd6) spent]
 *
 * The outcome tier comes from the MARGIN against a target, never from the d20
 * face. No die face is special: there is no natural-20 auto-success and, as of
 * core rules v0.31, no natural-1 auto-fail. The Hard Choice is offered on a
 * decisive failure — a margin of -10 or worse — not on any particular face.
 *
 * -------------------------------------------------------------------------
 * How a roll is stored
 * -------------------------------------------------------------------------
 * Rather than re-parsing dice formulas later, each chat card carries a small
 * plain-object "state" in its message flags. Action Dice spending reads that
 * state, adds to it, and posts a fresh card. This keeps re-posting exact: the
 * original d20 is never re-rolled.
 */

import { STAT_LABELS, SAVE_LABELS } from "../config.mjs";

/** The flag namespace used on our chat messages. */
export const FLAG_SCOPE = "kd20";

/** Spec section 1: the outcome tiers. */
export const TIERS = {
  fail: { key: "fail", label: "Fail" },
  success: { key: "success", label: "Success" },
  decisive: { key: "decisive", label: "Decisive" },
  supreme: { key: "supreme", label: "Supreme" }
};

/* -------------------------------------------- */
/*  Pure logic (no Foundry calls — unit tested) */
/* -------------------------------------------- */

/**
 * Sum a roll state into its current total.
 * @param {object} state
 * @returns {number}
 */
export function computeTotal(state) {
  const actionDice = (state.actionDice ?? []).reduce((sum, face) => sum + face, 0);
  // profileBonus (v0.34) and hardenedBonus (v0.37) exist only on Save rolls;
  // older cards lack them.
  return state.d20 + state.statBonus + (state.profileBonus ?? 0) + (state.hardenedBonus ?? 0)
    + (state.specDie ?? 0) + actionDice;
}

/**
 * The margin at or below which a failure is a "decisive failure" and offers the
 * Hard Choice. Core rules v0.31.
 */
export const HARD_CHOICE_MARGIN = -10;

/**
 * Core rules v0.31 — read the margin and produce the outcome tier.
 *
 * The margin is the SOLE arbiter. No d20 face is special: there is no
 * natural-20 auto-success and, as of v0.31, no natural-1 auto-fail either. A 1
 * is simply the lowest face the die can show.
 *
 * The Hard Choice is now a property of *how badly* the roll missed — a margin of
 * -10 or worse — rather than of any particular die face. Because it depends only
 * on the margin, spending Action Dice can lift a roll back out of that band, the
 * same way spending can reach any higher tier.
 *
 * @param {object} options
 * @param {number} options.total            The full roll total.
 * @param {number|null} options.target       The DC or opposed total, if known.
 * @returns {{tier: object|null, margin: number|null, hardChoice: boolean, isHit: boolean}}
 */
export function resolveOutcome({ total, target }) {
  const hasTarget = (target !== null) && (target !== undefined) && Number.isFinite(target);

  // Without a target there is no margin, and so no tier to report — just the total.
  if ( !hasTarget ) return { tier: null, margin: null, hardChoice: false, isHit: false };

  const margin = total - target;

  if ( margin < 0 ) {
    return {
      tier: TIERS.fail,
      margin,
      // A decisive failure: missed by 10 or more.
      hardChoice: margin <= HARD_CHOICE_MARGIN,
      isHit: false
    };
  }
  if ( margin < 10 ) return { tier: TIERS.success, margin, hardChoice: false, isHit: true };
  if ( margin < 20 ) return { tier: TIERS.decisive, margin, hardChoice: false, isHit: true };
  return { tier: TIERS.supreme, margin, hardChoice: false, isHit: true };
}

/**
 * Does this outcome earn a Precision Die? Spec section 5: Decisive and Supreme
 * both add exactly ONE Precision Die — Supreme does not double it.
 * @param {object|null} tier
 * @returns {boolean}
 */
export function earnsPrecisionDie(tier) {
  return (tier === TIERS.decisive) || (tier === TIERS.supreme);
}

/* -------------------------------------------- */
/*  Targets (pure — unit tested)                */
/* -------------------------------------------- */

/**
 * Card elements carrying this attribute reveal a target's AC — the AC itself,
 * the margin, or the "missed by" figure. They are removed for players when the
 * "Show target AC to players" setting is off. A secret element must be a
 * <span> with no <span> nested inside it.
 */
export const SECRET_ATTRIBUTE = "data-kd20-secret";

/**
 * Parse a DC typed into a dialog. Blank or non-numeric means "no target".
 * @param {*} input
 * @returns {number|null}
 */
export function parseTarget(input) {
  const raw = String(input ?? "").trim();
  if ( raw === "" ) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Read a KD20 actor's AC.
 * @param {Actor|null|undefined} actor
 * @returns {number|null}   null if the actor has no KD20 AC.
 */
export function readTargetAc(actor) {
  const ac = actor?.system?.ac;
  return Number.isFinite(ac) ? ac : null;
}

/**
 * Describe targeted tokens as plain objects for the roll state.
 * @param {Iterable<Token>} tokens   Usually game.user.targets.
 * @returns {Array<{name: string, tokenUuid: string|null, ac: number|null}>}
 */
export function describeTargets(tokens) {
  return Array.from(tokens ?? [], token => ({
    name: token.name ?? token.document?.name ?? "Unknown",
    tokenUuid: token.document?.uuid ?? null,
    ac: readTargetAc(token.actor)
  }));
}

/**
 * Turn the targeted tokens plus what was typed into the dialog into the target
 * fields of an attack's roll state.
 *
 *  - No target: the typed DC, as before.
 *  - One target: the typed value. If the AC was hidden from this user, a blank
 *    field means "use the target's AC".
 *  - Several targets: one roll, resolved against each target's AC separately.
 *
 * @param {object} options
 * @param {object[]} options.targets     From describeTargets().
 * @param {*} options.input              The raw DC field value.
 * @param {boolean} options.revealAc     Whether this user was shown the AC.
 * @returns {{target: number|null, targetName: string|null, targetFromToken: boolean, targets: object[]}}
 */
export function resolveAttackTarget({ targets = [], input = null, revealAc = true }) {
  const typed = parseTarget(input);

  if ( targets.length > 1 ) {
    return { target: null, targetName: null, targetFromToken: true, targets };
  }

  if ( targets.length === 1 ) {
    const [only] = targets;
    if ( only.ac === null ) {
      return { target: typed, targetName: only.name, targetFromToken: false, targets: [] };
    }
    // A hidden AC with a blank field: use the token's AC behind the scenes.
    if ( (typed === null) && !revealAc ) {
      return { target: only.ac, targetName: only.name, targetFromToken: true, targets: [] };
    }
    // A shown, pre-filled AC that was cleared: the user chose to roll with no target.
    if ( typed === null ) return { target: null, targetName: null, targetFromToken: false, targets: [] };
    return { target: typed, targetName: only.name, targetFromToken: typed === only.ac, targets: [] };
  }

  return { target: typed, targetName: null, targetFromToken: false, targets: [] };
}

/** Does this state resolve against several targets at once? */
function isMultiTarget(state) {
  return (state.targets?.length ?? 0) > 1;
}

/**
 * The outcome that decides what damage to roll. With several targets, damage is
 * rolled once if the attack hits ANY of them, and the Precision Die once if ANY
 * is Decisive or better — that is, the outcome against the lowest known AC. Each
 * target's own damage total is worked out on the card.
 * @param {object} state
 * @returns {object}   As resolveOutcome().
 */
export function damageOutcome(state) {
  const total = computeTotal(state);
  if ( !isMultiTarget(state) ) return resolveOutcome({ total, target: state.target });
  const known = state.targets.map(t => t.ac).filter(Number.isFinite);
  return resolveOutcome({ total, target: known.length ? Math.min(...known) : null });
}

/**
 * Is this actor carrying the KD20 Character data the roll code reads?
 * @param {Actor|null|undefined} actor
 * @returns {boolean}
 */
export function hasKD20Data(actor) {
  return Boolean(actor?.system?.stats && actor.system.actionDice);
}

/* -------------------------------------------- */
/*  Rolling                                     */
/* -------------------------------------------- */

/** Roll a single die and return its face. */
async function rollDie(formula) {
  const roll = await new Roll(formula).evaluate();
  return { roll, total: roll.total };
}

/**
 * Roll a basic stat check and post it to chat. Spec section 1.
 * @param {object} options
 * @param {Actor} options.actor
 * @param {string} options.statKey            One of str/dex/con/int/wis/cha.
 * @param {number|null} options.target         The DC, or null for no target.
 * @param {boolean} options.useSpecDie          Add one Specialization Die (d6).
 */
export async function rollCheck({ actor, statKey, target = null, useSpecDie = false }) {
  if ( !requireKD20Data(actor) ) return;
  const statBonus = actor.system.stats[statKey].bonus;
  const rolls = [];

  const d20 = await rollDie("1d20");
  rolls.push(d20.roll);

  let specDie = null;
  if ( useSpecDie ) {
    const d6 = await rollDie("1d6");
    rolls.push(d6.roll);
    specDie = d6.total;
  }

  const state = {
    version: 1,
    kind: "check",
    label: `${STAT_LABELS[statKey]} Check`,
    actorUuid: actor.uuid,
    statKey,
    statBonus,
    d20: d20.total,
    specDie,
    actionDice: [],
    target,
    damage: null,
    superseded: false
  };

  return postRollCard({ actor, state, rolls });
}

/**
 * Roll one of the six Saves and post it to chat. Core rules v0.34.
 *
 * Exactly a stat check with two more terms — the gateway profile step and any
 * Hardened Save steps (v0.37) — so it shares the chat card, the Action Dice button and the margin ladder. The target
 * is usually the attacker's total (a Save is a contest); a tie is a Success, so
 * the defense holds.
 *
 * TODO: active/passive contest automation (pull the attacker's total from their
 * card instead of typing it in).
 *
 * @param {object} options
 * @param {Actor} options.actor
 * @param {string} options.saveKey            One of SAVE_KEYS.
 * @param {number|null} options.target         The attacker's total or DC, or null.
 * @param {boolean} options.useSpecDie          Add one Specialization Die (d6).
 */
export async function rollSave({ actor, saveKey, target = null, useSpecDie = false }) {
  if ( !requireKD20Data(actor) ) return;
  const save = actor.system.saves[saveKey];
  const rolls = [];

  const d20 = await rollDie("1d20");
  rolls.push(d20.roll);

  let specDie = null;
  if ( useSpecDie ) {
    const d6 = await rollDie("1d6");
    rolls.push(d6.roll);
    specDie = d6.total;
  }

  const state = {
    version: 1,
    kind: "save",
    label: SAVE_LABELS[saveKey],
    actorUuid: actor.uuid,
    saveKey,
    statKey: save.stat,
    statBonus: save.statBonus,
    profileBonus: save.profile,
    profileLabel: actor.system.gatewayName ?? "Gateway",
    hardenedBonus: save.hardened?.bonus ?? 0,
    d20: d20.total,
    specDie,
    actionDice: [],
    target,
    damage: null,
    superseded: false
  };

  return postRollCard({ actor, state, rolls });
}

/**
 * Roll a weapon attack, and its damage if it hits. Spec section 5.
 * @param {object} options
 * @param {Actor} options.actor
 * @param {Item} options.weapon
 * @param {number|null} options.target          The target's AC.
 * @param {boolean} options.useSpecDie
 * @param {string|null} [options.targetName]     The single targeted token's name.
 * @param {boolean} [options.targetFromToken]    The AC came from a token, so it is
 *                                               secret if the setting hides it.
 * @param {object[]} [options.targets]           Two or more targets, from describeTargets().
 */
export async function rollAttack({ actor, weapon, target = null, useSpecDie = false,
  targetName = null, targetFromToken = false, targets = [] }) {
  if ( !requireKD20Data(actor) ) return;
  const statKey = weapon.system.attackStat;
  const statBonus = actor.system.stats[statKey].bonus;
  const rolls = [];

  const d20 = await rollDie("1d20");
  rolls.push(d20.roll);

  let specDie = null;
  if ( useSpecDie ) {
    const d6 = await rollDie("1d6");
    rolls.push(d6.roll);
    specDie = d6.total;
  }

  const state = {
    version: 1,
    kind: "attack",
    label: `${weapon.name} Attack`,
    actorUuid: actor.uuid,
    weaponUuid: weapon.uuid,
    statKey,
    statBonus,
    d20: d20.total,
    specDie,
    actionDice: [],
    target,
    targetName,
    targetFromToken,
    targets,
    // Damage is rolled lazily — only on a hit, per spec section 5.
    damage: {
      die: weapon.system.damageDie,
      statKey: weapon.system.damageStat,
      statBonus: actor.system.stats[weapon.system.damageStat].bonus,
      precisionDie: weapon.system.effectivePrecisionDie,
      dieResult: null,
      precisionResult: null
    },
    superseded: false
  };

  await ensureDamage(state, damageOutcome(state), rolls);

  return postRollCard({ actor, state, rolls });
}

/**
 * Warn and return false if an actor lacks KD20 Character data.
 * @param {Actor} actor
 * @returns {boolean}
 */
function requireKD20Data(actor) {
  if ( hasKD20Data(actor) ) return true;
  ui.notifications.warn(`KD20 | ${actor?.name ?? "That actor"} has no KD20 character data to roll with.`);
  return false;
}

/**
 * Roll whatever damage this outcome now warrants, if it has not been rolled yet.
 *
 * Called both on the initial attack and again after Action Dice are spent. The
 * ruling in force: all paths to a tier are treated equally, so Action Dice that
 * push an attack up to Decisive DO earn the Precision Die.
 *
 * @param {object} state
 * @param {object} outcome
 * @param {Roll[]} rolls   Accumulator for rolls to attach to the message.
 */
async function ensureDamage(state, outcome, rolls) {
  if ( (state.kind !== "attack") || !state.damage || !outcome.isHit ) return;

  // Base damage, rolled the first time the attack lands.
  if ( state.damage.dieResult === null ) {
    const dmg = await rollDie(`1${state.damage.die}`);
    rolls.push(dmg.roll);
    state.damage.dieResult = dmg.total;
  }

  // One Precision Die on Decisive or Supreme — never two, never doubled.
  if ( earnsPrecisionDie(outcome.tier) && (state.damage.precisionResult === null) ) {
    const prec = await rollDie(`1${state.damage.precisionDie}`);
    rolls.push(prec.roll);
    state.damage.precisionResult = prec.total;
  }
}

/* -------------------------------------------- */
/*  Action Dice (spec section 6)                */
/* -------------------------------------------- */

/**
 * Spend N Action Dice on an existing roll: roll Nd6, add the sum to that roll's
 * total, decrement the pool, and post a fresh card with the recomputed tier.
 * @param {ChatMessage} message   The card being added to.
 * @param {number} count          How many dice to spend.
 */
export async function spendActionDice(message, count) {
  const state = foundry.utils.deepClone(message.getFlag(FLAG_SCOPE, "state"));
  if ( !state ) return;

  const actor = await fromUuid(state.actorUuid);
  if ( !actor ) {
    ui.notifications.warn("KD20 | The actor for this roll no longer exists.");
    return;
  }
  if ( !actor.isOwner ) {
    ui.notifications.warn("KD20 | You do not own that character.");
    return;
  }
  if ( !requireKD20Data(actor) ) return;

  const pool = actor.system.actionDice.value;
  if ( count < 1 ) return;
  if ( count > pool ) {
    ui.notifications.warn(`KD20 | ${actor.name} has only ${pool} Action Dice left.`);
    return;
  }

  // Spec section 6: roll N d6 and sum them.
  const rolls = [];
  const pooled = await new Roll(`${count}d6`).evaluate();
  rolls.push(pooled);
  const faces = pooled.dice[0].results.map(r => r.result);

  state.actionDice.push(...faces);
  state.spentNow = faces;

  // Recompute. This may award a Precision Die if the attack moved up a tier, and
  // may equally lift the roll out of the Hard Choice band. With several targets,
  // every target is re-resolved when the card is rebuilt.
  await ensureDamage(state, damageOutcome(state), rolls);

  // Decrement the pool.
  await actor.update({ "system.actionDice.value": pool - count });

  // Retire the old card so its button cannot be used twice.
  try {
    await message.setFlag(FLAG_SCOPE, "superseded", true);
  } catch ( err ) {
    console.warn("KD20 | Could not mark the previous card as superseded.", err);
  }

  return postRollCard({ actor, state, rolls, isRepost: true });
}

/**
 * Spec section 6: manual pool refresh. Floor-raising — never reduces the pool.
 * @param {Actor} actor
 */
export async function refreshActionDice(actor) {
  if ( !requireKD20Data(actor) ) return;
  const { value, refresh } = actor.system.actionDice;
  const next = Math.max(value, refresh);
  if ( next === value ) {
    ui.notifications.info(`KD20 | ${actor.name}'s Action Dice are already at ${value}.`);
    return;
  }
  await actor.update({ "system.actionDice.value": next });
  ui.notifications.info(`KD20 | ${actor.name}'s Action Dice refreshed to ${next}.`);
}

/* -------------------------------------------- */
/*  Chat output (spec sections 1 and 5)         */
/* -------------------------------------------- */

/**
 * Render and post a roll card.
 * @param {object} options
 * @param {Actor} options.actor
 * @param {object} options.state
 * @param {Roll[]} options.rolls
 * @param {boolean} [options.isRepost]
 */
/**
 * Turn a roll state into the context the chat template renders.
 *
 * Kept pure and exported so it can be unit tested without Foundry running.
 *
 * @param {object} state
 * @param {object} [options]
 * @param {boolean} [options.isRepost]
 * @returns {object}
 */
export function buildCardContext(state, { isRepost = false } = {}) {
  const total = computeTotal(state);
  const outcome = resolveOutcome({ total, target: state.target });

  // Build the "+" breakdown shown under the total.
  const parts = [{ label: "d20", value: state.d20, isDie: true }];
  if ( state.statBonus !== 0 ) {
    parts.push({ label: STAT_LABELS[state.statKey], value: state.statBonus });
  }
  if ( state.profileBonus ) {
    parts.push({ label: `${state.profileLabel ?? "Gateway"} profile`, value: state.profileBonus });
  }
  if ( state.hardenedBonus ) {
    parts.push({ label: "Hardened Save", value: state.hardenedBonus });
  }
  if ( state.specDie !== null ) {
    parts.push({ label: "Specialization d6", value: state.specDie, isDie: true });
  }
  for ( const face of state.actionDice ) {
    parts.push({ label: "Action d6", value: face, isDie: true });
  }

  let damage = null;
  if ( (state.kind === "attack") && state.damage && (state.damage.dieResult !== null) ) {
    const d = state.damage;
    damage = {
      die: d.die,
      dieResult: d.dieResult,
      statKey: d.statKey,
      statLabel: STAT_LABELS[d.statKey],
      statBonus: d.statBonus,
      precisionDie: d.precisionDie,
      precisionResult: d.precisionResult,
      base: d.dieResult + d.statBonus,
      total: d.dieResult + d.statBonus + (d.precisionResult ?? 0)
    };
  }

  // Several targets: one roll, read against each target's AC separately.
  const isMulti = isMultiTarget(state);
  const targetRows = isMulti ? state.targets.map(t => {
    const o = resolveOutcome({ total, target: t.ac });
    return {
      name: t.name,
      hasAc: o.margin !== null,
      ac: t.ac,
      margin: o.margin,
      tier: o.tier,
      hardChoice: o.hardChoice,
      isHit: o.isHit,
      // Only targets this roll beat by 10+ take the Precision Die.
      damageTotal: (o.isHit && damage)
        ? damage.base + (earnsPrecisionDie(o.tier) ? (damage.precisionResult ?? 0) : 0)
        : null,
      followUp: earnsPrecisionDie(o.tier)
    };
  }) : [];

  // In multi-target mode there is no single target, tier or follow-up.
  const single = isMulti ? resolveOutcome({ total, target: null }) : outcome;

  return {
    label: state.label,
    isRepost,
    spentNow: state.spentNow ?? null,
    parts,
    total,
    // The target/margin line is gated on the target existing, never on there
    // being a tier — otherwise the margin can render as "NaN".
    hasTarget: single.margin !== null,
    target: state.target,
    targetName: state.targetName ?? null,
    // The AC came from a token, so the card marks it (and the margin) secret.
    secret: Boolean(state.targetFromToken),
    isMulti,
    targetRows,
    margin: single.margin,
    tier: single.tier,
    hardChoice: single.hardChoice,
    // Positive magnitude of the miss, so the card can read "missed by 12"
    // rather than "missed by -12".
    missedBy: single.hardChoice ? Math.abs(single.margin) : null,
    isHit: single.isHit,
    damage,
    // Spec section 5: surface Follow-Up as a GM reminder; not automated in v1.
    followUp: single.tier === TIERS.supreme ? "supreme"
      : single.tier === TIERS.decisive ? "decisive" : null
  };
}

/* -------------------------------------------- */

async function postRollCard({ actor, state, rolls, isRepost = false }) {
  const context = buildCardContext(state, { isRepost });
  delete state.spentNow;

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/kd20/templates/chat/roll-card.hbs", context
  );

  return foundry.documents.ChatMessage.implementation.create({
    speaker: foundry.documents.ChatMessage.implementation.getSpeaker({ actor }),
    content,
    rolls,
    flags: { [FLAG_SCOPE]: { state } }
  });
}

/* -------------------------------------------- */
/*  Chat card interactivity                     */
/* -------------------------------------------- */

/**
 * Wire up the buttons on our chat cards. Registered against the v14
 * `renderChatMessageHTML` hook, which runs once per viewer — so we can hide the
 * button from people who cannot use it.
 * @param {ChatMessage} message
 * @param {HTMLElement} html
 */
export function onRenderChatCard(message, html) {
  // The card's HTML is shared by everyone; hide AC-revealing figures per viewer.
  if ( !canSeeTargetAc() ) {
    for ( const el of html.querySelectorAll(`[${SECRET_ATTRIBUTE}]`) ) el.remove();
  }

  const button = html.querySelector("[data-action='kd20SpendActionDice']");
  if ( !button ) return;

  const state = message.getFlag(FLAG_SCOPE, "state");
  const superseded = message.getFlag(FLAG_SCOPE, "superseded");
  const actor = state ? fromUuidSync(state.actorUuid) : null;

  // Only offer the button to someone who owns the character and has dice left,
  // and only on the newest card in a chain.
  const usable = actor?.isOwner && !superseded && (actor.system.actionDice?.value > 0);
  if ( !usable ) {
    button.remove();
    return;
  }

  button.addEventListener("click", async event => {
    event.preventDefault();
    button.disabled = true;
    try {
      const pool = actor.system.actionDice.value;
      const count = await promptActionDiceCount(pool);
      if ( count ) await spendActionDice(message, count);
    } finally {
      button.disabled = false;
    }
  });
}

/**
 * Ask how many Action Dice to spend.
 * @param {number} pool
 * @returns {Promise<number|null>}
 */
async function promptActionDiceCount(pool) {
  const { DialogV2 } = foundry.applications.api;
  const result = await DialogV2.input({
    window: { title: "Spend Action Dice" },
    content: `
      <p>Each Action Die is a d6. Spend any number up to your pool; they are summed
      and added to the roll, and the outcome tier is recalculated.</p>
      <p><strong>Available: ${pool}</strong></p>
      <div class="form-group">
        <label for="kd20-ad-count">How many?</label>
        <input id="kd20-ad-count" type="number" name="count" value="1" min="1" max="${pool}" step="1" autofocus>
      </div>`,
    ok: { label: "Spend" }
  });
  if ( !result ) return null;
  const count = Math.clamp(Math.round(Number(result.count) || 0), 0, pool);
  return count || null;
}

/* -------------------------------------------- */
/*  Roll prompts used by the sheet              */
/* -------------------------------------------- */

/**
 * Ask for a DC and whether a Specialization Die applies.
 * @param {string} title
 * @param {string} targetLabel   "DC" for checks, "Target AC" for attacks.
 * @returns {Promise<{target: number|null, useSpecDie: boolean}|null>}
 */
export async function promptRollOptions(title, targetLabel = "DC") {
  const result = await promptDialog(title, `
      <div class="form-group">
        <label for="kd20-target">${targetLabel}</label>
        <input id="kd20-target" type="number" name="target" step="1" placeholder="leave blank for none" autofocus>
      </div>`);
  if ( !result ) return null;
  return { target: parseTarget(result.target), useSpecDie: Boolean(result.useSpecDie) };
}

/**
 * May the current user see a targeted token's AC (and so the margin)?
 * @returns {boolean}
 */
export function canSeeTargetAc() {
  return game.user.isGM || game.settings.get(FLAG_SCOPE, "showTargetAc");
}

/**
 * Ask for an attack's options, using the user's targeted tokens.
 *
 *  - No target: a manual Target AC field, as for any roll.
 *  - One target: the field is pre-filled with its AC and stays editable. If the
 *    AC is hidden from this user, the field is blank and blank means "use it".
 *  - Several targets: the names are listed and there is no AC field.
 *
 * @param {string} title
 * @param {Iterable<Token>} [tokens]   Defaults to game.user.targets.
 * @returns {Promise<object|null>}    Options for rollAttack(), or null if cancelled.
 */
export async function promptAttackOptions(title, tokens = game.user.targets) {
  const targets = describeTargets(tokens);
  const revealAc = canSeeTargetAc();
  const esc = foundry.utils.escapeHTML;

  let field;
  if ( targets.length > 1 ) {
    field = `
      <p>One roll against each target's AC:</p>
      <ul>${targets.map(t => `<li>${esc(t.name)}${t.ac === null ? " (no KD20 AC)" : ""}</li>`).join("")}</ul>`;
  } else {
    const [only] = targets;
    let label = "Target AC";
    let value = "";
    let placeholder = "leave blank for none";
    if ( only?.ac === null ) label = `Target AC (${esc(only.name)} has no KD20 AC)`;
    else if ( only && revealAc ) {
      label = `Target AC — ${esc(only.name)}`;
      value = only.ac;
    } else if ( only ) {
      label = `Target AC — ${esc(only.name)} (AC hidden)`;
      placeholder = "leave blank to use the target's AC";
    }
    field = `
      <div class="form-group">
        <label for="kd20-target">${label}</label>
        <input id="kd20-target" type="number" name="target" step="1" value="${value}"
               placeholder="${placeholder}" autofocus>
      </div>`;
  }

  const result = await promptDialog(title, field);
  if ( !result ) return null;
  return {
    ...resolveAttackTarget({ targets, input: result.target, revealAc }),
    useSpecDie: Boolean(result.useSpecDie)
  };
}

/**
 * The shared roll dialog: a caller-supplied target section, then the
 * Specialization Die box and the DC guide.
 * @param {string} title
 * @param {string} targetHtml
 * @returns {Promise<object|null>}
 */
async function promptDialog(title, targetHtml) {
  const { DialogV2 } = foundry.applications.api;
  return DialogV2.input({
    window: { title },
    content: `${targetHtml}
      <div class="form-group">
        <label for="kd20-spec">Apply a Specialization Die (d6)</label>
        <input id="kd20-spec" type="checkbox" name="useSpecDie">
      </div>
      <p class="notes">
        Tick the box only if one of your feats applies. At most one Specialization
        Die is ever added to a roll.
      </p>
      <p class="notes">DC guide: Easy 10 · Moderate 13 · Hard 16 · Formidable 20.</p>`,
    ok: { label: "Roll" }
  });
}
