---
title: "The Night We Moved the Oilfield to the Cloud"
arc: forging
status: draft
date_event: "2009"
date_written: "2026-01-04"
themes: [resilience, accident, surgeries, farm, systems-thinking, startup, technology, family, wrestling]
---

# The Night We Moved the Oilfield to the Cloud

## A farm kid’s way of building software.

 ![Image](https://lex-img-p.s3.us-west-2.amazonaws.com/img/42af31ab-1e40-4bf5-ae53-b27b496c1834-RackMultipart20250928-139-r3sb1d.png)

The office was my garage and attached apartment, built for a completely different purpose than housing the first-of-its-kind software company. Midnight made everything honest. We were a small team, but we did build great things. Out in the oilfield, things were changing, evolving, and scaling. We were happy on the bleeding edge if it meant the field could talk.

Fielding Systems wasn’t a concept deck. It was a promise from a farm kid who knew what it meant to get yelled at by machines. My first language wasn’t code; it was failure mode. On the farm, things break where you’re weakest and when you’re tired. You fix them in the dark. You learn the rhythm of troubleshooting: isolate, test, confirm, move. That cadence is software when you don’t make it precious. We called it forward engineering before we knew the term—Palantir‑style, shoulder‑to‑shoulder with operators, building next to the work so the model follows the field, not the other way around. We built on the job with the family business first—ship where someone answers your call at 5 a.m.—then we added the next customer, and the next. Each fix became a feature. Each feature survived another lease, another basin, until “our use case” turned into “the industry’s way to do it.”

We were trying to do a simple thing that was impossible back then: see real production in a browser, on Azure, before the coffee got cold. Not yesterday. Not last shift. Now. And then see it on your phone from the App Store without a VPN fairy tale. The hardware didn’t care about our dreams—modems flaked, radios stuttered, protocols were cranky, and the network was a hay bale stuck in a culvert. The field doesn’t negotiate. Either the data shows up or it doesn’t. So we wrote the glue no one sold anymore: device drivers for orphaned boxes and ghost vendors—Modbus RTU/TCP, OPC DA to UA shims, serial pollers for radios whose manufacturers were long gone. Forward engineering meant we didn’t pitch an ontology; we distilled one from gauges, clipboards, and curses, and we only kept what survived contact with a pumper at 4 a.m.

We kept the loop small. Poll a device. Don’t airdrop an “enterprise.” One route, one well, one gauge. No heroics. No keynote slides. A clean publish‑subscribe flow, retries that didn’t lie to us, logs we could read half‑asleep. I taped a note to my screen: **Ground truth beats architecture diagrams.** Another note under it: **Operational fit beats product demo.** At 2:17 a.m., the line went from zero to a number that meant something. Not a demo number. A barrel count. A pressure that matched a real gauge a hundred miles away. The graph moved. The room went quiet. That click‑over made it the first of its kind in oil and gas: real production telemetry live on Azure, and the path laid for the first native mobile app store release our operators could actually use.

It didn’t feel like triumph. It felt like adjusting a valve until the vibration stopped—a rightness in the bones. We watched the trend settle. We cross‑checked against the operator’s clipboard from that morning. We were within tolerance. A field hand texted “yep.” That “yep” meant more than any VC nod I ever got. That was the forward‑engineering contract: prove it on the line, with the person who lives with the consequence.

After that, momentum had a sound. More wells. More devices. More skeptics logging in at lunch and staying until dinner. We added alarms, mobile views, and audit logs —everything that keeps something from falling apart. We told the truth in the UI: don’t round what shouldn’t be rounded; don’t hide the dirty edges. I fought to keep the language plain. If a pumper can’t read it on a tailgate, it’s marketing, not software. We shipped in loops: sit with the operator, watch the click‑paths, name the thing the way they name it, then harden it until it survives rain, dust, and bad LTE. Customer by customer, lease by lease, we solved the next concrete problem and kept it, until we looked up and realized we had the map for the whole industry—and we were doing what no one else was doing. I didn’t hire system or network administrators; I hired engineers who could trace a fault from radio noise to driver code to SQL to UI copy, and fix it end‑to‑end. Titles didn’t move barrels; ownership did.

People call that night “the start‑up moment,” but it didn’t start there. It started years earlier, in a barn, where I broke down a baler clogged with wet hay and learned to clear the choke without losing a finger. It started with the accident, with the sense that systems either protect people or eat them. It started when I learned to prefer repeatable loops to heroic saves. Forward engineering is just that farm lesson at scale: build the guardrails first, earn the right to add speed.

Today at EnergiAcres, that same loop runs under everything—we just have more moving parts. Power plant. Battery. Greenhouse. Data center. We instrument, we simulate, we let the twin argue with reality until they agree, then we lock the gains. AI sits in the middle like a patient apprentice: watch, predict, suggest, and shut up when the operator says no. It’s not magic. It’s a bigger version of that 2:17 a.m. line inching up on the screen. The method didn’t change; the surface area did. We forward‑engineer across domains, pull semantics from the plant floor, and let software earn authority by being reliably right.

If you strip away the jargon, all I’ve ever wanted is to make the field talk back in time to help the human in the truck. That night was proof. The field had a voice. We just had to learn to listen without lying to ourselves. Forward engineering is listening with intent—and wiring what you hear into the loop.

### AI Playbook — Ground Truth Beats Diagrams

**Purpose:** Help anyone capture a “first signal” moment—when a small loop produced real‑world proof. Use a forward‑engineering stance: start at the edge with the operator, let the model emerge from the work. Build next to the paying problem, then generalize only as far as the next customer proves true.

**Prompt:**

> Write a 400–700 word scene about the exact moment a small technical loop produced real, verifiable results. Open with the workspace details (light, smell, noise). Name the metric that moved. Show how you validated it against ground truth. Show who on the ops side sat with you and what language they used. End with the operating rule you shipped because of it.

**Constraints:**

- Keep scope tiny: one loop, one metric, one validation.

- Include at least one timestamp (e.g., 2:17 a.m.) and one physical cross‑check (clipboard, gauge, human “yep”).

- Plain language UI/UX—what the operator actually saw.

- Derive naming from the field; avoid importing a diagram until the data and the operator agree.

- Prove operational fit live (bad network, real duty cycle) before you generalize.

- If you bridged old and orphaned hardware (Modbus, OPC, serial radios), name the driver you wrote and the failure mode you tamed.

**Optional follow‑ups:**

- What dirty edge did you refuse to hide in the UI?

- What did you automate next—and what did you refuse to automate?

- Which part of the ontology did the operator give you, word for word?

