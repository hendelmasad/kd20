/**
 * KD20 Combat and Combatant document classes.
 *
 * Core rules, Initiative: 1d20 + the better of dex or wis, rolled fresh EACH
 * ROUND. Foundry's default keeps one initiative for the whole encounter, so
 * KD20Combat re-rolls everyone as each new round begins and posts a single
 * summary card instead of one chat message per combatant.
 *
 * The maths lives in ../combat/initiative.mjs so it can be unit tested.
 */

import { initiativeFormula, compareCombatants, buildInitiativeRows } from "../combat/initiative.mjs";

/** Combat flag recording the last round whose initiative has been re-rolled. */
const ROUND_FLAG = "initiativeRound";

/* -------------------------------------------- */

export class KD20Combatant extends foundry.documents.Combatant {

  /**
   * Core's version returns String(CONFIG formula || game.system.initiative),
   * which is the text "undefined" if neither is set. Build the formula from the
   * actor's prepared bonus instead, and degrade to 1d20 + 0 for anything that is
   * not a KD20 character.
   * @override
   */
  _getInitiativeFormula() {
    const { formula, missing } = initiativeFormula(this.actor);
    if ( missing ) {
      ui.notifications.warn(`KD20 | ${this.name} has no KD20 initiative bonus; rolling 1d20 + 0.`);
    }
    return formula;
  }
}

/* -------------------------------------------- */

export class KD20Combat extends foundry.documents.Combat {

  /**
   * Ties go to the higher initiative bonus. Core calls this unbound.
   * @override
   */
  _sortCombatants(a, b) {
    return compareCombatants(a, b);
  }

  /* -------------------------------------------- */

  /**
   * Re-roll before the round advances, so that when core sets turn 0 the
   * highest new roller is the one at turn 0.
   * @override
   */
  async nextRound() {
    // Only a GM may update every combatant. When a player ends the last turn of
    // a round, _onStartRound below picks the re-roll up on the active GM.
    if ( game.user.isGM && (this.round > 0) ) await this.rerollInitiative(this.round + 1);
    return super.nextRound();
  }

  /* -------------------------------------------- */

  /** @override */
  async previousRound() {
    // Rewinding keeps the existing values. Clear the marker so stepping forward
    // into the same round again re-rolls it.
    if ( game.user.isGM && this.getFlag("kd20", ROUND_FLAG) ) await this.unsetFlag("kd20", ROUND_FLAG);
    return super.previousRound();
  }

  /* -------------------------------------------- */

  /**
   * Fallback for rounds advanced by a player. Core runs this on the active GM
   * only. By this point core has already put the turn on whoever was first in
   * the OLD order, so the re-roll pins the turn back to 0 of the new order.
   * Turn-start effects for this one transition fire for the old first combatant.
   * @override
   */
  async _onStartRound(context) {
    await super._onStartRound(context);
    if ( context.skipped || (context.round <= 1) ) return;
    if ( this.getFlag("kd20", ROUND_FLAG) === context.round ) return;
    await this.rerollInitiative(context.round, { combatTurn: 0 });
  }

  /* -------------------------------------------- */

  /**
   * Re-roll initiative for every combatant that is not defeated and post one
   * summary card.
   * @param {number} round                  The round these rolls are for.
   * @param {object} [options]
   * @param {number} [options.combatTurn]   Force the turn index afterwards. By
   *   default the turn stays on whoever currently has it, so that core's
   *   end-of-turn handling still applies to the right combatant.
   */
  async rerollInitiative(round, { combatTurn } = {}) {
    const updates = [];
    const entries = [];
    const rolls = new Map();

    for ( const combatant of this.combatants ) {
      if ( combatant.isDefeated ) continue;
      const roll = combatant.getInitiativeRoll();
      await roll.evaluate();
      updates.push({ _id: combatant.id, initiative: roll.total });
      rolls.set(combatant.id, roll);
      const { bonus, missing } = initiativeFormula(combatant.actor);
      entries.push({
        id: combatant.id,
        name: combatant.name,
        actor: combatant.actor,
        hidden: combatant.hidden,
        d20: roll.dice[0]?.total ?? roll.total,
        bonus,
        total: roll.total,
        missing
      });
    }
    if ( !updates.length ) return;

    // Keep the turn on the current combatant in the new order, unless told otherwise.
    if ( combatTurn === undefined ) {
      const fresh = new Map(updates.map(u => [u._id, u.initiative]));
      const order = this.combatants.contents
        .map(c => ({ id: c.id, actor: c.actor, initiative: fresh.get(c.id) ?? c.initiative }))
        .sort(compareCombatants);
      const index = order.findIndex(c => c.id === this.combatant?.id);
      combatTurn = index >= 0 ? index : (this.turn ?? 0);
    }

    await this.updateEmbeddedDocuments("Combatant", updates, { turnEvents: false, combatTurn });
    await this.setFlag("kd20", ROUND_FLAG, round);
    await this.#postSummary(round, entries, rolls);
  }

  /* -------------------------------------------- */

  /**
   * One public card for visible combatants, and a GM-only card for hidden ones.
   */
  async #postSummary(round, entries, rolls) {
    const ChatMessage = foundry.documents.ChatMessage.implementation;
    const groups = [
      { list: entries.filter(e => !e.hidden), whisper: [] },
      { list: entries.filter(e => e.hidden), whisper: ChatMessage.getWhisperRecipients("GM") }
    ];
    const messages = [];
    for ( const { list, whisper } of groups ) {
      if ( !list.length ) continue;
      const content = await foundry.applications.handlebars.renderTemplate(
        "systems/kd20/templates/chat/initiative-card.hbs",
        { round, rows: buildInitiativeRows(list), gmOnly: whisper.length > 0 }
      );
      messages.push({
        content,
        whisper: whisper.map(u => u.id),
        rolls: list.map(e => rolls.get(e.id)),
        flags: { "core.initiativeRoll": true }
      });
    }
    if ( messages.length ) await ChatMessage.create(messages);
  }
}
