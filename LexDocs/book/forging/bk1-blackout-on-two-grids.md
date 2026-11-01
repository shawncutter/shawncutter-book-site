---
title: "Blackout on Two Grids"
kind: scene
arc: forging
status: draft
date_written: "2026-01-04"
themes: [resilience, father, farm, systems-thinking, startup, technology, family, wrestling]
---

# Blackout on Two Grids

## _36 hours of cloud down, home dark, and customers who never knew._

Status pages glowed red. Slack didn’t stop. It was the Azure outage year that gets asterisks in SRE decks. Customers didn’t care about cloud drama. They cared that their dashboards worked.

We worked 36 hours. Failovers that weren’t clean on paper, made clean in practice: SQL in South Central to buy I/O, app layer in Brazil to keep breath in the system. DNS like chess. Manual scripts, then better ones. Coffee. Then more coffee.

At home, the power blinked and died. The propane generator should’ve picked up, except the starter battery wasn’t a “should.” It was dead. Carina asked if this was normal. The kids wanted to know why the house was dark if Dad “worked in computers.” I had no speech for that. I was keeping two grids alive—Azure’s stitched‑together one and the one that feeds our kitchen—and both demanded respect.

We kept customers up. They never knew how weird our topology got. Two lessons tattooed themselves: redundancy matters most when it’s boring, and **local‑first** is a philosophy, not a feature. The cloud is a tool; it is not your spine.

**AI tie.** Now I use AI to make **chaos drills** cheap. It kills a region in simulation for an hour and grades time‑to‑steady‑state. It writes the runbook and the rollback. It suggests the three tests we avoided because they’re inconvenient. And at EnergiAcres, we treat the farm like a data center: islandable power, local control loops, and one dumb manual switch that doesn’t need a password.

_Rule: Redundancy is a habit, not a headline._
