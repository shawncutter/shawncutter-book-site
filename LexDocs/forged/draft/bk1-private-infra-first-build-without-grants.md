---
title: "Private Infra First: Build Without Grants"
arc: forged
status: draft
date_event: "1985"
date_written: "2026-01-04"
themes: [resilience, farm, systems-thinking, startup, technology]
---

# Private Infra First: Build Without Grants

_If funding won’t meet us, we build around the gap._

Sharpie squeaks on Tyvek. Coffee steam, diesel on a cold hoodie. I drag three thick lines across the map—A, B, C. A follows the county right‑of‑way to a 13‑kV feeder. B jumps the rail bed to a cleaner corridor. C hugs the ditch, longer but fewer crossings. Two substation boxes sit in pencil, one at the pad, one by the industrial park. Time or money. Pick.

The grant deck says wait. The calendar says winter. The mayor called last night and asked the only question that matters: “When do the lights turn on?” I give him the farm answer—“When the pump is primed and the valves stop leaking”—and the oilfield answer—“When the tie‑in is hot and safe.” Both require steel, not press releases.

We’ve lost months to optimism before. Promised funds that drift. Calls that go quiet. I’m done recruiting hope. We’ll finance a standardized block—gas tap, feeder upgrade, sectionalizers, BESS, islandable microgrid—through partners who get paid on availability and performance. No heroes—systems win. If we hit 99.5% availability and beat SAIDI by 30%, they get their bonus. If we miss, they feel it first. Wedge, not replace: we interop politely with the utility and carry the peaks they hate.

On the table: a kit that ships in six months. 50 MW of reciprocating gas, heat recovery at 180°F feeding the greenhouse loop. 80–120 MWh of BESS to keep the sip‑not‑chug cadence (30–80% SOC band in shoulder seasons). A 34.5‑kV step‑up, reclosers set for a clean islanding cutover under 100 ms. One pad, five loops, one brain.

I circle B. Fewer permits, faster trench. I write the numbers next to it like we used to tally calves—days from pre‑app to NTP, feeder miles, capex per kW, first produce out of the greenhouse. Promise less, publish more. We’ll post a receipt every month: what we installed, what it cost, what it delivered.

The turn happens in a single call. “We’re not waiting on grants,” I tell the partner. “We’ll fund the physics. You get paid on uptime.” He pauses. He knows what that means—no lipstick, just logs. “Send me the A/B/C package,” he says. We hang up. I draw one more line on the map: the path from word to work.

**AI tie.** AI won’t win permits or pull cable. It will cut drift. We use it to generate the A/B/C one‑lines, simulate feeder loading under three weather profiles, and Monte‑Carlo procurement risk on switchgear and gensets. It drafts the availability SLA and cross‑links each clause to a test. Local‑first: every control that matters runs in airplane mode before it ever phones home. If it breaks in airplane mode, it was already broken.

**Rule: Fund the physics, not the press release.**

* * *

**AI Playbook — A/B/C Infra Paths**  **Purpose:** Replace hope with three shippable options and dates. **Prompt:**

1. “Draft three interconnect paths (A/B/C) to deliver [X MW] with CHP + BESS; include feeder miles, crossings, and 90‑day/180‑day timelines.”

2. “Simulate hourly load/heat curves for 12 months under cold/normal/hot; show SOC band policy (30–80%).”

3. “Write an availability‑based payment SLA with pass/fail tests, islanding cutover \<100 ms, SAIDI/MAIFI delta targets.”

4. “Produce a 2‑page PDF ‘receipt’ template: installed, cost, uptime, community outputs (jobs, produce pounds).” **Constraints:** 2 pages per path • Offline‑runnable tests • Part numbers + lead‑time sources • No grant dependencies • Logs before lipstick.

**Image Prompts** Header: “Predawn job trailer; map taped to table; three Sharpie routes; coffee ring; rainy light through window.” Inline (close‑up): “Hand marking ‘34.5‑kV feeder’ on Tyvek; Sharpie nib pressure; edge of steel ruler.”

**Tags:** memoir, AI, startups, farming, energy, leadership, resilience

**Fact Pack — verify/anonymize:** Feeder voltage (13.2 vs 34.5 kV) [NEEDS CHECK] • BESS hours (80–120 MWh for 50 MW) [NEEDS CHECK] • Availability target (99.5%) and SAIDI delta goals [NEEDS CHECK] • Partner names and SLA terms [ANON/CHECK] • Corridor specifics (rail bed, ROW, crossings) [NEEDS CHECK] • Greenhouse loop temps/CO₂ target (180°F; 900 ppm) [NEEDS CHECK].

