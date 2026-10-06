/**
 * One-off compendium seeding.
 *
 * The three KD20 compendium packs are declared in system.json and created empty
 * by Foundry on first load. This helper fills them with the reference content
 * from the design docs so there is something real to drag onto a sheet.
 *
 * This runs automatically once per world on first load. You can also re-run it
 * by hand from the console:   game.kd20.seedCompendiums()
 *
 * It is safe to run more than once — entries that already exist by name are
 * skipped rather than duplicated. Pass {force: true} to add them again anyway.
 *
 * All content below is taken from the design docs (Implementation Spec section 8
 * and KD20_Feats.md), not invented.
 */

/**
 * Bump this whenever the content below changes, to re-seed existing worlds with
 * the new entries. Existing entries are matched by name and left alone.
 */
export const CONTENT_VERSION = "7";

/** KD20_Feats.md, Adept "Spells and Trappings" — shared by the Bolt and Blast descriptions. */
const TRAPPINGS_HTML = "<p><strong>The trapping suggests the rider.</strong> On a Decisive or "
  + "Supreme cast, the spell's Follow-Up may impose a State that flows from its trapping "
  + "(GM-approved, from the standard menu):</p>"
  + "<table><thead><tr><th>Trapping</th><th>Suggested Decisive/Supreme rider</th></tr></thead><tbody>"
  + "<tr><td>Frost / cold</td><td><strong>Slow</strong> (Permission)</td></tr>"
  + "<tr><td>Fire</td><td><strong>−3 \"burning\"</strong> (Modifier) or ongoing damage</td></tr>"
  + "<tr><td>Force / thunder</td><td><strong>Prone</strong> (knockback) or <strong>Deafened</strong></td></tr>"
  + "<tr><td>Lightning</td><td>briefly <strong>Stunned</strong> <em>(strong — GM gates tightly)</em></td></tr>"
  + "<tr><td>Shadow / necrotic</td><td><strong>−3 \"withered\"</strong> (Modifier)</td></tr>"
  + "<tr><td>Light / radiant</td><td>briefly <strong>Blind</strong></td></tr>"
  + "</tbody></table>"
  + "<p>Trappings are otherwise pure fiction: igniting barrels or melting a lock is a GM "
  + "adjudication like any fictional bid, not a spell rule.</p>";

/** Exported so the build-time verification script can validate it against the schemas. */
export const PACK_CONTENT = {

  /* -------------------------------------------- */

  "kd20.gateways": [
    {
      name: "Warrior",
      type: "gateway",
      img: "icons/svg/sword.svg",
      system: {
        hpBonus: 6,
        // KD20_Rules.md v0.34, Gateway Save Profiles.
        saveProfile: { withstand: 3, fortitude: 3, reflexes: 1, composure: 0, resolve: -3, poise: 0 },
        costXp: 30,
        benefit: "<p>You are <strong>never unarmed</strong> — your body itself is a weapon "
          + "(unarmed strikes count as a weapon you are trained with, damage d4, and you may "
          + "take weapon feats for it).</p><p>In addition, <strong>once per turn, when you "
          + "would spend an Action Die to boost a melee attack roll, treat that die as if you "
          + "rolled at least a 4</strong>.</p>",
        description: "<p><em>You have dedicated yourself to the art of close combat — through "
          + "formal training, hard experience, or sheer bloody-mindedness, you understand "
          + "fighting in a way most people never will.</em></p>"
          + "<p>Transformative Moment: a life genuinely introduced to the calling of arms.</p>"
      }
    },
    {
      name: "Scout",
      type: "gateway",
      img: "icons/svg/wingfoot.svg",
      system: {
        hpBonus: 4,
        // KD20_Rules.md v0.34, Gateway Save Profiles.
        saveProfile: { withstand: 1, fortitude: 0, reflexes: 3, composure: 0, resolve: 3, poise: -3 },
        costXp: 30,
        benefit: "<p>You may <strong>attempt Stealth even while observed</strong>, so long as "
          + "there is <em>any</em> shadow, cover, or distraction to work with — a permission "
          + "others don't have.</p><p>In addition, <strong>once per turn, when you spend an "
          + "Action Die to boost a Stealth or a field-Perception roll, treat that die as if you "
          + "rolled at least a 4</strong>.</p>",
        description: "<p><em>You are at home in the shadows and the wilderness. You move where "
          + "others cannot, see what others miss, and are gone before anyone knew you were "
          + "there.</em></p>"
          + "<p>Transformative Moment: a life spent reading the land and living unseen.</p>"
      }
    },
    {
      name: "Adept",
      type: "gateway",
      img: "icons/svg/book.svg",
      system: {
        hpBonus: 2,
        // KD20_Rules.md v0.34, Gateway Save Profiles.
        saveProfile: { withstand: 0, fortitude: -3, reflexes: 0, composure: 3, resolve: 3, poise: 1 },
        costXp: 30,
        benefit: "<p>You can <strong>work magic at all</strong> — the base permission that "
          + "spellcasting requires; without an arcane gateway a character cannot take spell-feats "
          + "(they may still attempt found <em>rituals</em>, which are treasure, not feats). Your "
          + "spells are cast on <strong>1d20 + int</strong>.</p><p>In addition, <strong>once per "
          + "turn, when you spend an Action Die to boost a spell attack roll, treat that die as if "
          + "you rolled at least a 4</strong>.</p>",
        description: "<p><em>You have learned to reach past the ordinary and shape force by will "
          + "and study. Where others swing steel, you speak the world into doing what you want — a "
          + "bolt of ice, a burst of flame, a ward against harm.</em></p>"
          + "<p>Transformative Moment: a mind genuinely opened to the working of magic — an "
          + "apprenticeship, a revelation, a bargain.</p>"
      }
    },
    {
      name: "Guardian",
      type: "gateway",
      img: "icons/svg/holy-shield.svg",
      system: {
        hpBonus: 6,
        // KD20_Rules.md v0.34, Gateway Save Profiles.
        saveProfile: { withstand: 3, fortitude: 3, reflexes: -3, composure: 0, resolve: 1, poise: 0 },
        costXp: 30,
        benefit: "<p><strong>Interpose</strong> — once per round, when an ally within your reach "
          + "is hit by an attack, you may <strong>react</strong> (spend <strong>1 Action "
          + "Die</strong>) to take the hit in their place (the damage and any Follow-Up land on "
          + "you instead).</p><p>In addition, <strong>once per turn, when you spend an Action Die "
          + "to boost a Withstand resist roll, treat that die as if you rolled at least a "
          + "4</strong>.</p>",
        description: "<p><em>You put yourself between danger and the people who need protecting. "
          + "You hold the line when others break. You are the reason the party survives.</em></p>"
          + "<p>Transformative Moment: a moment that made protecting others your purpose.</p>"
      }
    },
    {
      name: "Face",
      type: "gateway",
      img: "icons/svg/card-joker.svg",
      system: {
        hpBonus: 2,
        // KD20_Rules.md v0.34, Gateway Save Profiles.
        saveProfile: { withstand: 0, fortitude: -3, reflexes: 0, composure: 3, resolve: 1, poise: 3 },
        costXp: 30,
        benefit: "<p>You always <strong>read the emotional state and immediate wants</strong> of "
          + "anyone you speak with — not their secrets, but their mood and motive right now (the "
          + "GM tells you).</p><p>In addition, <strong>once per turn, when you spend an Action Die "
          + "to boost a social roll, treat that die as if you rolled at least a 4</strong>.</p>",
        description: "<p><em>People are your instrument. You read them, move them, charm them, "
          + "deceive them, and inspire them — sometimes all at once. You are never the most "
          + "dangerous person in a fight. You are frequently the most dangerous person in the "
          + "building.</em></p>"
          + "<p>Transformative Moment: a life that taught you to read and move people.</p>"
          + "<p>Face is the generic social-operator gateway. Specific social identities — "
          + "<strong>Merchant, Noble, Con Artist, Diplomat</strong> — are flavours of it, which a "
          + "campaign may stamp on via the optional cultural/profession layer. Whether your "
          + "charm is honest, silver-tongued deception, or commercial savvy is your chosen "
          + "fiction.</p>"
      }
    }
  ],

  /* -------------------------------------------- */

  "kd20.feats": [
    {
      name: "Weapon Master",
      type: "feat",
      img: "icons/svg/sword.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Warrior",
        trigger: "Attacking with a chosen weapon type (blades, axes, blunt, polearms, bows "
          + "or unarmed — pick one per purchase).",
        effect: "<p>Add a <strong>Specialization Die</strong> to the attack roll.</p>",
        description: "<p>May be taken multiple times, once per weapon type.</p>"
      }
    },
    {
      name: "Brutal Strike",
      type: "feat",
      img: "icons/svg/target.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // This feat widens the Follow-Up menu; it does not grant a die.
        grantsSpecializationDie: false,
        prerequisite: "Warrior · STR 14; requires Weapon Master",
        trigger: "A Decisive or Supreme melee attack.",
        effect: "<p>The hit's <strong>Follow-Up</strong> may impose a State that flows from "
          + "the blow — your choice of <strong>Prone</strong>, <strong>Disarmed</strong>, or a "
          + "Modifier-lever −3 \"staggered\".</p><p>On a Supreme, the Follow-Up comes "
          + "<em>in addition</em> to the Precision Die.</p>",
        description: ""
      }
    },
    {
      name: "Steel Discipline",
      type: "feat",
      img: "icons/svg/statue.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Warrior; requires a Withstand resist feat",
        trigger: "You are subjected to a physical effect you resist with Withstand.",
        effect: "<p>Add a <strong>Specialization Die</strong> to the Withstand roll.</p>"
          + "<p>On a <strong>Decisive</strong> resist, you may immediately make a "
          + "<strong>free contest</strong> (a Follow-Up) against the source of the effect.</p>",
        description: ""
      }
    },
    {
      name: "Battle Awareness",
      type: "feat",
      img: "icons/svg/eye.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Warrior",
        trigger: "The start of combat, and Perception rolls made during combat.",
        effect: "<p>You cannot be <strong>surprised</strong>, and you add a "
          + "<strong>Specialization Die</strong> to initiative and to in-combat Perception rolls.</p>",
        description: ""
      }
    },
    {
      name: "Cleave",
      type: "feat",
      img: "icons/svg/thrust.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Grants a free Follow-Up attack, not a die.
        grantsSpecializationDie: false,
        prerequisite: "Warrior · STR 13; requires Weapon Master",
        trigger: "You drop an enemy to 0 HP with a melee attack.",
        effect: "<p>Take a <strong>free Follow-Up attack</strong> against another enemy within "
          + "your Zone of Control. This attack cannot itself trigger Cleave.</p>",
        description: ""
      }
    },
    {
      name: "Iron Resilience",
      type: "feat",
      img: "icons/svg/regen.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Warrior · CON 13; requires an Endurance/Withstand resist feat",
        trigger: "(Active — costs 1 Action Die) The moment you would be reduced to 0 HP "
          + "(defeated).",
        effect: "<p>Spend <strong>1 Action Die</strong> to instead remain standing at 1 HP with "
          + "one action left before defeat.</p><p>Additionally (passive): physical "
          + "<strong>States</strong> afflicting you end <strong>one step / one turn faster</strong> "
          + "than they otherwise would.</p>",
        description: ""
      }
    },
    {
      name: "Veteran's Eye",
      type: "feat",
      img: "icons/svg/dice-target.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Pure GM narration; no die.
        grantsSpecializationDie: false,
        prerequisite: "Warrior; requires any three other Warrior feats",
        trigger: "Combat begins, and you can see a foe.",
        effect: "<p>The GM tells you <strong>one</strong> of: the foe's approximate power level, "
          + "its most dangerous ability, or its most obvious weakness — your choice. Pure "
          + "GM-narration; no die.</p>",
        description: ""
      }
    },
    {
      name: "Adrenaline Rush",
      type: "feat",
      img: "icons/svg/heal.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Spends an Action Die to heal; it does not add a Specialization Die.
        grantsSpecializationDie: false,
        prerequisite: "Warrior",
        trigger: "(Active — costs 1 Action Die) Once per combat scene, as the adrenaline hits.",
        effect: "<p>Spend <strong>1 Action Die</strong> and <strong>heal HP equal to that die's "
          + "roll</strong> (a d6 — recovering stamina, grit, and second wind, not knitting flesh).</p>",
        description: "<p>Shared-library martial feat — available to other fighter-type gateways' "
          + "menus, but not mandatory on each.</p>"
      }
    },
    {
      name: "Ghost Step",
      type: "feat",
      img: "icons/svg/sound-off.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Scout; requires Stealth-based movement in your kit",
        trigger: "Moving while hidden or trying to stay unheard.",
        effect: "<p><em>(Permission + Modifier)</em> Your movement makes <strong>no sound</strong> "
          + "regardless of surface — anyone trying to detect you <em>by hearing</em> cannot, and "
          + "you add a <strong>Specialization Die</strong> to Stealth rolls that turn on staying "
          + "unheard.</p>",
        description: ""
      }
    },
    {
      name: "Ambush Predator",
      type: "feat",
      img: "icons/svg/trap.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Scout · DEX 14; requires Ghost Step",
        trigger: "Attacking a target that is unaware of you (from concealment/surprise).",
        effect: "<p>Add a <strong>Specialization Die</strong> to that first attack, "
          + "<strong>and</strong> a Decisive/Supreme ambush hit may take a "
          + "<strong>Follow-Up</strong> imposing a State (Prone, staggered −3, or — if the "
          + "fiction supports it — briefly <strong>Stunned</strong>).</p>",
        description: ""
      }
    },
    {
      name: "Tracker",
      type: "feat",
      img: "icons/svg/pawprint.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Scout · WIS 13",
        trigger: "Following a trail or tracking a quarry.",
        effect: "<p>Add a <strong>Specialization Die</strong> to tracking rolls; you can follow "
          + "trails up to a week old, and on an extended tracking task the GM grants extra "
          + "<strong>margin for error</strong> before consequences trigger.</p>",
        description: ""
      }
    },
    {
      name: "Vanish",
      type: "feat",
      img: "icons/svg/invisible.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // A Permission-State, not a die.
        grantsSpecializationDie: false,
        prerequisite: "Scout · DEX 14; requires Ghost Step",
        trigger: "(Active — costs 1 Action Die) As your Action, in any environment with cover, "
          + "shadow, or a distraction.",
        effect: "<p><em>(Permission)</em> You become <strong>Hidden</strong> even in plain sight — "
          + "a Permission-State that lasts until you act or circumstances change.</p>",
        description: ""
      }
    },
    {
      name: "Eagle Eye",
      type: "feat",
      img: "icons/svg/wing.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Scout · WIS 14; requires Tracker or a Perception feat",
        trigger: "Perception rolls limited by distance or darkness; and passive awareness.",
        effect: "<p><em>(Permission + Modifier)</em> Distance and darkness no longer hinder your "
          + "Perception; you <strong>passively notice</strong> concealed things (the GM tells you "
          + "<em>something</em> is there, not what); and you can read lips at any distance you "
          + "can see a face clearly.</p><p>Add a <strong>Specialization Die</strong> when "
          + "actively searching.</p>",
        description: ""
      }
    },
    {
      name: "Wilderness Craft",
      type: "feat",
      img: "icons/svg/oak.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // A Permission: survival rolls are switched off, not boosted.
        grantsSpecializationDie: false,
        prerequisite: "Scout · WIS 13; requires Tracker",
        trigger: "Sustaining yourself and companions in a natural environment.",
        effect: "<p><em>(Permission)</em> You can feed, water, and shelter <strong>yourself and "
          + "up to four companions indefinitely</strong> in any natural environment — routine "
          + "survival simply isn't in question for your group.</p>",
        description: ""
      }
    },
    {
      name: "Shadow Network",
      type: "feat",
      img: "icons/svg/cowled.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Pure GM narration; no die.
        grantsSpecializationDie: false,
        prerequisite: "Scout · CHA 13; requires any three other Scout feats",
        trigger: "(Active — costs 1 Action Die of a fresh session's pool, or GM discretion "
          + "between adventures) You consult your contacts about a region you've previously "
          + "operated in.",
        effect: "<p>Ask the GM <strong>one question</strong> about the location, movements, or "
          + "activities of any person or group in that region; the GM answers honestly with the "
          + "best information your network could realistically have.</p>",
        description: ""
      }
    },
    {
      name: "Bolt",
      type: "feat",
      img: "icons/svg/lightning.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Adept · INT 13",
        trigger: "You cast it at a single target in range (a ranged spell attack).",
        effect: "<p>Attack <strong>1d20 + int + a Specialization Die</strong>; on a hit, "
          + "<strong>d8 + int</strong> damage, <strong>Precision d8</strong> on a "
          + "Decisive/Supreme. Range ~15 units.</p><p>A Decisive/Supreme Follow-Up may impose the "
          + "trapping's rider State (see below).</p>",
        description: "<p>Choose a trapping at purchase; may be taken again with a different "
          + "trapping.</p>" + TRAPPINGS_HTML
      }
    },
    {
      name: "Blast",
      type: "feat",
      img: "icons/svg/explosion.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Targets resist the caster's total; no Specialization Die is added.
        grantsSpecializationDie: false,
        prerequisite: "Adept · INT 14; requires Bolt",
        trigger: "You cast it at an area (a burst ~3 units across, or a cone) within range.",
        effect: "<p>Every actor in the area makes a <strong>Reflexes resist</strong> (1d20 + dex "
          + "vs. your cast total). On a failure: <strong>d6 + int</strong> damage. On your "
          + "<strong>Decisive/Supreme</strong> cast, those who failed also suffer the trapping's "
          + "rider State (see below).</p><p>The Precision Die does not apply to area spells.</p>",
        description: "<p>Choose a trapping at purchase; may be retaken with a different "
          + "trapping.</p>" + TRAPPINGS_HTML
      }
    },
    {
      name: "Ward",
      type: "feat",
      img: "icons/svg/mage-shield.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // A Modifier-Ladder step on someone else's roll, not a die.
        grantsSpecializationDie: false,
        prerequisite: "Adept · INT 13",
        trigger: "(Active — costs 1 Action Die) As a reaction to an incoming attack or harmful "
          + "effect against you or an ally in reach.",
        effect: "<p><em>(Modifier)</em> Conjure a shield of force — impose a <strong>−3 "
          + "(Solid)</strong> hindrance on the attacker's roll, or grant <strong>+3</strong> to an "
          + "ally's resist against the effect.</p>",
        description: ""
      }
    },
    {
      name: "Cantrip",
      type: "feat",
      img: "icons/svg/light.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Adept · INT 11",
        trigger: "Minor magical effects at will — light a flame, chill a drink, lift a small "
          + "object, send a whisper, mend a crack.",
        effect: "<p><em>(Permission)</em> You can produce small, non-combat magical effects "
          + "appropriate to your study, no roll needed when there are no stakes; a contested or "
          + "risky use rolls <strong>1d20 + int</strong>.</p>",
        description: ""
      }
    },
    {
      name: "Shield Wall",
      type: "feat",
      img: "icons/svg/shield.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Modifier-Ladder steps on others' rolls, not a die.
        grantsSpecializationDie: false,
        prerequisite: "Guardian; requires a shield equipped",
        trigger: "Enemies attacking allies adjacent to you, while you wield a shield.",
        effect: "<p><em>(Modifier)</em> Adjacent enemies attacking your allies suffer "
          + "<strong>−3</strong> (a Solid hindrance); adjacent allies gain <strong>+3</strong> to "
          + "resist area effects.</p>",
        description: ""
      }
    },
    {
      name: "Taunt",
      type: "feat",
      img: "icons/svg/terror.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Guardian",
        trigger: "(Active — costs 1 Action Die) An enemy that can see and hear you.",
        effect: "<p>Make a <strong>contest</strong> — your Presence/Persuasion vs. the target's "
          + "Resolve. On a win, the enemy must direct its <strong>next action at you</strong> "
          + "rather than your allies; on a <strong>Decisive</strong> win, it cannot ignore you for "
          + "a second round.</p>",
        description: ""
      }
    },
    {
      name: "Bulwark",
      type: "feat",
      img: "icons/svg/anchor.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Guardian · CON 13; requires a Withstand resist feat",
        trigger: "An enemy tries to push, trip, knock down, or reposition you (a Universal "
          + "Maneuver against you).",
        effect: "<p><em>(Permission + Modifier)</em> You <strong>cannot be moved against your "
          + "will</strong> by physical force while conscious; forced-movement maneuvers against "
          + "you suffer <strong>−5</strong> (a Major hindrance).</p>",
        description: ""
      }
    },
    {
      name: "Guardian's Reach",
      type: "feat",
      img: "icons/svg/wall-direction.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Guardian; requires a Perception feat or Scout/Warrior cross-training",
        trigger: "Interposing (your gateway benefit), and warning an ally of danger.",
        effect: "<p>You may <strong>interpose for allies within a few units</strong>, not just "
          + "adjacent ones.</p><p>Additionally (active — costs <strong>1 Action Die</strong>): "
          + "call out a warning that grants one ally a <strong>free Reflexes resist</strong> "
          + "against an effect they'd otherwise have no chance to avoid.</p>",
        description: ""
      }
    },
    {
      name: "Retribution",
      type: "feat",
      img: "icons/svg/fire-shield.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Guardian; requires Shield Wall or a Warrior weapon feat",
        trigger: "You take a hit while interposing for an ally (your gateway benefit).",
        effect: "<p>Your <strong>next melee attack against that attacker</strong> gains a "
          + "<strong>Specialization Die</strong> — the fury of the protector.</p>",
        description: ""
      }
    },
    {
      name: "Unbreakable",
      type: "feat",
      img: "icons/svg/stoned.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Guardian · CON 14; requires Bulwark and a Withstand resist feat",
        trigger: "(Active — costs 1 Action Die) The moment you would be reduced to 0 HP "
          + "(defeated).",
        effect: "<p>Spend <strong>1 Action Die</strong> to instead drop to <strong>1 HP</strong> "
          + "and remain standing, with one action left before defeat.</p><p>Fires "
          + "<em>before</em> the 0-HP Defeat Options.</p>",
        description: ""
      }
    },
    {
      name: "Iron Aegis",
      type: "feat",
      img: "icons/svg/aura.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // The d6 goes on allies' resist rolls, not the Guardian's own.
        grantsSpecializationDie: false,
        prerequisite: "Guardian; requires any three other Guardian feats",
        trigger: "Allies within your reach, while you are conscious and not defeated.",
        effect: "<p>Allies within reach add a <strong>Specialization Die to their resist "
          + "rolls</strong> — your steadying presence.</p>",
        description: ""
      }
    },
    {
      name: "Silver Tongue",
      type: "feat",
      img: "icons/svg/sound.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: true,
        prerequisite: "Face · CHA 13",
        trigger: "A Persuasion roll where you're working someone around to your view.",
        effect: "<p>Add a <strong>Specialization Die</strong> to the Persuasion roll; on a success "
          + "the target believes the conclusion is <strong>their own idea</strong> (they don't "
          + "realise they were persuaded).</p>",
        description: ""
      }
    },
    {
      name: "Read the Room",
      type: "feat",
      img: "icons/svg/tankard.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Pure GM narration; no roll, no die.
        grantsSpecializationDie: false,
        prerequisite: "Face; requires a Perception or Insight feat",
        trigger: "Entering a social situation.",
        effect: "<p><em>(GM narration)</em> The GM tells you <strong>who holds real power, who "
          + "is most persuadable, and the underlying tension</strong> in the room — no roll.</p>",
        description: ""
      }
    },
    {
      name: "Impostor",
      type: "feat",
      img: "icons/svg/mystery-man-black.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // A Permission: the routine roll is switched off, not boosted.
        grantsSpecializationDie: false,
        prerequisite: "Face · CHA 14; requires Silver Tongue",
        trigger: "Maintaining a false identity.",
        effect: "<p><em>(Permission)</em> You can convincingly inhabit an assumed identity; "
          + "holding the imposture needs <strong>no roll</strong> under normal circumstances. "
          + "Only careful investigation or confrontation by someone who knows your true face "
          + "forces a <strong>contest</strong>.</p>",
        description: ""
      }
    },
    {
      name: "The Right People",
      type: "feat",
      img: "icons/svg/city.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Face; requires Connections in your fiction",
        trigger: "(Active — costs 1 Action Die, or GM discretion between scenes) In any "
          + "settlement of moderate size or larger.",
        effect: "<p>You <strong>know someone useful here</strong> — invoke a Connection; work "
          + "with the GM to establish who they are and what they offer.</p>",
        description: ""
      }
    },
    {
      name: "Rattled",
      type: "feat",
      img: "icons/svg/daze.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // A Modifier-Ladder step on the target's roll, not a die.
        grantsSpecializationDie: false,
        prerequisite: "Face · CHA 13; requires a Composure or Insight feat",
        trigger: "(Active — your Action) A target who can hear and understand you.",
        effect: "<p>Make a <strong>contest</strong> — your Persuasion/Presence vs. the target's "
          + "Resolve/Composure. On a win, the target suffers <strong>−3</strong> on its next "
          + "action (rattled); on a <strong>Decisive</strong> win, <strong>−5</strong> and it "
          + "cannot simply ignore you.</p>",
        description: ""
      }
    },
    {
      name: "Crowd Control",
      type: "feat",
      img: "icons/svg/tower-flag.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        // Widens scope rather than adding a die — breadth over depth, like Blast.
        grantsSpecializationDie: false,
        prerequisite: "Face; requires Rattled and a Presence feat",
        trigger: "Addressing a group rather than an individual.",
        effect: "<p>Your social rolls affect the <strong>whole group</strong> rather than one "
          + "target — a successful roll shifts the emotional temperature of the entire "
          + "room.</p><p>Single-target intensity doesn't apply: breadth over depth.</p>",
        description: ""
      }
    },
    {
      name: "The Long Con",
      type: "feat",
      img: "icons/svg/card-hand.svg",
      system: {
        featType: "cluster",
        costXp: 20,
        grantsSpecializationDie: false,
        prerequisite: "Face; requires any three other Face feats",
        trigger: "Running an extended deception over days or weeks.",
        effect: "<p>The con is an <strong>extended task</strong> (the GM sets the DC and the "
          + "successes needed; interval in days). A single failure doesn't blow your cover — it "
          + "costs time and forces adjustment; only a <strong>decisive failure</strong> (miss by "
          + "10+) exposes you.</p>",
        description: ""
      }
    },
    {
      name: "Master Feat",
      type: "feat",
      img: "icons/svg/upgrade.svg",
      system: {
        featType: "master",
        costXp: 40,
        grantsSpecializationDie: true,
        prerequisite: "Any one cluster feat you already own",
        trigger: "A narrower signature circumstance you carve out of the chosen feat's trigger.",
        effect: "<p>That narrowed trigger gains a <strong>second Specialization Die</strong> — "
          + "the only place two dice stack.</p>"
          + "<p><em>Not automated in v1: the system still adds only one die.</em></p>",
        description: "<p>One Master Feat per character, ever. No retraining, no refund.</p>"
      }
    }
  ],

  /* -------------------------------------------- */

  "kd20.weapons": [
    {
      name: "Short Sword",
      type: "weapon",
      img: "icons/svg/sword.svg",
      system: {
        damageDie: "d6",
        precisionDie: "d10",
        attackStat: "str",
        damageStat: "str",
        reach: 1,
        properties: "Parry; Finesse (Strength or Dexterity)",
        description: "<p>A short, straight blade. Being finesse, it may use Strength or "
          + "Dexterity — v1 stores one choice, so switch the stat above if you want the other.</p>"
      }
    }
  ]
};

/* -------------------------------------------- */

/**
 * Populate the KD20 compendium packs with reference content.
 * @param {object} [options]
 * @param {boolean} [options.force=false]  Add entries even if a matching name already exists.
 * @returns {Promise<{created: number, skipped: number}>}
 */
export async function seedCompendiums({ force = false } = {}) {
  if ( !game.user.isGM ) {
    ui.notifications.error("KD20 | Only a gamemaster can seed the compendium packs.");
    return { created: 0, skipped: 0 };
  }

  const Item = foundry.documents.Item.implementation;
  let created = 0;
  let skipped = 0;

  for ( const [packId, entries] of Object.entries(PACK_CONTENT) ) {
    const pack = game.packs.get(packId);
    if ( !pack ) {
      console.warn(`KD20 | Compendium pack "${packId}" not found — skipping.`);
      continue;
    }

    // System packs are locked by default. Unlock, write, then lock again.
    const wasLocked = pack.locked;
    if ( wasLocked ) await pack.configure({ locked: false });

    try {
      const index = await pack.getIndex();
      const existing = new Set(index.map(e => e.name));
      const toCreate = force ? entries : entries.filter(e => !existing.has(e.name));

      skipped += entries.length - toCreate.length;
      if ( toCreate.length ) {
        await Item.createDocuments(toCreate, { pack: packId });
        created += toCreate.length;
      }
    } finally {
      if ( wasLocked ) await pack.configure({ locked: true });
    }
  }

  const msg = `KD20 | Compendiums seeded: ${created} created, ${skipped} already present.`;
  console.log(msg);
  ui.notifications.info(msg);
  return { created, skipped };
}

/* -------------------------------------------- */

/**
 * Core rules v0.34: give already-existing copies of the five seeded gateways
 * their Save profile. Seeding skips entries that exist by name, and copies
 * dragged onto characters are separate documents, so neither picks up new seed
 * values on their own.
 *
 * Fills in the compendium entries, world Items, and gateways owned by world
 * Actors — but ONLY where the name matches a seeded gateway and all six profile
 * steps are still 0. A profile anyone has edited by hand is never touched.
 *
 * Safe to run more than once:   game.kd20.backfillSaveProfiles()
 *
 * @returns {Promise<number>}  How many gateways were updated.
 */
export async function backfillSaveProfiles() {
  if ( !game.user.isGM ) return 0;

  const profiles = Object.fromEntries(PACK_CONTENT["kd20.gateways"]
    .map(e => [e.name, e.system.saveProfile]));
  const needsProfile = item => (item.type === "gateway") && (item.name in profiles)
    && Object.values(item.system.saveProfile ?? {}).every(v => v === 0);
  const update = item => ({ _id: item.id, "system.saveProfile": profiles[item.name] });
  const Item = foundry.documents.Item.implementation;
  let updated = 0;

  // The compendium. System packs are locked by default: unlock, write, re-lock.
  const pack = game.packs.get("kd20.gateways");
  if ( pack ) {
    const targets = (await pack.getDocuments()).filter(needsProfile);
    if ( targets.length ) {
      const wasLocked = pack.locked;
      if ( wasLocked ) await pack.configure({ locked: false });
      try {
        await Item.updateDocuments(targets.map(update), { pack: pack.collection });
        updated += targets.length;
      } finally {
        if ( wasLocked ) await pack.configure({ locked: true });
      }
    }
  }

  // Gateways in the world Items sidebar.
  const worldTargets = game.items.filter(needsProfile);
  if ( worldTargets.length ) {
    await Item.updateDocuments(worldTargets.map(update));
    updated += worldTargets.length;
  }

  // Gateways owned by world Actors.
  // TODO: unlinked tokens' synthetic actors on scenes are not covered.
  for ( const actor of game.actors ) {
    const targets = actor.items.filter(needsProfile);
    if ( !targets.length ) continue;
    await actor.updateEmbeddedDocuments("Item", targets.map(update));
    updated += targets.length;
  }

  const msg = `KD20 | Save profiles filled in on ${updated} existing gateway(s).`;
  console.log(msg);
  if ( updated ) ui.notifications.info(msg);
  return updated;
}
