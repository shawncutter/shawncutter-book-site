---
title: "Farm roots — Shawn's dictation (mined from the Roads Less Traveled transcript)"
kind: capture
arc: forged
status: draft
date_event: "~1985"
date_written: "2026-10-31"
source: "Mined 2026-10-31 from captures/bk-roads-less-traveled-overcoming-adversity-and-.md — a ChatGPT conversation export that had been filed as a book scene. These are Shawn's own words from inside the prompts."
rewrite_status: "raw capture / verbatim dictation extracted / not yet a scene"
review_status: "verbatim only — nothing added. Four facts cross-checked against the corpus; see Cross-checks below"
trust: "raw (Shawn's own dictation, typed not spoken)"
themes:
  - farm
  - father
  - mother
  - side-hustles
  - systems-thinking
  - work-ethic
  - resilience
people:
  - Shawn Cutter
  - Chuck Cutter
  - Beth Cutter
locations:
  - northeast Ohio
  - Bechtel farm
related_to:
  - bk-roads-less-traveled-overcoming-adversity-and-.md
  - bk-stories-of-side-hustles.md
  - bk1-the-yard.md
  - bk1-the-hilltop.md
sources:
  - LexDocs/captures/bk-roads-less-traveled-overcoming-adversity-and-.md
---

# Farm roots — Shawn's dictation

> **Where this came from.** `bk-roads-less-traveled-overcoming-adversity-and-.md`
> was filed as a `scene` in `book/forged/` and compiled into the manuscript. It is
> not a scene: it is a **ChatGPT conversation export**, complete with the web UI's
> user-avatar image, `ChatGPT` speaker labels and "Certainly, here's the revised
> version." Most of it is article outlines and generated prose.
>
> But Shawn typed real source material into the prompts, and that material is
> better than the articles built from it. It is extracted here verbatim —
> lowercase `i` and all — so it can be used without going back through a chat log.
> Nothing has been added, cleaned or completed.

---

## Verbatim — the farm (Shawn's own words)

> "I grew up in a small rural town in northeast Ohio. Some of the earliest
> memories i have were riding on the tractor with my Dad as he farmed all night.
> My Mom would bring us sandwiches with long days picking up rocks in the field."

> "When i was 11, we purchased my great grandparents farm and that was the shift
> of the farm from grain only to dairy beef cattle."

> "The farm purchased had been run down for quite some time and there was always
> something to fix, cleanup, or upgrade. Today's farm has been a complete
> transformation from what it was as a dairy farm. It is still the farm i remember
> spending long summer days on as my great grandma watched close to a dozen kids
> while our parents worked."

## Verbatim — what the land taught him

> "I learned to always look for what is going to go wrong because Murphy will show
> up when you don't have time for him. The work you put in today will pay
> dividends in the future and some things take a long time to yield the desired
> results."

> "I learned how to make money on side hustles using the land and tools i had
> available. I grew pumpkins and sweet corn that I sold in the fall and I took
> animals to the fair for spending money."

## Verbatim — why he left

> "I knew that farming would never be something that could sustain my ambition or
> even a family. This was a lesson that my Dad already knew when he started an oil
> and gas company."

> "As i went out into the world and had success in technology, i began to realize
> that applying tech to farming can be the shift that is needed to be successful."

---

## Supplied by Shawn but not in his voice

The other prompt in that transcript is written as instructions to the model, so
these are his assertions in third person rather than dictation. Recorded as
supplied, not as quotable:

- agMD was deliberately designed to borrow "all of the success factors from his
  first company Fielding Systems, especially making it person[al] and building on
  the job to ensure it solved problems."
- Cedar Valley Farms described as "a vertically integrated wellness company with
  some of the finest hemp products on the market." Promotional framing from the
  period; `codes.CVF` records how it actually ended — hemp shut, wellness kept,
  the farm remained.

---

## Cross-checks (done 2026-10-31, not assumed)

| Claim | Result |
|---|---|
| "When i was 11, we purchased my great grandparents farm" | **Partly corroborated, and it sharpens an open conflict.** `_meta/characters.json` records "BECHTEL FARM ACQUIRED 1990: the family bought great-grandma Bechtel's farm in 1990", and that the West Salem farm was sold to buy it. Born 1979-12-30, so he was **10** for all of 1990 until Dec 30. His own recollection of "11" would put it Dec 30 1990 – Dec 1991. `codes.ACC-1990` carries the unresolved conflict between a 1990/1991 purchase and Bechtel land held "since Ohio was a state"; this is first-person evidence for the purchase, not for the year. |
| "Murphy will show up when you don't have time for him" | **Connects to a known thread.** `_meta/questions/FRACTURED-QUESTIONS.md` #10 records a "Murphy's Law philosophy" of his: "I've tested all the bad ways to do things, and I learn from those." Same idea, different words — worth deciding which phrasing is canonical. |
| pumpkins, sweet corn, animals to the fair | **Corroborated.** `codes.PUMPKIN-PATCH` ("the business is real"), `SIDE-HUSTLES`, `FORK-40`. |
| "#2 oil producer in the State of Ohio in 2010" (from the outline, not the dictation) | **Sourced — but only in a backup.** It appears in `LexDocs/_facts.json.bak` as "CUTTER OIL RANK: became the #2 OIL PRODUCER IN THE STATE OF OHIO in 2010" and **not** in the live `LexDocs/_facts.json`. See the gap note below. |

---

## Two gaps this surfaced

1. **A fact is surviving only in a `.bak` file.** The Cutter Oil #2-in-Ohio rank
   is in `_facts.json.bak` and absent from the live `_facts.json`. It is
   recoverable today and would be lost the moment backups are tidied.
2. **The 1990 farm purchase is not in the live timeline at all.**
   `LexDocs/_timeline.json` jumps from "Farm Life Begins" (1980) to the accident
   (1990-10-29) with no Bechtel-farm event, though `characters.json` dates it to
   1990. The event that turned the farm from grain to cattle is missing from the
   timeline the dashboard reads.

## Capture prompts

1. **The farm year (one breath):** Was the great-grandma Bechtel farm bought
   before or after your birthday that year? You said 11; the repo says 1990, and
   you turned 11 on Dec 30 1990. Either answer is fine — it settles an open
   conflict.
2. **Murphy:** Two versions of the same rule are on file — "always look for what
   is going to go wrong because Murphy will show up when you don't have time for
   him" and "I've tested all the bad ways to do things, and I learn from those."
   Which one is the Cutter Rule?
3. **A dozen kids:** "my great grandma watched close to a dozen kids while our
   parents worked" is a scene nobody has told yet. Whose kids, and what was that
   house like on a working day?
