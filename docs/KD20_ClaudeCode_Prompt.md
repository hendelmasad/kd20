# Claude Code Prompt — KD20 Foundry VTT v14 System Build

*Paste the block below into Claude Code. The four KD20 `.md` files (Implementation Spec + three rulebooks) are in `E:\FoundryVTTData\Data\systems\kd20\docs\`. The Foundry data path is already filled in.*

---

I'm building a **Foundry VTT game system** called **KD20** for my own tabletop RPG. I am **not a programmer** — you must explain each step in plain English, tell me exactly what to click or check to verify it works, and never assume I can read or debug code myself.

## The spec
My design docs are in the **`docs\` subfolder** (`E:\FoundryVTTData\Data\systems\kd20\docs\`). **The authoritative spec is `docs\KD20_Implementation_Spec.md`** — read it first and follow it exactly, including its build-priority order (§0) and its verification checklist (§9). The fuller rulebooks (`docs\KD20_Rules.md`, `docs\KD20_Feats.md`, `docs\KD20_Quick_Reference.md`) are reference for design context if you need it, but the implementation spec is the source of truth for what to build. (These `docs\` files are design reference only — they are **not** part of the shipped system; don't treat them as system data or packs.) Where anything is ambiguous, **ask me — do not guess.**

## The target
- **Foundry VTT version 14, build 368.** In `system.json`, set `compatibility` accordingly (minimum and verified around `14.368`).
- Use **modern v14 APIs only** — ApplicationV2 and DataModels. Do **not** use legacy patterns (ApplicationV1, template.json-only data, pre-v12 idioms).
- **Before writing Foundry code, study a current working v14 system** so your APIs are correct and current. You have two sources:
  - **Installed systems on this machine:** go up one directory level to `E:\FoundryVTTData\Data\systems\` — there are many other installed systems there to read directly. **Be selective:** inspect each candidate's `system.json` `compatibility` and its code, and learn **only** from systems that are genuinely current-v14-native (modern ApplicationV2 + DataModel patterns). **Ignore older systems** that merely run on v14 via backward-compatibility but use legacy patterns (ApplicationV1, template.json-only data, pre-v12 idioms) — copying those would produce stale code. Tell me which installed system(s) you chose as references and why.
  - **Online reference** (if the installed ones aren't clearly modern): fetch the **Boilerplate system by asacolips** (`asacolips-projects/foundry-vtt-system-template`) and/or the official Foundry sample system on GitHub.
  Match current manifest structure and modern patterns. **Do not write Foundry code from memory without checking it against a current v14 reference.**
- For any Foundry API you're unsure is current in v14, **consult the official Foundry VTT v14 API documentation rather than guessing**, and flag to me — in plain English — any place where you're relying on an API that may have changed.

## The location
The system folder already exists at `E:\FoundryVTTData\Data\systems\kd20` (Windows). You are working inside it. Do not create subfolders by guesswork — create the structure you propose (below) so folder names, manifest paths, and code all agree.

## Top priority: it must LOAD
The single most important first milestone is that **Foundry v14 (build 368) loads the system with zero console errors.** Get a minimal valid `system.json` loadable *first*, before any features. Then tell me exactly how to verify: restart Foundry, where to look in the systems list, how to open the browser console (F12), and what "no errors" looks like. Do not proceed to features until I confirm it loads clean.

## How to work with me (I can't debug)
Work in **small, verifiable steps.** After each step:
1. Summarize in plain English what you just did.
2. Tell me the **exact thing to check in Foundry** to confirm it works (what to click, what I should see).
3. **Wait for me to confirm** before continuing to the next step.

Follow the build-priority order from the spec (§0):
1. Loadable `system.json` manifest.
2. Character actor DataModel (six stats + computed bonuses + computed AC/HP/Initiative + Action Dice pool).
3. Item types: Gateway, Feat, Weapon.
4. Character sheet (ApplicationV2 + Handlebars).
5. Core roll (1d20 + stat + optional Specialization d6 → margin → outcome tier → chat), per spec §1 and §5.
6. Action Dice spend control (roll Nd6, sum, add to last roll, decrement pool, re-post tier), per spec §6.

## Before any code
Propose, for my approval:
- the **file/folder structure** you'll create, and
- a short **data-model plan** (what fields live on the Character actor and each item type, per spec §2–§4).

Then build step by step, pausing for my confirmation as described.

## Scope
**v1 only**, as defined in spec §7. Leave these as clearly-commented TODOs, do **not** build them yet: threat/NPC actors, automated States/conditions (a plain text notes field is enough), magic trapping automation, equipment/armour tables (manual armour/shield fields are fine), XP automation (a plain number field is fine), and the Master Feat's die-stacking.

When v1 is built, walk me through the **verification checklist (spec §9)** item by item so I can confirm each of the seven acceptance tests passes.
