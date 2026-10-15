# KD20 — Design Session TODO

**Version: v0.14 — 2026-10-14** *(against Core Rules v0.44 / Feats v0.44 — all defense work resolved AND SHIPPED to Foundry (system 0.8.0, merged to main): saves rename, Hardened Save, AC feats, Fitting Save, capability roll-types, armour table + equippable armour items — all tested live. Recent design (docs-only, Foundry deferred to the active-feats pass): Devotion feats (§2e, Vow + Breach Ladder, god Kael + Smite); Interpose brace (§2f, d6+con, con-once, found vs. Grush); HP feats + "rarely-sell-height" reword (§2g); **🧪 die-step Convergence + reborn Master Feat (§2h, PLAYTEST — supersedes the §2d Modifier version: one die stepping d6→d8→d10→d12, Master Feat now a step not a 2nd d6, re-priced 30, confirm at the table).** Distance now measured in **units ("un")**, 1 un ≈ 2m (v0.43). Next big design piece: the active-feats architecture (§5). A small Foundry polish backlog is tracked below §2c.)*

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

## 2c. Armour table — DEFINED ✅ (v0.40)

**Done.** The armour/shield values (previously deferred) are now canon in `KD20_Rules.md`:
- **None +0 · Light +1 · Medium +2 · Heavy +3 · Shield +1.** Tight on purpose — Armour Training (+1/+2) stacks, keeping the maxed heavy tank at **AC 20** (the band top; dex-20 extreme touches 21, absorbed by the soft cap).
- **Dex always applies at every category** — KD20 never caps agility by armour (that's *why* the base values are small).
- Validated vs hit-chance: a trained master holds AC 20 to ~47% passive; the pool lifts it over 50%. Strong-but-fair wall, never immune.
- **Foundry: SHIPPED ✅** — armour is **equippable items** (category + bonus on the item); equipped category drives the AC-feat gates. Merged to main in the v0.36→v0.40 overhaul (system 0.8.0). Tested live: Chain Mail (+2) + Shield (+1), dex+2 → AC 15; feat gates read equipped category; two independent slots (body / shield).

## 2d. Convergence — multiple feats on one roll — RESOLVED ✅ (v0.41) → ♻️ SUPERSEDED by die-step model (v0.44, §2h)

> **⚠️ The v0.41 Modifier-ladder version below is HISTORY.** As of v0.44 (§2h) Convergence **steps the Specialization Die up** (d6→d8→d10→d12) instead of granting a ±1/±3/±5 Modifier. Kept here for the reasoning trail. Read §2h for current.

**The gap:** the one-die rule says only one Specialization Die is ever added. But sometimes two feats fire for *genuinely different reasons* on one roll — the canonical case is a Guardian/Warrior's **Retribution** (fury of avenging an interposed hit) + **Weapon Master** (trained with this blade) on one swing. Players felt the "a spec die is a spec die, no further gain" explanation fall flat — it punishes breadth, which is backwards.

**Decision — Convergence rides the Modifier Ladder, one named rung per additional converging feat:**
- **2 feats → +1 (Minor) · 3 feats → +3 (Solid) · 4+ feats → +5 (Major) — CAP.**
- **Still one die.** Convergence adds a flat ladder Modifier *on top of* the single Spec Die; it never adds a second die.
- **GM counts honestly** — only feats whose triggers *independently* fire for their own reason; GM confirms. Rare by nature (3 is unusual, 4 is once-a-campaign), which is why it can climb the ladder safely.
- **Master Feat stays separate** — its second d6 is the one sanctioned stacked *die* (depth); convergence is the ladder reward for *breadth*. They never combine on one roll.
- **Why this shape:** reuses the established ladder (±1/±3/±5) rather than inventing a die-floor special case; rewards the exact thing KD20 is built to reward (breadth paying off); max flat +5 stays under a Master Feat's whole extra d6, so mastery (depth) still out-values alignment (breadth). Considered + rejected: flat +1 (too small to feel), floor-of-4 on the die (new special rule for reading a d6), count-up by raw integer (+1/+2/+3 — fine, but the named rungs are cleaner and more legible).
- **Docs:** canon in `KD20_Rules.md` → *One Die Applies* → "Convergence — When Feats Legitimately Stack"; one-liner in `KD20_Quick_Reference.md`.
- **Foundry: NOT YET.** Needs a convergence Modifier option in the roll flow / Contest Resolver (a "+N convergence" picker the GM sets, or a toggle per converging feat). Low priority until the active-feats architecture (§5) exists, since that's where multi-feat rolls get surfaced. For now it's a table ruling + sheet-noted modifier.

## 2e. Devotion feats — religion & granted divine powers — RESOLVED ✅ (Feats v0.40)

**The design:** religion is **not a class and not a gateway**. Worship is open to all; *power* is bestowed on a rare few **marked by destiny**. Devotion feats are a **cross-cutting layer in the shared library** — any gateway can carry them (a vengeance paladin = Warrior + Smite; a cleric = Guardian/Face/Adept + divine feats). The god is a thread *across* the gateway system, not another gateway in it.

**The one new mechanic — the Vow (a new prerequisite kind):**
- Every other prereq is permanent once met; the **Vow is standing and *revocable*** — the first prereq you can *lose* after meeting it. Named as a formal fourth gate in "How to Read a Feat."
- A Vow demands some/all of: **the Mark** (GM-bestowed, rare — the true gate), **exclusive worship** ("no other gods"), **the god's tenets**, and sometimes **a sacrifice** (one-time or maintained).

**Marked by destiny = the scarcity gate.** Not for the asking; GM-bestowed via a catalyst, exactly like a second gateway's. Keep marked PCs uncommon; named NPCs can carry divine feats to mark them as a god's champion/scourge. Scarcity is the balance valve — the feats needn't be individually weak, just rare.

**The Breach Ladder (consequence scales with offense):**
- **Lapse** (stumble, weakness, unavoidable) → **dormant until atonement** (the default; XP suspended, never wasted).
- **Betrayal** (knowingly against tenets, or worshipping a rival) → **lost until re-earned** (Mark stripped; needs a new Transformative Moment).
- **The god's own cardinal virtues / unforgivable crimes set where any breach lands** — per-deity flavour, not a generic rule. Signature tension: a war-god's devotee falls for showing *mercy to a marked foe*; a mercy-god's devotee falls for the opposite. Same feat, opposite souls.
- XP never refunded (standing rule); atonement restores a dormant feat free, betrayal must be re-earned in fiction.

**Divinity rides trigger + trapping, never flat height.** Smite = Weapon Master with a holier trigger (only vs. your *named vengeance*) + god-themed Follow-Up riders; it sells no standing bonus and obeys the ladder exactly. The nova ("Wrath of the Unbroken Blade") adds damage *only* via an Action-Die cost (pool is the limiter) — a new **option**, not a bigger number. This keeps the no-height principle intact inside the divine layer.

**Worked god shipped:** **Kael, the Unbroken Blade** (war & vengeance) — full portfolio, cardinal virtues, unforgivable crimes, Vow, and three feats (Smite 25 XP · Wrath 30 XP · Relentless 20 XP). Doubles as the GM's "how to write a god" template (portfolio + virtues + crimes + 2–4 feats).

**Docs:** canon in `KD20_Feats.md` (new "DEVOTION FEATS" section after Face; Vow named in "How to Read a Feat"). Feats doc → **v0.40**.

**Deferred:** divine **healing / condition-removal** (Lay on Hands, Mercy's Shield, Sanctuary, Absolution) waits on the **Recovery / Conditions** system (§4) — Devotion feats in waiting, not a separate track. Pure GM-narration divine feats port verbatim when a god wants them.

**Foundry: NOT YET.** A Devotion feat is just a feat to Foundry *except* for the Vow's revocable state. Minimum future support: a **feat flag/field** marking it as Devotion (god name + vow text), and a simple **active/dormant toggle** on the character (GM flips it on breach, so dormant feats visibly stop applying). The Mark and tenets stay GM-narrative. Low priority — parks against the active-feats pass (§5) and the eventual feat-tree/gateway browser, where feat metadata gets surfaced anyway.

## 2f. Interpose brace — Guardian survivability — RESOLVED ✅ (Feats v0.41)

**The playtest gap (found running Grush):** a Guardian who Interposes takes the hit with **no AC check and no Save** (Interpose fires *after* the ally "is hit" — the AC roll already happened vs. the ally). Against a boss (Grush's maul ~16, up to 25), two interposes drop a ~19-HP Guardian. The party's designated tank melted *faster* than the squishy it protected, and nothing in the gateway made tanking survivable — Interpose dumped raw damage on the Guardian's **−3 Dexterity Save** (their profile's soft spot), bypassing the con/endurance the role is built on. GM confirmed he was running it correctly — it was a design gap, not a table error.

**The fix (Keith's, folded into the existing ability, no new feat, no new cost):** the Action Die you *already* spend to Interpose now **braces the blow**. Reduce the damage you take by **that die's roll + your Constitution bonus**. May pour in **extra Action Dice to brace harder** (each adds a d6), but **con applies once** (two dice = `2d6 + con`, not con twice) — keeps a deep pool from trivializing it.
- **Why it's right:** costs nothing new (the die was always Interpose's price — now it *does* something on the receiving end); routes survivability through **con** (the stat a Guardian actually invests in: profile Str +3 / Con +3 / Dex −3), so the tank's toughness finally shows on the act of tanking; it's a spent-resource reduction (`d6 + con`), *not* flat permanent height, so it doesn't breach the no-defensive-height-outside-sanctioned-feats line. Self-scales: a 25 boss-hit still hurts through the brace; a 4-damage goblin hit is shrugged off.
- **Math check:** con +3 Guardian vs. Grush's ~16 maul → takes ~16 − (3.5 + 3) ≈ **9–10**. Still a real hit, no longer a death sentence. Grush stays scary *without* a nerf.

**Docs:** amended the Guardian gateway **Interpose** benefit in `KD20_Feats.md` (the one canonical spot — Core Rules & Quick Reference describe the gateway pattern generically, don't name Interpose, so no edit there). Feats → **v0.41**.

**Parked (not built):** "spend extra dice to brace harder" is in the benefit, but a dedicated **Guardian feat** that rewards heroic bracing (e.g. the brace die floors at 4, or a Decisive brace lets you counter) is a good future cluster feat — noted, not written.

**Foundry: NOT YET.** Interpose isn't automated (it's a narrated reaction), so no code needed now. When threats/active-feats land and damage gets applied in-VTT, the brace is a `-(Nd6 + con)` on the applied damage — trivial to fold into a future "apply interposed hit" helper.

## 2g. HP feats + "rarely sell height" reword — RESOLVED ✅ (v0.42)

**Trigger:** Keith asked whether HP feats existed. They were a *decided-but-unwritten* concept (named in Core Rules + Translation Guide as the replacement for MYD20's HP-by-gateway) but never authored as feats. Writing them surfaced that they're flat defensive height, which tripped the "Feats NEVER sell height" principle — which already had 2 (→3) sanctioned exceptions, so "never" was the wrong word.

**Principle reword (Keith's call):** "Feats **never** sell height" → "Feats **rarely** sell height — **and never on offense**." Intent was always *modesty/restraint, not prohibition*. Two tiers now, cleanly:
- **Offensive height = absolute no** (the DC/margin treadmill; forbidden, no exceptions — this line does NOT bend).
- **Defensive height = rare, sanctioned, bounded** — the named club: **Save** height (Hardened Save), **AC** height (Armour Training / Unarmored Defense), and now **HP** height (HP feats). An exception must be defensive, bounded, costed above a cluster feat, and named in Design Principles to exist.

**HP feats authored** (Feats doc → Defensive Feats, the 3rd sanctioned exception):
- Fold one **additional** stat's *living* bonus (tracks the stat) into HP. One per stat, **buy-once**, **stat 16+** gate (ties durability to catalyst-gated stat growth → earns in slowly), **30 XP** each (defensive-height price).
- **con & wis are already in base HP** (`10 + con + wis + gateway`), so the feats cover the other four: **Dogged** (+str), **Rolls With It** (+dex — riding the hit, not dodging it; dodging is AC/dex already), **Unflappable** (+int), **NOT IN THE FACE!** (+cha).
- **Bulwark name-clash resolved:** Core Rules had called the +con HP feat "Bulwark," but that name is taken by the Guardian can't-be-moved cluster feat (which Unbreakable requires — do NOT rename it). Moot anyway: con is in base HP so there's no +con HP feat. Core Rules HP line corrected to the 4-feat (str/dex/int/cha) model.

**Docs:** Core Rules → v0.42 (HP-feat line corrected), Feats → v0.42 (principle reword + 4 HP feats). TODO → v0.13.

**Foundry:** no new work — HP feats are flat living modifiers to HP. When built, they're the same pattern as other defensive-height feats (a feat item that adds a stat bonus to the HP formula); folds into the eventual feat-structure / active-feats pass, not a standalone job.

## 2h. Die-step Convergence + reborn Master Feat — 🧪 PLAYTEST (v0.44)

**Written as PLAYTEST, not firm canon** — confirm at the table (next session is the first time anyone rolls a stepped die) before locking. Supersedes the v0.41 Modifier-ladder Convergence (§2d).

**Origin:** Keith floated retiring the Master Feat (nobody had bought one; two-feat convergence was happening regularly and players were deliberately stacking overlapping feats). Pushed back — Convergence rewards *breadth*, the Master Feat rewards *depth*, and depth reaches **solo (single-feat) rolls** that convergence structurally can't (the lone lockpicker/loremaster). Deleting it would gut the specialist's apex + the niche-protection social work. Synthesis (Keith's): don't delete it — **unify it onto one die-step ladder.**

**The unified model — one die, sized by steps:**
- **One Specialization Die per roll, stepping d6 → d8 → d10 → d12 (cap).** Baseline feat = d6; each *additional* source of excellence = +1 step.
- **A "source of excellence" = a step, from either of two places, counted identically:** (a) each additional **converging feat** (independent trigger), (b) a **Master Feat** on the firing trigger. A mastered feat that *also* converges just adds its step, to the shared d12 cap.
- **Balance-safe by construction:** d8 = d6+1 exactly; d10/d12 sit *below* d6+3/d6+5 (gentler than the v0.41 modifier). One-feat roll unchanged → **no AC/DC retune.** Kills the last stacking exception (no second die anywhere) — which was the real thing the "retire it" proposal wanted gone.
- **Two separate ladders, crisp jobs:** the **Specialization Die ladder** (d6→d12) = the character's *trained excellence* (feats + mastery). The **Modifier Ladder** (±1/±3/±5) = *situational* help/harm (GM assessment, States, Follow-Up riders) — **unchanged.** A full roll: `1d20 + stat + [one Spec Die, stepped] ± [situational Modifiers]`.

**Master Feat — reborn, kept:**
- Still **once-ever, permanent, no refund** (the niche-protection + identity-capstone work is the whole point; Keith confirmed keep).
- **Effect: steps the die up one size** (d6→d8) on the narrowed trigger, instead of a 2nd d6.
- **Re-priced 40 → 30 XP** — a one-step bump (~+1 avg) is a smaller gift than the old 2nd d6 (~+3.5), so 40 was overpriced. (Probable reason nobody bought it: old version was a scary, expensive, weird 2d6 outlier.) 30 = gateway/AC-feat band.
- It is the **depth lane** and the only depth on *solo* rolls.

**Also in v0.44 — authoring discipline (these two are firmer, not just playtest):**
- **Overlap = the Venn test** (replaces "minimize overlap"): partial overlap is the goal (each feat keeps a solo zone); **merge** identical circles; **forbid** nested circles (a narrow feat wholly inside a broad one); **embrace** complementary overlap within a gateway. The old rule was guarding against tiers — buy-once already does that.
- **Independence test** (the GM's convergence count): a feat counts as a step only if its trigger fires for its *own* reason; a trigger that fired only because another did is dependent, doesn't count.

**Open question (parked):** the freed 40-XP slot — under "keep the Master Feat," moot (nothing freed; Master now 30). The 40 peg stays documented as the top-of-economy band (Deep Well 40/60, Hardened Save top rung 40) so future expensive feats have a home; a gap at 40 is fine, an *undefined* ceiling isn't.

**Docs:** Core Rules → v0.44 (Convergence block rewritten to die-step; Master Feat refs in structure/glossary/costs; overlap parenthetical). Feats → v0.44 (Master Feat block, cost peg, Design Principles #3 Venn test + #4 independence test). Quick Reference → v0.44 (convergence + growth + costs + Three-Kinds-of-Die Spec Die line). All PLAYTEST-flagged (🧪).

**Foundry: NOT YET** — now a die-SIZE pick (d6/d8/d10/d12) rather than a +N modifier; folds into the active-feats / contest-macro work. Simpler than the old modifier picker, actually.

## Foundry Polish Backlog (small, non-blocking — pick up any time)

Minor UX / cleanup items found during testing. None affect correctness.
- **Hide the `isShield` toggle on body-armour items.** Right now the Shield checkbox shows on every armour item, so a player can accidentally flip a body armour (e.g. Chain Mail) into a shield — which reclassifies it and empties the armour slot (hit this in v0.40 testing; no data bug, just a confusing trap). Fix: make `isShield` a fixed property set at creation (seeds already set it right), and **hide/disable the toggle on items whose category is set** (body armour). Shields are their own seeded item. Low effort, removes the main sharp edge of the equip UI.
- *(add further polish items here as they surface)*

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

Everything the design docs changed since the Foundry system was last at parity.

**TWO GROUND TRUTHS that simplify this build:**
1. **The new feats must COMPUTE** (not just exist as reference items) — Hardened Save changes a Save's computed total; the two AC feats change computed AC. Build them as real data-model contributions with working requirement checks, not display-only text.
2. **The test world has been WIPED — no actors, no items survive.** So there is **NO migration / backfill needed.** Fresh seeds at a new `CONTENT_VERSION` are the whole job for profiles — `backfillSaveProfiles` can be skipped/retired. This removes the only real risk from the prior change-list.

---

**A. Save rename + mental-coverage reshuffle (v0.36) — labels + fresh seeds.**
- `module/config.mjs` → `SAVE_LABELS`: "Strength Save" … "Charisma Save". `SAVE_KEYS`/`SAVE_STATS` unchanged (each save still uses its own stat). Keep the keys and change only the labels (simplest, and nothing stored needs migrating).
- Coverage text (what each save resists) in descriptions/tooltips → update strings: **Int = mind** (telepathy/memory/confusion), **Wis = perception** (illusion/deception/sensing wrongness), **Cha = will** (domination/compulsion/**fear**/intimidation/crowd).
- **Seed Warrior & Guardian `saveProfile` at the new values** (Warrior: Str+3 Con+3 Dex+1 Int0 Wis0 **Cha−3**; Guardian: Str+3 Con+3 **Dex−3** Int0 Wis0 Cha+1). Scout/Adept/Face unchanged. Fresh seed — no backfill. Bump `CONTENT_VERSION`.
- No roll-engine change — `rollSave`, `resolveOutcome`, margins all stay.

**B. Fitting Save (v0.36) — no code.** GM adjudication only. Optional tooltip/journal note.

**C. Hardened Save feat (v0.37) — seed one COMPUTING feat.**
- Parameterized "Hardened Save" item: carries **which Save (stat)** and **the step bought**. Its effect **adds a flat bonus to that Save's computed total** (the actor's Save = `1d20 + stat + gatewayProfileStep + Σ Hardened-Save steps`).
- Validity the model should enforce or at least flag: steps go −3→0→+1→+3→+5 from the *current* value; **Major (+5) only on a Save whose gateway profile is Solid (+3)**. Scaled cost 20/20/30/40 (data field for reference; not enforced).
- Prereq resolution: "requires a Strength Save feat" = the actor owns a Hardened Save item on that stat.

**D. Capability roll-types (v0.38) — no compute (cosmetic).** Roll-types are GM-assigned stat-rolls; nothing to automate. Optionally expose the baseline guide as a journal entry. **Spellcasting stat is gateway-declared** — the sheet must read the casting stat **from the gateway** (Adept = int), not a hardcoded `int`, so faith/innate casters (wis/cha) work when added.

**E. AC feats + soft cap (v0.39) — seed two COMPUTING feats.**
- **Armour Training:** adds **+1 AC per owned purchase, capped at +2**, **only while worn armour category > light**. Computed contribution with the armour-category gate.
- **Unarmored Defense:** **while armour category ≤ light**, **replace** the armour AC formula with **`10 + dex + themedStat`**, where `themedStat` is **named by the gateway** (Monk wis / Rogue·Swashbuckler cha / Barbarian con) — read it from the gateway, same pattern as the casting stat. Buy-once.
- The two are **mutually exclusive by requirement** (armour vs. ≤ light) — the gates make them never both apply; no extra exclusion logic needed, but assert it if cheap.
- **~20 AC soft cap is a GM target, NOT an enforced clamp** — do not hard-cap AC in code. (A non-blocking console/log *warning* if computed AC exceeds ~20 is fine if Keith wants a heads-up; default is nothing.)

**F. Equippable armour items (v0.40) — ADDED TO THIS BRANCH after A–E were tested.**
- New **`armour` item type**: `category` (light/medium/heavy), `armourBonus` (int), `isShield` (bool), `equipped` (bool), description.
- **AC reads equipped gear** (replaces the manual "Armour worn" dropdown as source of truth): `AC = 10 + dex + equipped-armour-bonus + equipped-shield-bonus + misc`. Dex always applies at every category. Fall back to "none" when nothing equipped.
- **Equipped category now drives the AC-feat gates** — Armour Training needs medium/heavy equipped; Unarmored Defense needs light/none.
- **Seed catalogue** (fresh seeds, bump CONTENT_VERSION): Padded/Leather (light +1), Chain Mail (medium +2), Plate (heavy +3), Shield (+1).
- Sheet gets an equip/unequip spot; AC tooltip includes the armour + shield lines.
- Values validated in band: maxed tank (dex+4, plate, shield, Armour Training) = AC 20; do not hard-cap.

**General:** bump system version + `CONTENT_VERSION`; run `tools/verify.mjs` (add armour + feat-gate-reads-equipped-category checks). Expect label/seed/compute diffs, no roll-engine diffs, **no migration.**

*Source: gap audit vs. the 34-feat catalogue (2026-10-03); updated through the v0.36–v0.39 design passes (2026-10-07/08). Feats compute; test world wiped (no migration).*
