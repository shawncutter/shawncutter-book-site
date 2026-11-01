---
title: "Moving the Oilfield to the Cloud"
kind: scene
arc: forging
status: draft
date_event: "2009-2012"
date_written: "2026-01-04"
themes: [resilience, accident, surgeries, farm, systems-thinking, startup, technology, family, wrestling]
products: [FieldVisor, ScadaVisor, FieldVisor Mobile, VisorBridge]
sources:
  - LexDocs/captures/bk1-fielding-products-visor-platform.md
---

# Moving the Oilfield to the Cloud

## A farm kid’s way of building software.

 ![Image](https://lex-img-p.s3.us-west-2.amazonaws.com/img/42af31ab-1e40-4bf5-ae53-b27b496c1834-RackMultipart20250928-139-r3sb1d.png)

The office was my garage and attached apartment, built for a completely different purpose than housing an oilfield software company. Midnight made everything honest. We were a small team, but we did build great things. Out in the oilfield, things were changing, evolving, and scaling. We were happy on the bleeding edge if it meant the field could talk.

> ✅ **SOURCED (Shawn, chat 2026-10-31).** The platform was built one product a
> year, and this scene should rest on that rather than on a single night:
> **FieldVisor 2009** — field data capture and production. **ScadaVisor 2010** —
> SCADA and measurement, which he defines as *"gas and liquids measurement.
> Quantifying the molecules that are flowing through pipelines and stored in
> tanks."* **FieldVisor Mobile 2011** — the mobile app for the hosted service.
> **VisorBridge 2012** — their own communication and polling engine: *"the heart
> of the SCADA communication. It's what actually talks to the devices… holds
> socket connections open… multi-threaded. Distributed application across
> multiple data center regions."* **There was no polling engine before
> VisorBridge.**
>
> ✅ **Decided by Shawn 2026-10-31: this scene is the whole build, not one
> night.** The draft invented a single midnight — Azure reached general
> availability 2010-02-01 and FieldVisor Mobile shipped 2011, two years apart, so
> they could not share an evening. Retitled from "The Night We Moved the Oilfield
> to the Cloud" (the file was renamed too, since the old name asserted the night),
> `date_event` is 2009-2012, and the three "that night" claims are reframed.
>
> ⚠️ **What this still needs from Shawn.** Reframing removed the false night; it
> did not supply the true shape. The passage about watching the trend settle and
> cross-checking the operator's clipboard still reads as one sitting, and no
> capture says which milestone that was. Nothing was written to fill the hole —
> whether it belongs to FieldVisor's first production data (2009), ScadaVisor's
> first live device (2010) or VisorBridge's first poll (2012) is his to say.
>
> ⚠️ **Say the cloud claim with dates, not as "first".** The defensible version:
> Azure opened for commercial business 1 February 2010; that year Fielding was
> running oilfield SCADA on it; by 2012 it had its own multi-region polling engine
> holding socket connections open to field devices. Microsoft's own blog carried
> Fielding as an ISV. See `codes.FIELD`.

Fielding Systems wasn’t a concept deck. It was a promise from a farm kid who knew what it meant to get yelled at by machines. My first language wasn’t code; it was failure mode. On the farm, things break where you’re weakest and when you’re tired. You fix them in the dark. You learn the rhythm of troubleshooting: isolate, test, confirm, move. That cadence is software when you don’t make it precious. We called it forward engineering before we knew the term—Palantir‑style, shoulder‑to‑shoulder with operators, building next to the work so the model follows the field, not the other way around. We built on the job with the family business first—ship where someone answers your call at 5 a.m.—then we added the next customer, and the next. Each fix became a feature. Each feature survived another lease, another basin, until “our use case” turned into “the industry’s way to do it.”

We were trying to do a simple thing that was impossible back then: see real production in a browser, on Azure, before the coffee got cold. Not yesterday. Not last shift. Now. And then see it on your phone from the App Store without a VPN fairy tale. The hardware didn’t care about our dreams—modems flaked, radios stuttered, protocols were cranky, and the network was a hay bale stuck in a culvert. The field doesn’t negotiate. Either the data shows up or it doesn’t. So we wrote the glue no one sold anymore: device drivers for orphaned boxes and ghost vendors—Modbus RTU/TCP, OPC DA to UA shims, serial pollers for radios whose manufacturers were long gone. Forward engineering meant we didn’t pitch an ontology; we distilled one from gauges, clipboards, and curses, and we only kept what survived contact with a pumper at 4 a.m.

We kept the loop small. Poll a device. Don’t airdrop an “enterprise.” One route, one well, one gauge. No heroics. No keynote slides. A clean publish‑subscribe flow, retries that didn’t lie to us, logs we could read half‑asleep. I taped a note to my screen: **Ground truth beats architecture diagrams.** Another note under it: **Operational fit beats product demo.** At 2:17 a.m., the line went from zero to a number that meant something. Not a demo number. A barrel count. A pressure that matched a real gauge a hundred miles away. The graph moved. The room went quiet. That click‑over made it the first of its kind in oil and gas: real production telemetry live on Azure, and the path laid for the first native mobile app store release our operators could actually use.

It didn’t feel like triumph. It felt like adjusting a valve until the vibration stopped—a rightness in the bones. We watched the trend settle. We cross‑checked against the operator’s clipboard from that morning. We were within tolerance. A field hand texted “yep.” That “yep” meant more than any VC nod I ever got. That was the forward‑engineering contract: prove it on the line, with the person who lives with the consequence.

After that, momentum had a sound. More wells. More devices. More skeptics logging in at lunch and staying until dinner. We added alarms, mobile views, and audit logs —everything that keeps something from falling apart. We told the truth in the UI: don’t round what shouldn’t be rounded; don’t hide the dirty edges. I fought to keep the language plain. If a pumper can’t read it on a tailgate, it’s marketing, not software. We shipped in loops: sit with the operator, watch the click‑paths, name the thing the way they name it, then harden it until it survives rain, dust, and bad LTE. Customer by customer, lease by lease, we solved the next concrete problem and kept it, until we looked up and realized we had the map for the whole industry—and we were doing what no one else was doing. I didn’t hire system or network administrators; I hired engineers who could trace a fault from radio noise to driver code to SQL to UI copy, and fix it end‑to‑end. Titles didn’t move barrels; ownership did.

People want a single night to call “the start‑up moment,” but it didn’t start there. It started years earlier, in a barn, where I broke down a baler clogged with wet hay and learned to clear the choke without losing a finger. It started with the accident, with the sense that systems either protect people or eat them. It started when I learned to prefer repeatable loops to heroic saves. Forward engineering is just that farm lesson at scale: build the guardrails first, earn the right to add speed.

Today at EnergiAcres, that same loop runs under everything—we just have more moving parts. Power plant. Battery. Greenhouse. Data center. We instrument, we simulate, we let the twin argue with reality until they agree, then we lock the gains. AI sits in the middle like a patient apprentice: watch, predict, suggest, and shut up when the operator says no. It’s not magic. It’s a bigger version of that 2:17 a.m. line inching up on the screen. The method didn’t change; the surface area did. We forward‑engineer across domains, pull semantics from the plant floor, and let software earn authority by being reliably right.

If you strip away the jargon, all I’ve ever wanted is to make the field talk back in time to help the human in the truck. The build was the proof. The field had a voice. We just had to learn to listen without lying to ourselves. Forward engineering is listening with intent—and wiring what you hear into the loop.
