/**
 * Build-time verification for KD20.
 *
 * This is a DEVELOPMENT TOOL, not part of the shipped system. Foundry never
 * loads it (it is not listed in system.json).
 *
 * It borrows Foundry's own real DataModel and field classes from the installed
 * application, builds every KD20 data model for real, and validates the seeded
 * compendium content against those schemas. That catches typos, bad enum
 * choices and type errors before Foundry ever sees them.
 *
 * Run with:
 *   node tools/verify.mjs "E:/Foundry Virtual Tabletop/resources/app"
 */

const appPath = (process.argv[2] ?? "E:/Foundry Virtual Tabletop/resources/app").replace(/\\/g, "/");
const appUrl = p => `file:///${appPath}/${p}`;

let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL    ${msg}`); };
const pass = msg => console.log(`  OK      ${msg}`);

/* -------------------------------------------- */
/*  Stand up just enough of the Foundry globals */
/* -------------------------------------------- */

// Foundry extends built-in prototypes (Array#filterJoin, String#titleCase, ...).
// Its data models rely on those, so install them before anything else.
await import(appUrl("common/primitives/_module.mjs"));

const fields = await import(appUrl("common/data/fields.mjs"));
const abstract = await import(appUrl("common/abstract/_module.mjs"));
const utils = await import(appUrl("common/utils/_module.mjs"));
const CONST = await import(appUrl("common/constants.mjs"));

globalThis.CONST = CONST;
globalThis.foundry = {
  data: { fields, validators: await import(appUrl("common/data/validators.mjs")) },
  abstract,
  utils,
  CONST
};
// Some field initialisers call the global localizer; stub it to identity.
globalThis.game = { i18n: { localize: s => s, format: s => s, has: () => false } };

/* -------------------------------------------- */
/*  Load the KD20 data models                   */
/* -------------------------------------------- */

const models = {
  character: (await import("../module/data/actor-character.mjs")).default,
  gateway: (await import("../module/data/item-gateway.mjs")).default,
  feat: (await import("../module/data/item-feat.mjs")).default,
  weapon: (await import("../module/data/item-weapon.mjs")).default,
  armour: (await import("../module/data/item-armour.mjs")).default
};

console.log("=== Schemas build and expose the expected fields ===");

/** Spec sections 2-4: the fields each model must have. */
const EXPECTED = {
  character: ["stats", "hp", "defence", "actionDice", "xp", "conditions", "biography"],
  gateway: ["description", "hpBonus", "saveProfile", "unarmoredStat", "benefit", "costXp"],
  feat: ["description", "featType", "trigger", "effect", "grantsSpecializationDie",
    "prerequisite", "costXp", "mechanic", "deity", "vow", "dormant"],
  weapon: ["description", "damageDie", "precisionDie", "attackStat", "damageStat",
    "reach", "properties"],
  armour: ["description", "category", "armourBonus", "isShield", "equipped"]
};

const schemas = {};
for ( const [name, cls] of Object.entries(models) ) {
  try {
    const schema = new fields.SchemaField(cls.defineSchema());
    schemas[name] = schema;
    const actual = Object.keys(schema.fields);
    const missing = EXPECTED[name].filter(f => !actual.includes(f));
    const extra = actual.filter(f => !EXPECTED[name].includes(f));
    if ( missing.length ) fail(`${name}: missing field(s) ${missing.join(", ")}`);
    else if ( extra.length ) fail(`${name}: unexpected field(s) ${extra.join(", ")}`);
    else pass(`${name}: ${actual.join(", ")}`);
  } catch ( e ) {
    fail(`${name}: schema failed to build :: ${e.message}`);
  }
}

/* -------------------------------------------- */
/*  Defaults match the spec                     */
/* -------------------------------------------- */

console.log("\n=== Spec defaults ===");
const defaults = {};
for ( const [name, schema] of Object.entries(schemas) ) {
  defaults[name] = schema.getInitialValue({});
}

const checkDefault = (path, got, want) => {
  if ( got === want ) pass(`${path} = ${got}`);
  else fail(`${path} = ${got}, expected ${want}`);
};

checkDefault("character stats.str.score", defaults.character.stats.str.score, 10);
checkDefault("character actionDice.value", defaults.character.actionDice.value, 5);
checkDefault("character actionDice.refresh", defaults.character.actionDice.refresh, 5);
checkDefault("gateway costXp (spec 4a: 30)", defaults.gateway.costXp, 30);
checkDefault("feat costXp (spec 4b: 20)", defaults.feat.costXp, 20);
checkDefault("weapon reach (spec 4c: 1)", defaults.weapon.reach, 1);
checkDefault("weapon damageDie (legacy single die still the default)", defaults.weapon.damageDie, "d6");
checkDefault("armour starts unequipped", defaults.armour.equipped, false);
checkDefault("armour isShield", defaults.armour.isShield, false);
checkDefault("character defence keeps only misc", Object.keys(defaults.character.defence).join(","), "misc");

/* -------------------------------------------- */
/*  Seeded compendium content validates         */
/* -------------------------------------------- */

console.log("\n=== Seeded compendium content validates against the schemas ===");
const { PACK_CONTENT } = await import("../module/seed-content.mjs");

for ( const [packId, entries] of Object.entries(PACK_CONTENT) ) {
  for ( const entry of entries ) {
    const schema = schemas[entry.type];
    if ( !schema ) { fail(`${entry.name}: unknown item type "${entry.type}"`); continue; }
    try {
      // strict cleaning surfaces unknown keys; validate() surfaces bad values.
      const cleaned = schema.clean(utils.deepClone(entry.system));
      const failure = schema.validate(cleaned, { strict: true });
      if ( failure ) fail(`${entry.name} (${entry.type}): ${failure.message}`);
      else {
        // Confirm no key was silently dropped as unrecognised.
        const dropped = Object.keys(entry.system).filter(k => !(k in cleaned));
        if ( dropped.length ) fail(`${entry.name}: unknown field(s) ${dropped.join(", ")}`);
        else pass(`${packId} / ${entry.name} (${entry.type})`);
      }
    } catch ( e ) {
      fail(`${entry.name} (${entry.type}) threw :: ${e.message}`);
    }
  }
}

console.log("\n=== Seeded gateway Save profiles match KD20_Rules.md ===");
{
  const fs = await import("node:fs");
  const rules = fs.readFileSync(new URL("../docs/KD20_Rules.md", import.meta.url), "utf8");
  // The "five built gateways' Save profiles" table. Columns are read by their
  // header ("Str Save", "Dex Save", ...) so the doc's column order never matters:
  // | Gateway | Str Save | Dex Save | Con Save | Int Save | Wis Save | Cha Save |
  // | **Warrior** | +3 | +1 | +3 | 0 | 0 | **−3** |
  const { SAVE_KEYS: keys, SAVE_STATS } = await import("../module/config.mjs");
  const header = rules.match(/^\| Gateway \|((?: \w+ Save \|){6})\s*$/m);
  const columns = (header?.[1] ?? "").split("|").map(c => c.trim()).filter(Boolean)
    .map(c => keys.find(k => SAVE_STATS[k] === c.split(" ")[0].toLowerCase()));
  if ( (columns.length !== 6) || columns.some(k => !k) ) fail(`could not read the profile table header: ${header?.[0]}`);
  const table = {};
  for ( const m of rules.matchAll(/^\| \*\*(\w+)\*\* \|((?: [^|]+ \|){6})\s*$/gm) ) {
    const cells = m[2].split("|").map(c => c.replace(/\*/g, "").replace("−", "-").trim()).filter(Boolean);
    if ( cells.every(c => /^[+-]?\d+$/.test(c)) ) table[m[1]] = Object.fromEntries(columns.map((k, i) => [k, Number(cells[i])]));
  }
  const gateways = PACK_CONTENT["kd20.gateways"];
  if ( Object.keys(table).length !== 5 ) fail(`expected 5 profile rows in the rules doc, found ${Object.keys(table).join(", ")}`);
  for ( const g of gateways ) {
    const want = table[g.name];
    const got = g.system.saveProfile;
    if ( !want ) { fail(`${g.name}: no profile row in KD20_Rules.md`); continue; }
    const same = keys.every(k => got?.[k] === want[k]);
    same ? pass(`${g.name} profile matches the rules table`)
      : fail(`${g.name} profile ${JSON.stringify(got)} != rules ${JSON.stringify(want)}`);
    // The fixed template: two +3, one +1, two 0, one -3.
    const shape = keys.map(k => got?.[k]).sort((a, b) => a - b).join(",");
    shape === "-3,0,0,1,3,3" ? pass(`${g.name} profile follows the fixed template`)
      : fail(`${g.name} profile shape ${shape}`);
  }
}

/* -------------------------------------------- */
/*  Derived maths matches the spec              */
/* -------------------------------------------- */

console.log("\n=== Spec 8: Bran the Warrior, through the real model ===");
{
  const CharacterModel = models.character;
  // Build a real model instance. A fake parent supplies the Gateway item so the
  // HP bonus path is exercised exactly as it will be in Foundry.
  const bran = new CharacterModel({
    stats: { str: { score: 15 }, dex: { score: 13 }, con: { score: 14 },
      int: { score: 10 }, wis: { score: 12 }, cha: { score: 11 } },
    hp: { value: 19 },
    defence: { misc: 0 }
  }, { parent: null });

  // prepareDerivedData reads this.parent.items; emulate an owned Warrior gateway
  // and Bran's armour +2 as equipped Chain Mail (core rules v0.39: AC reads gear).
  Object.defineProperty(bran, "parent", {
    value: { items: [{ type: "gateway", system: { hpBonus: 6 } },
      { type: "armour", name: "Chain Mail", system: { category: "medium", armourBonus: 2, isShield: false, equipped: true } }] },
    configurable: true
  });
  bran.prepareDerivedData();

  const expect = (label, got, want) => got === want ? pass(`${label} = ${got}`)
    : fail(`${label} = ${got}, expected ${want}`);

  expect("str bonus", bran.stats.str.bonus, 2);
  expect("dex bonus", bran.stats.dex.bonus, 1);
  expect("con bonus", bran.stats.con.bonus, 2);
  expect("int bonus", bran.stats.int.bonus, 0);
  expect("wis bonus", bran.stats.wis.bonus, 1);
  expect("cha bonus", bran.stats.cha.bonus, 0);
  expect("gatewayHpBonus", bran.gatewayHpBonus, 6);
  expect("AC", bran.ac, 13);
  expect("HP max", bran.hp.max, 19);
  expect("Initiative bonus", bran.initiative.bonus, 1);
}

console.log("\n=== Spec 2: stat bonus across the full range ===");
{
  const CharacterModel = models.character;
  const table = { 3: -4, 8: -1, 9: -1, 10: 0, 11: 0, 12: 1, 13: 1, 14: 2,
    15: 2, 16: 3, 17: 3, 18: 4, 19: 4, 20: 5 };
  let allOk = true;
  for ( const [score, want] of Object.entries(table) ) {
    const m = new CharacterModel({ stats: { str: { score: Number(score) } } }, { parent: null });
    Object.defineProperty(m, "parent", { value: { items: [] }, configurable: true });
    m.prepareDerivedData();
    if ( m.stats.str.bonus !== want ) {
      allOk = false;
      fail(`score ${score} -> ${m.stats.str.bonus}, expected ${want}`);
    }
  }
  if ( allOk ) pass("all 14 sampled scores produce the spec's bonus");
}

console.log("\n=== Spec 4c: precision die defaults to the damage die ===");
{
  const WeaponModel = models.weapon;
  const blank = new WeaponModel({ damageDie: "d8", precisionDie: "" }, { parent: null });
  blank.prepareDerivedData();
  blank.effectivePrecisionDie === "d8"
    ? pass("blank precision die falls back to the damage die (d8)")
    : fail(`blank precision die gave "${blank.effectivePrecisionDie}", expected "d8"`);

  const explicit = new WeaponModel({ damageDie: "d6", precisionDie: "d10" }, { parent: null });
  explicit.prepareDerivedData();
  explicit.effectivePrecisionDie === "d10"
    ? pass("explicit precision die is respected (d10)")
    : fail(`explicit precision die gave "${explicit.effectivePrecisionDie}", expected "d10"`);
}

/* -------------------------------------------- */
/*  Spec 1: outcome tiers                       */
/* -------------------------------------------- */

// The roll module imports ../config.mjs only, so it loads cleanly here.
const { resolveOutcome, computeTotal, earnsPrecisionDie, TIERS, HARD_CHOICE_MARGIN } =
  await import("../module/dice/kd20-roll.mjs");

console.log("\n=== Core v0.31: the acceptance-test tiers against DC 13 ===");
{
  const cases = [
    { total: 13, want: "success", label: "total 13 vs DC 13 (margin 0)" },
    { total: 23, want: "decisive", label: "total 23 vs DC 13 (margin 10)" },
    { total: 33, want: "supreme", label: "total 33 vs DC 13 (margin 20)" },
    { total: 12, want: "fail", label: "total 12 vs DC 13 (margin -1)" }
  ];
  for ( const c of cases ) {
    const got = resolveOutcome({ total: c.total, target: 13 });
    got.tier?.key === c.want ? pass(`${c.label} -> ${got.tier.label}`)
      : fail(`${c.label} -> ${got.tier?.key}, expected ${c.want}`);
  }
}

console.log("\n=== Core v0.31: no die face is special ===");
{
  // resolveOutcome no longer accepts a d20 face at all — the margin is the sole
  // arbiter. These assert that identical totals give identical outcomes no
  // matter what the die showed.
  const lowFaceHighTotal = resolveOutcome({ total: 40, target: 13 });
  lowFaceHighTotal.tier === TIERS.supreme
    ? pass("a total of 40 vs DC 13 is Supreme regardless of the face rolled")
    : fail(`total 40 vs DC 13 gave ${lowFaceHighTotal.tier?.key}, expected supreme`);

  lowFaceHighTotal.hardChoice === false
    ? pass("a high total never flags the Hard Choice")
    : fail("a high total wrongly flagged the Hard Choice");

  // A roll that merely clears the DC is a Success, however it got there.
  const bare = resolveOutcome({ total: 13, target: 13 });
  bare.tier === TIERS.success
    ? pass("margin 0 is a Success, with no die face exception")
    : fail(`margin 0 gave ${bare.tier?.key}`);

  // No natural-20 auto-success either: short of the DC is still a Fail.
  // Margin here is -8, so this is a plain Fail and must NOT flag the Hard Choice.
  const short = resolveOutcome({ total: 22, target: 30 });
  (short.tier === TIERS.fail && short.margin === -8 && short.hardChoice === false)
    ? pass("total 22 vs DC 30 -> plain Fail at margin -8, no auto-success, no Hard Choice")
    : fail(`total 22 vs DC 30 gave tier ${short.tier?.key}, margin ${short.margin}, `
      + `hardChoice ${short.hardChoice}`);
}

console.log("\n=== Core v0.31: tier boundaries ===");
{
  const boundaries = [
    [-1, "fail"], [0, "success"], [9, "success"],
    [10, "decisive"], [19, "decisive"], [20, "supreme"], [999, "supreme"]
  ];
  let allOk = true;
  for ( const [margin, want] of boundaries ) {
    const got = resolveOutcome({ total: 13 + margin, target: 13 });
    if ( got.tier?.key !== want ) {
      allOk = false;
      fail(`margin ${margin} -> ${got.tier?.key}, expected ${want}`);
    }
    if ( got.margin !== margin ) {
      allOk = false;
      fail(`margin ${margin} reported as ${got.margin}`);
    }
  }
  if ( allOk ) pass("margins -1/0/9/10/19/20/999 map to the correct tiers");

  // Exhaustive sweep: no margin anywhere should land in the wrong band, and the
  // Hard Choice flag must track the -10 threshold exactly.
  let sweepOk = true;
  for ( let m = -60; m <= 60; m++ ) {
    const got = resolveOutcome({ total: 13 + m, target: 13 });
    const wantTier = m < 0 ? "fail" : m < 10 ? "success" : m < 20 ? "decisive" : "supreme";
    const wantHard = m <= -10;
    if ( got.tier?.key !== wantTier ) { sweepOk = false; fail(`sweep margin ${m} -> ${got.tier?.key}`); }
    if ( got.hardChoice !== wantHard ) {
      sweepOk = false;
      fail(`sweep margin ${m} hardChoice=${got.hardChoice}, expected ${wantHard}`);
    }
  }
  if ( sweepOk ) pass("exhaustive sweep of margins -60..60: tiers and Hard Choice flag both correct");
}

console.log("\n=== Core v0.31: the Hard Choice band (margin <= -10) ===");
{
  HARD_CHOICE_MARGIN === -10
    ? pass("the threshold constant is -10")
    : fail(`HARD_CHOICE_MARGIN is ${HARD_CHOICE_MARGIN}, expected -10`);

  // Triggers at -10 and worse.
  const triggers = [-10, -11, -15, -40];
  let tOk = true;
  for ( const m of triggers ) {
    const got = resolveOutcome({ total: 13 + m, target: 13 });
    if ( !got.hardChoice || (got.tier !== TIERS.fail) ) {
      tOk = false;
      fail(`margin ${m} should be a Fail with the Hard Choice; got `
        + `${got.tier?.key}/hardChoice=${got.hardChoice}`);
    }
  }
  if ( tOk ) pass("margins -10, -11, -15, -40 all flag the Hard Choice");

  // A normal miss, -1 to -9, does NOT.
  let nOk = true;
  for ( let m = -9; m <= -1; m++ ) {
    const got = resolveOutcome({ total: 13 + m, target: 13 });
    if ( got.hardChoice || (got.tier !== TIERS.fail) ) {
      nOk = false;
      fail(`margin ${m} should be a plain Fail; got ${got.tier?.key}/hardChoice=${got.hardChoice}`);
    }
  }
  if ( nOk ) pass("margins -1 through -9 are plain Fails with no Hard Choice");

  // Successes never flag it.
  let sOk = true;
  for ( const m of [0, 5, 10, 25] ) {
    if ( resolveOutcome({ total: 13 + m, target: 13 }).hardChoice ) {
      sOk = false;
      fail(`margin ${m} wrongly flagged the Hard Choice`);
    }
  }
  if ( sOk ) pass("margins 0, 5, 10, 25 never flag the Hard Choice");

  // No target means no margin, so no Hard Choice can be determined.
  const noTarget = resolveOutcome({ total: 17, target: null });
  (noTarget.tier === null && noTarget.margin === null && noTarget.hardChoice === false)
    ? pass("no target -> no tier, no margin, no Hard Choice")
    : fail("a missing target should produce no tier and no Hard Choice");
}

console.log("\n=== Spec 6: Action Dice accumulate into the total ===");
{
  const state = { d20: 7, statBonus: 2, specDie: null, actionDice: [] };
  computeTotal(state) === 9 ? pass("d20 7 + str 2 = 9") : fail(`base total ${computeTotal(state)}`);

  state.specDie = 4;
  computeTotal(state) === 13 ? pass("+ Specialization d6 (4) = 13")
    : fail(`with spec die ${computeTotal(state)}`);

  state.actionDice.push(5, 3);
  computeTotal(state) === 21 ? pass("+ Action Dice (5, 3) = 21")
    : fail(`with action dice ${computeTotal(state)}`);

  // Action Dice can push a Success up to Decisive.
  const before = resolveOutcome({ total: 13, target: 13 });
  const after = resolveOutcome({ total: 23, target: 13 });
  (before.tier === TIERS.success && after.tier === TIERS.decisive)
    ? pass("spending Action Dice upgrades Success -> Decisive")
    : fail("Action Dice failed to upgrade the tier");

  // And per the agreed ruling, that upgrade earns the Precision Die.
  (!earnsPrecisionDie(before.tier) && earnsPrecisionDie(after.tier))
    ? pass("the upgraded Decisive now earns a Precision Die (agreed ruling)")
    : fail("Precision Die entitlement did not follow the tier upgrade");
}

console.log("\n=== Core v0.31: Action Dice lift a roll out of the Hard Choice band ===");
{
  // d20 2 + str 2 = 4 vs DC 20 -> margin -16: a decisive failure.
  const s = { d20: 2, statBonus: 2, specDie: null, actionDice: [] };
  const target = 20;

  const start = resolveOutcome({ total: computeTotal(s), target });
  (start.margin === -16 && start.hardChoice && (start.tier === TIERS.fail))
    ? pass("margin -16 -> Fail with the Hard Choice")
    : fail(`opening state gave margin ${start.margin}, hardChoice=${start.hardChoice}`);

  // Spend two Action Dice totalling 7 -> total 11, margin -9: still a Fail, but
  // now out of the Hard Choice band.
  s.actionDice.push(4, 3);
  const lifted = resolveOutcome({ total: computeTotal(s), target });
  (lifted.margin === -9 && !lifted.hardChoice && (lifted.tier === TIERS.fail))
    ? pass("Action Dice raising the margin to -9 removes the Hard Choice, still a Fail")
    : fail(`after lifting: margin ${lifted.margin}, hardChoice=${lifted.hardChoice}, `
      + `tier ${lifted.tier?.key}`);

  // Spend more to clear the DC outright: + 6 + 6 -> total 23, margin +3.
  s.actionDice.push(6, 6);
  const rescued = resolveOutcome({ total: computeTotal(s), target });
  (rescued.tier === TIERS.success && !rescued.hardChoice)
    ? pass("spending further turns the Fail into a Success")
    : fail(`after rescuing: tier ${rescued.tier?.key}, hardChoice=${rescued.hardChoice}`);

  // The boundary itself: exactly -10 keeps it, exactly -9 drops it.
  const at10 = resolveOutcome({ total: 10, target: 20 });
  const at9 = resolveOutcome({ total: 11, target: 20 });
  (at10.hardChoice && !at9.hardChoice)
    ? pass("the boundary is inclusive: -10 flags it, -9 does not")
    : fail(`boundary wrong: -10 gave ${at10.hardChoice}, -9 gave ${at9.hardChoice}`);
}

console.log("\n=== Spec 5: Supreme adds the same single Precision Die ===");
{
  // Both Decisive and Supreme grant exactly one Precision Die; Supreme must not
  // double it. earnsPrecisionDie is a boolean, so one die is structurally
  // guaranteed — this asserts both tiers qualify and the lesser ones do not.
  const qualifies = ["decisive", "supreme"].every(k => earnsPrecisionDie(TIERS[k]));
  const excluded = ["fail", "success"].every(k => !earnsPrecisionDie(TIERS[k]));
  (qualifies && excluded)
    ? pass("Decisive and Supreme each earn exactly one Precision Die; Fail/Success earn none")
    : fail("Precision Die entitlement is wrong for some tier");
}

/* -------------------------------------------- */
/*  Chat card rendering                         */
/* -------------------------------------------- */

console.log("\n=== Save rolls: d20 + stat + gateway profile, read on the margin ladder ===");
{
  const { buildCardContext } = await import("../module/dice/kd20-roll.mjs");
  const ck = (label, ok, detail = "") => ok ? pass(label) : fail(detail ? `${label} :: ${detail}` : label);
  // A Warrior's Strength Save: str +2, profile +3, so the static part is +5.
  const save = d20 => ({ kind: "save", label: "Strength Save", saveKey: "withstand",
    statKey: "str", statBonus: 2, profileBonus: 3, profileLabel: "Warrior",
    d20, specDie: null, actionDice: [], target: 15, damage: null });

  ck("d20 10 + str 2 + profile 3 = 15", computeTotal(save(10)) === 15, `got ${computeTotal(save(10))}`);
  ck("old cards without profileBonus still total", computeTotal({ ...save(10), profileBonus: undefined }) === 12);

  const parts = buildCardContext(save(10)).parts;
  ck("card breakdown lists the profile step",
    parts.some(p => p.label === "Warrior profile" && p.value === 3), JSON.stringify(parts));
  ck("a zero profile is left off the breakdown",
    !buildCardContext({ ...save(10), profileBonus: 0 }).parts.some(p => /profile/.test(p.label)));

  // vs. attacker total 15: tie succeeds; then Decisive at +10, Supreme at +20.
  const tierAt = (d20, target) => buildCardContext({ ...save(d20), target }).tier?.key;
  ck("tie with the attacker (15 vs 15) = Success, the defense holds", tierAt(10, 15) === "success");
  ck("14 vs 15 = Fail", tierAt(9, 15) === "fail");
  ck("25 vs 15 = Decisive", tierAt(20, 15) === "decisive");
  ck("25 vs 5 = Supreme", tierAt(20, 5) === "supreme");
  ck("no target = total only, no tier", tierAt(10, null) === undefined);
  ck("action dice add on top", computeTotal({ ...save(10), actionDice: [4] }) === 19);

  // Core rules v0.37: Hardened Save steps are a separate, flat term on the card.
  const hardened = { ...save(10), hardenedBonus: 2 };
  ck("Hardened Save adds to the total (10 + 2 + 3 + 2 = 17)", computeTotal(hardened) === 17,
    `got ${computeTotal(hardened)}`);
  ck("card breakdown lists the Hardened Save term",
    buildCardContext(hardened).parts.some(p => p.label === "Hardened Save" && p.value === 2));
  ck("no Hardened Save = no breakdown line",
    !buildCardContext(save(10)).parts.some(p => p.label === "Hardened Save"));
  ck("Hardened Save can turn a Fail into a Success (15 vs 17)",
    buildCardContext({ ...save(10), target: 17 }).tier?.key === "fail"
    && buildCardContext({ ...hardened, target: 17 }).tier?.key === "success");
}

console.log("\n=== Chat card renders without NaN in any combination ===");
{
  const { buildCardContext } = await import("../module/dice/kd20-roll.mjs");
  const Handlebars = (await import(
    `file:///${appPath}/node_modules/handlebars/lib/index.js`
  )).default;
  const fs = await import("node:fs");

  // Mirror the two Foundry Handlebars helpers the card uses. numberFormat is
  // reproduced from the v14 source, including its NaN behaviour for null input,
  // so this test reflects exactly what Foundry would render.
  Handlebars.registerHelper("numberFormat", (value, options) => {
    const dec = options.hash.decimals ?? 0;
    const sign = options.hash.sign || false;
    if ( (typeof value === "string") || (value == null) ) value = parseFloat(value);
    const str = sign && (value >= 0) ? `+${value.toFixed(dec)}` : value.toFixed(dec);
    return new Handlebars.SafeString(str);
  });
  Handlebars.registerHelper("eq", (a, b) => a === b);

  const template = Handlebars.compile(
    fs.readFileSync(new URL("../templates/chat/roll-card.hbs", import.meta.url), "utf8")
  );

  const baseCheck = (over = {}) => ({
    version: 1, kind: "check", label: "Strength Check", actorUuid: "Actor.x",
    statKey: "str", statBonus: 2, d20: 11, specDie: null, actionDice: [],
    target: 13, damage: null, superseded: false, ...over
  });

  const baseAttack = (over = {}) => baseCheck({
    kind: "attack", label: "Short Sword Attack", weaponUuid: "Item.y",
    damage: { die: "d6", statKey: "str", statBonus: 2, precisionDie: "d10",
      dieResult: 4, precisionResult: null },
    ...over
  });

  const scenarios = [
    // A natural 1 is now entirely unremarkable. 1 + 2 = 3 vs DC 13 -> margin -10,
    // which lands in the Hard Choice band because of the MARGIN, not the face.
    { name: "natural 1, DC 13 (margin -10)", state: baseCheck({ d20: 1 }),
      wantTier: "fail", wantMarginShown: true, wantHardChoice: true },
    // The same natural 1, but with enough bonus to succeed outright — proof that
    // the face carries no penalty any more.
    { name: "natural 1 with +15, DC 13 (Success)",
      state: baseCheck({ d20: 1, statBonus: 15 }),
      wantTier: "success", wantMarginShown: true, wantHardChoice: false },
    { name: "natural 1, NO target", state: baseCheck({ d20: 1, target: null }),
      wantTier: null, wantMarginShown: false, wantHardChoice: false },
    { name: "normal roll, NO target", state: baseCheck({ target: null }),
      wantTier: null, wantMarginShown: false, wantHardChoice: false },
    { name: "normal roll, DC 13 (Success)", state: baseCheck(),
      wantTier: "success", wantMarginShown: true, wantHardChoice: false },
    // Plain miss: 11 + 2 = 13 vs DC 18 -> margin -5.
    { name: "plain miss, margin -5 (no Hard Choice)",
      state: baseCheck({ target: 18 }),
      wantTier: "fail", wantMarginShown: true, wantHardChoice: false },
    // Decisive failure: 11 + 2 = 13 vs DC 30 -> margin -17.
    { name: "decisive failure, margin -17 (Hard Choice)",
      state: baseCheck({ target: 30 }),
      wantTier: "fail", wantMarginShown: true, wantHardChoice: true },
    { name: "Decisive", state: baseCheck({ d20: 20, statBonus: 2, actionDice: [6] }),
      wantTier: "decisive", wantMarginShown: true, wantHardChoice: false },
    { name: "Supreme", state: baseCheck({ d20: 20, statBonus: 5, actionDice: [6, 6, 6] }),
      wantTier: "supreme", wantMarginShown: true, wantHardChoice: false },
    { name: "attack, Decisive with Precision die",
      state: baseAttack({ d20: 20, actionDice: [6], damage: { die: "d6", statKey: "str",
        statBonus: 2, precisionDie: "d10", dieResult: 4, precisionResult: 7 } }),
      wantTier: "decisive", wantMarginShown: true, wantHardChoice: false },
    // An attack that misses badly: no damage rolled, Hard Choice offered.
    { name: "attack, decisive failure (no damage block)",
      state: baseAttack({ target: 30,
        damage: { die: "d6", statKey: "str", statBonus: 2, precisionDie: "d10",
          dieResult: null, precisionResult: null } }),
      wantTier: "fail", wantMarginShown: true, wantHardChoice: true },
    { name: "no stat bonus, no target", state: baseCheck({ statBonus: 0, target: null }),
      wantTier: null, wantMarginShown: false, wantHardChoice: false },
    // A re-post whose Action Dice push it over the Decisive line:
    // d20 11 + str 2 + (6+6) = 25 vs DC 13 -> margin 12 -> Decisive.
    { name: "re-post, dice upgrade it to Decisive",
      state: baseCheck({ actionDice: [6, 6], spentNow: [6, 6] }),
      wantTier: "decisive", wantMarginShown: true, wantHardChoice: false },
    // And one that stays a Success: 11 + 2 + (3+5) = 21 -> margin 8.
    { name: "re-post, still a Success",
      state: baseCheck({ actionDice: [3, 5], spentNow: [3, 5] }),
      wantTier: "success", wantMarginShown: true, wantHardChoice: false },
    // A re-post that lifts the roll OUT of the Hard Choice band:
    // 11 + 2 + (4+3) = 20 vs DC 30 -> margin -10... still in the band.
    // Add one more: + 6 -> 26, margin -4 -> out of the band, still a Fail.
    { name: "re-post, lifted out of the Hard Choice band",
      state: baseCheck({ target: 30, actionDice: [4, 3, 6], spentNow: [4, 3, 6] }),
      wantTier: "fail", wantMarginShown: true, wantHardChoice: false }
  ];

  for ( const s of scenarios ) {
    const ctx = buildCardContext(s.state, { isRepost: Boolean(s.state.spentNow) });
    let html;
    try {
      html = template(ctx);
    } catch ( e ) {
      fail(`${s.name}: template threw :: ${e.message}`);
      continue;
    }

    const problems = [];
    if ( html.includes("NaN") ) problems.push("output contains NaN");
    if ( html.includes("undefined") ) problems.push("output contains undefined");
    if ( html.includes("null") ) problems.push("output contains null");

    const marginShown = html.includes("Margin");
    if ( marginShown !== s.wantMarginShown ) {
      problems.push(`margin ${marginShown ? "shown" : "hidden"}, expected `
        + `${s.wantMarginShown ? "shown" : "hidden"}`);
    }

    const tierShown = ctx.tier?.key ?? null;
    if ( tierShown !== s.wantTier ) {
      problems.push(`tier ${tierShown}, expected ${s.wantTier}`);
    }

    // The Hard Choice panel must appear exactly when the flag is set.
    const panelShown = html.includes("Decisive failure");
    if ( panelShown !== s.wantHardChoice ) {
      problems.push(`Hard Choice panel ${panelShown ? "shown" : "hidden"}, expected `
        + `${s.wantHardChoice ? "shown" : "hidden"}`);
    }
    if ( ctx.hardChoice !== s.wantHardChoice ) {
      problems.push(`hardChoice flag ${ctx.hardChoice}, expected ${s.wantHardChoice}`);
    }
    // The panel must never print a negative "missed by" figure.
    if ( panelShown && !/missed the target by \d+\./.test(html) ) {
      problems.push("the miss magnitude is missing or negative");
    }
    // No card should ever claim a natural 1 is special any more.
    if ( /[Nn]atural 1/.test(html) ) problems.push("output still mentions a natural 1");

    if ( problems.length ) fail(`${s.name}: ${problems.join("; ")}`);
    else {
      pass(`${s.name}: tier ${s.wantTier ?? "none"}, margin `
        + `${s.wantMarginShown ? "shown" : "hidden"}, Hard Choice `
        + `${s.wantHardChoice ? "shown" : "hidden"}`);
    }
  }

  // Pin the earlier NaN defect so it cannot silently return.
  const noTarget = buildCardContext(baseCheck({ target: null }));
  (noTarget.hasTarget === false && noTarget.margin === null && noTarget.tier === null)
    ? pass("REGRESSION: no target -> hasTarget false, margin null, no tier (no NaN)")
    : fail(`REGRESSION: no target gave hasTarget=${noTarget.hasTarget}, `
      + `margin=${noTarget.margin}, tier=${noTarget.tier?.key}`);

  // Pin the v0.31 change: a natural 1 is no longer special in the context either.
  const nat1 = buildCardContext(baseCheck({ d20: 1, statBonus: 15 }));
  (nat1.tier?.key === "success" && nat1.hardChoice === false)
    ? pass("REGRESSION: a natural 1 with a high bonus now Succeeds (v0.31)")
    : fail(`REGRESSION: natural 1 with +15 gave tier=${nat1.tier?.key}, `
      + `hardChoice=${nat1.hardChoice}`);

  // And pin missedBy as a positive magnitude.
  const badMiss = buildCardContext(baseCheck({ target: 30 }));
  (badMiss.hardChoice === true && badMiss.missedBy === 17 && badMiss.margin === -17)
    ? pass("REGRESSION: margin -17 reports missedBy 17 and flags the Hard Choice")
    : fail(`REGRESSION: margin -17 gave missedBy=${badMiss.missedBy}, `
      + `hardChoice=${badMiss.hardChoice}`);
}

/* -------------------------------------------- */
/*  Shared helpers for the sections below       */
/* -------------------------------------------- */

const check = (label, ok, detail = "") => ok ? pass(label) : fail(detail ? `${label} :: ${detail}` : label);
const Handlebars = (await import(`file:///${appPath}/node_modules/handlebars/lib/index.js`)).default;
const fs = await import("node:fs");
const compile = rel => Handlebars.compile(fs.readFileSync(new URL(rel, import.meta.url), "utf8"));
const badText = html => ["NaN", "undefined", "null"].filter(s => html.includes(s));

/** Core rules v0.36: the Warrior's Save profile (Str +3, Dex +1, Con +3, Int 0, Wis 0, Cha -3). */
const warriorProfile = { withstand: 3, reflexes: 1, fortitude: 3, composure: 0, resolve: 0, poise: -3 };

/** Build and prepare a character the way Foundry would, with the given owned items. */
const makeCharacter = (items, parent = { items }, defence = { misc: 0 }) => {
  const m = new models.character({
    stats: { str: { score: 15 }, dex: { score: 13 }, con: { score: 14 },
      int: { score: 10 }, wis: { score: 12 }, cha: { score: 11 } },
    hp: { value: 19 },
    defence
  }, { parent: null });
  Object.defineProperty(m, "parent", { value: parent, configurable: true });
  m.prepareDerivedData();
  return m;
};

/* -------------------------------------------- */
/*  A character with no Gateway                 */
/* -------------------------------------------- */

console.log("\n=== A Character with no Gateway derives every stat ===");
{
  const noGateway = makeCharacter([]);
  check("no gateway: gatewayHpBonus = 0", noGateway.gatewayHpBonus === 0, `got ${noGateway.gatewayHpBonus}`);
  // HP max = 10 + con 2 + wis 1 + 0.
  check("no gateway: HP max = 13", noGateway.hp.max === 13, `got ${noGateway.hp.max}`);
  check("no gateway: current HP clamped to the new max", noGateway.hp.value === 13, `got ${noGateway.hp.value}`);
  check("no gateway, no armour: AC = 10 + dex 1 = 11", noGateway.ac === 11, `got ${noGateway.ac}`);
  check("no gateway: initiative bonus unaffected (+1)", noGateway.initiative.bonus === 1,
    `got ${noGateway.initiative.bonus}`);

  const orphan = makeCharacter(null, null);
  check("no parent actor at all: HP max = 13, initiative +1",
    orphan.hp.max === 13 && orphan.initiative.bonus === 1, `HP ${orphan.hp.max}, init ${orphan.initiative.bonus}`);

  const broken = makeCharacter([{ type: "gateway", system: {} }]);
  check("gateway with no hpBonus value contributes 0, not NaN",
    broken.gatewayHpBonus === 0 && broken.hp.max === 13, `bonus ${broken.gatewayHpBonus}, HP ${broken.hp.max}`);
}

/* -------------------------------------------- */
/*  Saves (core rules v0.34)                    */
/* -------------------------------------------- */

console.log("\n=== Saves: stat bonus + gateway profile step ===");
{
  // Test stats: str +2, dex +1, con +2, int +0, wis +1, cha +0.
  // Warrior, core rules v0.36: Str +3, Dex +1, Con +3, Int 0, Wis 0, Cha -3.
  const want = { withstand: 5, reflexes: 2, fortitude: 5, composure: 0, resolve: 1, poise: -3 };
  const warrior = makeCharacter([{ type: "gateway", name: "Warrior",
    system: { hpBonus: 6, saveProfile: warriorProfile } }]);
  for ( const [key, total] of Object.entries(want) ) {
    const s = warrior.saves[key];
    check(`Warrior ${key}: total ${total}`, s.total === total && s.total === s.statBonus + s.profile,
      JSON.stringify(s));
  }
  check("Warrior: gatewayName recorded", warrior.gatewayName === "Warrior", `got ${warrior.gatewayName}`);
  check("Warrior: AC unaffected by profile (11)", warrior.ac === 11, `got ${warrior.ac}`);

  const none = makeCharacter([]);
  check("no gateway: every Save is just its stat bonus",
    Object.values(none.saves).every(s => s.profile === 0 && s.total === s.statBonus), JSON.stringify(none.saves));

  const blank = makeCharacter([{ type: "gateway", system: {} }]);
  check("gateway with no profile: Saves are numbers, not NaN",
    Object.values(blank.saves).every(s => Number.isFinite(s.total) && s.profile === 0), JSON.stringify(blank.saves));
}

/* -------------------------------------------- */
/*  Hardened Save (core rules v0.37)            */
/* -------------------------------------------- */

console.log("\n=== Hardened Save: each copy climbs one ladder step, gated by the profile ===");
{
  const gateway = { type: "gateway", name: "Warrior", system: { hpBonus: 6, saveProfile: warriorProfile } };
  const hs = save => ({ type: "feat", name: "Hardened Save", system: { mechanic: { kind: "hardenedSave", save } } });
  const withFeats = (...saves) => makeCharacter([gateway, ...saves.map(hs)]);
  const s = (c, key) => c.saves[key];

  // Cha -3 (cha +0): one copy patches it to 0; a second raises nothing.
  let c = withFeats("poise");
  check("Cha -3 + 1 copy -> 0 (total -3 -> 0)", s(c, "poise").total === 0 && s(c, "poise").hardened.bonus === 3,
    JSON.stringify(s(c, "poise")));
  c = withFeats("poise", "poise");
  check("Cha -3 + 2 copies -> still 0; a hindrance lifts only to neutral",
    s(c, "poise").total === 0 && s(c, "poise").hardened.wasted === 1, JSON.stringify(s(c, "poise")));

  // Int 0 (int +0): 0 -> +1 -> +3, never +5 (not gateway-Solid).
  c = withFeats("composure", "composure");
  check("Int 0 + 2 copies -> +3 (0 -> +1 -> +3)", s(c, "composure").total === 3, JSON.stringify(s(c, "composure")));
  check("Int 0 climb costs 20 then 30 XP",
    s(c, "composure").hardened.steps.map(x => x.cost).join(",") === "20,30", JSON.stringify(s(c, "composure").hardened));
  c = withFeats("composure", "composure", "composure");
  check("Int 0 + 3 copies -> capped at +3; Major needs a gateway-Solid Save",
    s(c, "composure").total === 3 && s(c, "composure").hardened.wasted === 1, JSON.stringify(s(c, "composure")));

  // Dex +1 (dex +1): one copy to +3.
  c = withFeats("reflexes");
  check("Dex +1 + 1 copy -> +3 (total 2 -> 4)", s(c, "reflexes").total === 4, JSON.stringify(s(c, "reflexes")));

  // Str +3 (str +2): gateway-Solid, so Major +5 is reachable, at 40 XP.
  c = withFeats("withstand", "withstand");
  check("Str +3 + 1 copy -> Major +5 (total 5 -> 7), cost 40",
    s(c, "withstand").total === 7 && s(c, "withstand").hardened.steps[0].cost === 40
    && s(c, "withstand").hardened.wasted === 1, JSON.stringify(s(c, "withstand")));

  // Copies only touch their own Save.
  check("a copy on Str leaves every other Save unchanged",
    ["reflexes", "fortitude", "composure", "resolve", "poise"].every(k => s(c, k).total === s(warriorBase(), k).total));

  // A copy with no Save chosen raises nothing but is counted for the sheet to flag.
  c = withFeats("");
  check("Hardened Save with no Save chosen raises nothing, flagged",
    c.unassignedHardenedSaves === 1 && Object.values(c.saves).every(x => x.hardened.bonus === 0));

  // No gateway: every profile is 0, so the cap is +3.
  const bare = makeCharacter([hs("withstand"), hs("withstand"), hs("withstand")]);
  check("no gateway: Str 0 + 3 copies -> +3 (total 2 -> 5)", s(bare, "withstand").total === 5,
    JSON.stringify(s(bare, "withstand")));

  // A non-feat item claiming the mechanic is ignored.
  const fake = makeCharacter([gateway, { type: "weapon", system: { mechanic: { kind: "hardenedSave", save: "poise" } } }]);
  check("only feat items count", s(fake, "poise").total === -3);

  function warriorBase() { return makeCharacter([gateway]); }
}

/* -------------------------------------------- */
/*  Armour items drive AC (core rules v0.39)    */
/* -------------------------------------------- */

/** An Armour item as the character model sees it. */
const armourItem = (name, category, armourBonus, { isShield = false, equipped = true } = {}) =>
  ({ type: "armour", name, system: { category, armourBonus, isShield, equipped, description: "" } });
const leather = o => armourItem("Padded / Leather", "light", 1, o);
const chain = o => armourItem("Chain Mail", "medium", 2, o);
const plate = o => armourItem("Plate", "heavy", 3, o);
const shieldItem = o => armourItem("Shield", "light", 1, { isShield: true, ...o });

/** Build a character with these items (and optional stat scores); check its AC breakdown adds up. */
const acOf = (items, defence = { misc: 0 }, stats = null) => {
  const c = makeCharacter(items, undefined, defence);
  if ( stats ) {
    for ( const [k, score] of Object.entries(stats) ) c.stats[k].score = score;
    c.prepareDerivedData();
  }
  const sum = c.acParts.reduce((t, p) => t + p.value, 0);
  if ( sum !== c.ac ) fail(`AC breakdown ${JSON.stringify(c.acParts)} sums to ${sum}, not ${c.ac}`);
  return c;
};

console.log("\n=== Armour items: AC reads equipped armour and shield ===");
{
  // Test stats: dex +1.
  let c = acOf([]);
  check("nothing owned: AC 11, category none", c.ac === 11 && c.armour.category === "none", JSON.stringify(c.armour));
  c = acOf([plate({ equipped: false }), shieldItem({ equipped: false })]);
  check("owned but unequipped armour and shield add nothing (11, category none)",
    c.ac === 11 && c.armour.category === "none", JSON.stringify(c.armour));
  c = acOf([leather()]);
  check("Padded / Leather equipped: 10 + 1 + 1 = 12, category light", c.ac === 12 && c.armour.category === "light");
  c = acOf([chain()]);
  check("Chain Mail equipped: 10 + 1 + 2 = 13, category medium", c.ac === 13 && c.armour.category === "medium");
  c = acOf([plate()]);
  check("Plate equipped: 10 + 1 + 3 = 14, category heavy", c.ac === 14 && c.armour.category === "heavy");
  c = acOf([plate(), shieldItem()], { misc: 1 });
  check("Plate + Shield + misc 1: 10 + 1 + 3 + 1 + 1 = 16", c.ac === 16, `got ${c.ac}`);
  c = acOf([shieldItem()]);
  check("a shield alone adds its bonus but sets no category (12, none)",
    c.ac === 12 && c.armour.category === "none" && c.armour.body === null, JSON.stringify(c.armour));
  c = acOf([shieldItem({ equipped: false }), chain()]);
  check("unequipped shield beside equipped Chain Mail: shield ignored (13)", c.ac === 13);

  c = acOf([plate(), shieldItem()]);
  check("breakdown names the equipped armour and shield",
    c.acParts.some(p => p.label === "Plate (Heavy)" && p.value === 3)
    && c.acParts.some(p => p.label === "Shield" && p.value === 1), JSON.stringify(c.acParts));
  check("breakdown has no armour line when nothing is equipped",
    acOf([]).acParts.every(p => ["Base", "Dexterity", "Misc"].includes(p.label)), JSON.stringify(acOf([]).acParts));

  // Two body armours (or two shields) equipped: only the best counts, flagged.
  c = acOf([leather(), plate()]);
  check("two body armours equipped: the higher (Plate) counts, category heavy, flagged",
    c.ac === 14 && c.armour.category === "heavy" && c.armour.extraBody === 1, JSON.stringify(c.armour));
  c = acOf([shieldItem(), armourItem("Tower Shield", "light", 2, { isShield: true })]);
  check("two shields equipped: the higher counts, flagged", c.ac === 13 && c.armour.extraShields === 1);

  // Dex always applies, whatever the category: dex 18 (+4) in Plate.
  c = acOf([plate()], { misc: 0 }, { dex: 18 });
  check("dex +4 applies in full under heavy armour (10 + 4 + 3 = 17)", c.ac === 17, `got ${c.ac}`);

  // Non-armour items never count, even if they look equipped.
  c = acOf([{ type: "weapon", name: "Odd", system: { armourBonus: 5, equipped: true } }]);
  check("only Armour items count toward AC", c.ac === 11);
}

/* -------------------------------------------- */
/*  AC feats (core rules v0.39)                 */
/* -------------------------------------------- */

console.log("\n=== AC feats: gated on the category of the EQUIPPED armour ===");
{
  // Test stats: dex +1, con +2, wis +1.
  const at = { type: "feat", name: "Armour Training", system: { mechanic: { kind: "armourTraining", save: "" } } };
  const ud = { type: "feat", name: "Unarmored Defense", system: { mechanic: { kind: "unarmoredDefense", save: "" } } };
  const warrior = { type: "gateway", name: "Warrior", system: { hpBonus: 6, saveProfile: warriorProfile } };
  const barbarian = { type: "gateway", name: "Barbarian", system: { hpBonus: 6, unarmoredStat: "con" } };

  let c = acOf([warrior, at, chain()]);
  check("Armour Training x1 in Chain Mail (medium): 10 + 1 + 2 + 1 = 14", c.ac === 14, `got ${c.ac}`);
  c = acOf([warrior, at, at, plate()]);
  check("Armour Training x2 in Plate (heavy): 10 + 1 + 3 + 2 = 16", c.ac === 16, `got ${c.ac}`);
  check("breakdown lists Armour Training", c.acParts.some(p => p.label === "Armour Training" && p.value === 2));
  c = acOf([warrior, at, at, at, plate()]);
  check("Armour Training x3: still +2 (max), flagged", c.ac === 16 && Boolean(c.acFeats.armourTraining.reason),
    JSON.stringify(c.acFeats));
  c = acOf([warrior, at, leather()]);
  check("Armour Training in light armour: no bonus, flagged (12)",
    c.ac === 12 && c.acFeats.armourTraining.bonus === 0 && Boolean(c.acFeats.armourTraining.reason), JSON.stringify(c.acFeats));
  c = acOf([warrior, at]);
  check("Armour Training with nothing equipped: no bonus (11)", c.ac === 11, `got ${c.ac}`);
  c = acOf([warrior, at, plate({ equipped: false })]);
  check("Armour Training with Plate owned but UNEQUIPPED: no bonus (11) — gear is the source of truth",
    c.ac === 11 && c.acFeats.armourTraining.bonus === 0, `got ${c.ac}`);
  c = acOf([warrior, at, shieldItem()]);
  check("a shield alone does not qualify Armour Training (12)", c.ac === 12 && c.acFeats.armourTraining.bonus === 0);

  c = acOf([barbarian, ud, shieldItem()]);
  check("Unarmored Defense (Barbarian con), no body armour + Shield: 10 + 1 + 2 + 1 = 14",
    c.ac === 14 && c.acFeats.unarmoredDefense.active, `got ${c.ac}`);
  c = acOf([barbarian, ud, leather()]);
  check("Unarmored Defense in Padded / Leather replaces the armour term (13, not 12)",
    c.ac === 13 && c.acParts.some(p => /replaced by Unarmored Defense/.test(p.label) && p.value === 0),
    JSON.stringify(c.acParts));
  c = acOf([barbarian, ud, chain()]);
  check("Unarmored Defense in Chain Mail: inactive, normal AC (13), flagged",
    c.ac === 13 && !c.acFeats.unarmoredDefense.active && Boolean(c.acFeats.unarmoredDefense.reason), JSON.stringify(c.acFeats));
  c = acOf([barbarian, ud, plate({ equipped: false })]);
  check("Unarmored Defense with Plate owned but UNEQUIPPED: active (13)",
    c.ac === 13 && c.acFeats.unarmoredDefense.active, JSON.stringify(c.acFeats));
  c = acOf([warrior, ud]);
  check("Unarmored Defense under a gateway with no themed stat: inactive, flagged (11)",
    c.ac === 11 && Boolean(c.acFeats.unarmoredDefense.reason), JSON.stringify(c.acFeats));
  c = acOf([ud]);
  check("Unarmored Defense with no gateway at all: inactive (11)", c.ac === 11 && !c.acFeats.unarmoredDefense.active);
  const monk = { type: "gateway", name: "Monk", system: { unarmoredStat: "wis" } };
  check("the gateway names the stat: Monk wis gives 10 + 1 + 1 = 12", acOf([monk, ud]).ac === 12);

  // Mutually exclusive by requirement: whatever is equipped, at most one applies.
  const worn = { none: [], light: [leather()], medium: [chain()], heavy: [plate()] };
  const want = { none: 13, light: 13, medium: 10 + 1 + 2 + 1, heavy: 10 + 1 + 3 + 1 };
  for ( const [category, gear] of Object.entries(worn) ) {
    c = acOf([barbarian, at, ud, ...gear]);
    const both = (c.acFeats.armourTraining.bonus > 0) && c.acFeats.unarmoredDefense.active;
    check(`both feats owned, ${category} equipped: exactly one applies (AC ${want[category]})`,
      !both && c.ac === want[category] && c.armour.category === category, `got ${c.ac} ${JSON.stringify(c.acFeats)}`);
  }

  // The design ceiling: dex +4, Plate, Shield, Armour Training x2 = 20; dex 20
  // (+5) reaches 21. The ~20 soft cap is the GM's, so nothing clamps it.
  c = acOf([warrior, at, at, plate(), shieldItem()], { misc: 0 }, { dex: 18 });
  check("ceiling build (dex +4, Plate, Shield, Armour Training x2) = AC 20", c.ac === 20, `got ${c.ac}`);
  c = acOf([warrior, at, at, plate(), shieldItem()], { misc: 0 }, { dex: 20 });
  check("dex 20 extreme = AC 21, not hard-capped", c.ac === 21, `got ${c.ac}`);
  check("AC feats leave the Saves alone",
    Object.values(acOf([warrior, at, at, plate()]).saves).every(x => x.hardened.bonus === 0));
}

/* -------------------------------------------- */
/*  Seeded v0.37/v0.39 feats and v0.36 wording  */
/* -------------------------------------------- */

console.log("\n=== Seeded content: the computed feats, and no retired Save names ===");
{
  const feats = PACK_CONTENT["kd20.feats"];
  const kindOf = name => feats.find(f => f.name === name)?.system.mechanic?.kind;
  check("Hardened Save is seeded with the hardenedSave mechanic", kindOf("Hardened Save") === "hardenedSave");
  check("Armour Training is seeded with the armourTraining mechanic", kindOf("Armour Training") === "armourTraining");
  check("Unarmored Defense is seeded with the unarmoredDefense mechanic", kindOf("Unarmored Defense") === "unarmoredDefense");
  check("Armour Training costs 30, Unarmored Defense 30",
    feats.find(f => f.name === "Armour Training").system.costXp === 30
    && feats.find(f => f.name === "Unarmored Defense").system.costXp === 30);
  check("no other seeded feat claims a computed mechanic",
    feats.filter(f => f.system.mechanic?.kind).length === 3);

  // v0.36 retired the flavour names; none may reach a player through the seeds.
  const retired = /\b(Withstand|Reflexes|Fortitude|Composure|Resolve|Poise|Endurance)\b/;
  const leaks = Object.values(PACK_CONTENT).flat()
    .flatMap(e => Object.entries(e.system).filter(([, v]) => typeof v === "string" && retired.test(v))
      .map(([k, v]) => `${e.name}.${k}: "${v.match(retired)[0]}"`));
  check("no retired Save flavour name in any seeded text", leaks.length === 0, leaks.join("; "));

  // Core rules v0.39: the starter armour catalogue, values deliberately tight.
  const armour = Object.fromEntries((PACK_CONTENT["kd20.armour"] ?? []).map(e => [e.name, e.system]));
  const spec = { "Padded / Leather": ["light", 1, false], "Chain Mail": ["medium", 2, false],
    "Plate": ["heavy", 3, false], "Shield": [null, 1, true] };
  for ( const [name, [category, bonus, isShield]] of Object.entries(spec) ) {
    const a = armour[name];
    check(`armour seed ${name}: ${isShield ? "shield" : category} +${bonus}, unequipped`,
      Boolean(a) && (a.armourBonus === bonus) && (a.isShield === isShield) && (isShield || a.category === category)
      && (a.equipped === false), JSON.stringify(a));
  }
  check("armour pack has exactly the four starter pieces", Object.keys(armour).length === 4, Object.keys(armour).join(", "));

  const { CONTENT_VERSION } = await import("../module/seed-content.mjs");
  check("CONTENT_VERSION bumped to 9", CONTENT_VERSION === "9", `got ${CONTENT_VERSION}`);
}

/* -------------------------------------------- */
/*  Initiative                                  */
/* -------------------------------------------- */

const { INITIATIVE_FORMULA, initiativeFormula, getInitiativeBonus, compareCombatants, buildInitiativeRows } =
  await import("../module/combat/initiative.mjs");

console.log("\n=== Initiative: the formula is defined and resolves ===");
{
  const systemJson = JSON.parse(fs.readFileSync(new URL("../system.json", import.meta.url), "utf8"));
  check("system.json declares an initiative formula", systemJson.initiative === INITIATIVE_FORMULA,
    `got ${systemJson.initiative}`);

  // Actor#getRollData() returns actor.system, so @initiative.bonus must resolve
  // against the prepared model itself.
  const warrior = makeCharacter([{ type: "gateway", system: { hpBonus: 6 } }]);
  const noGateway = makeCharacter([]);
  const path = INITIATIVE_FORMULA.match(/@([\w.]+)/)[1];
  check(`@${path} resolves against prepared roll data (+1)`, utils.getProperty(warrior, path) === 1,
    `got ${utils.getProperty(warrior, path)}`);

  // The two actors from the bug report.
  for ( const [label, model] of [["Warrior gateway", warrior], ["no gateway", noGateway]] ) {
    const r = initiativeFormula({ system: model });
    check(`${label}: formula "1d20 + 1", not flagged missing`,
      r.formula === "1d20 + 1" && !r.missing, JSON.stringify(r));
  }
}

console.log("\n=== Initiative: actors without KD20 data fall back to 1d20 + 0 ===");
{
  const cases = [
    ["no actor (null)", null],
    ["undefined actor", undefined],
    ["actor with empty system", { system: {} }],
    ["non-KD20 actor", { system: { attributes: { init: 3 } } }],
    ["initiative bonus not a number", { system: { initiative: { bonus: "2" } } }]
  ];
  for ( const [label, actor] of cases ) {
    const r = initiativeFormula(actor);
    check(`${label}: "1d20", bonus 0, flagged for a warning`,
      r.formula === "1d20" && r.bonus === 0 && r.missing === true, JSON.stringify(r));
  }

  const neg = initiativeFormula({ system: { initiative: { bonus: -2 } } });
  check('negative bonus -> "1d20 - 2"', neg.formula === "1d20 - 2", neg.formula);
  const zero = initiativeFormula({ system: { initiative: { bonus: 0 } } });
  check('zero bonus -> "1d20", not missing', zero.formula === "1d20" && !zero.missing, JSON.stringify(zero));

  // The original bug: the formula text contained "undefined".
  const all = [null, {}, { system: {} }, { system: { initiative: {} } }, { system: { initiative: { bonus: 4 } } }];
  check("REGRESSION: no formula ever contains the text \"undefined\"",
    all.every(a => !initiativeFormula(a).formula.includes("undefined")));
  check("getInitiativeBonus returns null for non-KD20 actors",
    getInitiativeBonus(null) === null && getInitiativeBonus({ system: {} }) === null);
}

console.log("\n=== Initiative: turn order and ties ===");
{
  const actor = bonus => ({ system: { initiative: { bonus } } });
  const combatants = [
    { id: "a", name: "Low bonus", initiative: 15, actor: actor(1) },
    { id: "b", name: "High bonus", initiative: 15, actor: actor(3) },
    { id: "c", name: "Fastest", initiative: 20, actor: actor(0) },
    { id: "d", name: "Not rolled", initiative: null, actor: actor(5) },
    { id: "e", name: "Non-KD20 tie", initiative: 15, actor: null },
    { id: "f", name: "Also not rolled", initiative: null, actor: actor(1) }
  ];
  const order = [...combatants].sort(compareCombatants).map(c => c.id).join("");
  check("descending initiative, ties to the higher bonus, unrolled last (c b a e d f)",
    order === "cbaedf", `got ${order}`);
  check("two unrolled combatants compare without NaN",
    Number.isFinite(compareCombatants(combatants[3], combatants[5])));

  const rows = buildInitiativeRows([
    { id: "x", name: "Bran", actor: actor(1), d20: 7, bonus: 1, total: 8, missing: false },
    { id: "y", name: "Rook", actor: actor(2), d20: 14, bonus: 2, total: 16, missing: false },
    { id: "z", name: "Statue", actor: null, d20: 8, bonus: 0, total: 8, missing: true }
  ]);
  check("summary rows ranked highest first, tie to the higher bonus",
    rows.map(r => `${r.rank}${r.name}`).join(",") === "1Rook,2Bran,3Statue",
    rows.map(r => `${r.rank}${r.name}`).join(","));

  const html = compile("../templates/chat/initiative-card.hbs")({ round: 3, rows, gmOnly: false });
  check("summary card renders all combatants without NaN/undefined/null",
    badText(html).length === 0 && ["Rook", "Bran", "Statue", "Round 3"].every(s => html.includes(s)),
    badText(html).join(", "));
  check("summary card marks the actor with no KD20 data", html.includes("no KD20 data"));
}

/* -------------------------------------------- */
/*  Attack targets                              */
/* -------------------------------------------- */

const roll = await import("../module/dice/kd20-roll.mjs");

/** Remove secret elements the way the render hook does for players. */
const stripSecrets = html => html.replace(
  new RegExp(`<span[^>]*${roll.SECRET_ATTRIBUTE}[^>]*>[\\s\\S]*?</span>`, "g"), "");

console.log("\n=== Targets: reading targeted tokens ===");
{
  const tokens = [
    { name: "Goblin", document: { uuid: "Scene.s.Token.g" }, actor: { system: { ac: 13 } } },
    { name: "Boulder", document: { uuid: "Scene.s.Token.b" }, actor: { system: {} } },
    { document: { name: "Ghost", uuid: "Scene.s.Token.h" }, actor: null }
  ];
  const t = roll.describeTargets(tokens);
  check("KD20 token -> name, uuid and AC",
    t[0].name === "Goblin" && t[0].tokenUuid === "Scene.s.Token.g" && t[0].ac === 13, JSON.stringify(t[0]));
  check("non-KD20 token -> AC null", t[1].ac === null, JSON.stringify(t[1]));
  check("token with no actor -> name from the document, AC null",
    t[2].name === "Ghost" && t[2].ac === null, JSON.stringify(t[2]));
  check("no targets -> empty list", roll.describeTargets(new Set()).length === 0);

  check("hasKD20Data: character yes, empty system / null no",
    roll.hasKD20Data({ system: makeCharacter([]) }) && !roll.hasKD20Data({ system: {} }) && !roll.hasKD20Data(null));
}

console.log("\n=== Targets: what the dialog resolves to ===");
{
  const goblin = { name: "Goblin", tokenUuid: "T.g", ac: 13 };
  const boulder = { name: "Boulder", tokenUuid: "T.b", ac: null };
  const ogre = { name: "Ogre", tokenUuid: "T.o", ac: 11 };
  const r = (targets, input, revealAc = true) => roll.resolveAttackTarget({ targets, input, revealAc });
  const same = (got, want) => Object.entries(want).every(([k, v]) => JSON.stringify(got[k]) === JSON.stringify(v));

  const cases = [
    ["no target, DC typed", r([], "15"), { target: 15, targetName: null, targetFromToken: false }],
    ["no target, blank", r([], ""), { target: null, targetFromToken: false }],
    ["one target, pre-filled AC kept", r([goblin], "13"), { target: 13, targetName: "Goblin", targetFromToken: true }],
    ["one target, AC edited", r([goblin], "16"), { target: 16, targetName: "Goblin", targetFromToken: false }],
    ["one target, pre-filled AC cleared", r([goblin], ""), { target: null, targetFromToken: false }],
    ["one target, AC hidden, blank -> uses token AC", r([goblin], "", false),
      { target: 13, targetName: "Goblin", targetFromToken: true }],
    ["one target, AC hidden, override typed", r([goblin], "11", false),
      { target: 11, targetName: "Goblin", targetFromToken: false }],
    ["one target with no KD20 AC, blank", r([boulder], ""), { target: null, targetName: "Boulder" }],
    ["one target with no KD20 AC, DC typed", r([boulder], "12"), { target: 12, targetFromToken: false }],
    ["several targets", r([goblin, boulder, ogre], "99"),
      { target: null, targetFromToken: true, targets: [goblin, boulder, ogre] }]
  ];
  for ( const [label, got, want] of cases ) check(label, same(got, want), JSON.stringify(got));
}

console.log("\n=== Targets: one roll, the margin ladder per target ===");
{
  // d20 15 + str 3 = 18 against AC 5 / 13 / 20 / unknown.
  const targets = [
    { name: "Rat", ac: 5 }, { name: "Goblin", ac: 13 }, { name: "Knight", ac: 20 }, { name: "Boulder", ac: null }
  ];
  const state = {
    version: 1, kind: "attack", label: "Spear Attack", actorUuid: "Actor.x", weaponUuid: "Item.w",
    statKey: "str", statBonus: 3, d20: 15, specDie: null, actionDice: [],
    target: null, targetName: null, targetFromToken: true, targets,
    damage: { die: "d8", statKey: "str", statBonus: 3, precisionDie: "d8", dieResult: null, precisionResult: null },
    superseded: false
  };

  const dmg = roll.damageOutcome(state);
  check("damage is decided against the lowest known AC (5 -> Decisive)",
    dmg.tier === roll.TIERS.decisive && dmg.isHit, `${dmg.tier?.key}`);

  // Pretend ensureDamage rolled a 6 base and a 4 precision.
  state.damage.dieResult = 6;
  state.damage.precisionResult = 4;
  const ctx = roll.buildCardContext(state);
  const summary = ctx.targetRows.map(t => `${t.name}:${t.tier?.key ?? "none"}:${t.margin}:${t.damageTotal}`).join(" ");
  check("per-target tiers: Rat Decisive +13, Goblin Success +5, Knight Fail -2, Boulder unknown",
    summary === "Rat:decisive:13:13 Goblin:success:5:9 Knight:fail:-2:null Boulder:none:null:null", summary);
  check("Precision Die only on the Decisive target (Rat 6+3+4=13, Goblin 6+3=9)",
    ctx.targetRows[0].damageTotal === 13 && ctx.targetRows[1].damageTotal === 9);
  check("multi-target card has no single tier, target line or follow-up",
    ctx.isMulti && !ctx.hasTarget && ctx.tier === null && ctx.followUp === null);

  const template = compile("../templates/chat/roll-card.hbs");
  const html = template(ctx);
  check("multi-target card renders without NaN/undefined/null", badText(html).length === 0, badText(html).join(", "));
  check("every target is named, and the unknown one says so",
    ["Rat", "Goblin", "Knight", "Boulder", "AC unknown"].every(s => html.includes(s)));
  check("the single-target 'no target given' note is not shown", !html.includes("No target given"));

  // Spending Action Dice re-resolves every target: 18 + 12 = 30.
  state.actionDice.push(6, 6);
  const after = roll.buildCardContext(state).targetRows.map(t => t.tier?.key ?? "none").join(",");
  check("Action Dice (6, 6) re-resolve every target: supreme, decisive, decisive, none",
    after === "supreme,decisive,decisive,none", after);

  // No AC known anywhere: no hit, no damage.
  const blind = { ...state, actionDice: [], targets: [{ name: "A", ac: null }, { name: "B", ac: null }] };
  check("several targets with no known AC -> no hit, so no damage",
    roll.damageOutcome(blind).isHit === false);
}

console.log("\n=== Targets: 'Show target AC to players' hides the AC and margin ===");
{
  const template = compile("../templates/chat/roll-card.hbs");
  const base = over => ({
    version: 1, kind: "check", label: "Spear Attack", actorUuid: "Actor.x", statKey: "str",
    statBonus: 2, d20: 11, specDie: null, actionDice: [], damage: null, superseded: false, ...over
  });

  // 11 + 2 = 13 vs a token's AC 31 -> margin -18, a Hard Choice.
  const secret = template(roll.buildCardContext(base({ target: 31, targetName: "Troll", targetFromToken: true })));
  check("GM view: AC, margin and miss figure are all present",
    secret.includes("31") && secret.includes("Margin") && /by 18/.test(secret));
  const player = stripSecrets(secret);
  check("player view: AC 31 removed", !player.includes("31"));
  check("player view: margin removed", !player.includes("Margin") && !player.includes("-18"));
  check("player view: 'missed by 18' removed", !/by 18/.test(player));
  check("player view: still shows the target name, the tier and the Hard Choice",
    player.includes("Troll") && player.includes("Fail") && player.includes("Hard Choice"));
  check("player view: nothing renders as NaN/undefined/null", badText(player).length === 0, badText(player).join(", "));

  // A DC the player typed themselves is never secret.
  const manual = stripSecrets(template(roll.buildCardContext(base({ target: 31 }))));
  check("manual DC (not from a token) still shows target and margin",
    manual.includes("31") && manual.includes("Margin"));

  // Multi-target: AC 27 and 29 must vanish; the tiers stay.
  const multi = roll.buildCardContext(base({ kind: "attack", targetFromToken: true, target: null,
    targets: [{ name: "Rat", ac: 7 }, { name: "Wyrm", ac: 29 }] }));
  const multiHtml = template(multi);
  const multiPlayer = stripSecrets(multiHtml);
  check("multi GM view shows each AC", multiHtml.includes("AC 7") && multiHtml.includes("AC 29"));
  check("multi player view hides each AC and margin",
    !multiPlayer.includes("AC 7") && !multiPlayer.includes("AC 29") && !multiPlayer.includes("margin"));
  check("multi player view keeps each tier", multiPlayer.includes("Success") && multiPlayer.includes("Fail"));
}

/* -------------------------------------------- */
/*  End-to-end rolls against stubbed Foundry    */
/* -------------------------------------------- */

/**
 * Just enough of Roll, ChatMessage and friends to run the real roll functions.
 * Every die rolls a scripted face (default: its maximum), and each formula
 * handed to Roll is recorded, so the tests can assert exactly what was rolled.
 */
const harness = {
  formulas: [],
  faces: [],          // queue of forced faces, consumed one per die rolled
  posted: [],
  warnings: [],
  reset() { this.formulas = []; this.faces = []; this.posted = []; this.warnings = []; }
};
globalThis.Roll = class {
  constructor(formula) { this.formula = formula; }
  async evaluate() {
    harness.formulas.push(this.formula);
    this.dice = [];
    let total = 0;
    for ( const [, sign, term] of this.formula.matchAll(/([+-]?)([^+-]+)/g) ) {
      const m = term.match(/^(\d+)d(\d+)$/);
      let value;
      if ( m ) {
        const results = Array.from({ length: Number(m[1]) },
          () => ({ result: harness.faces.length ? harness.faces.shift() : Number(m[2]) }));
        this.dice.push({ results });
        value = results.reduce((s, r) => s + r.result, 0);
      } else if ( /^\d+$/.test(term) ) value = Number(term);
      else throw new Error(`stub Roll cannot parse "${this.formula}"`);
      total += sign === "-" ? -value : value;
    }
    this.total = total;
    return this;
  }
};
globalThis.ui = { notifications: { warn: m => harness.warnings.push(m), info: () => {}, error: m => harness.warnings.push(m) } };
foundry.utils.deepClone ??= o => structuredClone(o);
foundry.applications = { handlebars: { renderTemplate: async (path, ctx) => compile("../templates/chat/roll-card.hbs")(ctx) } };
foundry.documents = { ChatMessage: { implementation: {
  getSpeaker: () => ({}),
  create: async data => { harness.posted.push(data); return data; }
} } };

/** A KD20-shaped actor: str +2, dex +1, 3 Action Dice. */
const stubActor = () => {
  const stat = bonus => ({ bonus });
  const actor = {
    uuid: "Actor.stub", name: "Stub", isOwner: true,
    system: {
      stats: { str: stat(2), dex: stat(1), con: stat(0), int: stat(0), wis: stat(0), cha: stat(0) },
      actionDice: { value: 3, refresh: 3 },
      saves: { withstand: { stat: "str", statBonus: 2, profile: 3, hardened: { bonus: 0 } } },
      gatewayName: "Warrior"
    },
    async update(diff) { this.system.actionDice.value = diff["system.actionDice.value"]; }
  };
  return actor;
};

/** A weapon item whose system data went through the real model. */
const stubWeapon = (name, data) => {
  const system = new models.weapon(data, { parent: null });
  system.prepareDerivedData();
  return { name, uuid: `Item.${name}`, system };
};

const lastState = () => harness.posted.at(-1).flags.kd20.state;
const lastHtml = () => harness.posted.at(-1).content;

console.log("\n=== v0.9.0 A: damage dice expressions ===");
{
  const cfg = await import("../module/config.mjs");
  for ( const ok of ["d6", "1d6", "2d8", "1d10+1d6", "3d6", "2d8+4", "1d12-1", " 2D8 + 1d6 ", "d100"] ) {
    check(`"${ok}" is a valid damage expression`, cfg.isValidDamageDice(ok));
  }
  for ( const bad of ["", "6", "d", "2d", "d1", "0d6", "2d8+", "+2d8", "2d8*2", "1d6+abc", "2x8", "101d6", "d6d6", "2d8 4"] ) {
    check(`"${bad}" is rejected`, !cfg.isValidDamageDice(bad));
  }
  check("formula: bare d6 -> 1d6 (unchanged behaviour)", cfg.damageFormula("d6") === "1d6");
  check("formula: 2d8 stays 2d8", cfg.damageFormula("2d8") === "2d8");
  check("formula: d10+d6 -> 1d10+1d6", cfg.damageFormula("d10+d6") === "1d10+1d6", cfg.damageFormula("d10+d6"));
  check("formula: whitespace/case normalised", cfg.damageFormula(" 2D8 + 1d6 ") === "2d8+1d6");
  check("largest die: 1d10+1d6 -> d10", cfg.largestDamageDie("1d10+1d6") === "d10");

  // The schema accepts old and new values and refuses junk.
  const field = schemas.weapon.fields.damageDie;
  check("schema accepts a legacy single die (d6)", !field.validate("d6"));
  check("schema accepts 2d8", !field.validate("2d8"));
  const err = field.validate("2d8*banana");
  check("schema rejects a bad expression with a clear message",
    Boolean(err) && /not a damage dice expression/.test(err.message ?? String(err)), String(err?.message ?? err));

  // Precision die defaults.
  check("precision default for 2d8 is d8", stubWeapon("A", { damageDie: "2d8" }).system.effectivePrecisionDie === "d8");
  check("precision default for 1d10+1d6 is d10",
    stubWeapon("B", { damageDie: "1d10+1d6" }).system.effectivePrecisionDie === "d10");
  check("explicit precision still wins",
    stubWeapon("C", { damageDie: "2d8", precisionDie: "d4" }).system.effectivePrecisionDie === "d4");

  // End to end: a legacy d6 weapon rolls exactly 1d20, then 1d6, as before.
  harness.reset();
  const actor = stubActor();
  harness.faces = [15, 4];      // d20 15 + str 2 = 17 vs AC 13 -> Success; damage d6 shows 4
  await roll.rollAttack({ actor, weapon: stubWeapon("Short Sword", { damageDie: "d6" }), target: 13 });
  check("legacy d6 weapon: Roll formulas are exactly 1d20, 1d6", harness.formulas.join(",") === "1d20,1d6",
    harness.formulas.join(","));
  check("legacy d6 weapon: damage 4 + str 2 = 6",
    /Damage total<\/th>\s*<td>6</.test(lastHtml()), lastHtml().match(/Damage total[\s\S]{0,40}/)?.[0]);

  // A 2d8 weapon rolls 2d8, plus the stat on top.
  harness.reset();
  harness.faces = [15, 3, 5];   // d20 15; 2d8 shows 3 + 5 = 8
  await roll.rollAttack({ actor, weapon: stubWeapon("Gorge", { damageDie: "2d8" }), target: 13 });
  check("2d8 weapon: Roll formulas are 1d20, 2d8", harness.formulas.join(",") === "1d20,2d8", harness.formulas.join(","));
  check("2d8 weapon: card shows the 2d8 row and total 8 + str 2 = 10",
    lastHtml().includes("<th>2d8</th>") && /Damage total<\/th>\s*<td>10</.test(lastHtml()));
  check("2d8 weapon card renders with no NaN/undefined/null", badText(lastHtml()).length === 0, badText(lastHtml()).join(","));

  // A Decisive hit with a multi-die weapon adds ONE precision die of the largest size.
  harness.reset();
  harness.faces = [20, 1, 1, 6];   // 20 + 2 = 22 vs AC 10 -> Decisive
  await roll.rollAttack({ actor, weapon: stubWeapon("Maul", { damageDie: "1d10+1d6" }), target: 10 });
  check("1d10+1d6 Decisive: formulas 1d20, 1d10+1d6, 1d10 (one precision die)",
    harness.formulas.join(",") === "1d20,1d10+1d6,1d10", harness.formulas.join(","));
}

console.log("\n=== v0.9.0 B: Devotion feats (deity, vow, dormant) ===");
{
  check("feat defaults: deity blank, vow blank, not dormant",
    defaults.feat.deity === "" && defaults.feat.vow === "" && defaults.feat.dormant === false);
  const featErr = schemas.feat.validate({ ...defaults.feat, deity: "Kael", vow: "marked by Kael", dormant: true });
  check("a Devotion feat validates", !featErr, String(featErr));

  // Stubs for the Foundry form helpers the item sheets use.
  for ( const [name, fn] of Object.entries({
    selectOptions: () => "",
    formInput: () => "",
    checked: v => (v ? "checked" : "")
  }) ) if ( !Handlebars.helpers[name] ) Handlebars.registerHelper(name, fn);

  const featSheet = compile("../templates/item/feat.hbs");
  const render = system => featSheet({
    document: { name: "Smite", img: "x.svg" }, editable: true, enriched: {}, systemFields: {}, choices: {},
    system: { ...defaults.feat, ...system }
  });
  const rootClass = html => html.match(/<div class="(kd20-sheet kd20-item-sheet[^"]*)"/)?.[1];

  const ordinary = render({});
  check("ordinary feat: not greyed, no dormant banner",
    rootClass(ordinary) === "kd20-sheet kd20-item-sheet" && !ordinary.includes("kd20-dormant-banner"), rootClass(ordinary));
  check("ordinary feat: Devotion fields present but empty",
    /name="system.deity" value=""/.test(ordinary) && /name="system.vow" value=""/.test(ordinary));

  const devoted = render({ deity: "Kael", vow: "marked by Kael, exclusive worship" });
  check("Devotion feat shows its deity and vow",
    devoted.includes('value="Kael"') && devoted.includes('value="marked by Kael, exclusive worship"'));
  check("faithful Devotion feat is not greyed", !rootClass(devoted).includes("kd20-dormant"));

  const lapsed = render({ deity: "Kael", vow: "marked by Kael", dormant: true });
  check("dormant feat: sheet greyed and banner shown",
    rootClass(lapsed).includes("kd20-dormant") && lapsed.includes("kd20-dormant-banner"));
  check("dormant feat: the toggle renders checked", /name="system.dormant"\s*checked/.test(lapsed));
  check("feat sheet renders with no NaN/undefined/null", badText(lapsed).length === 0, badText(lapsed).join(","));

  // The character sheet's feat list greys a dormant feat too.
  const sheetSrc = fs.readFileSync(new URL("../templates/actor/character.hbs", import.meta.url), "utf8");
  const listSrc = sheetSrc.match(/\{\{#each feats as \|item\|\}\}[\s\S]*?\{\{\/each\}\}/)[0];
  const list = Handlebars.compile(listSrc)({ editable: true, saveLabels: {}, feats: [
    { id: "a", name: "Weapon Master", img: "x", system: { ...defaults.feat } },
    { id: "b", name: "Smite", img: "x", system: { ...defaults.feat, deity: "Kael", dormant: true } }
  ] });
  const rows = list.split("<li").slice(1);
  check("character sheet: ordinary feat row unchanged (not greyed, no Devotion tag)",
    !rows[0].includes("kd20-dormant") && !rows[0].includes("Devotion"));
  check("character sheet: dormant Devotion feat row greyed and tagged",
    rows[1].includes("kd20-dormant") && rows[1].includes("Devotion (Kael)") && rows[1].includes("dormant"));
}

console.log("\n=== v0.9.0 C: Specialization Die size + GM modifier ===");
{
  const actor = stubActor();
  const cardFor = state => compile("../templates/chat/roll-card.hbs")(roll.buildCardContext(state));
  /** The state exactly as v0.8.0 stored it: no specDieSize, no modifier. */
  const asV080 = state => { const s = { ...state }; delete s.specDieSize; delete s.modifier; return s; };

  // SAFETY NET: None + 0 must be identical to today, for every roll kind.
  for ( const [kind, run] of [
    ["check", () => roll.rollCheck({ actor, statKey: "str", target: 13, specDieSize: "", modifier: 0 })],
    ["save", () => roll.rollSave({ actor, saveKey: "withstand", target: 13, specDieSize: "", modifier: 0 })],
    ["attack", () => roll.rollAttack({ actor, weapon: stubWeapon("Sword", { damageDie: "d6" }), target: 13 })]
  ] ) {
    harness.reset();
    harness.faces = [11, 4];
    await run();
    const state = lastState();
    check(`${kind}, None + 0: only ${kind === "attack" ? "1d20, 1d6 (damage)" : "1d20"} rolled`,
      harness.formulas.join(",") === (kind === "attack" ? "1d20,1d6" : "1d20"), harness.formulas.join(","));
    check(`${kind}, None + 0: specDie null, modifier 0`, state.specDie === null && state.modifier === 0);
    check(`${kind}, None + 0: total unchanged (${roll.computeTotal(asV080(state))})`,
      roll.computeTotal(state) === roll.computeTotal(asV080(state)));
    check(`${kind}, None + 0: card HTML byte-identical to the v0.8.0 card`,
      lastHtml() === cardFor(asV080(state)));
    check(`${kind}, None + 0: no Specialization or Modifier row`,
      !lastHtml().includes("Specialization") && !lastHtml().includes("Modifier"));
  }

  // Defaults: calling with no options at all is also None + 0.
  harness.reset();
  harness.faces = [11];
  await roll.rollCheck({ actor, statKey: "str", target: 13 });
  check("omitted options default to no spec die, modifier 0",
    harness.formulas.join(",") === "1d20" && lastState().specDie === null && lastState().modifier === 0);

  // Old cards (v0.8.0 states with a spec die) still label it d6.
  const oldCard = roll.buildCardContext({ kind: "check", label: "x", statKey: "str", statBonus: 2, d20: 10,
    specDie: 4, actionDice: [], target: null });
  check("a pre-v0.9.0 card with a spec die still reads 'Specialization d6'",
    oldCard.parts.some(p => p.label === "Specialization d6" && p.value === 4));

  // Each size rolls ONE die of that size, and the card says so.
  for ( const size of ["d6", "d8", "d10", "d12"] ) {
    harness.reset();
    harness.faces = [10, 5];
    await roll.rollCheck({ actor, statKey: "str", target: 13, specDieSize: size });
    check(`${size} pick: rolls 1d20 then 1${size}, card label 'Specialization ${size}', total 10+2+5 = 17`,
      harness.formulas.join(",") === `1d20,1${size}`
      && lastHtml().includes(`<th>Specialization ${size}</th>`)
      && lastState().specDieSize === size && roll.computeTotal(lastState()) === 17,
      `${harness.formulas.join(",")} total ${roll.computeTotal(lastState())}`);
  }
  harness.reset();
  harness.faces = [10, 7];
  await roll.rollAttack({ actor, weapon: stubWeapon("Sword", { damageDie: "d6" }), specDieSize: "d8", target: null });
  check("attack with d8 spec die rolls 1d8", harness.formulas.join(",") === "1d20,1d8", harness.formulas.join(","));
  harness.reset();
  harness.faces = [10, 7];
  await roll.rollSave({ actor, saveKey: "withstand", specDieSize: "d10", target: null });
  check("save with d10 spec die rolls 1d10", harness.formulas.join(",") === "1d20,1d10", harness.formulas.join(","));

  // GM modifier.
  harness.reset();
  harness.faces = [10];
  await roll.rollCheck({ actor, statKey: "str", target: 13, modifier: 3 });
  check("+3 modifier: total 10 + 2 + 3 = 15", roll.computeTotal(lastState()) === 15);
  check("+3 modifier: shown on the card as a +3 Modifier row (not a die)",
    /<th>Modifier<\/th>\s*<td>\s*\+3\s*<\/td>/.test(lastHtml()), lastHtml().match(/Modifier[\s\S]{0,60}/)?.[0]);
  check("+3 modifier: card total reads 15", /Total<\/th>\s*<td>15</.test(lastHtml()));
  const minus = roll.buildCardContext({ ...lastState(), modifier: -5 });
  check("-5 modifier: row reads -5 and total drops to 7",
    minus.parts.some(p => p.label === "Modifier" && p.value === -5 && !p.isDie) && minus.total === 7);
  check("+3 modifier can turn a Fail into a Success (12 vs 13 -> 15 vs 13)",
    roll.buildCardContext({ ...lastState(), modifier: 0 }).tier.key === "fail" && lastState() && roll.buildCardContext(lastState()).tier.key === "success");

  // Dialog parsing.
  const r = roll.readDialogOptions;
  check("dialog: None -> no die, blank modifier -> 0",
    JSON.stringify(r({ specDieSize: "", modifier: "" })) === JSON.stringify({ specDieSize: "", modifier: 0 }));
  check("dialog: d12 and -3 pass through", r({ specDieSize: "d12", modifier: -3 }).specDieSize === "d12"
    && r({ specDieSize: "d12", modifier: -3 }).modifier === -3);
  check("dialog: unknown size -> none; junk modifier -> 0; 2.6 -> 3",
    r({ specDieSize: "d20" }).specDieSize === "" && r({ modifier: "abc" }).modifier === 0 && r({ modifier: 2.6 }).modifier === 3);

  // The real prompts, with DialogV2 stubbed to "submit" a chosen form.
  let dialogHtml = "";
  let submit = {};
  foundry.applications.api = { DialogV2: { input: async ({ content }) => { dialogHtml = content; return submit; } } };
  game.user = { isGM: true };
  submit = { target: "14", specDieSize: "d8", modifier: 3 };
  const checkOpts = await roll.promptRollOptions("Strength Check");
  check("promptRollOptions returns target, specDieSize and modifier (no useSpecDie)",
    JSON.stringify(checkOpts) === JSON.stringify({ target: 14, specDieSize: "d8", modifier: 3 }), JSON.stringify(checkOpts));
  check("dialog: a specDieSize select with None/d6/d8/d10/d12, None selected, no checkbox",
    /<select[^>]*name="specDieSize"/.test(dialogHtml) && !dialogHtml.includes("useSpecDie")
    && ["", "d6", "d8", "d10", "d12"].every(v => dialogHtml.includes(`<option value="${v}"`))
    && /<option value="" selected>None<\/option>/.test(dialogHtml));
  check("dialog: Convergence note and modifier field present",
    dialogHtml.includes("d8/d10/d12 = Convergence (v0.44 playtest)")
    && /<input[^>]*type="number" name="modifier" value="0"/.test(dialogHtml)
    && dialogHtml.includes("Modifier (situational ±, e.g. ±1/3/5 or in between)"));
  submit = { target: "", specDieSize: "", modifier: 0 };
  const atkOpts = await roll.promptAttackOptions("Sword Attack", []);
  check("promptAttackOptions returns specDieSize and modifier alongside the target fields",
    atkOpts.specDieSize === "" && atkOpts.modifier === 0 && atkOpts.target === null && !("useSpecDie" in atkOpts),
    JSON.stringify(atkOpts));

  // Spend Action Dice on a d8 + modifier card: the button logic is size-agnostic.
  harness.reset();
  harness.faces = [10, 6];     // d20 10, d8 6; + str 2 + mod 3 = 21 vs AC 25 -> Fail
  const weapon = stubWeapon("Sword", { damageDie: "2d8" });
  await roll.rollAttack({ actor, weapon, target: 25, specDieSize: "d8", modifier: 3 });
  const first = harness.posted.at(-1);
  check("d8 + mod card: Fail at 21 vs 25, no damage yet", roll.computeTotal(lastState()) === 21
    && lastState().damage.dieResult === null);
  const flags = { ...first.flags.kd20 };
  const message = { getFlag: (s, k) => flags[k], setFlag: async (s, k, v) => { flags[k] = v; } };
  globalThis.fromUuid = async () => actor;
  actor.system.actionDice.value = 3;
  harness.formulas = [];
  harness.faces = [5, 4, 2, 3];  // 2 Action Dice 5 + 4 -> 30 vs 25 Success; 2d8 damage 2 + 3
  await roll.spendActionDice(message, 2);
  const spent = lastState();
  check("spend 2 Action Dice: 1 more card, pool 3 -> 1, old card superseded",
    harness.posted.length === 2 && actor.system.actionDice.value === 1 && flags.superseded === true);
  check("spend keeps the d8 spec die and the modifier: total 10+2+6+3+5+4 = 30",
    roll.computeTotal(spent) === 30 && spent.specDie === 6 && spent.specDieSize === "d8" && spent.modifier === 3);
  check("re-posted card: Specialization d8 and Modifier rows, Success, 2d8 damage 5 + str 2 = 7",
    lastHtml().includes("Specialization d8") && /<th>Modifier<\/th>/.test(lastHtml())
    && lastHtml().includes("re-posted") && /Damage total<\/th>\s*<td>7</.test(lastHtml()),
    harness.formulas.join(","));
  check("spend rolled only 2d6 then the 2d8 damage (no re-roll of d20/spec die)",
    harness.formulas.join(",") === "2d6,2d8", harness.formulas.join(","));
  check("re-posted card renders with no NaN/undefined/null", badText(lastHtml()).length === 0, badText(lastHtml()).join(","));
  check("no warnings raised during any roll", harness.warnings.length === 0, harness.warnings.join(" | "));
}

/* -------------------------------------------- */

console.log("\n" + (failures ? `*** ${failures} CHECK(S) FAILED ***` : "ALL CHECKS PASS"));
process.exitCode = failures ? 1 : 0;
