/**
 * KD20 system entry point.
 *
 * This file is loaded by Foundry because system.json lists it under
 * "esmodules". Its only job is to tell Foundry which data models and sheets
 * belong to which document types.
 */

import KD20CharacterData from "./data/actor-character.mjs";
import KD20GatewayData from "./data/item-gateway.mjs";
import KD20FeatData from "./data/item-feat.mjs";
import KD20WeaponData from "./data/item-weapon.mjs";
import KD20ArmourData from "./data/item-armour.mjs";

import KD20CharacterSheet from "./sheets/actor-sheet.mjs";
import KD20ItemSheet from "./sheets/item-sheet.mjs";

import { KD20Combat, KD20Combatant } from "./documents/combat.mjs";
import { INITIATIVE_FORMULA } from "./combat/initiative.mjs";

import { seedCompendiums, CONTENT_VERSION } from "./seed-content.mjs";
import * as dice from "./dice/kd20-roll.mjs";

Hooks.once("init", () => {
  console.log("KD20 | Initialising the KD20 system");

  // Make our classes reachable from the console for troubleshooting, and
  // expose the compendium seeding helper for manual re-runs.
  game.kd20 = {
    KD20CharacterData,
    KD20GatewayData,
    KD20FeatData,
    KD20WeaponData,
    KD20ArmourData,
    KD20CharacterSheet,
    KD20ItemSheet,
    KD20Combat,
    KD20Combatant,
    seedCompendiums,
    dice
  };

  // Attach data models to the document subtypes declared in system.json.
  // Without these, `system` would just be an untyped object.
  CONFIG.Actor.dataModels.character = KD20CharacterData;
  CONFIG.Item.dataModels.gateway = KD20GatewayData;
  CONFIG.Item.dataModels.feat = KD20FeatData;
  CONFIG.Item.dataModels.weapon = KD20WeaponData;
  CONFIG.Item.dataModels.armour = KD20ArmourData;

  // Initiative: 1d20 + better of dex or wis, re-rolled every round. Without a
  // formula here, core rolls the literal text "undefined". KD20Combatant builds
  // the real formula per actor; this default is for anything that reads CONFIG.
  CONFIG.Combat.documentClass = KD20Combat;
  CONFIG.Combatant.documentClass = KD20Combatant;
  CONFIG.Combat.initiative = { formula: INITIATIVE_FORMULA, decimals: 0 };

  // Register sheets. Foundry core ships no default Actor or Item sheet, so
  // there is nothing to unregister first (verified in the v14 source).
  foundry.documents.collections.Actors.registerSheet("kd20", KD20CharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "KD20 Character Sheet"
  });

  foundry.documents.collections.Items.registerSheet("kd20", KD20ItemSheet, {
    types: ["gateway", "feat", "weapon", "armour"],
    makeDefault: true,
    label: "KD20 Item Sheet"
  });

  // Records which batch of reference content this world has already received,
  // so the compendiums are only auto-filled once.
  game.settings.register("kd20", "seededContentVersion", {
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // When off, players see a targeted token's outcome tier but not its AC, the
  // margin, or the "missed by" figure (any of which would reveal the AC).
  game.settings.register("kd20", "showTargetAc", {
    name: "KD20.Settings.showTargetAc.name",
    hint: "KD20.Settings.showTargetAc.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true
  });
});

/* -------------------------------------------- */

// Wire up the buttons on our roll cards. In v14 this hook passes a plain
// HTMLElement; the older `renderChatMessage` hook (jQuery) is deprecated.
Hooks.on("renderChatMessageHTML", dice.onRenderChatCard);

/* -------------------------------------------- */

Hooks.once("ready", async () => {
  if ( !game.user.isGM ) return;

  // Fill the compendium packs with the reference content from the design docs,
  // once per content version: new entries are added and existing ones refreshed
  // to match. Deleting an entry afterwards will not make it reappear until the
  // next version; run game.kd20.seedCompendiums() if you want it back.
  if ( game.settings.get("kd20", "seededContentVersion") === CONTENT_VERSION ) return;
  await seedCompendiums({ refresh: true });
  await game.settings.set("kd20", "seededContentVersion", CONTENT_VERSION);
});
