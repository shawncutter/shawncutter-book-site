---
title: "Pocket Computers and Cold Thumbs"
arc: forged
status: draft
date_written: "2026-01-04"
themes: [resilience, accident, farm, startup, technology, faith]
---

# Pocket Computers and Cold Thumbs

_If it doesn’t work with gloves and bad coverage, it doesn’t work._

Server room hum. Early mobile days. We tried BlackBerry and Windows CE on devices that felt like calculators in witness protection. On paper, everything “worked.” In the field, latency and crashes made enemies.

Then the iPhone arrived. A slab of glass that could render the web without lying. We built one of the first oilfield web apps we’d ever seen run clean on it—thin, fast, honest about the network. Later, we added a native layer where it actually helped. The rule was simple: **web‑first until native earns its keep.**

There was a 3 a.m. pivot in there—killing a shiny PhoneGap build inside Visual Studio after a stubborn test told us it wouldn’t carry a public launch. We switched to a web‑first mobile framework and shipped the loop operators needed at 3 a.m., not the one that looked good at 3 p.m.

FieldVisor stuck because it was faithful to the job. It still runs—scale measured in wells, not slides. Not because we were geniuses, but because we let the job tell us what the device was allowed to be.

**AI tie.** Now AI is our harness. It generates **failure‑mode tests** for offline, stale auth, and partial data. It writes acceptance criteria in the operator’s words and drafts the two‑minute field manual before any slide deck exists. Pretty comes last.

_Rule: Build for cold thumbs and bad coverage._

## **AI Playbook — Field‑First Mobile Gate**

**Purpose:** Make mobile survive where it runs. **Prompt:** “Define the 3 a.m. task the user must complete offline/low‑bandwidth. (1) Have AI generate failure‑mode tests (offline, stale auth, partial data), (2) write acceptance criteria in operator language, (3) ship the web‑first loop, (4) add native only if it beats the tests.” **Constraints:** Load \<3s on 2G • One action per screen • Offline behavior defined and tested.

**Image Prompts**

1. _Header:_ “Gloved hand holding an early smartphone with a simple web app open over a dawn wellsite; frost breath; cinematic realism.”

2. _Inline:_ “Battered BlackBerry beside a first‑gen iPhone on a truck hood; small dashboard open; macro detail.”

_Tags: memoir, AI, startups, farming, energy, leadership, resilience_

