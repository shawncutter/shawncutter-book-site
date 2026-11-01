---
title: "Fielding Systems products — FieldVisor, ScadaVisor, VisorBridge"
kind: capture
arc: forging
status: draft
date_event: "2009-2015"
date_written: "2026-10-31"
source: "Shawn chat 2026-10-31, verbatim"
rewrite_status: "raw capture / verbatim / externally corroborated / fills a gap the corpus had"
review_status: "verbatim + external research 2026-10-31; product names and scopes externally confirmed, 'first' claims are vendor-side only"
trust: "raw (Shawn's own words)"
themes:
  - startup
  - technology
  - oilfield
  - product
  - systems-thinking
people:
  - Shawn Cutter
locations: []
related_to:
  - bk1-the-garage.md
  - bk1-the-cold-call.md
  - bk1-pocket-computers-and-cold-thumbs.md
  - bk1-moving-the-oilfield-to-the-cloud.md
---

# Fielding Systems products

> **Shawn, chat 2026-10-31 (verbatim):**
> "FieldVisor, ScadaVisor and VisorBridge was the three products i built under
> Fielding Systems. collectively this was a digital oilfield platform, first of
> its kind in the cloud"

## Why this capture exists

Before today **none of these three names appeared anywhere in the corpus** —
not in `codes.FIELD`, not in any session log, profile, timeline or capture. The
only occurrence of "FieldVisor" was inside a generated scene,
`book/forging/bk1-pocket-computers-and-cold-thumbs.md`.

The 2026-10-31 AI-draft audit therefore listed FieldVisor as finding #2, "an
invented company asset." **That was wrong, and the error is worth naming
precisely:** the observation was right — the name was absent from the corpus —
but the inference was not. A detail missing from the captures is a gap in the
captures. It is not evidence that the detail is false. The audit has been
corrected.

## Shawn on the sequence (chat 2026-10-31, verbatim)

> "So I really started with Field Advisor and Skate Advisor more or less at the same time. They were two separate products. We didn't have our own polling engine the system that actually did the communication between all of the devices and sensors in the field. That would come later. We had the system on top of the polling engine, but it really, if I had to put it in a timeline, Field Advisor, then Skate Advisor, then Visor Bridge. Now I look at it just as one system."

**On the spelling.** This message reads as dictation and the names come through
as "Field Advisor", "Skate Advisor" and "Visor Bridge". The typed message
earlier the same day said **FieldVisor, ScadaVisor, VisorBridge**, and external
sources use those spellings throughout (below). "Skate Advisor" is what speech
recognition does to "ScadaVisor". The Visor spellings are used here as canonical;
say so if that is wrong.

**What the sequence message establishes, independent of spelling:**

- FieldVisor and ScadaVisor started **roughly simultaneously** and were **two
  separate products** — not one platform split in two.
- They did **not** own the polling engine at first: "the system that actually did
  the communication between all of the devices and sensors in the field." They
  built the application layer on top of somebody else's.
- Forced into order: **FieldVisor → ScadaVisor → VisorBridge.**
- "**Now I look at it just as one system**" — the single-platform framing is
  **retrospective**. At the time these were separate products. That distinction
  matters for any scene set in 2009–2012: writing it as "the platform" from day
  one would be the memoir version, not the true one.

---

## Shawn on the polling engine and the platform (chat 2026-10-31, verbatim)

> "There was not a polling engine before Visor Bridge. The polling engine is the heart of the SCADA communication. It's what actually talks to the devices. It does the translation. It holds socket connections open. It's super complicated, multi-threaded. Distributed application across multiple data center regions. Think of it more as a platform play where I was building out starting with the field data capture and production system and then adding the SCADA and measurement and then communication, polling, along with it. FieldVisor Mobile was the mobile app that went along with the hosted service."

### This corrects a question that was in this file, not just answers it

The earlier note here asked "which polling engine did they sit on top of before
VisorBridge?" **That question was malformed and came from my misreading.** His
first message said "we had the system on top of the polling engine", which I took
to mean a third-party engine underneath. He means the opposite: they had the layer
that *would* sit on top, and **there was no polling engine at all until
VisorBridge**. Nothing to name, because nothing was there.

### What a polling engine is, in his words

Worth keeping verbatim — it is the clearest technical explanation of his own work
anywhere in the corpus, and it is in his voice rather than a brochure's:

- "the **heart** of the SCADA communication"
- "it's what actually **talks to the devices**"
- "it does the **translation**"
- "it **holds socket connections open**"
- "super complicated, **multi-threaded**"
- "**distributed application across multiple data center regions**"

That last point is the one a reader would miss and an engineer would not: a
multi-region distributed system, in 2010-era Azure, built by a small team in a
Plant City garage lineage. It is also what makes the "SCADA in the cloud" claim
technically substantive rather than marketing — holding live socket connections
to field devices from a distributed cloud service is the hard part.

### The sequence, refined

> "Think of it more as a **platform play** where I was building out starting with
> the field data capture and production system and then adding the SCADA and
> measurement and then communication, polling, along with it."

| Step | Product | What was added |
|---|---|---|
| 1 | **FieldVisor** | field data capture + production |
| 2 | **ScadaVisor** | SCADA **and measurement** |
| 3 | **VisorBridge** | communication / polling |

**`measurement` is new to the corpus** — it appears nowhere else, and in oil and
gas it is its own discipline (custody transfer, allocation), distinct from SCADA
monitoring. Worth one line from him on what measurement meant in ScadaVisor.

**How this sits with his earlier message.** The first message said "they were two
separate products" and "now I look at it just as one system"; this one says
"think of it more as a platform play". Both are his and they are not in conflict:
the products were separately named and sold, the platform was the intent they were
built out against. Recorded as a refinement, not a replacement — and the useful
version for prose is probably his: a platform built in three moves, not three
products that later got a platform story attached.

### The dates (Shawn, chat 2026-10-31)

| Year | Product | What it added |
|---|---|---|
| **2009** | FieldVisor | field data capture + production |
| **2010** | ScadaVisor | SCADA and measurement |
| **2011** | FieldVisor Mobile | the mobile app for the hosted service |
| **2012** | VisorBridge | the communication / polling engine |

One product a year, four years running.

### Three corroborations, and they are not trivial

- **FieldVisor 2009 is the founding-year product.** `FORGING-QUESTIONS` has
  "Fielding officially started 2009" from his 2026-10-30 chat. The first product
  shipped the year the company existed on paper.
- **ScadaVisor 2010 is the year he went full time.** Same source: "not full time
  until 2010." So the SCADA product and his own full commitment arrive together —
  that is a narrative beat, not just a date.
- **ScadaVisor 2010 is also the year Azure went commercial** — general
  availability 1 February 2010. He was building oilfield SCADA on Azure in the
  year the platform opened for business.

### The App Store claim — corrected and consistent

Shawn corrected the year on 2026-10-31: the claim is **"no oil and gas app in the
App Store before '11"**, not '10. I had recorded '10 from his earlier message and
flagged it as contradicting FieldVisor Mobile's 2011 date.

**With '11 the contradiction disappears and the claim is internally consistent:**
FieldVisor Mobile shipped **2011**, and by his account nothing in oil and gas was
in the App Store before it. That makes FieldVisor Mobile the first — which is a
sharper, more specific claim than the one I was worried about, and it fits his own
dates exactly.

**What research can say about it:** searching found **no** verifiable oil and gas
App Store release before 2011. Two caveats, neither a refutation:

- Industry **media** apps exist — E&P (Hart Energy), GEO ExPro, World Oil, Oil &
  Gas Journal — but none could be reliably dated, and Oilfield Technology's was
  2014. The iPad itself did not exist until April 2010, so iPad magazine apps
  cannot predate that.
- **iGas** (2008) was an oil-price app, but consumer retail fuel pricing, not
  operational.

So the version to print specifies the kind of app, which is the meaningful claim
anyway: **the first operational / field oil-and-gas app in the App Store**, not
the first thing in the store with "oil" in it. That phrasing survives someone
turning up a 2010 magazine app.

### What "measurement" meant (Shawn, chat 2026-10-31)

> "Measurement is gas and liquids measurement. Quantifying the molecules that are flowing through pipelines and stored in tanks."

**This corroborates the external product description without having been written
to.** The independent account of ScadaVisor says it monitored "**flow meters**,
pump-off controllers, **tanks**, compressors, PLC's, artificial lifts" — flow
meters and tanks are precisely the two halves of what he just described: product
**in motion** through pipelines, and product **at rest** in tanks. His definition
and the 2013-era marketing copy describe the same thing from opposite ends.

Note what he did **not** say, so nobody fills it in later: he defined the domain,
not the commercial use. Whether ScadaVisor's measurement served **custody
transfer** (the numbers a sale is billed on, which have to survive an audit),
**allocation** (splitting commingled production back to wells and owners), or
operational metering only, is still unrecorded. He was asked and answered at the
physical level, which may well be the honest answer — but it is not the same
question.

### And then the bigger version of it

> "i quantified matter and energy"

Six words, and they reach further than the product. Measurement at Fielding was
matter — molecules in pipelines and tanks. EnergiAcres is energy. Said together,
this is a claim about the whole working life rather than about ScadaVisor.

**It also lands on an existing locked thesis.** `codes.SWITCH` holds
"energy is everything" from `_meta/PHILOSOPHY-BRIEF.md`, and its summary records
the cause-and-effect habit that started after the accident — "turtles all the way
down". "I quantified matter and energy" is the same thought arriving from the
engineering side instead of the philosophical one.

**Scope settled by Shawn 2026-10-31: Fielding only.** Asked directly whether the
line described Fielding's measurement work or the whole working life, he said
**just Fielding**. So it is a description of what the software did — gas and
liquids, molecules in pipelines and tanks — and **not** a thesis about the career.

That is the restrictive answer, and it closes something off rather than opening it:

- **Do not** use it to bridge Forging→Foundry.
- **Do not** tie Fielding to EnergiAcres' "energy is everything" thesis on the
  strength of this phrasing. The resemblance to `codes.SWITCH` is real and was
  put to him; he declined it. The `SWITCH`→`FIELD` link added earlier has been
  withdrawn, and the decision recorded on both codes so the connection is not
  rebuilt from the wording alone.
- **Do** use it inside a Fielding scene, where it is accurate and good.

Worth noting why this was worth asking rather than assuming: the career reading
was the more attractive one — it would have given the book a clean spine from
oilfield measurement to power campuses — and it was wrong. Six words that sound
like a thesis were a description of a product.

**"Quantifying the molecules" is usable prose.** It is the voice profile in
`CLAUDE.md` working — direct, Feynman-style, explaining a regulated technical
discipline in six words a reader outside the industry can hold. If a Fielding
scene ever needs to explain what the software was for, that is the line, and it
is his.

### The claim, in a form that survives a fact-check

Not "first of its kind" unqualified. This version is all dates and all checkable:

> Windows Azure opened for commercial business on 1 February 2010. That same year
> Fielding was running oilfield SCADA on it, and by 2012 had built its own
> communication and polling engine — multi-threaded, distributed across several
> data-centre regions, holding socket connections open to field devices.

Every element there is dateable, Microsoft's own blog carried Fielding as an ISV,
and it is stronger than "first" because nobody has to take his word for it.
"First" can still be said — in his voice, as his own knowledge, which is what
"I work directly with the teams and know that" is. A memoir may do that; a press
release may not.

### FieldVisor Mobile — answered

### FieldVisor Mobile — answered

"FieldVisor Mobile was the mobile app that went along with the hosted service."
That settles which mobile product existed and what it attached to. Note the scene
`book/forging/bk1-pocket-computers-and-cold-thumbs.md` is still `ai-draft`: its
specifics — BlackBerry and Windows CE, a killed PhoneGap build inside Visual
Studio, "web-first until native earns its keep" — are **not** verified by this
answer and remain unsourced.

---

## External research (2026-10-31) — what is confirmed

Searched at Shawn's invitation. **All three product names are externally
documented**, so the audit's "invented asset" finding was wrong on every count.

| Product | External description |
|---|---|
| **FieldVisor** | Field data capture and production reporting application for oil and gas. A `FieldVisor Mobile` also existed. |
| **ScadaVisor** | Remote SCADA monitoring and field automation: monitors "flow meters, pump-off controllers, tanks, compressors, PLC's, artificial lifts" in real time. `ScadaVisor Mobile` added "control over plunger lift cycles, pump off controller cycles, valve control and variable frequency". |
| **VisorBridge** | Fielding's **own "cloud-based communication and polling engine"**, supporting ScadaVisor. |

**VisorBridge independently matches Shawn's account.** He said they lacked their
own polling engine and "that would come later"; the external record describes
VisorBridge as exactly that engine, and his ordering puts it third. The two
accounts were produced a decade apart and agree.

**This also reconciles an apparent contradiction in the book.**
`bk1-the-garage.md` (ready) calls Fielding "an operations platform… field
tickets, crew dispatch, job tracking", while `codes.FIELD` says it "came to
monitor hundreds of thousands of wells". Both are right: FieldVisor was field
data capture, ScadaVisor was SCADA monitoring. Two products, two descriptions, no
conflict.

Also confirmed, and resolving a logged repo conflict:

- **The CTO's surname is Taynton, not Taton — now confirmed by Shawn (2026-10-31) and corrected throughout the repo.** The Quorum acquisition release
  says "Fielding Chief Technology Officer Jeff Taynton". `codes.FIELD` carries
  this exact conflict ("Jeff Taton (ready pieces, P2L-BOOK-CONTEXT) vs Taynton
  (CHARACTER-LIST / photo notes)") — external primary-side source favours
  **Taynton**.
- Fielding was "**based in Tampa, Florida**"; acquisition announced **2015-03-25**
  (the repo's "closed March 23, 2015" is consistent — close then announce).
- Titles differ by source: the acquisition release says "**Fielding President**
  Shawn Cutter"; the Microsoft Azure guest post bylines him "**Founder and CEO**".
  **Resolved by Shawn 2026-10-31: the book uses Founder / CEO.** Both remain on
  record, and the Quorum release should still be quoted as written wherever it is
  cited — an external source does not get edited to match the book. His later
  Quorum title was Vice President, a different role at a different company.
- Fielding's own ~2012 Azure post: "FieldVisor, FieldVisor Mobile, ScadaVisor,
  and ScadaVisor Mobile exist in Windows Azure as separate multi-tenant web
  applications with single-tenant SQL Azure databases for each of our customers."

## The "first of its kind" claims — what research can and cannot support

Being straight about this, because it is the part that would get checked in
print.

**Supported by context, strongly.** Windows Azure only reached **general
availability on 1 February 2010** — billing and SLAs for commercial accounts
began that day, after a free January. Before 2010 there was essentially no
production Azure to be in. So "there wasn't a solution in Azure" is close to
structurally true for the period, and being an early oil-and-gas ISV on Azure is
a credible, dateable claim.

**Claimed contemporaneously by Fielding — which is evidence the claim was made,
not that it was true.** Fielding's own material from ~2012–2015 says ScadaVisor
is "the only truly cloud-based service of its kind since it is supported by our
own cloud-based communication and polling engine called VisorBridge", and a
Fielding representative wrote on a control-systems forum that running ScadaVisor
on Windows Azure "makes it the first of its kind". These are vendor statements.

**Not independently verified.** No third-party source was found confirming
first-in-Azure or first-in-the-App-Store for oil and gas.

**No counterexample found either.** Searching for an earlier oil-and-gas iPhone
app surfaced only consumer fuel-price tools (iGas, 2008; GasBuddy's own apps,
2010) and industry magazine apps whose launch dates could not be verified —
nothing upstream, nothing handling production or SCADA data. Shawn later
corrected the App Store year to **'11**, which makes the claim consistent with
FieldVisor Mobile's 2011 date (see "The App Store claim" above). Even so, "no
other app before '11" is a negative search cannot fully settle, which is why the
printable version specifies **operational / field** apps.

**How I would put it in print.** Not "the first" unqualified. Something that is
both true and stronger because it is checkable: that Azure went commercial in
February 2010 and Fielding was already building oilfield SCADA on it, with
VisorBridge as its own cloud polling engine — a claim the dates support and
Microsoft's own blog carried. Shawn's "I work directly with the teams and know
that" is the strongest evidence for the unqualified version, and it is testimony
rather than citation; worth saying in his own voice as his own knowledge, which a
memoir can do and a press release cannot.

## Still open

1. **The App Store claim vs FieldVisor Mobile's 2011 date** — see the tension
   above. Which of the three readings is right? This is the one that matters for
   print.
2. **Measurement's commercial use** — the domain is now defined ("gas and liquids
   measurement… quantifying the molecules"), but whether it served custody
   transfer, allocation, or operational metering only is still unrecorded. Lower
   stakes than the rest; it only matters if a scene gets specific.
3. Did the product names survive the 2015 Quorum acquisition?
4. ~~Product dates~~ — **closed: 2009 / 2010 / 2011 / 2012.**
5. ~~Which polling engine before VisorBridge~~ — **closed: there wasn't one.**
6. ~~FieldVisor Mobile or ScadaVisor Mobile~~ — **closed: FieldVisor Mobile.**
   The rest of that scene's detail is still unsourced.

## Sources

- Quorum, *Quorum Enhances Capabilities with Acquisition of Fielding Systems* (2015-03-25)
- Microsoft Azure blog, *ISV Guest Post Series: Post by Founder and CEO of Fielding Systems* (~2012)
- Microsoft, *Commercial Availability of Windows Azure Platform* (Azure GA 2010-02-01)
- Hart Energy, *Fielding Systems Enhances Artificial Lift Smart Device Support*
- Quorum, *Fielding Systems to Unveil a New SCADA Dashboard Tile Feature*
- Quorum, *Oil and Gas Industry to Benefit from Cloud — insight from Jeff Taynton, CTO*
- control.com forum, *Will Cloud-based SCADA come?*
- Crunchbase / Tracxn company records; Rigzone, *Oil & Gas Industry Mobile Apps*; Oil IT Journal, *Got iPhone? You got iGas!* (2008)
