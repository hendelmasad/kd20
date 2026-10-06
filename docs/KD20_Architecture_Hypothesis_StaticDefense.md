# KD20 — Architecture Hypothesis: Unified Static Defense

**Status: PROPOSED — not yet canon.** A design hypothesis to be worked through in a dedicated session *after* the Foundry feat-catalogue pass is complete. It is upstream of several pending to-dos (resist feats, the "active feats" architecture, Parry/Ward, the Guardian) and should be decided *first*, because it reshapes all of them.

**Captured: 2026-10-03, against Core Rules v0.32.**

---

## The One-Sentence Version

**Every actor has static defenses (10 + mods); every action is a roll vs. a defense; and either side may spend Action Dice to push their number in a moment that matters.**

Attack vs. AC, spell vs. Reflexes, taunt vs. Resolve, poison vs. Fortitude, lockpick vs. a lock's DC — all the same resolution shape, all boostable by the same pool, on both sides of the screen.

---

## The Hypothesis, in Full

1. **All defenses are static numbers, built like AC.** Not just Armour Class — *every* defense is `10 + stat + mods`: **AC, Reflexes, Fortitude/Withstand, Resolve, Composure, Poise** (one per the relevant stat, matching the six resistances). Each is a fixed value on the sheet, computed like AC.

2. **The attacker always rolls; the defender's number is static.** Just as a weapon attack is `d20 + stat vs. target AC`, every offensive action rolls against the appropriate static defense: a fear effect is `d20 + cha vs. target Resolve`; a poison `vs. Fortitude`; a mind-trick `vs. Composure`; an area blast `vs. each target's Reflexes`. The actor *doing* something rolls; the target never rolls to resist. One paradigm for all defense.

3. **Either side may spend Action Dice to push their number.** On offense you spend dice to boost your roll (already canon). On defense, your "roll" is frozen at its average (that's what a static 10-based number *is*), so you may **spend Action Dice to raise a static defense against an incoming attack** — roll the die(s), add to the defense for that attack. Normal case: no dice, fast, attacker rolls vs. your static number. Clutch case: the blow that would drop you — spend 2 dice, roll 2d6, AC 14 → 21 for that attack.

4. **Defensive die-spending is a reaction, after seeing the attack total.** The attacker rolls, you see their total, *then* you decide whether to spend Action Dice to raise your defense above it. It costs the reaction slot + the dice (reusing the reaction economy). "The blow is coming — do I burn dice to turn it aside?"

5. **Resist feats become "+X to a static defense"** (or "boost your defensive die-spend"), **not "a d6 on a resist roll."** The six resistances are static defenses; the feats that improve them raise the number or improve the die you spend to defend.

---

## Why This Is Compelling

- **Total consistency with the AC decision.** KD20 already made AC static with the attacker rolling. This extends that single choice to *all* defenses — one defensive paradigm, one mental model: the actor doing something always rolls; the defender's values are static.
- **It SHRINKS the "active feats" architecture instead of growing it.** The pending worry was a whole family of feats that force *target* rolls (Blast → Reflexes resist, Taunt/Rattled → Resolve contest, a Monk's Stunning Palm, etc.). With static defenses, **none of these force a target roll** — they are all just "attacker rolls vs. a static defense," identical to an attack. The entire *resist-check branch collapses into the attack branch.* Four effect-types (attack / resist-check / contest / self) reduce toward two (roll-vs-a-static-DC, and self-effects).
- **Faster at the table.** Half as many dice rolls in many exchanges — attacker rolls, check against a number, done. No attacker-rolls-then-defender-rolls. Fits "keep the action moving."
- **Symmetric with offense — the KD20 soul.** Attacker pushes their total up; defender pushes their defense up; whoever commits more dice to the moment wins it. **One resource (Action Dice), symmetric use, both sides of the screen.** The pool now governs attack *and* defense uniformly.
- **Defense becomes a choice, not an obligation.** Players don't roll a defense every time (slow); they *may* engage the dice when it matters (agency as a deliberate, dramatic choice).
- **It reframes Parry, Ward, Guardian's benefit, and Steel Discipline cleanly** — they all become *instances* of "spend dice to raise a static defense" (Parry via weapon, Ward via magic, Guardian's floor on the defensive die-spend, Steel Discipline's +d6 when defending physically). The special cases collapse into the general rule.
- **One resolution shape for the whole game** — the unification KD20 has driven toward since the margin ladder. Removing the last defensive asymmetry (some defenses rolled, some static) rhymes with removing the last die-face exception (nat 1/20).

---

## Consequences to Resolve (the honest costs)

- **Players roll less on defense.** Rolled saves put the defender's fate in the defender's hands (high agency/drama — *you* grab the dice when the dragon breathes). Static defenses mean the GM rolls *at* the players for monster attacks. **But** KD20 already accepted this for AC, so extending it is consistency, not a new departure — and point 3/4 (spend dice to raise defense) restores the agency as a *choice*. Decide consciously: is defense-as-a-choice-to-engage preferable to mandatory defense rolls? (Hypothesis says yes.)
- **Defensive Action-Die spending moves from "boost a resist roll" to "raise a static defense."** This is the fix that makes the whole thing work (point 3) — it means static defenses are *not* un-boostable; the frozen d20 can still be pushed. Reframe Guardian's benefit and Steel Discipline accordingly (they boost the defensive die-spend / add to the static number).
- **Timing & information rule needs nailing down** (point 4): attacker rolls, defender sees the total, then chooses to spend. Confirm this is a reaction (reaction slot + dice), so it isn't free and ties to existing machinery. Parry/Ward likely collapse into this general rule.
- **Area effects** (Blast) still target *each* defender's static Reflexes — clean under this model (one roll vs. several static numbers), and *simpler* than roll-vs-each-defender's-roll.

## What It Touches (why it must be decided first, all at once)

AC · the six resistances · resist feats · the "active feats" architecture (attack/resist/contest/self) · Parry · Ward · the Guardian gateway (Interpose, Steel Discipline-style boosts) · the Action Die economy (now symmetric across attack and defense) · the Foundry roll engine (defenses become target numbers; a "spend dice to raise defense" reaction).

## Recommended Sequencing

1. **Finish the Foundry feat-catalogue pass** (Guardian, Face) with everything as plain display-only feats. *(In progress.)*
2. **Decide THIS hypothesis first** in the design session — it is the keystone the rest hangs from.
3. Then, downstream of it: **author the resist feats** (now "+X to a static defense"), **design the (shrunken) active-feats architecture**, **reframe Parry/Ward/Guardian**, and **prereq cleanup**.
4. Re-sim if adopted (the defensive math changes), then build in Foundry.

## Open Questions for the Session

1. Happy with players rolling less on defense (agency moves to the *choice* to spend dice), in exchange for consistency-with-AC, speed, and the architecture collapse? *(Hypothesis leans yes.)*
2. Defensive die-spending as a **reaction** (slot + dice), decided after seeing the attacker's total — and do Parry/Ward collapse into this general rule?
3. Do the six resistances all get static values at creation (10 + stat + mods), and do threats get them authored directly (like threat AC)?
4. Any defense that should *stay* rolled for feel reasons, or is full static the goal (full consistency)?
