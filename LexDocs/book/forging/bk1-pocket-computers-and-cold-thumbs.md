---
title: "Pocket Computers and Cold Thumbs"
kind: scene
arc: forging
status: draft
date_event: "2011"
date_written: "2026-01-04"
themes: [resilience, accident, farm, startup, technology, faith]
products: [FieldVisor Mobile]
sources:
  - LexDocs/captures/bk1-fielding-products-visor-platform.md
---

# Pocket Computers and Cold Thumbs

_If it doesn’t work with gloves and bad coverage, it doesn’t work._

> ✅ **SOURCED (Shawn, chat 2026-10-31).** The mobile product is **FieldVisor
> Mobile, 2011** — "the mobile app that went along with the hosted service."
> FieldVisor itself (2009) was the field data capture and production application;
> it is externally documented, and the earlier audit note calling it invented was
> **wrong and has been retracted**. Shawn: there was no oil and gas app in the App
> Store before '11, which makes this the first — print it as the first
> **operational / field** oil-and-gas app, since undated industry *magazine* apps
> exist.
>
> ⚠️ **Refiled 2026-10-31**: this was `arc: forged`, the 1980–1990 childhood arc,
> with no `date_event`. It is Fielding-era work. Now `arc: forging`,
> `date_event: 2011`.
>
> ✅ **PARTLY SOURCED 2026-10-31, and this corrects an earlier flag.** The
> pivot in this draft — killing an outsourced mobile build because it "wouldn't
> carry a public launch", then switching to a web app — is now corroborated by a
> first-person account: three weeks out from the Penn Virginia rollout, the app
> was with a company in Israel, Shawn pulled it and had it rebuilt in-house in
> three weeks for a public company, then spent 90 days keeping it alive with
> compression work to hold the install under 15 MB against Apple's 20 MB cellular
> cap. See `captures/bk1-three-weeks-to-a-mobile-app.md`. Today's audit listed
> this whole passage as unsourced; that was true when written and is now partly
> wrong.
>
> ⚠️ **Still unsourced:** that the dropped build was **PhoneGap**, that it was
> **inside Visual Studio**, that a "stubborn test" triggered it, that it happened
> at **3 a.m.**, plus BlackBerry and Windows CE, "one of the first oilfield web
> apps", and "web-first until native earns its keep". He named the outsourcing and
> the deadline, not the toolchain — do not merge the two accounts.
>
> ⚠️ **"It still runs" removed.** Whether the product names survived the 2015
> Quorum acquisition is an open question in `codes.FIELD`, so the draft could not
> assert it in the present tense.

Server room hum. Early mobile days. We tried BlackBerry and Windows CE on devices that felt like calculators in witness protection. On paper, everything “worked.” In the field, latency and crashes made enemies.

Then the iPhone arrived. A slab of glass that could render the web without lying. We built one of the first oilfield web apps we’d ever seen run clean on it—thin, fast, honest about the network. Later, we added a native layer where it actually helped. The rule was simple: **web‑first until native earns its keep.**

There was a 3 a.m. pivot in there—killing a shiny PhoneGap build inside Visual Studio after a stubborn test told us it wouldn’t carry a public launch. We switched to a web‑first mobile framework and shipped the loop operators needed at 3 a.m., not the one that looked good at 3 p.m.

FieldVisor stuck because it was faithful to the job—scale measured in wells, not slides. Not because we were geniuses, but because we let the job tell us what the device was allowed to be.

**AI tie.** Now AI is our harness. It generates **failure‑mode tests** for offline, stale auth, and partial data. It writes acceptance criteria in the operator’s words and drafts the two‑minute field manual before any slide deck exists. Pretty comes last.

_Rule: Build for cold thumbs and bad coverage._
