# KD20 — Implementation Spec (for Foundry VTT v14)
**Version: v0.32 — 2026-10-03** *(reflects Core Rules v0.32)*

*A mechanics-only specification for building the KD20 game system in Foundry VTT v14. This strips out all design rationale and states only what an implementer needs: data fields, formulas, roll procedures, and output. Where this doc and the full rulebook (`KD20_Rules.md`) disagree on a mechanic, ask — don't guess. Target: Foundry VTT **v14** (use modern ApplicationV2 + DataModel APIs, not legacy template.json-only or ApplicationV1).*

*Reflects Core Rules v0.32: **no die face is special** (no lucky-20, no unlucky-1); the margin is the sole arbiter; the ladder is symmetric, with the Hard Choice triggered by a decisive failure (margin ≤ −10). (v0.32 also added the Hit Points / Recovery / Defeat system — not yet reflected in this implementation spec's build scope, which remains v1 core: stats, items, the roll engine. Defeat Options are GM-adjudicated and need no v1 automation.)*

---

## 0. Build Priority (do in this order)

1. A valid, **loadable** `system.json` for v14. Nothing else matters until Foundry loads the system with no console errors.
2. The **Character** actor DataModel + computed fields.
3. **Item** types: Gateway, Feat, Weapon.
4. The **character sheet** (ApplicationV2 + Handlebars).
5. The **core roll** (margin → outcome tier → chat).
6. **Action Dice** spend control.

Threats, States automation, magic trappings, and equipment tables are **out of scope for v1** — leave as TODO comments.

---

## 1. Core Dice Mechanic

Every check is the same shape:

```
result_total = 1d20 + stat_bonus + [one Specialization Die (d6) IF a feat applies]
```

Then compare `result_total` to a **target** (a DC set by the GM, or an opponent's total in a contest) and read the **margin** = `result_total − target`:

| Condition | Outcome |
|---|---|
| margin 20+ | **Supreme** |
| margin 10 to 19 | **Decisive** |
| margin 0 to 9 | **Success** |
| margin −1 to −9 | **Fail** |
| margin −10 or worse | **Fail + Hard Choice** — a decisive failure that flags the "Hard Choice" option |

Notes:
- **No die face is special — not a natural 20, not a natural 1.** The margin is the sole arbiter of the outcome. The d20 face is stored and displayed in the breakdown but never influences the verdict. A natural 1 with a large enough bonus can Succeed; a natural 20 with too small a bonus can Fail.
- The **Hard Choice triggers on a margin of −10 or worse** (a "decisive failure" — the downside mirror of a Decisive success). A normal miss (margin −1 to −9) is a plain Fail with no Hard Choice.
- **Action Dice can lift a roll out of the Hard Choice band:** if spending raises the margin above −10, the decisive-failure / Hard Choice status is removed on the re-posted card — all paths to a margin are treated equally (same code path as upgrading Success→Decisive).
- The **Specialization Die is a d6**, added **only** when a feat's trigger applies. At most **one** Specialization Die is ever added to a single roll (never stack two — the one exception, the Master Feat, is out of v1 scope).

**Chat output must show:** the d20 face, the bonuses added, the total, the target (if given), the margin, and the outcome tier (clearly labelled).

---

## 2. Statistics

Six Statistics, each a raw score (typically 3–20):

`Strength (str)`, `Dexterity (dex)`, `Constitution (con)`, `Intelligence (int)`, `Wisdom (wis)`, `Charisma (cha)`

**Stat bonus** (computed, used on all rolls):
```
bonus = floor( (score − 10) / 2 )
```
(So 10–11 → +0, 12–13 → +1, 14–15 → +2, 16–17 → +3, 18–19 → +4, 20 → +5. Also negative: 8–9 → −1, etc.)

The lowercase abbreviation (str, dex, …) always refers to the **bonus**, not the score.

---

## 3. Derived Statistics (computed fields on the Character)

```
AC         = 10 + dex + armour + shield + misc
HP (max)   = 10 + con + wis + gateway_hp_bonus
Initiative = 1d20 + max(dex, wis)      // rolled each round; the bonus is max(dex,wis)
```

- `armour`, `shield`, `misc` default 0; `armour` and `shield` come from equipped items or manual entry in v1 (equipment automation is later — manual fields are fine).
- `gateway_hp_bonus` comes from the character's Gateway item (see §4); default 0 if none. Provisional values: fragile gateways +2, mid +4, hardy +6.
- HP is a current/max pair; current starts = max.
- Initiative: store the **bonus** = `max(dex, wis)`; the actual roll is 1d20 + that, rolled fresh each round.

---

## 4. Item Types

### 4a. Gateway
A character's calling/profession/culture. Fields:
- `name`
- `description` (HTML)
- `hp_bonus` (integer: 2 / 4 / 6 typically)
- `benefit` (HTML text — the always-on gateway benefit; not automated in v1, just displayed)
- `cost_xp` (integer, default 30)

A character normally has **one** Gateway (allow more technically; don't enforce limits in v1).

### 4b. Feat
A trained capability. Fields:
- `name`
- `description` (HTML)
- `feat_type` (enum: `cluster` | `master` | `resist` — v1 just stores it)
- `trigger` (text — when its die/effect applies; not auto-detected in v1, GM/player decides)
- `effect` (HTML text)
- `grants_specialization_die` (boolean — if true, this feat is one a player may invoke to add a d6 to a roll)
- `prerequisite` (text — display only in v1)
- `cost_xp` (integer, default 20; master = 40)

**v1 behaviour:** feats are displayed on the sheet. When the player makes a roll, they may tick "apply a Specialization Die" (see §6) — the system does not need to auto-determine which feat applies; it just adds one d6 when the player says a feat applies. (Auto-triggering is a later enhancement.)

### 4c. Weapon
Fields:
- `name`
- `description` (HTML)
- `damage_die` (string, e.g. `d6`, `d8`, `d10`, `d12`, `d4`)
- `precision_die` (string, e.g. `d10` — the bonus die on Decisive/Supreme hits; defaults to equal the damage die)
- `attack_stat` (enum: `str` | `dex` | `int` | … — which stat bonus is added to the attack roll; finesse weapons may allow str OR dex — in v1 a single choice is fine, with a note)
- `damage_stat` (enum — usually same as attack_stat; the stat bonus added to damage)
- `reach` (integer, grid units; default 1)
- `properties` (text — e.g. "Parry"; display only in v1)

---

## 5. Attack & Damage Roll (procedure)

An attack is a core roll (§1) using the weapon's `attack_stat`, against the target's AC (or rolled manually vs. a GM-stated AC in v1):

```
attack_total = 1d20 + attack_stat_bonus + [Specialization Die d6 if a combat feat applies]
```
Read margin vs. the target's **AC**:
- Fail / Success / Decisive / Supreme per §1.

**Damage** (only on a hit):
```
damage = [weapon.damage_die] + damage_stat_bonus
on a DECISIVE hit: + [weapon.precision_die]          (one Precision die)
on a SUPREME hit:  + [weapon.precision_die]          (one Precision die — SAME single die; Supreme does NOT double it)
```
- The Precision Die is **always a single die** — Supreme adds the same one die as Decisive. (Supreme's extra reward is a "Follow-Up," which is **not automated in v1** — just note in chat "Supreme: Follow-Up available" as a reminder for the GM.)
- On a Decisive hit the player may *choose* a Follow-Up **instead** of the Precision Die (v1: just surface both as options/reminders in chat; don't force the choice mechanically).

**Chat output for an attack:** attack roll breakdown + outcome tier; then damage breakdown including whether a Precision die was added; and a text reminder if a Follow-Up is available.

---

## 6. Action Dice

A spendable pool on the Character.

Fields:
- `action_dice.value` (current, integer)
- `action_dice.refresh` (the refresh rate / Session-Zero dial value, default 5)

Mechanics:
- Each Action Die is a **d6**.
- A player may spend **any number** on a roll (no cap), up to `value`. Spending N: **roll N d6, sum them, add the sum to the roll's total.** Decrement `value` by N.
- Action Dice may be spent **after seeing the d20** (declare, roll, add) — so the UI should allow adding Action Dice to the *most recent* roll and re-reporting the new total and outcome tier.
- Refresh (session start) is a manual action in v1 (a button "Refresh Pool"): set `value = max(value, refresh)` (floor-raising default). Don't automate session detection.

**v1 UI:** a control to spend N Action Dice that rolls Nd6, adds to the last roll, updates the pool, and posts the new total + recomputed outcome tier to chat.

---

## 7. What NOT to build in v1 (leave as TODO)

- Threat/NPC actor type (GM runs threats manually at first).
- Automated **States/conditions** (Prone, Blind, Slow, etc. — v1: a plain text "conditions" notes field on the actor is enough).
- **Magic trappings** / spell rider automation (Adept spells are just Feat/Weapon-like items in v1; cast = a core roll).
- Equipment/encumbrance, armour tables (manual `armour`/`shield` fields suffice).
- XP tracking automation (a plain `xp` number field is fine).
- The Master Feat's die-stacking (store feat_type=master; don't automate the second die yet).

---

## 8. Reference Values (for test content / sanity checks)

- **Short Sword:** damage d6, precision d10, reach 1, finesse (str or dex), property "Parry".
- **Sample starting character (Bran, a Warrior):** STR 15(+2) DEX 13(+1) CON 14(+2) INT 10(+0) WIS 12(+1) CHA 11(+0); Warrior gateway (hp_bonus +6); AC = 10+1+2(leather)+0 = 13; HP = 10+2+1+6 = 19; Initiative bonus = max(+1,+1) = +1; Action Dice 5.
- **DC guide (provisional):** Easy 10, Moderate 13, Hard 16, Formidable 20.
- A correct Bran short-sword attack vs. AC 13: `1d20 + 2` (str), hit on total ≥ 13; Decisive at total ≥ 23; damage `1d6 + 2`, plus `1d10` on a Decisive/Supreme.

---

## 9. Verification Checklist (how a non-coder confirms it works)

After each build step, the AI should tell you how to check it. Minimum acceptance tests:

1. **Loads:** Foundry v14 starts, KD20 appears in the systems list, a world can be created with it, **zero console errors** on load.
2. **Character sheet opens** and shows the six stats, computed bonuses, AC/HP/Initiative, Action Dice pool, and lists of Gateway/Feats/Weapons.
3. **Editing a stat** updates its bonus and the derived AC/HP/Initiative automatically.
4. **A basic roll** (pick a stat, enter DC 13) posts to chat with the correct total and the correct outcome tier (test: a total of 13 = Success, 23 = Decisive, 33 = Supreme, 12 = Fail, a total of 3 or less = Fail + Hard Choice (missed by 10+); a natural 1 with enough bonus can still Succeed — no die face is special).
5. **Applying a Specialization Die** adds exactly one d6 and re-reports.
6. **An attack** vs. a stated AC reports the tier and, on a Decisive/Supreme, adds one Precision die to damage and flags the Follow-Up.
7. **Spending Action Dice** rolls Nd6, sums, adds to the last roll, decrements the pool, and re-posts the new tier.

If all seven pass, v1 is done.
