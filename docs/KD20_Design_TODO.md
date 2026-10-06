# KD20 — Design Session TODO

**Version: v0.3 — 2026-10-03** *(roadmap for the next design pass; against Core Rules v0.34 — defense model resolved, playtest-revised to rolled Saves)*

The playable Foundry system and the five-gateway catalogue (Warrior, Scout, Adept, Guardian, Face — 34 feats) are built. Populating the catalogue surfaced a set of **referenced-but-undefined terms** and some **rules gaps** the gateways lean on. This doc is the roadmap for the next focused *design* session. Most items interlock and resolve through one keystone decision (below), so they should be tackled together, not piecemeal.

---

## THE KEYSTONE — RESOLVED (Core Rules v0.34, playtest-revised) ✅

The defense model is settled — but **not** as the fully-static proposal; live play revised it. (v0.33 briefly adopted all-static defenses; players found rolling *saves* mattered to them — static felt "helpless, out of my hands" — so the Saves reverted to rolled while AC stayed static. All the profile/feat/weakness design was preserved.) Final model (see `KD20_Rules.md` → *Defenses*):
- **AC is static** (passive avoidance): `10 + dex + armour`. Attacker rolls against it.
- **The six Saves are ROLLED by the defender** (active resistance): `1d20 + stat + gateway profile + feats`. One per stat: **Withstand (str)**, Fortitude (con), Reflexes (dex), Composure (int), Resolve (wis), Poise (cha).
- **Contest-or-Save line:** target actively opposing → contest (both roll); passive target → roll vs. their static number; AC is the one always-static defense.
- **Gateway Save profiles** (fixed template, AC excluded) and **Effect Escalation** (default ladder along a chosen axis) both adopted.

**What this resolved from the list below:** the §1 resist mechanic (Saves are now rolled, one per stat, with Withstand filling the old str gap), much of §2's "what is a resist / contest" question (the active/passive line), and the §5 resist-check branch of the active-feats architecture (a Save *is* a contest — attacker's total vs. defender's Save roll). What remains is mostly *naming and authoring*, not architecture.

---

## 1. Resist feats (currently referenced, none exist as items)

The gateways lean on a set of per-stat resists, but none are authored, and the feats use **inconsistent names** for them. **Decision needed: the canonical set.**
- **Withstand** (physical) — needed by Steel Discipline, Iron Resilience, Bulwark, Unbreakable, Guardian's boost-floor.
- **Reflexes** — rolled by Blast and Guardian's Reach.
- **Resolve** — Taunt and Rattled contest against it.
- **Poise** — named in the rules; no feat uses it yet.
- **Name collisions to resolve:** "Endurance" (Iron Resilience) is probably **Withstand**; "Composure" (Rattled) is probably **Poise**. Decide whether there are six distinct resists (one per stat) or whether these are synonyms to be unified. *(Rules originally sketched one resist per stat: Withstand/str, Reflexes/dex, Endurance/con, Composure/int, Resolve/wis, Poise/cha — six distinct. Reconcile the feat wording to that.)*
- **Note:** the Saves are rolled (1d20 + stat + gateway profile + feats); "resist feats" raise a Save one ladder step from its gateway baseline. Author the per-stat Save vocabulary and any defense-boosting feats here.

## 2. Roll / capability types the feats use but the rules never define

These are the non-combat competences the retired skill system used to cover — now homeless. Decide where they live (capability feats? defined roll types? both).
- **Social roll** (Face boost-floor, Crowd Control) — what counts as one?
- **Persuasion** (Silver Tongue, Taunt, Rattled)
- **Presence** (Taunt, Rattled; "a Presence feat" prereq for Crowd Control) — skill, stat, or feat family?
- **Insight** (prereq for Read the Room, Rattled)
- **Perception** (Battle Awareness, Eagle Eye, Scout boost-floor) — only mentioned in passing; "field-Perception" needs its own definition
- **Stealth** (Scout benefit, Ghost Step) — mentioned, not defined as a roll
- **Tracking** (Tracker) — what is rolled?
- **Spell attack roll** (Adept boost-floor) — doc says 1d20 + int; confirm as a roll type for the sheet

## 2b. AC-boosting feats (AC is feat-driven, not profiled)

Since AC is excluded from the gateway Save profile, callings get "hard to hit" via **cluster feats**, in two library flavors to author:
- **Armour-based** (Warrior, Guardian) — improves worn armour/shields.
- **Unarmored** (Monk, Rogue/Scout, Swashbuckler) — AC while lightly/un-armored, from agility and training (the dodgy-fighter fantasy).

Both are shared-library feats drawn by the relevant gateways. **Note:** this also flags **Monk** and **Rogue** as natural future gateways to build (neither exists yet) — they're the archetypal homes for the unarmored-AC feat and evasion-based identity.

## 3. Prerequisites with no feat behind them (prereq cleanup)

Tighten these to the proper **gateway + stat + feat** format once the referenced feats exist:
- **A Perception feat** (Eagle Eye, Guardian's Reach, Read the Room)
- **An Insight feat** (Read the Room, Rattled)
- **A Composure feat** (Rattled — see Poise question, §1)
- **A Presence feat** (Crowd Control)
- **A Withstand resist feat** (covered in §1)
- **"Warrior weapon feat"** (Retribution) — define: Weapon Master only, or any Warrior combat feat?
- **"Stealth-based movement in your kit"** (Ghost Step) — not a feat; is it gear, a skill, or fiction? Reword.
- **"Connections in your fiction"** (The Right People) — no Connections mechanic exists yet; define or reword.
- **"Scout/Warrior cross-training"** (Guardian's Reach) — **no rule exists for taking a feat outside your gateway.** Decide: define cross-training, or reword the prereq.
- **"Any three other X feats"** (Veteran's Eye, Shadow Network, Iron Aegis, The Long Con) — fine as text; the sheet won't auto-check it (acceptable).

## 4. Rules concepts the feats lean on that are missing or only sketched

- **Extended task** (The Long Con; Tracker's "margin for error") — no core rule for multi-roll/over-time tasks. Define.
- **Hidden** (Vanish calls it a Permission-State) — **not in the States list.** Add it.
- **Surprise / unaware** (Battle Awareness, Ambush Predator) — no surprise rule exists. Define.
- **Reaction timing** (Interpose, Ward, Guardian's Reach, Unbreakable) — Action Dice spent as reactions, but no *general* reaction rule in core. Formalize. *(Ties to the static-defense keystone: defensive die-spending is a reaction.)*
- **Session-pool / between-scenes costs** (Shadow Network, The Right People) — costs other than the in-play Action Dice pool aren't defined. Clarify.
- **Defeat wording** — RESOLVED in the doc (Iron Resilience → "0 HP / defeated", parallel to Unbreakable); ensure the Foundry seed entry matches.

## 5. The "active feats" architecture

A whole family of feats need to *do* something mechanical when used, and the data model/sheet doesn't yet support it:
- **Attack feats** (Bolt, Monk strikes) — roll d20+stat vs. target, deal damage. (Make Bolt rollable from the sheet.)
- **Resist-check feats** (Blast → Reflexes; Taunt, Rattled → Resolve/Composure contest) — **resolved: a Save IS a contest** (attacker's total vs. the defender's rolled Save) — no separate resist-check branch needed.
- **Self-effect feats** (Adrenaline Rush — spend a die, heal the roll).
Design **one coherent system** covering these, *after* the static-defense decision (which shrinks it). Then build in Foundry and retrofit the spells/strikes/social-attacks.

## 6. Known, already-decided, or deferred (no action unless revisited)

- **Adrenaline Rush double-limit** (Action Die cost *and* once-per-combat) — **deliberate, flavor-justified exception** to "the pool is the limiter" (adrenaline fires once per fight). Not a bug; already decided. Noting so it isn't re-flagged.
- **Master Feat's second Specialization Die** — not automated by the sheet (known, post-v1).
- **Spells stay Feat items, no weapon versions** — decided (spells cost XP, weapons don't). The castability is handled by the §5 active-feats work, not by making spells into weapons.
- **Offensive spells need an attack button** — part of §5; handle via the active-feats architecture (a Feat that can carry attack/damage fields), not a separate item type, so it also serves Monk strikes etc.

---

## Suggested order for the design session

1. **Decide the Static Defense keystone** (§keystone). Everything else reshapes around the answer.
2. **Settle the resist set** (§1) — six canonical per-stat resists; reconcile the synonym wording. (Static values if the keystone is adopted.)
3. **Decide where capability roll-types live** (§2) — define the social/perception/stealth/etc. vocabulary (capability feats and/or defined roll types).
4. **Design the active-feats architecture** (§5) — now shrunken by the keystone.
5. **Author the actual resist + capability feats**, then **prereq cleanup** (§3) against the now-existing feats; define or reword cross-training and Connections.
6. **Fill the rules gaps** (§4): Hidden state, Surprise, general Reaction rule, Extended tasks, between-scenes costs.
7. **Re-sim** if the defense math changed, then **build in Foundry** (resist feats/defenses into the data model + sheet; make active feats rollable) and re-seed the compendiums.

*Source: gap audit performed by Claude Code against the full 34-feat catalogue, 2026-10-03.*
