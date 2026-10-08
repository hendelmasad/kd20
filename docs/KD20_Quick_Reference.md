# KD20 — Quick Reference
**Version: v0.39 — 2026-10-08** *(companion to Core Rules v0.39)*

*Rules as they currently stand. Facts only.*

---

## Core Roll

**Roll 1d20 + bonus vs. a target number.** The target is a **DC** (set by the GM) or, in a contest, the **opponent's total**. Only roll when the outcome is in doubt and has stakes; **if it has no stakes, narrate it — don't roll.**

**DC guide (provisional):** Easy **10** · Moderate **13** · Hard **16** · Formidable **20**.

## Outcome Ladder

Read by **margin** over the target — not by the face of the die.

| Result | Margin |
|---|---|
| **Supreme** | Beat target by **20+** |
| **Decisive** | Beat target by **10+** |
| **Success** | Meet or beat (margin 0 to +9) |
| **Failure** | Miss (margin −1 to −9) |
| **Failure + Hard Choice** | Miss by **10+** (decisive failure) |

- **No die face is special** — no lucky-20, no unlucky-1. Margin decides everything; the face is just an input to the total.
- The ladder is **symmetric**: beat by 10 = Decisive; miss by 10 = the **Hard Choice** (below).

## Statistics & Bonuses

Six **Statistics**: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma. Each yields a **stat bonus** — the flat number that goes on rolls.

- **Bonus = (Statistic − 10) ÷ 2, round down.** (14 → +2, 10 → +0, 7 → −2.)
- **Short form = the bonus:** str, dex, con, int, wis, cha. "Add str" = add the derived bonus, not the raw score.
- **Each stat also owns a Save** (see Defenses): str = shove/grapple, dex = dodge/area, con = poison/body, int = mind, wis = perception, cha = will.
- **Generation (2 Session-Zero knobs):** *Dice* — **3d6** (gritty) or **4d6-drop** (heroic); *Method* — **Individual** (keep your own array) or **Shared Pool** (all arrays pooled, take any, duplicates fine, assign individually — fixes bad rolls). With small creation bumps (≤ +2), **20 is the effective creation ceiling**.
- **Raising a stat:** *not* an open XP buy — a **GM-gated narrative catalyst** (quest, training arc, boon) unlocks it, then a **low XP cost** completes it. GM controls the pace.

## The Full Roll

**1d20 + stat bonus + Specialization Die (if a feat's trigger fires)** → adjust by the **Modifier Ladder (±1/±3/±5)** → compare to a **DC or opposing roll**. *(Action Dice layer on top when a player spends to focus.)*

## Capabilities — the d6 Under a Condition

Everything that makes you better is a **d6 under a condition**. Three tiers:

1. **Base (anyone):** `d20 + stat`. You can attempt almost anything; stats are the floor, untrained ≠ helpless.
2. **Trained (a feat):** a narrow trigger grants **one d6** when it fires. Buy the feat, get the die.
3. **Gradient (Action Dice):** spend to push *this* roll — "how hard am I trying right now."

- **One die applies.** Even if several feats fit, only **one** Specialization Die is added — more feats = broader *coverage*, never a bigger bonus. When several fit, **the chosen feat sets the fiction** (sneak vs. bribe vs. seduce = same die, different scene).
- **Growth is breadth** — feats are **buy-once**, no tiers. Sole exception: the **Master Feat** — once, permanent, narrow one held feat further for a **second d6** there (the only stack). No retraining. Protects your niche.
- **Defense splits two ways** — **AC is static** (attacker rolls vs. it), the **six Saves are rolled** by the defender (see Defenses below). Feats raise a Save a ladder step or add a Spec Die on defence.
- **The Gateway IS the profession** — callings, trades, cultures are one thing: a gateway (identity) opening a menu of narrow d6 cluster feats.
- **Costs (provisional, sim-validated):** cluster feat **20** · gateway **30** · Master Feat **40**. The cluster feat is the economy's peg.

## Capability Roll-Types — Named Stat-Rolls (no skill list)

**A roll-type is just a named stat-roll:** the name picks the **stat** + the fiction; the bonus is purely the stat. "A Persuasion roll" = a **Charisma** roll; "a Perception roll" = a **Wisdom** roll. `1d20 + stat + (Spec Die if a feat fires)`, as always.

**The GM names the stat at the table** by asking *"which stat does this lean on?"* — read off what each stat governs. No master list; KD20 doesn't name every action. The guide below is a **baseline for common cases**, not a registry.

**What each stat governs** (the engine of the "which bonus?" call):
- **str** — force: melee, lift, break, climb, grapple, haul.
- **dex** — agility & precision: balance, tumble, aim, sleight of hand, stealthy movement, dodge.
- **con** — stamina: endurance, resist fatigue/elements, outlast.
- **int** — the *learned* mind: lore, languages, deduction, craft, arcane theory *(what you studied)*.
- **wis** — the *sensing* mind: notice, read people, track, survive, gut judgment *(what you sense in the moment)*.
- **cha** — force of self: persuade, intimidate, deceive, perform, lead.

*Int-vs-Wis, once: **Int = what you learned; Wis = what you sense.** Recall a weakness from study (int) vs. notice it in the moment (wis).*

**Baseline guide** (default stat · all rerouteable): Perception wis · Insight wis · Stealth dex · Tracking/Survival wis · Persuasion cha · Presence cha · Deception cha · Athletics str · Acrobatics dex · Lore/Academics int · Craft int · Medicine int/wis · **Spellcasting = gateway-determined** (Adept int · faith wis · innate cha).

**Rerouting (offensive mirror of the Fitting Save):** the listed stat is the default, not a cage — a player who credibly describes a different approach may, **GM-granted**, use a different stat (intimidate by **str**, pick a lock by **wis**). One stat not best-of; earned by commitment; **consequences follow the method chosen.** GM's "no" is fast and final.

**"A [roll-type] feat"** (in prereqs) = any feat granting a Spec Die on that roll-type. Base competence needs no feat.

## Contests

Both roll d20 + bonus. **Higher total wins; ties go to the defender.** The winning **margin** sets the tier (Decisive at 10+, Supreme at 20+), using the opponent's total as the target.

## Modifier Ladder

The same Success/Decisive/Supreme scale **prices every modifier**, both directions:

| Magnitude | Aid | Hindrance |
|---|---|---|
| Minor | +1 | −1 |
| Solid | +3 | −3 |
| Major | +5 | −5 |

- **Assessed:** GM prices a circumstance directly ("handholds aid you decisively, +3"). No roll.
- **Earned:** an actor rolls to aid/impede; their **tier** sets the modifier (Success +1 / Decisive +3 / Supreme +5). A failed attempt = ±0 and the actor spent their action. Contribution must be plausible (GM gates it).
- **Cap ±5 per side** (all sources counted), **then net** the two sides: +5 aid and −3 hindrance → +2.
- *Aiding example:* **Medicine** aids a patient's **Recovery** roll by the helper's tier (+1/+3/+5).

## States & the Two Levers

Any imposed effect is a **State** that pulls one or both levers:

- **Modifier lever** — changes a *number* on a roll (Ladder −1/−3/−5). *Can still do it, just worse.* (impaired vision −3; shaken −3 toward the source)
- **Permission lever** — changes *what's allowed*: prohibits/alters/requires/opens an action. No roll modified. (Blind: can't see; Held: can't move; Stunned: lose Action; Slow: Move **or** Action, not both)

**GM's question:** *number or permission?* Number → apply the Ladder. Permission → state plainly what they can't/must/may now do; don't roll the impossible.

**No severity scale** — "how much" lives only on the Modifier lever. Permission-States are binary (no "somewhat Blind"). *Impaired vision (−3)* and *Blind (can't see)* are two different States, not one at two volumes.

**Standard States** (each names how it ends): Prone (attackers +3, spend Move to stand) · Blind · Deafened · Held (can't move, can act) · Disarmed · Slow (Move or Action) · Stunned (lose Action, ends end-of-round) · Dying. GM-authored States must name **lever, effect, and end-condition**.

Spells/feats/properties author in this vocabulary: a Modifier value, a named State, damage, or a mix.

---

## Decisive & Supreme Results

| | Decisive | Supreme |
|---|---|---|
| **Combat (attack)** | **One** of: a Precision Die on damage, *or* a Follow-Up | **Both**: a Precision Die *and* a Follow-Up |
| **Skill (non-attack)** | The outcome is **better** (an extra benefit alongside the success) | The outcome is **much better** or carries an added benefit |

- **Precision Die** is always a *single* die (no doubled tier). Supreme's upgrade is getting the Follow-Up *too*, not more damage.
- **Follow-Up** = a combat effect or maneuver that **must flow causally from the attack** (a maul knocks sprawling; a punch can't pin to a wall — GM adjudicates). A flat effect uses the Modifier Ladder (−3/−5); a maneuver is a **free maneuver attempt** on the same action, **rolled to resolve**.
- **Skill** rewards a *better outcome*, never dice — the improved result is the reward. Degree is the GM's call.

## Universal Maneuvers

Shove, trip, grapple, disarm, throw sand, etc. are **universal** — any actor may attempt them as a **contest**, modifiable by Action Dice. Not gated. Being *exceptional* at a maneuver comes from a gateway/feat **Specialization Die** on top. Also what a combat **Follow-Up** can trigger for free.

## Action Economy

**Initiative:** rolled **each round** — 1d20 + **better of dex or wis**. Highest first. Ties → higher of the two bonuses, else simultaneous.

Each round: **1 Move + 1 Action.**

- **Move:** 6 grid units (2 m each = 12 m). **Splittable** around your Action (move–act–move).
- **Trade Action → extra Move** (12 units, no Action). Not the reverse.
- **Distance is concrete** (metres/grid; metres ≈ yards, use either); convert to narrative if the table prefers.
- **Reaction:** spend **1 Action Die** to act off-turn. Doesn't touch your own Move/Action. Must **flow from the trigger** (a fleeing foe → a swing, not an unrelated act). Uncapped, but **one trigger = one reaction**.
- **Zone of Control** = your weapon's reach (default **1 unit** all directions). **Leaving** an enemy's ZoC lets them react (character spends an Action Die; threat uses a stat-block ability). Moving *within* it doesn't provoke.

## Actor Baseline (provisional)

- **AC = 10 + dex + armour + shield + misc.** DEX always applies (any armour). Static band ~13–17, holds all campaign.
- **HP = 10 + con + wis + gateway bonus** (gateway ~+2/+4/+6 by durability). Start ~13–20. HP feats (later) fold in another stat, once each, stat 16+.
- **Magic items grant capabilities, not stat bonuses** (rare +1 max, always with a feature) — this keeps AC static.
- *Numbers provisional — playtest the HP-to-damage ratio.*

## Defenses — static AC, rolled Saves

**AC is static** (passive avoidance): `10 + dex + armour + shield`. Attacker rolls against it; defender never rolls.

**The six Saves are rolled** (active resistance): `1d20 + stat + gateway profile + feats`, vs. the attacker's total. **Each Save is just "[Stat] Save"** — the stat name says which bonus and (with the coverage) what it defends:

| Save | Stat | Defends against |
|---|---|---|
| **Strength Save** | str | shove, grapple, trip, forced movement |
| **Dexterity Save** | dex | areas, blasts, traps (dodge) |
| **Constitution Save** | con | poison, disease, exhaustion |
| **Intelligence Save** | int | **the mind** — telepathy, memory, confusion |
| **Wisdom Save** | wis | **perception** — illusion, deception, sensing wrongness |
| **Charisma Save** | cha | **the will / self** — domination, compulsion, fear, intimidation, crowd |

*The three mental Saves divide clean: **Int** = your thoughts (mind-reading, memory, confusion); **Wis** = your perception (illusion, spotting the trap); **Cha** = your will (defiance of domination, fear, being broken). Charisma is force of personality on defense as on offense.*

*(Retired flavour names, kept once so old notes parse: Str = "Withstand," Dex = "Reflexes," Con = "Fortitude," Int = "Composure," Wis = "Resolve/discernment," Cha = "Poise.")*

**Contest or Save? → Is the target *actively opposing* right now?**
- **Yes → contest** (both roll): grapple/shove vs. **Strength Save**; sneaking past a guard who's *actively searching* = Stealth vs. Perception.
- **No → roll vs. their static number**: sneaking past an *unaware* guard = Stealth vs. static Perception (10 + wis).
- A Save *is* a contest (attacker's total vs. your Save roll). **AC is the one always-static defense.**
- **Action Dice boost a Save roll** like any roll (Parry/Ward aid it). Gateway Save profile: 2 Solid / 1 Minor / 2 none / 1 Solid-hindrance. **AC isn't in the profile — boost it via a cluster feat.**
- **Hardened Save feat** (universal) raises one Save one flat ladder step — defensive feat-bought height, gated. **Scaled cost:** −3→0 = 20 · 0→+1 = 20 · +1→+3 = 30 · +3→+5 = 40. Major (+5) only on a gateway-Solid Save; a −3 can only be lifted toward neutral. Bought one step at a time.
- **AC feats** (how a calling gets hard to hit — AC isn't in the profile): **Armour Training** (+1 AC from worn armour, max +2, needs armour > light; 30/40 XP) *or* **Unarmored Defense** (while light/no armour, AC = `10 + dex + gateway's themed stat` — Monk wis · Rogue/Swashbuckler cha · Barbarian con; 30 XP). Mutually exclusive (armour vs. its absence). **AC soft cap ~20** — a GM-upheld band target, not a hard rule.

### The Fitting Save (more than one Save can apply)

A threat names a **default Save** (fireball → Dexterity, fear → Charisma, grapple → Strength). But **if a defender describes a defense that credibly routes the threat through a different stat, the GM may allow that stat's Save instead.**

- **Fiction leads, GM decides** — permission *granted*, not *picked*. **GM's "no" is fast and final** (no table debate).
- **One Save, not best-of** — it *replaces* the default; never roll two and take the higher.
- **Earned by commitment** — the greatshield in hand and braced, room to move, cover to hide behind. This is what keeps a gateway's −3 meaningful.
- **The fiction's consequences stay** — succeeding doesn't erase what you chose to stand in. A **Strength Save** braced vs. a fireball (instead of a **Dexterity Save** to dodge) = you *chose to stay in the blast*: you live, but you're standing in the fire, cloak smoking, surroundings alight. The default save is often also the "get clear" save; the Fitting Save keeps you *alive*, not *clear*.
- **Cuts both ways** — a threat may route a fear effect through Constitution ("a toxin that *feels* like dread") if the fiction fits.
- **Universal & free** at baseline (fiction + GM, like maneuvers); feats may later grant *reliability* (a shield feat that always allows the Str-brace vs. areas).
- *Example:* a Warrior (Str Save +3 / Dex Save −3) braces his **large shield** (no bucklers) vs. a dragon's breath → rolls a **Strength Save** instead of his awful Dexterity Save, but stands in the cone and everything around him burns.

## Effect Escalation (non-damage effects scale like damage)

Effects scale with the attacker's tier, via a default ladder along a chosen **axis**:

| Tier | Effect | (Damage) |
|---|---|---|
| **Success** | base State/Modifier | base damage |
| **Decisive** | **+1 step** on the axis | + Precision Die |
| **Supreme** | **+2 steps**, or +1 step **+ a rider** | + Precision **and** Follow-Up |

**Axes (pick one):** Magnitude (−1→−3→−5) · Severity (Modifier→Permission state) · Duration (round→scene→extended) · Scope (one→more targets). An effect names its base + axis; the ladder does the rest.

## Health, Recovery & Defeat

**HP is abstract** (grit/luck/dodging, not meat) → recovers fast; lasting harm only on reaching 0.

- **Recovery:** **15 min rest, no fighting = full HP.** No roll. Can't be claimed under pressure. Does **not** heal a defeat injury (that's the slower Recovery system, deferred).
- **Adrenaline Rush** (martial feat): spend an Action Die, once per combat, heal the roll — the only in-combat HP recovery.
- **At 0 HP = defeated, not dead. Player picks a Defeat Option (GM approval):**
  - **Take the Wound** — stay up at 1 HP with a **lasting injury-State** (meat; won't rest off).
  - **Go Down** *(default)* — unconscious, **Golden Hour** starts; keep the character.
  - **Last Stand** — stabilisation roll; on Success, 2–3 rounds with a **Spec Die on attacks**, then death; no Golden Hour.
  - **Clean Exit** — immediate clean death; next character gets an XP bonus.
  - **Vendetta** — die, return as a revenant hunting your killer; laid to rest by a ritual.
- **Golden Hour:** a downed PC worsens if untreated, pulls through if the party acts in time (maybe with a lasting Wound). *Campaigns may customize the Defeat menu in their own doc.*

## The Hard Choice (on a decisive failure — miss by 10+)

**Base:** on a failure by 10 or more, the GM may offer a **setback** (fiction-driven). Player **accepts** → gain **1 Action Die**; or **refuses** → plain Failure, no setback, no die. Refusing is always safe. Applies to any roll. **Action Dice can lift a roll out of the −10 band** (mitigate the catastrophe), same as reaching any tier.

**Optional — GM Imposition** (Session Zero opt-in): GM may instead **impose** a setback with no refusal; player gets **2 Action Dice**. Used at the GM's discretion within that permission.

Setback severity is the GM's call.

---

## Action Dice

A spendable pool that adds dice to rolls — the one exception to KD20's flat-modifier baseline.

- **Every Action Die is a d6. Fixed.** No boosting, no die-size chain. Dice never grow.
- **Spend** one or more on a roll, **before or after** seeing the result; each adds a d6 to the total. **No cap** beyond what's in the pool. (The regulator on a fat pool is *harder challenges*, not a rule.)
- Uses: **boost a roll**, or **buy a Reaction** (act outside your turn).
- **Pool refresh (default floor-raising):** start each session at the **greater of** carryover or the rate — earned dice survive the session boundary, so end-of-session rewards still matter. *(Optional hard-reset variant: reset to the rate, strict spend-or-lose.)*
- **Pool size (refresh rate)** is a Session Zero dial: **Gritty 3 / Heroic 5 (default) / Cinematic 8.** *(Provisional; Heroic 5 sim-anchored.)*
- **Pool depth (throughput feats):** **Deep Well** (universal, 40/60 XP, +1 refresh each, cap +2) · **Singular Path** (universal, 40 XP, needs Deep Well + single-gateway lock, +2 dice usable only within your gateway's theme). No XP refund if Singular Path is later broken.

### Earning Action Dice (fiction & character — never raw success)

- **Lean into a negative trait** — GM leans on it, player accepts the consequence → **1 die**. *(traits system, later)*
- **Table acclaim ("Cool!" die)** — a moment that makes the table/GM light up → **1 die**.
- **Milestones** — party reaches a GM-seeded beat → **1–3 dice each** (GM's call).
- **Feats** — certain feats (e.g. "Luck") grant a pool die on a narrow trigger. *(feat system, later)*

---

## Three Kinds of Die (keep them separate)

- **Action Die** — pool resource; **d6**; spent to boost rolls / buy reactions; refreshes each session.
- **Precision Die** — combat reward on a Decisive/Supreme **hit**; rolled into damage; **size = weapon's** (default = damage die; some differ, e.g. dagger d6 damage / d12 Precision). Not pooled.
- **Specialization Die** — conditional **d6** from a specialization feat; appears when the feat's narrow trigger fires. Not pooled, not spent. *(feat system, later)*

---

## Actors & Construction Tracks

**Character track** — built with full character rules. Has its **own Action Dice pool**; obeys the action economy. Covers PCs and any NPC built to that standard (major villains, key allies).

**Threat track** — monsters, minions, incidental NPCs. **No pool** (and the GM has no pool either); difficulty is built into the stat block; bespoke abilities; **not bound by the character action economy**. Authored via the Threat Design System *(later)*.

### Universal Actor Baseline

Every actor, either track, has:

- **AC** — how hard to hit *(values TBD)*
- **HP** — punishment absorbed before going down; abstracted (stamina, experience, evasion, luck) *(values TBD)*
- **Damage** — see below

## Damage Model

- **Attack that hits:** roll **damage die + stat bonus.**
- **Damage dice:** weapons **d6–d12**; **unarmed d4** (most humanoids).
- **Stat bonus:** **str** (most melee, unarmed) · **dex** (finesse melee, most ranged) · **other** (magic/special — named in its description).
- **On a hit:** Decisive = **one** of {a single Precision Die, *or* a Follow-Up}; Supreme = **both**. The Precision Die is always a single die (never doubled).

## Size Scale *(threat/NPC tool — later)*

Centered at **0 = human**. **Additive, upward only:** sizes **above** human add a flat modifier to **damage** and **HP**. Human and **below** take no size modifier (smaller = different, not worse). **AC unaffected** at every step.

---

## Session Zero Dials

| Dial | Options | Default |
|---|---|---|
| **Stat Gen — Dice** | 3d6 / 4d6-drop | 4d6-drop |
| **Stat Gen — Method** | Individual / Shared Pool | Individual |
| **Action Dice Pool** | Gritty 3 / Heroic 5 / Cinematic 8 | Heroic (5) |
| **Pool Refresh** | Floor-raising / Hard reset | Floor-raising |
| **GM Imposition** | Off / On | Off |

*(Pool numbers provisional; Heroic 5 sim-anchored.)*

---

*Companion to KD20 Core Rules v0.39. Provisional values flagged TBD.*
