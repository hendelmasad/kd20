# KD20 — Feat & Gateway Translation Guide
**Version: v0.32 — 2026-10-03** *(working reference, not canon)*

*A structured pass over the MYD20 Branch resource's Part Four (Gateways / Feats-as-Classes), read through KD20's decisions. For each gateway: what ports cleanly, what needs translating, what to drop. Use this when building out the KD20 feat library — the raw stock is ~17 gateways and 100+ feats you authored; the job is translation and pruning, not invention.*

*Progress note: five gateways have since been built from this guide and live in `KD20_Feats.md` (Warrior, Scout, Adept, Guardian, Face). Still to port: Scholar, Ironwill, Skirmisher (needs benefit re-invention), and the deferred magic/divine gateways. This guide remains the reference for those.*

---

## The KD20 Translation Filter

Every ported feat runs through these checks. Most fixes are mechanical swaps, not content changes — the *ideas* nearly all survive; the *mechanics* often need KD20 idiom.

| MYD20 pattern | KD20 translation |
|---|---|
| **"gain advantage / disadvantage"** | KD20 has no advantage mechanic. Translate to a **Specialization Die** (+d6 on the triggering roll) or a **Modifier Ladder** step (+3 Solid / +5 Major; −3 / −5 against foes). Pick by whether it's a repeatable signature (die) or a situational nudge (ladder). |
| **"Requires: Melee at Skilled"** (skill-gated attack) | KD20 has **no Melee/attack skill** (attack is gateway/feat-driven, Resolution C). Re-gate on **gateway + stat** (e.g. "Warrior gateway, STR 13") or on a prior **cluster feat** (ring structure). |
| **"Requires: [Skill] at Rank"** (non-combat) | These mostly survive — KD20 *does* have skills with the same training ladder. Keep skill prereqs for non-combat feats (Stealth, Persuade, Spellcraft, etc.). |
| **"critical success / Super Crit"** | Map to KD20's ladder: **Decisive** (beat by 10) / **Supreme** (beat by 20). "On a crit" → "on a Decisive"; "on a Super Crit" → "on a Supreme." |
| **"can be taken multiple times"** (per weapon/school/etc.) | Keep — this is KD20's **parameterized feat** pattern (Weapon Master (Rapier) vs (Axe)). Distinct from banned "Feat I/II" tiers. |
| **"once per scene / once per session"** | KD20 has no formal scene/session-limit mechanic yet. Keep as-is for now (GM-adjudicated), or convert the strongest to **Action Die** costs where a resource gate fits better. Flag for the feat-system's limiter decision. |
| **"reroll and take the better"** | KD20 avoids reroll/advantage. Translate to **+d6 (Specialization Die)** or a Modifier-Ladder bonus, or an **Action Die** spend, depending on flavor. |
| **Five-purchase caps** (from HP/other feats) | KD20 uses **buy-once, breadth-not-tiers**. Drop the cap; make each a distinct one-time feat instead. |
| **"Transformative Moment" + "Gateway Tax"** | Close to KD20's **narrative-catalyst** gateway acquisition + **hoop-gated multi-gateway**. Compare deliberately when building acquisition; the shape is compatible. |
| **Spellbinder "birth-locked, char-creation only"** | Compatible with KD20 — some gateways can be creation-only. But note KD20's *"exceptional nature is earned, not chosen"* stance (Pillar 1): birth-locked *bloodlines* are a tension to resolve — either allow as a deliberate exception, or re-gate them behind an earned catalyst. **Design decision flagged.** |

**Combat translation note:** KD20 combat feats add their **Specialization Die to the attack roll** (→ more Decisives → more Precision Dice), never a flat damage bonus. Any MYD20 feat that "deals more damage" or "gains combat advantage" becomes a Specialization-Die-on-attack feat. Effects that impose conditions become **Follow-Ups** (must flow causally from the strike) or Modifier-Ladder hindrances.

---

## Gateway-by-Gateway

Ratings: **PORT** (clean, minor idiom swap) · **TRANSLATE** (real rework) · **DROP/DEFER** (MYD20-specific or depends on unbuilt KD20 systems).

### Warrior — *the melee calling* · **mostly PORT**
The cleanest gateway to port; it's the one we already used as the KD20 exemplar.
- **Gateway benefit** ("never unarmed; extended crit range") → KD20: "never unarmed" ports as-is; "extended crit range" → **lower the Decisive threshold** with this weapon, or grant a Specialization Die (cleaner). *Prefer the die.*
- **Weapon Mastery** → **PORT** verbatim as the parameterized **Weapon Master (X)** — grants a Specialization Die on attacks with that weapon type. This is already KD20's model.
- **Brutal Strike** ("win by margin → knocked down/disarmed/staggered") → **PORT** as a **Follow-Up** feat: on a Decisive/Supreme hit, the maneuver rides free. Already how KD20 Follow-Ups work.
- **Cleave** ("drop an enemy → free attack") → **PORT** as a Follow-Up-style trigger. Clean.
- **Steel Discipline / Iron Resilience** ("advantage on Withstand", "stay standing") → **TRANSLATE** advantage → +d6 on Withstand; the "stay standing once per scene" is a defeat-system hook (defer to that system).
- **Battle Awareness** ("never surprised, act first") → **PORT**; ties to Initiative (better of dex/wis) — could grant a flat init bonus or auto-high-initiative.
- **Veteran's Eye** (GM tells you a fact about a foe) → **PORT** as-is; pure GM-narration feat, no mechanics to translate.

### Scout — *stealth & wilderness* · **mostly PORT**
Non-combat, skill-gated — ports cleanly since KD20 keeps those skills.
- **Ghost Step, Eagle Eye, Wilderness Craft, Tracker** → **PORT**; translate any "advantage" to +d6/ladder.
- **Ambush Predator** ("advantage on attack from concealment") → **TRANSLATE** to a Specialization Die on the ambush attack; "crit → disadvantage on their next action" → Follow-Up.
- **Vanish, Shadow Network** → **PORT** (once-per-scene/session flags pending the limiter decision).

### Survivor — *endurance & defeat-resistance* · **TRANSLATE (defeat-system dependent)**
Much of this hooks the **conditions/defeat/recovery** systems KD20 hasn't built.
- **Hard to Kill, Iron Stomach, Pain Tolerance, Adapted** → **PORT** (advantage swaps); Iron Stomach's immunity is clean.
- **Grit / Unstoppable** ("reroll saves", "ignore conditions") → **TRANSLATE**: reroll → +d6/ladder or Action Die; "ignore conditions" **defers** to the conditions system.
- **Scavenger** (treat conditions w/o equipment) → depends on the **recovery/conditions** system — **DEFER**.

### Wizardry — *studied arcane* · **DEFER (needs magic system)**
Every feat leans on **Spellcraft, spellbook, spell schools** — none of which KD20 has yet. The *structure* (spellbook, learn-any-spell, counterspell as a contest) is a good model, but this whole gateway **defers to the KD20 magic system**. When built: Counterspell Mastery's "competitive Spellcraft as a reaction" ports beautifully to KD20's contest + reaction (Action Die) machinery.

### Skirmisher — *mobile striker* · **PORT (great fit)**
This gateway is *very* KD20-compatible — it's about movement and tempo, which the action economy already supports.
- **Gateway benefit** ("move before & after attack") → **already core KD20** (splittable Move around the Action)! So the benefit must be *upgraded* to stay distinctive — e.g. extra movement, or ignore Zone-of-Control reactions. Note: **the base rule caught up to this feat**, so re-pitch the benefit.
- **Rapid Strike** ("win contest → second attack") → **PORT** as a Follow-Up. Clean.
- **Dirty Fighter** (sand-in-face, impose disadvantage) → **TRANSLATE**: this is now a **Universal Maneuver** anyone can do! So the *feat* version becomes "your dirty tricks grant a Specialization Die" or impose a bigger Modifier-Ladder penalty.
- **Evasion** ("no damage on successful Reflexes save") → **TRANSLATE** to KD20 damage/save idiom (there's no "half on save" baseline yet — flag).
- **Skirmish Mastery** ("no free attacks when moving") → **PORT**: ignore Zone-of-Control reactions. Direct fit.
- **Crippling Strike / Death of a Thousand Cuts** → **TRANSLATE** to Follow-Ups / stacking Modifier-Ladder penalties (cap at −5).

### Guardian — *protector* · **mostly PORT**
- **Gateway benefit** ("interpose, take hit for ally") → **PORT**; the interpose is a **reaction** (spend an Action Die) — fits KD20 reaction machinery perfectly.
- **Shield Wall, Bulwark, Guardian's Reach, Aegis** → **PORT** (advantage → +d6/ladder). Bulwark ("can't be moved") resists Universal Maneuvers — clean.
- **Taunt** ("force enemy to target you") → **PORT** as a contest (Persuade/Presence vs Discipline-equivalent). Note KD20's resistance skills.
- **Retribution** (truncated in source — likely a riposte-on-being-hit) → **PORT** as a reaction Follow-Up.

### Scholar — *knowledge* · **PORT**
Pure knowledge/GM-narration feats; almost all port as-is (advantage swaps only). Living Encyclopaedia, Investigator, Master of Lore, Polyglot, Tactical Briefing — **PORT**. Field Researcher's "allies gain advantage" → allies gain +d6/ladder on their first action.

### Face — *social* · **PORT**
Social feats, skill-gated on Persuade/Performance/Connections — all present in KD20's skill layer. **PORT** across, swapping advantage → +d6/ladder and "reroll" → same. Rattled/Crowd Control/Long Con are clean. Good showcase of KD20's contest + Modifier-Ladder handling social conflict.

### Ironwill — *mental defense* · **PORT**
Mirrors Guardian but for the mind. Discipline/Grounded-gated. **PORT** with advantage swaps. "Reroll a failed WIS/CHA save" → +d6 or Action Die. Ties to KD20's **Resolve** resistance skill. Note MYD20 uses "Discipline/Grounded" saves; KD20's resistance skills are Resolve (wis) / Poise (cha) / Composure (int) — **remap the save names.**

### Spellbinder bloodlines (Draconic, Infernal, Fey, Celestial, Void, Storm) · **DEFER + FLAG**
Six birth-locked bloodline gateways. **Two issues:**
1. **They need the magic system** (breath weapons, bolts, glamours) — **DEFER** mechanics.
2. **"Birth-locked, character-creation only"** collides with KD20's *"exceptional nature is earned, not chosen"* (Pillar 1). **Design decision needed:** either (a) allow bloodlines as a *deliberate exception* (some heroes are born touched), or (b) re-gate them behind an earned catalyst (the blood *awakens* through play). Given how firmly KD20 committed to earned-not-chosen, **(b) is more consistent** — the bloodline exists at creation as latent flavor but its *gateway* unlocks through a Transformative-Moment-style awakening. Worth resolving before porting these.
- Mineable ideas regardless: **Devil's Own Luck** ("crit failure → normal failure") maps to the **Hard Choice** space; **Fey Step** (reaction teleport to avoid an attack) is a clean reaction feat; **Shield of Faith** ("AC = CHA mod, replaces armour") ports directly to KD20's AC formula as an armour-slot alternative.

### Cleric of Mercy / Paladin of Justice — *divine callings* · **TRANSLATE (needs divine magic + conditions)**
Evocative and mostly GM-narration or condition-manipulation.
- **PORT** the narration feats (Veteran's-Eye-style): Read the Guilty, Expose the Corrupt, Divine Warrant, Sanctuary, Absolution.
- **DEFER** the healing/condition feats (Lay on Hands, Mercy's Shield) to the **recovery/conditions** system.
- **Divine feats as an "unlimited, faith-based" casting model** (from Part Twelve) is a distinct magic subsystem — defer with the magic build.

---

## Cross-Cutting Feats (outside Part Four)

- **Stat Improvement Feats (Part Thirteen):** MYD20 has five-tier per-stat chains, each +1, skill-gated. **KD20 has already replaced this** — stat increases are the **catalyst-plus-consolidation** model (GM-gated narrative trigger + low XP), *not* a feat chain. **DROP the MYD20 chains**; KD20's approach supersedes them.
- **HP-by-Gateway feats (Part Eight, "cap at five"):** **KD20 has already replaced this** — HP feats are **one-per-stat, living bonus, stat 16+, buy-once** (Bulwark/con, NOT IN THE FACE!/cha, etc.). **DROP the five-cap version**; KD20's is cleaner.
- **Combat Manoeuvres (Part Nine):** Now **Universal Maneuvers** in KD20 (shove/trip/grapple/disarm as universal contests). Port MYD20's specific maneuvers as the *universal* list; gate *mastery* behind Specialization Dice.
- **Weapon/Armour feat-equivalents (Parts Ten–Eleven):** "muscle-memory replicates a magic weapon's effect" → fits KD20's *magic-items-grant-capabilities* stance and the Specialization pattern. Mineable.

---

## Recommended Build Order (when tackling the feat system)

1. **Build the feat chassis first** (five-field template: name, prereq, XP cost, trigger, effect) + the **once-per-scene/session limiter decision** (or convert to Action-Die costs).
2. **Port the PORT-rated gateways first** — Warrior, Skirmisher, Guardian, Scout, Scholar, Face, Ironwill. These need only idiom swaps and give KD20 a playable calling roster fast.
3. **Resolve the two flagged design questions:** (a) once-per-scene limiter mechanic; (b) birth-locked bloodlines vs. earned-not-chosen.
4. **Defer the magic-dependent gateways** (Wizardry, Spellbinders, Clerics/Paladins) until the KD20 magic + conditions + recovery systems exist.
5. **Skip the superseded chains** (stat-improvement feats, five-cap HP feats) — KD20 already has better versions.

*The ideas are nearly all worth keeping — you wrote good feats. The work is translation (advantage → dice/ladder; skill-attack-prereqs → gateway+stat; crit → Decisive/Supreme) and pruning (drop what KD20 already solved better).*
