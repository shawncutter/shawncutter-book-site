---
title: "Three weeks to a mobile app (2012)"
kind: capture
arc: forging
status: draft
date_event: "2012"
date_written: "2026-10-31"
source: "Shawn chat 2026-10-31, verbatim"
rewrite_status: "raw capture / verbatim / two technical constraints externally checked"
review_status: "first-person; the build is 2012 per Shawn, which makes the 20 MB ceiling and the 2011 first app cohere — see Resolution"
trust: "raw (Shawn's own words)"
themes:
  - startup
  - technology
  - leadership
  - decision
  - pressure
  - systems-thinking
people:
  - Shawn Cutter
locations: []
related_to:
  - bk1-fielding-customer-ladder.md
  - bk1-fielding-products-visor-platform.md
  - bk1-pocket-computers-and-cold-thumbs.md
  - bk1-moving-the-oilfield-to-the-cloud.md
sources:
  - LexDocs/captures/bk1-fielding-customer-ladder.md
---

# Three weeks to a mobile app

This is the answer to "what does *really tested us* mean" on the Penn Virginia
rollout. It is the scene the ladder was missing.

## Verbatim (Shawn, chat 2026-10-31)

> "We were 3 weeks out. And we were relying on a company out of Israel to build our mobile app. Because we didn't have that expertise in-house. And it was at that time we made the call. I made the call that we were going to switch. We were going to build it ourselves. We were going to build a mobile app in 3 weeks, deliver it for public company. And for the next 90 days, it was everything we could do, every day, to keep it running. Dealing with problems one after the next. Coming up with new compression strategies, to keep the install footprint under 15 megabytes, because it was a mobile web app. And Apple limited the amount, the size of the database."

## The shape of it

- **Three weeks from a public-company rollout.**
- The mobile app was **outsourced to a company in Israel** — "we didn't have that
  expertise in-house."
- **He made the call to switch and build it in-house.** His words put the decision
  on himself, twice: "we made the call. I made the call."
- Three weeks to build it. Then **90 days of keeping it alive** — "everything we
  could do, every day… problems one after the next."
- The specific engineering constraint: **new compression strategies to keep the
  install footprint under 15 MB**, because it was a mobile web app, and **Apple
  capped the database size.**

## The two Apple constraints, verified (2026-10-31)

He names two limits in one breath. Both were real, and they are *different*
limits — worth separating before this is written, because an engineer reading the
book will know the difference.

**1. The install footprint and the cellular download cap.** Apple's
over-the-air App Store limit went 10 MB (2008) → **20 MB (February 2010)** →
50 MB (2012, with iOS 5.1 and the third-generation iPad) → 100 MB (2013, iOS 7).
So a target of "under 15 megabytes" is exactly what you would aim for against a
**20 MB** ceiling — which was the ceiling in force from February 2010 until early
2012.

**2. The database quota.** For a mobile *web* app, Web SQL storage on iOS
defaulted to **5 MB**, with larger quotas (up to 50 MB) available by permission
and unreliable in practice; on iOS 4, asking for more than 5 MB threw a
`SECURITY_ERR`. That is the "Apple limited… the size of the database" constraint,
and it is a genuinely hard problem for an offline-capable field app.

**These are secondary sources, not Apple documentation** — the limits were
reported by outlets after developers noticed them, and no official Apple page was
found for any of the changes. Recorded as well-corroborated, not as citation.

## Resolution: the build was 2012, and there was an app before it

Shawn, 2026-10-31:

> "actually it was in 2012. We had a web mobile app prior to that, And this was one of the limitations.. The third party company that built the first app got it to the app store but it didn't run worth a crap."

**This makes everything fit.** The sequence:

| Year | What |
|---|---|
| **2011** | **FieldVisor Mobile** — the *first* mobile app, built by the third-party company. It **reached the App Store** but, in his words, "didn't run worth a crap." The 20 MB ceiling was one of its limitations. |
| **2012** | the **three-week in-house rebuild** — he pulls the contract and his own team builds it, then 90 days keeping it alive |
| **2013** | the **Penn Virginia rollout** |

**And the 20 MB now coheres with the documented record rather than contradicting
it.** The App Store cellular cap was 20 MB from February 2010 until early 2012 —
which is exactly the window the 2011 first app and the 2012 rebuild sit in. His
number was right and the published cap history was right; the only thing wrong was
my anchoring of the mobile build to the 2013 rollout date.

### What this says about the three wrong guesses above

The hypothesis I refused to adopt was "the mobile build predates the 2013
rollout." **That direction was correct.** The year I floated with it — 2011 — was
not; the answer is 2012. So had I adopted my own tidy reconciliation I would have
been wrong for the fourth time, on a hypothesis whose structure was right.

That is the clearest argument in this whole file for asking rather than inferring:
being directionally right is not the same as being right, and a confident
near-miss is still a wrong date in a book.

### It also supports the App Store claim

The first app **reached the App Store** in the 2011 era, built by the third party.
That is consistent with his separate claim that there was no oil and gas app in
the App Store before '11 — the product that got there first was this one, warts
and all. Worth noting the honest shape of it: the first-to-market app was the one
that did not work.

## The one wrinkle left

He first described the three weeks as "3 weeks out… deliver it for public
company", and Penn Virginia is the public company — but the build is 2012 and he
dates the rollout 2013. Those are adjacent, not simultaneous. Most likely the
mobile deliverable was due in 2012 and the enterprise rollout completed or went
live in 2013. **Not asserted** — one short answer closes it, and this file has
already shown what happens when a gap gets filled by whatever is tidiest.

## What this corrects about the platform story

Shawn, same conversation: *"never saw Visor Bridge to Penn Virginia, actually, we
just sold that to Gulfport, Penn Virginia was only an enterprise FieldVisor
customer."*

| Customer | What they actually bought |
|---|---|
| **Penn Virginia** | **FieldVisor only** — an enterprise FieldVisor customer |
| **Gulfport** | where **VisorBridge** was sold |

**This answers a question I had put to him, and the answer is no.** I had asked
whether Penn Virginia's scale is what forced VisorBridge to be built — the
customer who breaks the system and makes you build the hard thing. It is a tidy
story and it is **wrong**: Penn Virginia never ran VisorBridge, and the engine
went to Gulfport.

**It also sharpens the land-and-expand line rather than contradicting it.** He
said the goal was "to get them with everything". Penn Virginia only ever took
FieldVisor. So the aspiration and the outcome were different on the first big
account, and the full platform did not land until Gulfport — which is a better
story than the strategy working first time, and it explains why Gulfport is the
one that "really set the company."

## It partly sources an AI draft

`book/forging/bk1-pocket-computers-and-cold-thumbs.md` (`ai-draft`) says: *"There
was a 3 a.m. pivot in there—killing a shiny PhoneGap build inside Visual Studio
after a stubborn test told us it wouldn't carry a public launch. We switched to a
web-first mobile framework."*

**The shape of that is now corroborated** by a first-person account: an outsourced
mobile build dropped, a public-company deadline, a switch to a web app. Today's
audit listed the whole passage as unsourced; that was right at the time and is now
partly wrong.

**Still not corroborated:** that the dropped build was **PhoneGap**, that it was
**inside Visual Studio**, that the trigger was "a stubborn test", or that it
happened at **3 a.m.** He said the work sat with a company in Israel; whether that
company had built a PhoneGap app in Visual Studio is a different claim. Do not
merge the two accounts.

## Capture prompts

1. **The 2012 build vs the 2013 rollout.** Was the mobile deliverable due in 2012
   with the enterprise rollout completing in 2013, or is the rollout date the one
   to adjust?
2. **The three weeks.** Who actually built it — you, Jeff Taynton, Mike Huff, all
   three? Did anyone sleep?
3. **The call itself.** You put it on yourself twice. What made you certain enough
   to pull a contract three weeks out, and what would have happened if the three
   weeks had failed?
4. **The Israeli company** — keep them generic, or do you want them named? They
   are a third party and nothing about them is on file.
5. **The 90 days.** One problem you remember by name.
6. **The third-party company** — keep them generic, or name them? They built an
   app that "didn't run worth a crap" for a named public-company rollout, which is
   a harder thing to put next to a real firm's name than a neutral fact.
