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
  weapon: (await import("../module/data/item-weapon.mjs")).default
};

console.log("=== Schemas build and expose the expected fields ===");

/** Spec sections 2-4: the fields each model must have. */
const EXPECTED = {
  character: ["stats", "hp", "defence", "actionDice", "xp", "conditions", "biography"],
  gateway: ["description", "hpBonus", "saveProfile", "unarmoredStat", "benefit", "costXp"],
  feat: ["description", "featType", "trigger", "effect", "grantsSpecializationDie",
    "prerequisite", "costXp", "mechanic"],
  weapon: ["description", "damageDie", "precisionDie", "attackStat", "damageStat",
    "reach", "properties"]
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
checkDefault("weapon damageDie", defaults.weapon.damageDie, "d6");

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
    defence: { armour: 2, shield: 0, misc: 0 }
  }, { parent: null });

  // prepareDerivedData reads this.parent.items; emulate an owned Warrior gateway.
  Object.defineProperty(bran, "parent", {
    value: { items: [{ type: "gateway", system: { hpBonus: 6 } }] },
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
const makeCharacter = (items, parent = { items }, defence = { armour: 2, shield: 0, misc: 0 }) => {
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
  check("no gateway: AC unaffected (13)", noGateway.ac === 13, `got ${noGateway.ac}`);
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
  check("Warrior: AC unaffected by profile (13)", warrior.ac === 13, `got ${warrior.ac}`);

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
/*  AC feats (core rules v0.39)                 */
/* -------------------------------------------- */

console.log("\n=== AC feats: Armour Training and Unarmored Defense change computed AC ===");
{
  // Test stats: dex +1, con +2, wis +1.
  const at = { type: "feat", name: "Armour Training", system: { mechanic: { kind: "armourTraining", save: "" } } };
  const ud = { type: "feat", name: "Unarmored Defense", system: { mechanic: { kind: "unarmoredDefense", save: "" } } };
  const warrior = { type: "gateway", name: "Warrior", system: { hpBonus: 6, saveProfile: warriorProfile } };
  const barbarian = { type: "gateway", name: "Barbarian", system: { hpBonus: 6, unarmoredStat: "con" } };
  const ac = (items, defence) => {
    const c = makeCharacter(items, undefined, { armour: 0, armourType: "none", shield: 0, misc: 0, ...defence });
    const sum = c.acParts.reduce((t, p) => t + p.value, 0);
    if ( sum !== c.ac ) fail(`AC breakdown ${JSON.stringify(c.acParts)} sums to ${sum}, not ${c.ac}`);
    return c;
  };

  check("no feats: 10 + dex 1 + armour 4 + shield 1 = 16",
    ac([warrior], { armour: 4, armourType: "medium", shield: 1 }).ac === 16);

  let c = ac([warrior, at], { armour: 4, armourType: "medium" });
  check("Armour Training x1 in medium armour: 10 + 1 + 4 + 1 = 16", c.ac === 16, `got ${c.ac}`);
  c = ac([warrior, at, at], { armour: 6, armourType: "heavy" });
  check("Armour Training x2 in heavy armour: 10 + 1 + 6 + 2 = 19", c.ac === 19, `got ${c.ac}`);
  c = ac([warrior, at, at, at], { armour: 6, armourType: "heavy" });
  check("Armour Training x3: still +2 (max), flagged", c.ac === 19 && Boolean(c.acFeats.armourTraining.reason),
    JSON.stringify(c.acFeats));
  c = ac([warrior, at], { armour: 1, armourType: "light" });
  check("Armour Training in light armour: no bonus, flagged (12)",
    c.ac === 12 && c.acFeats.armourTraining.bonus === 0 && Boolean(c.acFeats.armourTraining.reason), JSON.stringify(c.acFeats));
  c = ac([warrior, at], { armourType: "none" });
  check("Armour Training with no armour: no bonus (11)", c.ac === 11, `got ${c.ac}`);

  c = ac([barbarian, ud], { armourType: "none", shield: 1 });
  check("Unarmored Defense (Barbarian con), no armour: 10 + dex 1 + con 2 + shield 1 = 14",
    c.ac === 14 && c.acFeats.unarmoredDefense.active, `got ${c.ac}`);
  c = ac([barbarian, ud], { armour: 1, armourType: "light" });
  check("Unarmored Defense in light armour replaces the armour term (13, not 12)", c.ac === 13, `got ${c.ac}`);
  c = ac([barbarian, ud], { armour: 4, armourType: "medium" });
  check("Unarmored Defense in medium armour: inactive, normal AC (15), flagged",
    c.ac === 15 && !c.acFeats.unarmoredDefense.active && Boolean(c.acFeats.unarmoredDefense.reason), JSON.stringify(c.acFeats));
  c = ac([warrior, ud], { armourType: "none" });
  check("Unarmored Defense under a gateway with no themed stat: inactive, flagged (11)",
    c.ac === 11 && Boolean(c.acFeats.unarmoredDefense.reason), JSON.stringify(c.acFeats));
  c = ac([ud], { armourType: "none" });
  check("Unarmored Defense with no gateway at all: inactive (11)", c.ac === 11 && !c.acFeats.unarmoredDefense.active);
  const monk = { type: "gateway", name: "Monk", system: { unarmoredStat: "wis" } };
  check("the gateway names the stat: Monk wis gives 10 + 1 + 1 = 12",
    ac([monk, ud], { armourType: "none" }).ac === 12);

  // Mutually exclusive by requirement: whatever is worn, at most one applies.
  for ( const armourType of ["none", "light", "medium", "heavy"] ) {
    c = ac([barbarian, at, ud], { armour: 3, armourType });
    const both = (c.acFeats.armourTraining.bonus > 0) && c.acFeats.unarmoredDefense.active;
    const expected = ["medium", "heavy"].includes(armourType) ? 10 + 1 + 3 + 1 : 10 + 1 + 2;
    check(`both feats owned, ${armourType} armour: exactly one applies (AC ${expected})`,
      !both && c.ac === expected, `got ${c.ac} ${JSON.stringify(c.acFeats)}`);
  }

  check("no AC hard cap: misc 10 on top of a maxed build still counts (29)",
    ac([warrior, at, at], { armour: 6, armourType: "heavy", misc: 10 }).ac === 29);
  check("AC feats leave the Saves alone",
    Object.values(ac([warrior, at, at], { armour: 6, armourType: "heavy" }).saves)
      .every(x => x.hardened.bonus === 0));
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

  const { CONTENT_VERSION } = await import("../module/seed-content.mjs");
  check("CONTENT_VERSION bumped to 8", CONTENT_VERSION === "8", `got ${CONTENT_VERSION}`);
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

console.log("\n" + (failures ? `*** ${failures} CHECK(S) FAILED ***` : "ALL CHECKS PASS"));
process.exitCode = failures ? 1 : 0;
