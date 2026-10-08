# KD20 — Feats & Gateways
**Version: v0.39 — 2026-10-07** *(companion to Core Rules v0.39)*

*The capability content layer. Cluster feats are the narrow d6-on-trigger capabilities of the KD20 Capabilities system; a **gateway** is an identity (calling, profession, culture) that opens a curated menu of them. Feats are authored **once** in the Feat Library and referenced by every gateway that offers them — so overlapping gateways share one feat rather than duplicating it.*

*Feats ported and translated from the MYD20 Branch resource through KD20's decisions (see the Feat Translation Guide). Costs and details provisional; this is a growing document — five gateways built so far (Warrior, Scout, Adept, Guardian, Face); further gateways follow the same treatment.*

*Save vocabulary (v0.36): the six Saves are named for their Statistic — **Strength Save, Dexterity Save, Constitution Save, Intelligence Save, Wisdom Save, Charisma Save**. A "resist feat" that raises a Save names the stat (e.g. "a Strength Save feat"). See Core Rules → Defenses. Retired flavour names, for anyone reading older feat text: Strength = "Withstand," Dexterity = "Reflexes," Constitution = "Fortitude/Endurance," Intelligence = "Composure," Wisdom = "Resolve/discernment," Charisma = "Poise."*

---

## How to Read a Feat

Every feat is written in the same five-part shape:

> **Feat Name** — *Prerequisite* · **Cost** XP 
> **Trigger:** the specific circumstance in which the feat's die fires or its effect activates. 
> **Effect:** what happens, always in KD20's own vocabulary — a **Specialization Die** (a d6) on a roll; a **State** (Modifier or Permission lever); a **Follow-Up**; a Modifier-Ladder value; or an Action-Die-fuelled reaction.

**Reading conventions:**
- **Prerequisite** is a gateway plus, where relevant, a Statistic minimum (e.g. *Warrior · STR 14*) and/or a prior cluster feat. KD20 gates on gateway + stat + prior feats, never on a "skill rank" (there are none).
- **Cost** uses the standard economy pegs: **cluster feat 20 · Master Feat 40** (gateway feats themselves cost **30**, listed with the gateway). All provisional, simulation-supported.
- **One die applies.** If several of a character's feats could fire on one roll, only **one** Specialization Die is added; the player picks which, and the chosen feat sets the fiction (see core rules).
- **Active powers cost an Action Die.** Where a feat grants an *activated* effect that would otherwise need a "once per scene" limiter, KD20 instead charges **1 Action Die** to use it — the pool is the limiter, consistent with the reaction economy. Passive and always-on feats cost nothing to use.

---

## Design Principles (for the feat author)

Two guardrails govern every feat in this document. A candidate feat that fails them is redesigned or dropped — this is what keeps the library honest and consistent across a hundred-plus feats.

**1. Feats never sell height.** KD20's advancement runs in four separate lanes (see Core Rules — *Where Bonuses Come From*): **height** (a higher permanent ceiling) comes *only* from raising a Statistic; **breadth** comes from feats; **focus** comes from spending Action Dice; **consistency** comes from the floor pattern. Feats live in the *breadth* lane exclusively. If a player wants a flat, permanent power increase, the answer is "raise your stat" — not "buy a feat." A feat that simply increases an existing bonus is height in disguise and does not belong, **even as a buy-once feat** (buying a bigger number once is still buying a bigger number).

> **The sanctioned exceptions — defensive height only.** A feat *may* buy permanent, flat height on a **defense** — a **Save** (the **Hardened Save** feat) or **AC** (the **Armour Training** / **Unarmored Defense** feats), all below. This is deliberate and allowed for two reasons the offensive case lacks: (a) defensive height never drives the margin/DC treadmill that the no-height rule exists to prevent (you get harder to hit; you don't get a bigger number pushing *against* DCs); and (b) every such feat is **bounded** — Saves by the gateway profile (Major only on a gateway-Solid Save), AC by being **buy-once/capped and gated on a fiction requirement** (armour worn, or armour absent) plus the **~20 AC soft cap**. Defensive height is costed above a cluster feat, named as an exception, and bounded; **nothing else in the library may sell a flat bonus** — offense is always breadth (a new trigger/option), never a bigger number.

**2. A legitimate cluster feat adds one of four things — never just a bigger bonus:**
- **A new trigger** — a circumstance where you're now exceptional that you weren't before (*Weapon Master*: your rapier attacks now get a die; *Ambush*: attacking from concealment now gets a die).
- **A new option** — a thing you can now *choose to do* that others can't (*Cleave*: drop a foe, take a free attack; *Flurry*: spend a die for a second strike).
- **A permission change** — you can now do something the rules normally forbid (*Skirmish Mastery*: ignore Zone-of-Control reactions; *Battle Awareness*: cannot be surprised).
- **A state / follow-up change** — your Decisive or Supreme results gain new consequences (*Brutal Strike*: widen the States your Follow-Up can impose; a riposte on a Decisive parry).

The test for any proposed feat: *does it give a new thing to do or a new circumstance to excel in — or does it just make a number bigger?* Only the former is a feat.

---

Available to any character, once, permanently.

> **Master Feat** — *any one cluster feat you already own* · **40** XP 
> **Trigger:** a *narrower* signature circumstance you carve out of the chosen feat's trigger (e.g. from *Weapon Master (Rapier)* → "the first exchange against a single foe"; from *Ghost Step* → "moving through a space you have scouted beforehand"). 
> **Effect:** that narrowed trigger gains a **second Specialization Die** — the only place two dice stack. 

One Master Feat per character, ever. **No retraining, no refund.** Mastery is a lifelong pursuit; its permanence also protects player niches (a claimed specialty stays claimed, and the party diversifies rather than converging). Choose wisely.

*(General principle, applies to the Master Feat and every purchase: **XP is never refunded** for a lost, broken, or abandoned purchase. XP buys what you had and used, not a cancelable reservation — see Core Rules.)*

## Other Universal Feats

These, like the Master Feat, are available to **any character regardless of gateway** (they are not drawn from a gateway's cluster menu). They deepen the Action Dice pool — the *throughput* lane of advancement.

> **Deep Well** — *universal; may be taken up to twice* · **40** XP (second purchase **60** XP) 
> **Trigger:** passive, always on. 
> **Effect:** your Action Dice **refresh rate increases by +1** (permanently). Deliberately expensive — a pool bump helps in every scene, forever, so it costs well above a cluster feat and escalates on the second purchase. **Capped at +2 total** (e.g. Heroic 5 → 6 → 7). Pure throughput: more clutch moments, same d6 dice. *(The steep cost is the gate — in practice only established characters afford it, so "veterans have deeper pools" emerges from the price, no separate progression track needed.)*

> **Singular Path** — *universal; requires **Deep Well**; requires you to be **locked to a single gateway** (you have taken, and will take, no second gateway)* · **40** XP 
> **Trigger:** actions that fall within your gateway's **written theme** (below) — GM adjudicates edge cases against that theme, with table input. 
> **Effect:** you gain **two extra Action Dice** (added to your pool / refresh) that may be spent **only** on themed actions. This is the reward for *devotion*: the focused character's answer to the breadth a second gateway would offer — mastery of one calling instead of access to two. 
> **The single-gateway lock is breakable, at a cost:** if a dramatic turn later leads you to take a second gateway, you may — but doing so **forfeits Singular Path and its two themed dice, and the XP is not refunded.** The XP bought the devotion you lived, not a reservation you can cancel; choosing a new path ends the mastery, it does not un-spend the years. *(This pairs with the Multi-Gateway rule, see Core Rules: breadth and focus are the two sides of advancement, each with its own reward.)*

### Defensive Feats (universal)

> **Hardened Save** — *universal; taken per-Statistic and repeated to climb; a Save may be bought up one ladder step at a time* · **scaled cost (below)** 
> **Trigger:** passive, always on — it raises the chosen Save's standing bonus. 
> **Effect:** raise **one** Save by **one ladder step** from its current value: **−3 → 0**, **0 → +1** (Minor), **+1 → +3** (Solid), **+3 → +5** (Major). The new value is permanent and flat — it is added to your `1d20 + stat + gateway profile` Save, exactly like the gateway profile step itself. This is the *trained spike on top of the gateway baseline* the Core Rules describe.
>
> **The gate (from Core Rules):** **Major (+5) is reachable only on a Save your gateway set to Solid (+3).** You may lift a gateway hindrance *up toward neutral* (−3 → 0) and push a gateway strength to exceptional, but you can never spike your mandatory −3 soft spot into a Major — every calling keeps a real weakness. A step is bought from the Save's *current* value, so climbing from 0 to +3 is two purchases (0→+1, then +1→+3).
>
> **Scaled cost** — cheaper to shore up a weakness, dearer to reach exceptional:
>
> | Step | From → To | Cost |
> |---|---|---|
> | Patch a hindrance | **−3 → 0** | **20** XP |
> | Train a neutral Save | **0 → +1** (Minor) | **20** XP |
> | Spike toward strong | **+1 → +3** (Solid) | **30** XP |
> | Reach exceptional | **+3 → +5** (Major) | **40** XP *(gateway-Solid Save only)* |
>
> *(This is the one feat that sells flat, permanent height — the sanctioned defensive exception, see Design Principles. It is costed above a cluster feat for exactly that reason, and the scaled price nudges players toward patching their gateway's −3 rather than min-maxing an already-strong Save. A feat named "requires a Strength Save feat" (Steel Discipline, Iron Resilience, Bulwark, Unbreakable) is satisfied by owning any Hardened Save on that Statistic. Where a gateway feat grants a **Specialization Die on a Save** — e.g. Steel Discipline, Iron Aegis — that die is a conditional rider on a feat that does more; it is distinct from this flat, always-on height, and the two can both apply.)*

#### AC Feats — "Hard to Hit," by Two Fictions

AC is deliberately **not** in the gateway Save profile (see Core Rules → *Defenses*): being hard to hit is a *characterful, invested* thing, and callings become hard to hit by different fictions. These are the feats that do it — the **second sanctioned place a feat buys flat defensive height**, held in band by the same logic as Hardened Save (buy-once/capped, gated by a fiction requirement) and by the **~20 AC soft cap** (Core Rules). The two flavours are **mutually exclusive by their requirements** — one needs armour, the other needs its absence — so they never stack.

> **Armour Training** — *universal (drawn by armour-wearing gateways — Warrior, Guardian, and future heavies); requires armour heavier than light actually worn; may be taken up to twice* · **30** XP (second purchase **40** XP) 
> **Trigger:** passive, always on while you wear armour heavier than *light*. 
> **Effect:** you add **+1 AC** from trained use of your worn armour (the drill that makes steel do its full work). A **second purchase** adds another **+1** (max **+2** total). The bonus applies only while the armour is worn; strip it off and the trained bump goes with it. *(The plate-knight route: the AC comes from the gear, the feat is the mastery of it. Capped at +2 and gated on wearing real armour, so it can't spiral the static band — the ~20 soft cap is the ceiling. This is flat defensive height, the AC sibling of Hardened Save, and priced the same way.)*

> **Unarmored Defense** — *gateway-themed (the gateway names the stat — Monk, Rogue/Swashbuckler, Barbarian, and future light fighters); requires **light or no armour***; buy-once* · **30** XP 
> **Trigger:** passive, always on **while you wear light or no armour** (a shield is fine). 
> **Effect:** your AC becomes **`10 + dex + [your gateway's themed stat]`** instead of the armour formula — your training *is* your defense:
> - **Monk → wis** (awareness as armour; you flow around the blow)
> - **Rogue / Swashbuckler → cha** (audacity and flair; too dashing to be where the blade lands)
> - **Barbarian → con** (raw toughness and battle-instinct turning hits aside)
>
> The gateway fixes the stat (like Spellcasting's casting stat — not player-chosen). **Self-limiting:** `10 + dex + stat` with both stats high lands around **~20** at the extreme — the same band-top an agile-armoured veteran reaches, by a different route — so no separate cap is needed beyond the ~20 soft cap. The **light/no-armour requirement is what makes this the true opposite of Armour Training**: you cannot wear plate *and* claim your reflexes are your armour, so the two never combine. *(The dodgy-fighter fantasy: the slippery rogue, the untouchable monk, the whirling barbarian. dex is the universal backbone of not-being-hit; the themed stat is the flavour of how.)*

**Gateway themes** (the scope of *Singular Path*'s dice; a short written descriptor anchors adjudication so "what's thematic?" isn't re-argued each time):
- **Warrior:** martial force, weapons, physical endurance, battlefield presence.
- **Scout:** stealth, wilderness, tracking, scouting ahead.
- **Adept:** casting, arcane knowledge, magical problem-solving.
- **Guardian:** protecting others, holding ground, defensive action.
- **Face:** social influence, reading people, deception and persuasion.

---

# GATEWAYS

---

## Gateway: Warrior

*You have dedicated yourself to the art of close combat — through formal training, hard experience, or sheer bloody-mindedness, you understand fighting in a way most people never will.*

> **Warrior (gateway feat)** — *Transformative Moment: a life genuinely introduced to the calling of arms* · **30** XP 
> **Benefit (always on):** You are **never unarmed** — your body itself is a weapon (unarmed strikes count as a weapon you are trained with, damage d4, and you may take weapon feats for it). In addition, **once per turn, when you would spend an Action Die to boost a melee attack roll, treat that die as if you rolled at least a 4** (your trained instinct wrings value from every push). *(This replaces MYD20's "extended crit range," which doesn't exist in KD20 — the margin ladder is fixed. The reframed benefit rewards the Warrior's signature act, pressing a melee attack, without touching the static ladder.)* 
> **Gateway HP bonus:** +6 (hardy). 
> **Save profile:** Strength Save +3, Constitution Save +3, Dexterity Save +1, Intelligence Save 0, Wisdom Save 0, **Charisma Save −3** (strong and hardy in body; shakeable of will — fear and domination find the crack). *(AC is separate — a Warrior wanting to be hard to hit buys an AC cluster feat.)*

**Opens the following cluster feats:**

> **Weapon Master** — *Warrior* · **20** XP · *may be taken multiple times, once per weapon type* 
> **Trigger:** attacking with a chosen weapon type (blades, axes, blunt, polearms, bows, or unarmed — pick one per purchase). 
> **Effect:** add a **Specialization Die** to the attack roll. *(Porting note: MYD20's "combat advantage" → the Specialization Die on the attack roll, KD20's standard combat-superiority mechanism. The old "Melee at Skilled" prereq is gone — attack is not a skill — so it gates on the Warrior gateway alone.)*

> **Brutal Strike** — *Warrior · STR 14; requires Weapon Master* · **20** XP 
> **Trigger:** a **Decisive** or **Supreme** melee attack. 
> **Effect:** the hit's **Follow-Up** may impose a State that flows from the blow — your choice of **Prone** (knocked down), **Disarmed**, or a **Modifier-lever −3 "staggered"** (Solid hindrance on the target's next roll). On a Supreme, the Follow-Up comes *in addition* to the Precision Die, per the standard rewards. *(Porting note: "win by a significant margin → condition" is exactly the Decisive/Supreme Follow-Up already in core; this feat simply widens the menu of States a Warrior can choose.)*

> **Steel Discipline** — *Warrior; requires a Strength Save feat* · **20** XP 
> **Trigger:** you are subjected to a physical effect you resist with your **Strength Save**. 
> **Effect:** add a **Specialization Die** to the Strength Save. On a **Decisive** resist, you may immediately make a **free contest** (a Follow-Up) against the source of the effect. *(Porting note: "advantage on the physical resist" → the d6; "free contest on success" tightened to fire on a *Decisive* resist, so the counter is earned, not automatic.)*

> **Battle Awareness** — *Warrior* · **20** XP 
> **Trigger:** the start of combat, and Perception rolls made during combat. 
> **Effect:** you cannot be **surprised**, and you add a **Specialization Die** to initiative (representing coiled readiness) and to in-combat Perception rolls. *(Porting note: "always act first" softened to a d6 on initiative — a flat "always first" would break the rolled-each-round initiative; "advantage" → the d6.)*

> **Cleave** — *Warrior · STR 13; requires Weapon Master* · **20** XP 
> **Trigger:** you drop an enemy to 0 HP with a melee attack. 
> **Effect:** take a **free Follow-Up attack** against another enemy within your Zone of Control. This attack cannot itself trigger Cleave. *(Porting note: ports almost verbatim — "drop an enemy → free attack" is a clean Follow-Up. Reach expressed as Zone of Control.)*

> **Iron Resilience** — *Warrior · CON 13; requires a Strength Save feat* · **20** XP 
> **Trigger (active — costs 1 Action Die):** the moment you would be reduced to **0 HP (defeated)**. 
> **Effect:** spend **1 Action Die** to instead remain standing at **1 HP** with one action left **before defeat**. Additionally (passive): physical **States** afflicting you end **one step / one turn faster** than they otherwise would. *(Porting note: MYD20's "once per scene" limiter → an Action-Die cost, per the standing ruling — the pool is the limiter. Fires* before *the 0-HP Defeat Options, the same as the Guardian's Unbreakable — the two are parallel defeat-defiance feats. The "recover a step faster" passive is retained, expressed against KD20's State end-conditions.)*

> **Veteran's Eye** — *Warrior; requires any three other Warrior feats* · **20** XP 
> **Trigger:** combat begins, and you can see a foe. 
> **Effect:** the GM tells you **one** of: the foe's approximate power level, its most dangerous ability, or its most obvious weakness — your choice. Pure GM-narration; no die. *(Porting note: ports verbatim; the "Melee at Master" prereq becomes "three other Warrior feats" — depth-of-calling expressed in feats, not a skill rank.)*

> **Adrenaline Rush** — *Warrior* · **20** XP · *(shared-library martial feat — available to other fighter-type gateways' menus, but not mandatory on each)* 
> **Trigger (active — costs 1 Action Die):** **once per combat scene**, as the adrenaline hits. 
> **Effect:** spend **1 Action Die** and **heal HP equal to that die's roll** (a d6 — recovering stamina, grit, and second wind, not knitting flesh; consistent with abstracted HP). KD20's first in-combat recovery: a martial emergency valve. *(Design notes: this is the one ability gated **twice** — it costs a die* and *caps at once per combat — a deliberate, flavor-justified exception to "the pool is the only limiter," because unlimited die-fuelled healing would undermine KD20's intended lethality; "adrenaline fires once per fight" sells the cap. Gated to fighter-type gateways by design: fragile callings survive by not being hit, martial ones by enduring — the access restriction* is *the differentiation, so no "improved" tier is needed. This is the in-combat valve only; out-of-combat healing is the deferred Recovery system.)*

---

## Translation Notes (Warrior — for the record)

What the exemplar establishes, to be applied to every gateway that follows:
- **"Advantage / disadvantage" → a Specialization Die** (+d6) on the relevant roll, or a Modifier-Ladder step where it's circumstantial.
- **"Critical success" → Decisive; "Super Crit" → Supreme.** Gateway benefits keyed to "extended crit range" get *re-conceived*, because the margin ladder is fixed — usually reframed as a Specialization Die on the calling's signature act.
- **Skill-rank prereqs → gateway + stat + prior feats.** "Melee at Skilled" etc. vanish (no skills); combat feats gate on the gateway, a stat minimum, and sometimes a prior cluster feat.
- **"Win by a margin → condition" → a Decisive/Supreme Follow-Up** imposing a State (using the two-lever vocabulary).
- **"Once per scene/session" active powers → cost 1 Action Die** (the pool is the limiter).
- **"Taken multiple times" (per weapon/etc.) → retained** as the parameterized-feat pattern.
- **Pure GM-narration feats (Veteran's Eye) → port verbatim**, no mechanics to translate.
- **Save references → stat-name Saves** (v0.36): a "resist feat" names its stat (a "Strength Save feat"), a resisted effect names the Save (your "Strength Save").

---

## Gateway: Scout

*You are at home in the shadows and the wilderness. You move where others cannot, see what others miss, and are gone before anyone knew you were there.*

> **Scout (gateway feat)** — *Transformative Moment: a life spent reading the land and living unseen* · **30** XP 
> **Benefit (always on):** You may **attempt Stealth even while observed**, so long as there is *any* shadow, cover, or distraction to work with — a permission others don't have (see the Two Levers: this is a Permission-lever benefit). In addition, once per turn, when you spend an Action Die to boost a **Stealth or Perception roll** (see *Capability Roll-Types* — Stealth = dex, Perception = wis), treat that die as if you rolled at least a **4**. *(Gateway-benefit pattern: a signature Permission quirk + the boost-floor on the calling's signature act. The MYD20 "advantage on outdoor Perception" is folded into the boost-floor rather than a standing advantage, since KD20 has no advantage mechanic.)* 
> **Gateway HP bonus:** +4 (mid — Scouts avoid trouble rather than absorb it). 
> **Save profile:** Dexterity Save +3, Wisdom Save +3, Strength Save +1, Constitution Save 0, Intelligence Save 0, **Charisma Save −3** (nimble and keen-eyed; awkward under social pressure).

**Opens the following cluster feats:**

> **Ghost Step** — *Scout; requires a Stealth feat* · **20** XP 
> **Trigger:** moving while hidden or trying to stay unheard. 
> **Effect (Permission + Modifier):** your movement makes **no sound** regardless of surface — anyone trying to detect you *by hearing* cannot (a Permission denial), and you add a **Specialization Die** to Stealth rolls that turn on staying unheard. *(Porting note: "others suffer disadvantage to hear you" → the sound-denial permission plus the d6 on your roll, rather than a penalty on theirs. Passes the four-point test: new permission.)*

> **Ambush Predator** — *Scout · DEX 14; requires Ghost Step* · **20** XP 
> **Trigger:** attacking a target that is unaware of you (from concealment/surprise). 
> **Effect:** add a **Specialization Die** to that first attack, **and** a Decisive/Supreme ambush hit may take a **Follow-Up** imposing a State (Prone, staggered −3, or — if the fiction supports it — briefly **Stunned**). *(Porting note: "strong combat advantage" → the d6 on the attack; "crit → disadvantage on their next action" → a Follow-Up State on a Decisive, using the two-lever vocabulary. This is the Scout's one combat-superiority feat — narrow, gated on surprise.)*

> **Tracker** — *Scout · WIS 13* · **20** XP 
> **Trigger:** following a trail or tracking a quarry. 
> **Effect:** add a **Specialization Die** to tracking rolls; you can follow trails up to a week old, and on an extended tracking task the GM grants extra **margin for error** before consequences trigger. *(Porting note: "reduced DC" → the d6 on the roll (KD20 prefers a die on the actor over shifting the DC); the extended-task forgiveness ports as-is.)*

> **Vanish** — *Scout · DEX 14; requires Ghost Step* · **20** XP 
> **Trigger (active — costs 1 Action Die):** as your Action, in any environment with cover, shadow, or a distraction. 
> **Effect (Permission):** you become **Hidden** even in plain sight — a Permission-State that lasts until you act or circumstances change. *(Porting note: MYD20's "once per scene" → an Action-Die cost, per the standing ruling. Passes the test: a new option/permission, not a bigger number.)*

> **Eagle Eye** — *Scout · WIS 14; requires Tracker or a Perception feat* · **20** XP 
> **Trigger:** Perception rolls limited by distance or darkness; and passive awareness. 
> **Effect (Permission + Modifier):** distance and darkness no longer hinder your Perception (a Permission removal of those penalties); you **passively notice** concealed things (the GM tells you *something* is there, not what); and you can read lips at any distance you can see a face clearly. Add a **Specialization Die** when actively searching. *(Porting note: "no disadvantage from distance/dark" → permission-removal of the Modifier those conditions would impose; passive-notice ports verbatim.)*

> **Wilderness Craft** — *Scout · WIS 13; requires Tracker* · **20** XP 
> **Trigger:** sustaining yourself and companions in a natural environment. 
> **Effect (Permission):** you can feed, water, and shelter **yourself and up to four companions indefinitely** in any natural environment — routine survival simply isn't in question for your group. *(Porting note: ports verbatim; a clean permission — turns survival rolls off entirely for the group under normal conditions.)*

> **Shadow Network** — *Scout · CHA 13; requires any three other Scout feats* · **20** XP 
> **Trigger (active — costs 1 Action Die of a fresh session's pool, or GM discretion between adventures):** you consult your contacts about a region you've previously operated in. 
> **Effect:** ask the GM **one question** about the location, movements, or activities of any person or group in that region; the GM answers honestly with the best information your network could realistically have. *(Porting note: MYD20's "once per session" → an Action-Die cost, but note this one fires *outside* combat — the GM may simply allow it once between adventures rather than tracking a die, whichever suits the table. Depth-gated like Veteran's Eye: needs three other Scout feats, so it's a capstone.)*

---

## Translation Notes (Scout — additions to the record)

Scout confirmed the idioms hold outside combat, and added two patterns:
- **"Advantage on a non-combat roll" → a Specialization Die on that roll** — works identically to combat (Tracker, Ghost Step, Eagle Eye). The non-combat half of the Capabilities system uses the exact same mechanism, as intended.
- **"Reduced DC" → put the die on the actor, not the DC.** KD20 prefers modifying the roller's total (a Specialization Die) over shifting the target number, keeping DCs stable and the margin ladder honest.
- **Permission-heavy gateway:** unlike Warrior (mostly dice-on-attack), Scout leans on the **Permission lever** (attempt Stealth while observed, no-sound movement, Vanish, ignore distance/dark, group survival). This is the first proof that the Two-Lever States vocabulary carries a whole gateway's identity, not just combat effects — a good validation that "capabilities are one system" reaches the exploration pillar.
- **The signature-act boost-floor** re-skins cleanly: Warrior floors melee-attack boosts, Scout floors Stealth/Perception boosts. The gateway-benefit pattern (signature Permission quirk + signature boost-floor) generalizes as intended.*

---


---

## Gateway: Adept *(the first magic gateway)*

*You have learned to reach past the ordinary and shape force by will and study. Where others swing steel, you speak the world into doing what you want — a bolt of ice, a burst of flame, a ward against harm.*

Magic in KD20 comes in two very different forms, and the Adept shows the first:
- **Spells are feats** — fast, bounded, cast at scene-speed, bought with XP like any capability, resolved on the five-outcome ladder. This is the caster's reliable, trained toolkit. *(Below.)*
- **Rituals are treasure** — slow, costly, powerful, found-and-studied rather than bought. They lie outside the XP economy entirely. *(See the Ritual framework — deferred; open to anyone who finds and studies one, whatever their gateway.)*

> **Adept (gateway feat)** — *Transformative Moment: a mind genuinely opened to the working of magic — an apprenticeship, a revelation, a bargain* · **30** XP 
> **Benefit (always on):** You can **work magic at all** — the base permission that spellcasting requires; without an arcane gateway a character cannot take spell-feats (they may still attempt found *rituals*, which are treasure, not feats). **The Adept's casting stat is Intelligence** — its Spellcasting roll-type is `1d20 + int` (a studied caller; see *Capability Roll-Types* — Spellcasting is gateway-determined, and the Adept learns magic by study). In addition, once per turn, when you spend an Action Die to boost a **Spellcasting roll**, treat that die as if you rolled at least a **4**. *(Gateway-benefit pattern: a signature permission — access to spell-feats — plus the boost-floor on the calling's signature act, casting.)* 
> **Gateway HP bonus:** +2 (fragile — Adepts win by not being hit, not by enduring blows). 
> **Save profile:** Intelligence Save +3, Wisdom Save +3, Charisma Save +1, Strength Save 0, Dexterity Save 0, **Constitution Save −3** (a fortified, disciplined mind and clear perception; a frail body).

### Spells and Trappings

An Adept's offensive spells are defined by their **mechanical shape**, not a fixed element. The player chooses the spell's **trapping** — its element and sensory form — **when the feat is bought**, and that trapping is fixed for that purchase (this is the *chosen feat sets the fiction* rule, applied to magic). A frost **Bolt** and a fire **Bolt** are *different spells*: to have both, buy Bolt twice, once per trapping. This is breadth (a new option and a new rider each time), never a bigger number — it passes the feat test the same way owning two Weapon Masters does.

**The trapping suggests the rider.** On a **Decisive or Supreme** cast, a spell's Follow-Up may impose a State that flows from its trapping (GM-approved, from the standard menu):

| Trapping | Suggested Decisive/Supreme rider |
|---|---|
| Frost / cold | **Slow** (Permission) |
| Fire | **-3 "burning"** (Modifier) or ongoing damage |
| Force / thunder | **Prone** (knockback) or **Deafened** |
| Lightning | briefly **Stunned** *(strong - GM gates tightly)* |
| Shadow / necrotic | **-3 "withered"** (Modifier) |
| Light / radiant | briefly **Blind** |

The rider fires only as the Decisive/Supreme **Follow-Up** — the same earned reward every combat feat gives, flavored by trapping. Trappings are otherwise pure fiction: describe your fire Bolt freely, but igniting barrels or melting a lock is a GM adjudication like any fictional bid, not a spell rule.

**Opens the following spell-feats:**

> **Bolt** — *Adept · INT 13 · choose a trapping at purchase; may be taken again with a different trapping* · **20** XP 
> **Trigger:** you cast it at a single target in range (a ranged spell attack). 
> **Effect:** attack **1d20 + int + a Specialization Die**; on a hit, **d8 + int** damage, **Precision d8** on a Decisive/Supreme. Range ~15 units. A Decisive/Supreme Follow-Up may impose the trapping's rider State (see table). *(A self-contained conjured "weapon": the feat grants the attack, the damage, and the trained die in one package — the caster's spell is their mastered armament.)*

> **Blast** — *Adept · INT 14; requires Bolt · choose a trapping at purchase; may be retaken with a different trapping* · **20** XP 
> **Trigger:** you cast it at an area (a burst ~3 units across, or a cone) within range. 
> **Effect:** every actor in the area makes a **Dexterity Save** (1d20 + dex + their gateway profile vs. your cast total). On a failure: **d6 + int** damage. On your **Decisive/Supreme** cast, those who failed also suffer the trapping's rider State. *(Area magic resolves as your cast vs. their Dexterity Save — a contest, per core. Lower per-target damage than Bolt because it hits many; the Precision Die does not apply to area spells — spreading force trades the telling single blow for breadth.)*

> **Ward** — *Adept · INT 13* · **20** XP 
> **Trigger (active — costs 1 Action Die):** as a reaction to an incoming attack or harmful effect against you or an ally in reach. 
> **Effect (Modifier):** conjure a shield of force — impose a **-3 (Solid)** hindrance on the attacker's roll, or grant **+3** to an ally's Save against the effect. *(An Adept's defensive option, so the gateway isn't purely offense. Reaction-priced like Parry; reuses the Modifier Ladder. Trappings apply cosmetically — a wall of ice, a rune of light.)*

> **Cantrip** — *Adept · INT 11* · **20** XP 
> **Trigger:** minor magical effects at will — light a flame, chill a drink, lift a small object, send a whisper, mend a crack. 
> **Effect (Permission):** you can produce small, non-combat magical effects appropriate to your study, no roll needed when there are no stakes (per the core "no stakes, don't roll" rule); a contested or risky use rolls **1d20 + int**. *(The everyday utility magic that makes an Adept feel magical out of combat. Deliberately broad and low-power — a permission, not a weapon.)*

---

## Translation Notes (Adept — additions to the record)

The first magic gateway, and it validated that **magic needs almost no new machinery**:
- **Spells are feats.** A spell-feat is a self-contained conjured weapon (cast-ability + Specialization Die + damage + Precision, in one 20-XP package). No spell slots, no separate casting subsystem — magic enters through the same door as every capability.
- **Trappings = the chosen-feat-sets-fiction rule, applied to magic.** Mechanical shape (Bolt/Blast/Ward) is the feat; element/form is player-authored fiction, fixed at purchase. Infinite spell variety from a near-zero content build — the deferred "author 50 spells" problem dissolves.
- **Trappings touch mechanics only through the Two-Lever States menu** (a Decisive rider), so they matter without trapping-creep — the GM gates any effect beyond the feat's shape as an ordinary fictional bid.
- **Re-buying a spell with a new trapping is breadth, not a tier** — frost Bolt and fire Bolt are different options with different riders, exactly like two Weapon Masters. Sidesteps the no-tiers rule cleanly.
- **Area magic = your cast vs. each target's Dexterity Save** (a contest), and **the Precision Die doesn't apply to area spells** — breadth trades the telling single blow. A precedent for all future area effects.
- **Rituals stay out** — the Adept can be built and played on spell-feats alone; ritual magic remains treasure, buildable later with no dependency on this.

---


---

## Gateway: Guardian

*You put yourself between danger and the people who need protecting. You hold the line when others break. You are the reason the party survives.*

> **Guardian (gateway feat)** — *Transformative Moment: a moment that made protecting others your purpose* · **30** XP 
> **Benefit (always on):** **Interpose** — once per round, when an ally within your reach is hit by an attack, you may **react** (spend **1 Action Die**) to take the hit in their place (the damage and any Follow-Up land on you instead). In addition, once per turn, when you spend an Action Die to boost a **Strength Save** roll, treat that die as if you rolled at least a **4**. *(Gateway-benefit pattern: a signature act — interposing — plus the boost-floor on the calling's signature roll, enduring physical force. The interpose is a reaction, reusing the reaction economy; MYD20's "advantage on physical resist" is folded into the boost-floor.)* 
> **Gateway HP bonus:** +6 (hardy — Guardians are built to absorb what's meant for others). 
> **Save profile:** Strength Save +3, Constitution Save +3, Charisma Save +1, Intelligence Save 0, Wisdom Save 0, **Dexterity Save −3** (an immovable bulwark — resolute of will, but cannot dodge). *(AC is separate — a Guardian's armour training would be an AC cluster feat.)*

**Opens the following cluster feats:**

> **Shield Wall** — *Guardian; requires a shield equipped* · **20** XP 
> **Trigger:** enemies attacking allies adjacent to you, while you wield a shield. 
> **Effect (Modifier):** adjacent enemies attacking your allies suffer **−3** (a Solid hindrance); adjacent allies gain **+3** to resist area effects. *(Porting note: "disadvantage to attackers / advantage to allies" → symmetric Modifier-Ladder steps, KD20's idiom for advantage.)*

> **Taunt** — *Guardian* · **20** XP 
> **Trigger (active — costs 1 Action Die):** an enemy that can see and hear you. 
> **Effect:** make a **contest** — your Presence/Persuasion vs. the target's **Charisma Save**. On a win, the enemy must direct its **next action at you** rather than your allies; on a **Decisive** win, it cannot ignore you for a second round. *(Porting note: MYD20's "once per scene" → an Action-Die cost; "Discipline save" → a Charisma Save contest — the will-vs-will clash, KD20's resistance idiom; crit → Decisive.)*

> **Bulwark** — *Guardian · CON 13; requires a Strength Save feat* · **20** XP 
> **Trigger:** an enemy tries to push, trip, knock down, or reposition you (a Universal Maneuver against you). 
> **Effect (Permission + Modifier):** you **cannot be moved against your will** by physical force while conscious; forced-movement maneuvers against you suffer **−5** (a Major hindrance). *(Porting note: ports cleanly; "significant disadvantage" → Major −5; the immovability is a Permission denial of the maneuver.)*

> **Guardian's Reach** — *Guardian; requires a Perception feat or Scout/Warrior cross-training* · **20** XP 
> **Trigger:** interposing (your gateway benefit), and warning an ally of danger. 
> **Effect:** you may **interpose for allies within a few units**, not just adjacent ones. Additionally (active — costs **1 Action Die**): call out a warning that grants one ally a **free Dexterity Save** against an effect they'd otherwise have no chance to avoid. *(Porting note: extends the gateway reaction's range; "once per scene warning" → Action-Die cost.)*

> **Retribution** — *Guardian; requires Shield Wall or a Warrior weapon feat* · **20** XP 
> **Trigger:** you take a hit while interposing for an ally (your gateway benefit). 
> **Effect:** your **next melee attack against that attacker** gains a **Specialization Die** — the fury of the protector. *(Porting note: "significant advantage" → the Specialization Die on the attack. Passes the four-point test: a new conditional trigger.)*

> **Unbreakable** — *Guardian · CON 14; requires Bulwark and a Strength Save feat* · **20** XP 
> **Trigger (active — costs 1 Action Die):** the moment you would be reduced to 0 HP (defeated). 
> **Effect:** spend **1 Action Die** to instead drop to **1 HP** and remain standing, with one action left before defeat. *(Porting note: MYD20's "once per session, when killed outright" → an Action-Die cost, per the standing ruling — the pool is the limiter. This is the Guardian's defeat-defiance, parallel to the Warrior's Iron Resilience; both fire* before *the 0-HP Defeat Options. Note it now interacts cleanly with the Defeat system: it's the "don't reach defeat yet" option.)*

> **Iron Aegis** — *Guardian; requires any three other Guardian feats* · **20** XP 
> **Trigger:** allies within your reach, while you are conscious and not defeated. 
> **Effect:** allies within reach add a **Specialization Die to their Save rolls** — your steadying presence. *(Porting note: "advantage on all saves" → the Specialization Die on Saves; depth-gated like Veteran's Eye — needs three other Guardian feats, a capstone.)*

---

## Gateway: Face

*People are your instrument. You read them, move them, charm them, deceive them, and inspire them — sometimes all at once. You are never the most dangerous person in a fight. You are frequently the most dangerous person in the building.*

> **Face (gateway feat)** — *Transformative Moment: a life that taught you to read and move people* · **30** XP 
> **Benefit (always on):** you always **read the emotional state and immediate wants** of anyone you speak with — not their secrets, but their mood and motive right now (a GM-narration benefit). In addition, once per turn, when you spend an Action Die to boost a **social roll** (Persuasion, Presence, or Deception — all Charisma; see *Capability Roll-Types*), treat that die as if you rolled at least a **4**. *(Gateway-benefit pattern: a signature read-people quirk + the boost-floor on the calling's signature act, social rolls.)* 
> **Gateway HP bonus:** +2 (fragile — the Face wins in the drawing room, not the melee). 
> **Save profile:** Charisma Save +3, Intelligence Save +3, Wisdom Save +1, Strength Save 0, Dexterity Save 0, **Constitution Save −3** (iron-willed and sharp-minded; no fighter's constitution).
>
> *Face is the generic social-operator gateway. Specific social identities — **Merchant, Noble, Con Artist, Diplomat** — are flavours of it: a campaign may stamp one on via the optional cultural/profession layer (a curated menu of these feats plus a signature or two), the same way "Warrior of the Polar Bear Clan" flavours Warrior. The trapping (honest charm vs. silver-tongued deception vs. commercial savvy) is the player's chosen fiction per the "chosen feat sets the fiction" rule.*

**Opens the following cluster feats:**

> **Silver Tongue** — *Face · CHA 13* · **20** XP 
> **Trigger:** a Persuasion roll where you're working someone around to your view. 
> **Effect:** add a **Specialization Die** to the Persuasion roll; on a success the target believes the conclusion is **their own idea** (they don't realise they were persuaded). *(Porting note: MYD20's "reroll on a near miss" → a Specialization Die, KD20's idiom — no rerolls; the never-realises effect ports as fiction.)*

> **Read the Room** — *Face; requires a Perception or Insight feat* · **20** XP 
> **Trigger:** entering a social situation. 
> **Effect (GM narration):** the GM tells you **who holds real power, who is most persuadable, and the underlying tension** in the room — no roll. *(Porting note: ports verbatim; pure GM-narration, like Veteran's Eye.)*

> **Impostor** — *Face · CHA 14; requires Silver Tongue* · **20** XP 
> **Trigger:** maintaining a false identity. 
> **Effect (Permission):** you can convincingly inhabit an assumed identity; holding the imposture needs **no roll** under normal circumstances. Only careful investigation or confrontation by someone who knows your true face forces a **contest**. *(Porting note: ports cleanly; a Permission — routine deception simply works.)*

> **The Right People** — *Face; requires Connections in your fiction* · **20** XP 
> **Trigger (active — costs 1 Action Die, or GM discretion between scenes):** in any settlement of moderate size or larger. 
> **Effect:** you **know someone useful here** — invoke a Connection; work with the GM to establish who they are and what they offer. *(Porting note: MYD20's "once per session" → an Action-Die cost or GM-gated between scenes, like the Scout's Shadow Network — a non-combat invoke.)*

> **Rattled** — *Face · CHA 13; requires an Insight feat* · **20** XP 
> **Trigger (active — your Action):** a target who can hear and understand you. 
> **Effect:** make a **contest** — your Persuasion/Presence vs. the target's **Charisma Save** (its composure and will). On a win, the target suffers **−3** on its next action (rattled); on a **Decisive** win, **−5** and it cannot simply ignore you. *(Porting note: "disadvantage / serious disadvantage" → Modifier-Ladder −3 / −5; "Discipline save" → a Charisma Save contest — getting under someone's skin is a will-vs-will clash; crit → Decisive. Social combat, resolved on the same contest + ladder machinery as a shove.)*

> **Crowd Control** — *Face; requires Rattled and a Presence feat* · **20** XP 
> **Trigger:** addressing a group rather than an individual. 
> **Effect:** your social rolls affect the **whole group** rather than one target — a successful roll shifts the emotional temperature of the entire room. *(Porting note: ports cleanly; a scope-widening of your social effect, like a Blast is to a Bolt. The Precision-equivalent single-target intensity doesn't apply — breadth over depth, per the area-effect precedent.)*

> **The Long Con** — *Face; requires any three other Face feats* · **20** XP 
> **Trigger:** running an extended deception over days or weeks. 
> **Effect:** a long con is an **extended task** (GM sets the DC and the successes needed; interval in days). A single failure doesn't blow your cover — it costs time and forces adjustment; only a **decisive failure** (miss by 10+) exposes you. *(Porting note: "catastrophic failure exposes you" → a decisive failure on the margin ladder; depth-gated capstone, three other Face feats.)*

---

## Translation Notes (Guardian & Face — additions to the record)

Two more gateways, confirming the idioms hold across defensive and social play:
- **Guardian proves the reaction economy carries a whole gateway.** Interpose, Guardian's Reach warnings, and Unbreakable all spend Action Dice as reactions — the Guardian is the party's answer to KD20's lethality, mitigating it through the pool (mutual support, as intended). Its defeat-defiance (Unbreakable) sits cleanly in front of the Defeat Options, parallel to the Warrior's Iron Resilience.
- **Face proves social conflict runs on the core contest + Modifier Ladder** — Rattled and Taunt are "social attacks" resolved exactly like a shove (a contest against the target's **Charisma Save**, with −3/−5 riders and a Decisive upgrade). No separate social subsystem needed; the unified engine reaches the social pillar. *(The social Saves are now the will/mind Saves by name: Taunt and Rattled contest the target's **Charisma Save** — their will to not be moved.)*
- **Face as a generic gateway + specific identities as cultural flavours** is the gateway-is-the-profession model working: one social calling, with Merchant/Noble/Con Artist as content-layer trappings rather than separate gateways.
- **"Reroll" → Specialization Die** confirmed (Silver Tongue) — KD20 never rerolls; it adds the conditional d6.
- **Group/area social effects drop the single-target intensity** (Crowd Control), mirroring the Blast-vs-Bolt area-effect precedent: breadth trades the telling single blow.

---

*KD20 Feats — working draft. Gateways complete: **Warrior** (combat, + Adrenaline Rush), **Scout** (exploration/permission), **Adept** (magic — spells-as-feats + trappings), **Guardian** (defensive/reaction economy), **Face** (social — generic social-operator, with Merchant/Noble/Con Artist as cultural flavours). Save vocabulary = stat-name Saves (v0.36). **Hardened Save** (the universal save-raising feat, scaled cost, the sanctioned defensive-height exception) added v0.37. Feat wording aligned to the **Capability Roll-Types** vocabulary v0.38. **AC feats authored v0.39** — Armour Training (+1/+2, armour-gated) and Unarmored Defense (10+dex+themed stat, light/no-armour-gated, gateway names the stat: Monk wis / Rogue-Swashbuckler cha / Barbarian con). Next gateways to build: **Monk, Rogue, Swashbuckler, Barbarian** (the homes of Unarmored Defense). Deferred: the active-feats architecture; the Ritual framework. Companion to Core Rules v0.39.*
