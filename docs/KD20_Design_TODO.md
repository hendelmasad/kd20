# KD20 — Design Session TODO

**Version: v0.7 — 2026-10-08** *(against Core Rules v0.39 — defense model, Save naming, Fitting Save, Hardened Save, capability roll-types, AND AC feats all resolved. **Next action: the Foundry VTT update — consolidated change-list at the bottom.**)*

The playable Foundry system and the five-gateway catalogue (Warrior, Scout, Adept, Guardian, Face — 34 feats) are built. Populating the catalogue surfaced a set of **referenced-but-undefined terms** and some **rules gaps** the gateways lean on. This doc is the roadmap for the next focused *design* session. Most items interlock, so they should be tackled together, not piecemeal.

---

## THE KEYSTONE — RESOLVED (Core Rules v0.34, playtest-revised) ✅ — and NAMING RESOLVED (v0.36) ✅

The defense model is settled, **playtest-blessed**, and the save naming is now finalized.

(v0.33 briefly adopted all-static defenses; players found rolling *saves* mattered to them — static felt "helpless, out of my hands" — so the Saves reverted to rolled while AC stayed static. All the profile/feat/weakness design was preserved.) Final model (see `KD20_Rules.md` → *Defenses*):
- **AC is static** (passive avoidance): `10 + dex + armour`. Attacker rolls against it.
- **The six Saves are ROLLED by the defender** (active resistance): `1d20 + stat + gateway profile + feats`. **Named for their stat (v0.36):** **Strength Save** (str), **Dexterity Save** (dex), **Constitution Save** (con), **Intelligence Save** (int), **Wisdom Save** (wis), **Charisma Save** (cha). *(Old flavour names Withstand/Reflexes/Fortitude/Composure/Resolve/Poise are retired.)*
- **Mental-save coverage re-divided (v0.36, "force of will"):** **Int Save** = the mind (telepathy, memory, confusion); **Wis Save** = perception (illusion, deception, sensing wrongness); **Cha Save** = the self / will (domination, compulsion, possession, **fear**, intimidation, crowd). Gateway −3 weaknesses preserved (the Warrior's old "Resolve −3" is now "Cha Save −3," still fear/domination).
- **Contest-or-Save line:** target actively opposing → contest (both roll); passive target → roll vs. their static number; AC is the one always-static defense.
- **Gateway Save profiles** (fixed template, AC excluded) and **Effect Escalation** (default ladder along a chosen axis) both adopted.
- **The Fitting Save (v0.36):** a defender who describes a defense routing a threat through a different stat may, GM-granted, roll that stat's Save instead of the default — one save not best-of, earned by commitment, the fiction's consequences stay, cuts both ways for threats, universal + free at baseline (feats may later grant reliability). Canonical example: braced large shield (no bucklers) vs. a breath weapon → Strength Save, but you stand in the fire. *This is also the reason the bare stat-name label matters: which save applies can shift.*

**What this resolved from the list below:** the §1 resist mechanic (Saves are rolled, one per stat) **and** the §1 naming/collision question (bare stat names — no more "is Endurance con or str?"); much of §2's "what is a resist / contest" question (the active/passive line); and the §5 resist-check branch (a Save *is* a contest). What remains is mostly *authoring*, not architecture.

---

## 1. Save-raising feats — AUTHORED ✅ (v0.37)

**Done.** The naming was settled in v0.36 (six stat-name Saves), and the feat itself is now authored in `KD20_Feats.md`:
- **Hardened Save** — one **parameterized universal feat** (taken per-Statistic, repeated to climb), matching the Weapon Master pattern. Raises one Save one flat ladder step (−3→0→+1→+3→+5).
- **Costed as the one sanctioned feat-bought height** (defensive, gated by the profile). **Scaled cost:** −3→0 = 20 · 0→+1 = 20 · +1→+3 = 30 · +3→+5 = 40. Major only on a gateway-Solid Save; a −3 lifts toward neutral only. One step per purchase.
- The feat-authoring guardrail in both docs now names defense as the explicit height exception, so it isn't re-flagged as "height in disguise."
- All the "requires a Strength Save feat" prereqs (Steel Discipline, Iron Resilience, Bulwark, Unbreakable) are satisfied by owning any Hardened Save on that stat.
- **Specialization-Die-on-a-Save** (Steel Discipline, Iron Aegis) is kept distinct: a conditional rider on a feat that does more, not flat height. Both can apply.

## 2. Roll / capability types — RESOLVED ✅ (v0.38)

**Done.** `KD20_Rules.md` now has a **Capability Roll-Types** section. The resolution:
- A **roll-type is a named stat-roll** — the name picks the stat + fiction; the bonus is purely the stat. No skill list; no separate numbers.
- **The GM names the governing stat at the table** from the (now expanded) *Character of each Statistic* definitions, by asking "which stat does this lean on?" The **baseline guide table** (Perception wis, Stealth dex, Persuasion cha, …) is a consistency anchor for the common cases and the feat-referenced activities, **not a registry** — Keith's call: lean on clear stat definitions, don't name every situation.
- **Spellcasting = gateway-determined** (Adept int, faith wis, innate cha) — the clearest case of stat-by-fiction.
- **Rerouting** added: a described approach may use a different stat (GM-granted) — the offensive mirror of the Fitting Save; one principle across the game.
- **"A [roll-type] feat"** = any feat granting a Spec Die on that roll-type — this resolves every dangling prereq (see §3).
- Social-attack *targets* were already settled in v0.36 (Taunt/Rattled contest the Charisma Save); the attacker's own roll type is now a Charisma (Presence/Persuasion) roll per the guide.

## 2b. AC-boosting feats — AUTHORED ✅ (v0.39)

**Done.** Both AC feats are in `KD20_Feats.md`:
- **Armour Training** (universal, armour-wearing gateways) — **+1 AC** from worn armour, **max +2** (two purchases, 30/40 XP), requires armour heavier than light. Flat defensive height, capped.
- **Unarmored Defense** (gateway-themed) — while **light or no armour**, AC = **`10 + dex + gateway's themed stat`**: Monk **wis**, Rogue/Swashbuckler **cha**, Barbarian **con**. 30 XP, buy-once, self-limiting. The gateway names the stat (like Spellcasting).
- **Mutually exclusive by requirement** (armour vs. its absence) — never stack.
- **~20 AC soft cap** canonized in the Rules (GM-upheld band target, protects the static ~13–17 band).
- The guardrail in both docs now names **AC** as the second sanctioned defensive-height exception (alongside Hardened Save).
- **Flags the next gateways:** **Monk, Rogue, Swashbuckler, Barbarian** are named in the rules as the homes of Unarmored Defense — the hook for building them as full gateways.

## 3. Prerequisites with no feat behind them (prereq cleanup) — mostly RESOLVED

The "a [roll-type] feat" definition (§2) + the Hardened Save feat (§1) now give most of these a real referent. Status:
- ✅ **A Perception feat** (Eagle Eye, Guardian's Reach, Read the Room) → any feat granting a Spec Die on Perception (wis).
- ✅ **An Insight feat** (Read the Room, Rattled) → any feat training Insight (wis).
- ✅ **A Presence feat** (Crowd Control) → any feat training Presence (cha).
- ✅ **An Intelligence Save / Strength Save feat** (Rattled; Steel Discipline, Iron Resilience, Bulwark, Unbreakable) → owning a **Hardened Save** on that stat.
- **Still to tidy (wording, not architecture):**
  - **"Warrior weapon feat"** (Retribution) — define: Weapon Master only, or any Warrior combat feat?
  - **"Stealth-based movement in your kit"** (Ghost Step) — reword to "a Stealth feat" (now that Stealth is a defined roll-type).
  - **"Connections in your fiction"** (The Right People) — no Connections mechanic yet; define or reword.
  - **"Scout/Warrior cross-training"** (Guardian's Reach) — no rule for taking a feat outside your gateway. Decide: define cross-training, or reword.
  - **"Any three other X feats"** (Veteran's Eye, Shadow Network, Iron Aegis, The Long Con) — fine as text; sheet won't auto-check (acceptable).
- **Small follow-up:** the feats still say "field-Perception," "social roll," "spell attack roll" in a few places — reword to the clean roll-type names (Perception, a Charisma/Presence roll, Spellcasting) for consistency. Low priority, cosmetic.

## 4. Rules concepts the feats lean on that are missing or only sketched

- **Extended task** (The Long Con; Tracker's "margin for error") — no core rule for multi-roll/over-time tasks. Define.
- **Hidden** (Vanish calls it a Permission-State) — **not in the States list.** Add it.
- **Surprise / unaware** (Battle Awareness, Ambush Predator) — no surprise rule exists. Define.
- **Reaction timing** (Interpose, Ward, Guardian's Reach, Unbreakable, + Save-boost die-spending) — Action Dice spent as reactions, but no *general* reaction rule in core. *(Partly formalized — the Action Economy's Reactions section exists; confirm it covers defensive Save-boosting after seeing the attacker's total.)*
- **Session-pool / between-scenes costs** (Shadow Network, The Right People) — costs other than the in-play Action Dice pool aren't defined. Clarify.
- **Defeat wording** — RESOLVED (Iron Resilience → "0 HP / defeated", parallel to Unbreakable); ensure the Foundry seed entry matches.
- **Fitting Save reliability feats** — the Fitting Save is universal + free at baseline, but the rules note feats *may later* grant reliability (an automatic, permission-free substitution, e.g. a shield feat that always allows the Strength-brace vs. areas). Author these alongside the AC/Save feats if wanted.

## 5. The "active feats" architecture

A whole family of feats need to *do* something mechanical when used, and the data model/sheet doesn't yet support it:
- **Attack feats** (Bolt, Monk strikes) — roll d20+stat vs. target, deal damage. (Make Bolt rollable from the sheet.)
- **Resist-check feats** (Blast → Dexterity Save; Taunt, Rattled → Charisma Save contest) — **resolved: a Save IS a contest** (attacker's total vs. the defender's rolled Save) — no separate resist-check branch needed.
- **Self-effect feats** (Adrenaline Rush — spend a die, heal the roll).
Design **one coherent system** covering these. Then build in Foundry and retrofit the spells/strikes/social-attacks.

## 6. Known, already-decided, or deferred (no action unless revisited)

- **Adrenaline Rush double-limit** (Action Die cost *and* once-per-combat) — **deliberate, flavor-justified exception** to "the pool is the limiter." Not a bug; already decided.
- **Master Feat's second Specialization Die** — not automated by the sheet (known, post-v1).
- **Spells stay Feat items, no weapon versions** — decided (spells cost XP, weapons don't).
- **Offensive spells need an attack button** — part of §5; handle via the active-feats architecture (a Feat that can carry attack/damage fields).

---

## FOUNDRY VTT CHANGE-LIST for the v0.36 Save rename (hand this to Claude Code)

The save rename + coverage reshuffle touches the "kd20" system. Most of it is labels, not logic:
- **`module/config.mjs`** — `SAVE_LABELS` change to "Strength Save" … "Charisma Save" (the player-facing strings). `SAVE_KEYS` / `SAVE_STATS` mapping is unchanged (each save still uses its own stat). If any key string encoded a flavour name (e.g. `withstand`), decide whether to keep the key and only change the label (lower-risk) or migrate keys (needs a data migration + `backfillSaveProfiles`-style pass).
- **Gateway `saveProfile` values are unchanged** for Scout, Adept, Face. **Warrior and Guardian** had their −3/+1 *move between stat columns* (Warrior −3 from wis→cha; Guardian +1 from wis→cha) — if profiles are stored per-stat, those two seeds need re-seeding (bump `CONTENT_VERSION`). Everything else validates against the same 2/1/2/1 template.
- **Coverage text** (what each save resists) lives in descriptions/tooltips, not logic — update strings only.
- **No roll-engine change** — `rollSave`, `resolveOutcome`, margins all stay. The Fitting Save is GM adjudication, not automation (no code).
- Re-run `tools/verify.mjs`; expect only label/seed diffs.

---

## Suggested order for the next design session

1. ~~**Author the Save-raising feats** (§1)~~ — **DONE (v0.37):** the Hardened Save feat is authored and costed.
2. ~~**Decide where capability roll-types live** (§2)~~ — **DONE (v0.38):** roll-types are named stat-rolls; GM assigns the stat from the definitions; baseline guide + rerouting + "a [roll-type] feat." The next biggest piece is now **§2b AC-boosting feats** (and the Monk/Rogue gateways they imply), then the active-feats architecture (§5).
3. ~~**Author the AC-boosting feats** (§2b)~~ — **DONE (v0.39):** Armour Training + Unarmored Defense authored; ~20 soft cap canonized.
4. **→ FOUNDRY VTT UPDATE (next):** fold v0.36–v0.39 into the "kd20" system — see the consolidated change-list below. This is the next action.
5. **Design the active-feats architecture** (§5) — make Bolt/strikes/social-attacks rollable — then build in Foundry.
6. **New gateways** when wanted — **Monk, Rogue, Swashbuckler, Barbarian** (homes for Unarmored Defense + evasion identity).
7. **Prereq cleanup** (§3) leftovers (cross-training, Connections wording); **rules gaps** (§4): Hidden state, Surprise, Extended tasks, between-scenes costs.
8. **Re-sim** only if defense *math* changes (the v0.36–v0.39 passes didn't change the core numbers — renames, a new cap, and new feats that stay in band).

---

## CONSOLIDATED FOUNDRY VTT CHANGE-LIST (v0.36 → v0.39) — hand to Claude Code

Everything the design docs changed since the Foundry system was last at parity. Grouped by risk.

**A. Save rename + mental-coverage reshuffle (v0.36) — labels + two re-seeds.**
- `module/config.mjs` → `SAVE_LABELS`: "Strength Save" … "Charisma Save" (player-facing strings). `SAVE_KEYS`/`SAVE_STATS` unchanged (each save still uses its own stat). If any key string encoded a flavour name (`withstand`, etc.), prefer keeping the key and changing only the label (low-risk) over migrating keys.
- Coverage text (what each save resists) lives in descriptions/tooltips → update strings: Int = mind, Wis = perception, Cha = will (fear moved to Cha).
- **Re-seed Warrior & Guardian gateway `saveProfile`** — their −3/+1 moved between stat columns (Warrior −3 wis→cha; Guardian +1 wis→cha). Scout/Adept/Face unchanged. Bump `CONTENT_VERSION`.
- No roll-engine change — `rollSave`, `resolveOutcome`, margins all stay.

**B. Fitting Save (v0.36) — no code.** GM adjudication only. Optionally a tooltip/journal note.

**C. Hardened Save feat (v0.37) — seed one feat.** A parameterized "Hardened Save" item (raises one Save one step; scaled cost 20/20/30/40; Major only on a gateway-Solid Save). Flat, always-on bonus to the chosen Save's computed total. The "requires a Strength Save feat" prereqs are satisfied by owning one on that stat.

**D. Capability roll-types (v0.38) — no code (or cosmetic).** Roll-types are GM-assigned stat-rolls; nothing to automate. Optionally expose the baseline guide as a journal/reference entry. Spellcasting stat is gateway-declared (Adept int) — if the sheet hardcodes a casting stat, make sure it reads from the gateway.

**E. AC feats + soft cap (v0.39) — seed two feats; AC computed.**
- Seed **Armour Training** (+1 AC from worn armour, max +2, requires armour > light) and **Unarmored Defense** (while light/no armour, AC = 10 + dex + gateway's themed stat).
- If AC is a computed field, add the two feats' contributions with their requirement checks (armour category gate; the themed stat from the gateway). They're mutually exclusive by requirement.
- The ~20 soft cap is a GM target, not an enforced clamp — don't hard-cap AC in code unless Keith wants a warning.

**General:** bump system version + `CONTENT_VERSION`; run `tools/verify.mjs`; a `backfillSaveProfiles`-style one-time migration if any stored gateway profiles need the Warrior/Guardian column move. Expect label/seed diffs, no engine diffs.

*Source: gap audit vs. the 34-feat catalogue (2026-10-03); updated through the v0.36–v0.39 design passes (2026-10-07/08).*
