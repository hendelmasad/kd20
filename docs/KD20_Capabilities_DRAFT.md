# KD20 — Capabilities System (THEORETICAL DRAFT)

> **⚠️ STATUS: IMPLEMENTED / SUPERSEDED (as of Core Rules v0.28).** This was a proposal; it was **approved and executed** — the Capabilities system is now **canon**, folded into `KD20_Rules.md` (the "Capabilities and the Anatomy of a Roll" section, the four-lane advancement model, the gateway-is-the-profession structure, and the cluster-feat XP peg of 20/30/40). This file is retained as **design history** — the record of how the Skills→Capabilities cut was reasoned and validated. It is **not** a live proposal; for current rules, see `KD20_Rules.md` (v0.32+).

*Original draft framing (historical): Proposed replacement for the Skills system. This draft assembled the full unified model so it could be read whole before anything was cut from the core rules. It replaces the "Skills and the Anatomy of a Roll" skill-list machinery and re-pegs the XP economy. The core roll, outcome ladder, Modifier Ladder, States, Action Dice, action economy, HP/AC, and gateways were unaffected in structure — they were already built for this.*

*Drafted against KD20 Core Rules v0.27. Costs provisional; a fresh simulation is required before canon (the prior sim assumed skill ranks).*

---

## The Thesis

**Everything that makes a character better at something is a d6, added under a condition.** That is KD20's atom. The three dice are its three forms:

- **Action Die** — a d6 you *spend* to focus in when it matters (pool resource).
- **Specialization Die** — a d6 that *fires* when a trained trigger is met (from a feat).
- **Precision Die** — a d6-family die on a telling blow (combat reward).

The Capabilities system finishes the unification the game was already reaching for: it removes the one subsystem that *didn't* speak in d6 — rank-based skills — and denominates **all** capability in the atom. Combat stops being a special case; "good at fighting" and "good at lockpicking" become the same kind of thing.

---

## The Three-Tier Capability Stack

Any task a character attempts resolves through up to three layers:

### 1. Base Competence — anyone, no investment
`1d20 + stat`. Any actor may attempt almost anything. Stats are the universal floor: untrained is not helpless. This is Resolution C generalized — what was true of attacks ("anyone attacks at d20 + stat") is now true of *all* tasks. Pick locks, persuade, sneak, climb, recall lore: the untrained roll is d20 + the governing stat, read on the outcome ladder.

Because base competence is universal, **thin stats stop mattering** — a stat is never "short on skills," because every stat is the floor for *any* task the fiction assigns it. Capability is not filed under stats; it rides whatever stat the moment calls for.

### 2. Trained Identity — cluster feats (the Specialization Die)
Training is a **feat**: a named, narrow trigger that grants **one Specialization Die (d6)** when its circumstance is met. "Infiltrator" (a d6 when moving unseen through a guarded space), "Talk Shop — Mercenary" (a d6 in social dealings with military types), "Field Medicine" (a d6 treating wounds without proper tools). Buy the feat, get the die on the trigger.

- **One die applies.** Even if several feats *could* apply, **only one Specialization Die is ever added to a roll** — it would not be *specialization* if everything applied. Owning many feats means broader *coverage* (you are exceptional in more situations), never a bigger bonus in one. *(Design rule: author feats to be as unique as possible; minimize unavoidable overlap.)*
- **The chosen feat sets the fiction.** When more than one of your feats could apply, you choose which single die to add — and that choice is not just mechanical (the dice are identical d6s); the feat you invoke *declares how your character is succeeding.* Bluffing past a guard with "Talk Shop — Mercenary" is a scene of shared war stories and a fellow-soldier's nod; the same roll with "Silver Tongue" is charm and misdirection. Same die, different scene. The GM narrates from the invoked feat and may let it shape the *consequences* (the fellow-soldier remembers you kindly; the charmed guard may later realize he was played). This turns unavoidable overlap into a *feature* — a choice of *how* you succeed — rather than redundant bonus.
- **Buy once.** No tiers, no "Feat I / II / III." Growth is breadth (more triggers), never inflation (bigger numbers) — except the single Master Feat (below).
- **Stat-agnostic application.** A feat names a *situation*, not a stat. Its die rides whatever roll the fiction calls for; the base roll uses the appropriate stat, and the feat die attaches by *trigger-match*.

### 3. Dynamic Gradient — Action Dice
How good you are *at this moment* is how much you commit. Spending Action Dice to push a roll is the gradient that rank-based skills used to provide — but player-controlled, dramatic, and earned-and-spent through play rather than fixed on the sheet. A veteran outperforms a novice with the same feat not because of a higher rank, but because they have played boldly, earned dice, and know when to spend them. The gradient moved from the sheet to the table.

*(This is why the loss of skill ranks costs nothing: the reliable-gradient job is covered by Action Dice, in a form that fits high adventure better — competence rises to the moment instead of sitting static.)*

---

## One Structure: The Gateway IS the Profession

Identity and capability are a single architecture:

- A **Gateway** is an identity you enter — a calling, a profession, a culture. Warrior, Scout, Mercenary, Courtesan, Wizard, Warrior of the Polar Bear Clan. Entering it grants the identity, a modest base benefit, and **access to a menu of cluster feats.**
- **Cluster feats** are the narrow d6 capabilities inside it — the "skills" of old, now denominated in the atom.

Combat callings, civilian trades, and cultures are all the *same object*: a gateway with a themed cluster of narrow specialization feats. There is no separate "skill system" and "class system" and "profession system" — there is one system, worn in many costumes.

*(This generalizes the old "cultural feats" idea — "Warrior of the Polar Bear Clan" as a gateway plus additive signature feats — from an optional sidecar into the core mechanism. Culture was the prototype; this is the pattern it proved.)*

### Feats as a Shared Library; Gateways as Curated Menus

Gateways overlap, and that is by design. A Mercenary and a City Watch gateway may both open "Weapon Training: Spear" and "Battlefield Nerve." These are **not duplicated feats to maintain in two places** — they are one feat, authored once in a **shared library**, listed on the menu of every gateway that should offer it.

- **The feat library:** every cluster feat, written once (narrow trigger, one d6, buy-once). Change it once, it changes everywhere.
- **A gateway is a curated list** into that library, plus a few **signature feats** unique to it. What distinguishes a Mercenary from a Watchman is the *specific combination* they open and their handful of originals — not that all their feats differ.

This makes "many specific gateways" *sustainable*: authoring a new gateway is mostly choosing a menu from the library and writing two or three signature feats — cheap, fast, and free of copy-paste maintenance.

---

## Saves / Resistances

Resistance to harmful effects becomes a cluster feat like any other: a **resist feat** grants a d6 when defending against its trigger (Withstand a physical effect, Reflexes to dodge, Resolve against fear, Poise against social pressure). No separate save subsystem, no rank ladder — full consistency with the one model. The untrained defense is still `d20 + stat`; the feat adds the die.

*(Naming TBD: "Saves," "Resistances," or fold them in as ordinary cluster feats with a defensive trigger. Recommend the last — they are not a special category, just feats whose trigger is "when something bad happens to you.")*

---

## The Master Feat — the Capstone

Mastery is the one place a character deepens rather than broadens.

- **Choose one cluster feat you already have and *further narrow* it** — from its trigger, carve a still-narrower signature circumstance. "Lockpicking" → "tumbler locks under time pressure." "Duelist — Rapier" → "the first exchange against a single foe."
- **That narrowed trigger gains a second d6.** This is the *only* place two Specialization Dice stack — permitted precisely because it is one feat doubled-down, in a trigger so narrow it rarely fires, not two different feats piling on. It does not violate the one-die rule; it *is* the exception the rule is built around.
- **One Master Feat, ever. Permanent. No retraining, no refund.** Mastery is a lifelong pursuit of excellence — you do not get to respec your soul. It is the most weighted, most permanent choice on the sheet: *this is what your character's life was ultimately about.* Choose wisely.

Permanence is justified at three levels that all point the same way:
- **Thematic** — mastery is a life's work, not a loadout.
- **Mechanical** — a movable mastery would be a power dial to optimize arc to arc; a fixed one is a *commitment*, so it can't be gamed.
- **Social (niche protection)** — a claimed specialty stays claimed. The player who deliberately picks the *un*-taken role — the party's only master lockbreaker, the only reader of the old tongue — is buying identity through scarcity, and that identity is worthless if anyone can retrain into it on a whim. Permanence makes the niche a *promise*: the thoughtful, table-aware player who chooses for the group's sake can invest in "I am the one who does this" without fear of being poached, and because everyone's mastery is a permanent commitment, the party naturally *diversifies* into distinct specialists rather than converging on whatever is optimal this month.

Mastery is thus *deeper specialization*, never a bigger number on a broad thing — breadth's mirror image, and still pure to the d6 atom.

---

## Costing (provisional — re-peg + re-sim required)

The old XP peg was the skill training ladder (10/20/40/70). That ladder is gone. **The atomic unit of cost is now the cluster feat / one d6**, mirroring how the d6 is the atomic unit of mechanics. Cost-atom and mechanic-atom, aligned. All flat numbers — no ladders anywhere.

| Purchase | Provisional XP | Reasoning |
|---|---|---|
| **Cluster feat** (one narrow d6 on a trigger) | **20** | ≈ the old "Skilled" rank; a conditional d6 (~+3.5) is worth roughly a mid-rank skill. Keeps the economy's scale familiar so the prior sim's assumptions don't wildly break. |
| **Gateway feat** (identity + base benefit + menu access) | **30** | The door: grants the profession and access to a whole line, but no dice until cluster feats are bought. First gateway may be discounted/free at creation *(chargen flag)*. |
| **Master Feat** (second d6 on a narrowed signature) | **40** | ≈ old "Expert" cost, ~2× a cluster feat. Steep enough to be a serious, deliberate, once-ever investment; reachable mid-campaign. |
| **Statistic increase** (consolidation) | **~10** | Unchanged model: GM-gated narrative *catalyst* unlocks it, low XP *consolidates* it. The gate is the catalyst, not the price — so the number stays low (≈ old "Trained"). |

**Everything except ordinary gear and stat catalysts is bought with XP, priced off the 20-XP cluster feat.** A fresh Monte Carlo pass is needed to confirm these numbers (the prior sim assumed skill ranks; this assumes feat-dice) — flag in the Watch-List on canonization.

### [SIM] Economy Validation

A Monte Carlo pass (real RNG, 50k rolls per profile, feat-die model, DC band Easy 10 / Moderate 13 / Hard 16 / Formidable 20) tested the four load-bearing assumptions. **All validated — the economy holds at the proposed scale.**

- **Trained beats untrained without the rank ladder. [confirmed]** At Moderate (DC13), stat +2: untrained is a coin flip (50% success, **0% Decisive** — never exceptional); a trained on-trigger specialist drops fail to 32% and opens **17% Decisive.** The single d6-on-trigger does exactly the job a skill rank used to — reliably better *and* able to reach exceptional results the untrained can't. The rank ladder is genuinely unnecessary.
- **The zero-to-hero curve survives on one die. [confirmed]** On-trigger specialist Decisive rate scales correctly with difficulty: 32% (Easy) → 18% (Moderate) → 5% (Hard) → 0% (Formidable). Matches the original core sim's curve; single-die-no-stacking did not flatten it.
- **The untrained floor is playable — the riskiest assumption, and it's well-tuned. [confirmed]** Untrained (d20 + 2) any-success rate: Easy 65%, Moderate 50%, Hard 35%, Formidable 15%. A novice can usually manage easy things, coin-flips the moderate, is outclassed-but-not-hopeless at hard, and only rarely reaches the formidable. Exactly the "anyone can try, training matters" balance the base-competence tier requires.
- **Action Dice deliver a smooth dramatic gradient — this replaces skill ranks, and better. [confirmed]** Trained specialist at Moderate, spending 0→4 Action Dice: succeed 68% → 85% → 95% → 99% → ~100%; Decisive-or-better 17% → 35% → 53% → 70% → 85%. Each die meaningfully lifts both success and quality with real diminishing returns — a clean "how hard am I trying right now" dial, player-controlled and dramatic rather than a static rank.

**Cost scale is supported.** One cluster feat (20 XP) buys the jump from "coin-flip, never exceptional" to "reliably better, 17% exceptional" — clearly worth the old Skilled-rank cost. The Master Feat's second d6 on a narrowed trigger roughly doubles the Decisive rate *on that trigger* (~17% → ~34%, like a permanent always-spent Action Die there) — a big, characterful effect, appropriately priced at ~2× a cluster feat.

**Watch-List note for canon:** Action Dice are *potent* — a trained specialist with just 2 dice hits ~95% success / ~53% Decisive at Moderate. Not a flaw (a focused expert *should* crush a moderate task), but it confirms (a) the pool refresh is a meaningful lever, and (b) genuinely *challenging* content for trained characters should lean Hard/Formidable, since Moderate melts under focus.

---

## What Survives Untouched

Structurally unaffected — they were already built for the atom:
stats · the d20 core roll · the outcome ladder (Success / Decisive / Supreme) · the Modifier Ladder · States and the Two Levers · Action Dice (pool, earning, spending, refresh) · the action economy · initiative · HP / AC · the Precision Die · gateways (this *is* the gateway model, extended).

## What Changes

- **The Skills section** ("Skills and the Anatomy of a Roll") — the skill *list*, the five-rank training ladder, cross-stat skills, resistance-skills-as-ranked — is **replaced** by this. The *roll formula* survives (d20 + stat + specialization die, Modifier Ladder), just sourced from feats not ranks.
- **The XP peg** re-anchors from the skill ladder to the cluster feat.
- **Marksmanship / attack-skills** (already Resolution-C casualties) and the **Grappling-skill/Universal-Maneuver overlap** simply never arise — attacking and maneuvers were already outside the skill system, and now everything is one system so the seams are gone.

---

## Open Items Before Canon

1. **Re-sim the economy — DONE. [SIM validated]** The 20/30/40 costs and the three-tier model passed a Monte Carlo pass (see *Economy Validation* above): trained-beats-untrained without ranks, the zero-to-hero curve survives on one die, the untrained floor is playable across all DCs, and Action Dice deliver a smooth gradient. The economy is greenlit at the proposed scale. *(Re-run once the actual feat library exists, to catch any content-level surprises.)*
2. **Saves naming** — fold resist feats in as ordinary cluster feats (recommended) or keep a named "Resistances" grouping.
3. **Chargen** — starting XP budget, whether the first gateway is free, how many cluster feats a starting character opens. (Chargen was always deferred; this sharpens what it must define.)
4. **Base-competence DC calibration** — keep DCs low enough that untrained `d20 + stat` attempts aren't hopeless (the tested band — Easy 10 / Moderate 13 / Hard 16 / Formidable 20 — already supports this; confirm under the new model).
5. **The feat library itself** — the actual catalog of cluster feats and the starting gateways. This is the big content build that follows approval (and where the MYD20 feats, per the Translation Guide, are the mining stock).
