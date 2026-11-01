# AI-draft audit — the 37 generated scenes in the manuscript

**Written 2026-10-31.** Companion to `ORGANIZATION-REVIEW.md`. Hand-written
analysis — do not regenerate. Figures recomputed from `_index.json`,
`story-index.json` and `compile-manuscript.js` on 2026-10-31.

---

## The number

Of the **70 scenes** that `compile-manuscript.js` puts in the book:

| | Scenes | Words |
|---|---|---|
| `ai-draft` and nothing else | **37** | **29,582** |
| `dump-draft` | 17 | — |
| `raw` | 1 | — |
| **`ready`** | **15** | **13,025** |
| **Total manuscript** | **70** | **62,311** |

**47% of the words in your book are AI-generated drafts.** This is not an
outside assessment — it is `story-index.json`'s own `trust` field. The index
uses exactly five trust values (`reference`, `ai-draft`, `dump-draft`, `raw`,
`ready`), so there is no fuzzy matching here, and there is **no disagreement**:
not one of the 37 is called `raw`, `ready` or `dump-draft` under any other code.

The 15 `ready` scenes are the book that is actually yours: The Van, The Hilltop,
I Didn't Look, Chuck at 175, Chuck at Sixty Seconds, Forty Dollars and a Fork,
The Cold Call, The Dave Problem, The Elopement, The Forty Percent Ask, The
Garage, The Last Flight, The Quorum Bed, Three Thirty AM, 150 Credit Hours.

`bk1-scars-as-data.md` was audited on 2026-10-31 (flags #4 and #7 actioned).
The other 36 had not been looked at. This is that look.

> **State after the 2026-10-31 actions** (scaffolding strip + bucket A refile).
> The figures above are the audit's findings as taken; these are where the book
> stands now:
>
> | | At audit | Now |
> |---|---|---|
> | Manuscript scenes | 70 | **63** |
> | Manuscript words | 62,311 | **55,169** |
> | `ai-draft` scenes | 37 (53%) | **30 (48%)** |
> | `ai-draft` words | 29,582 (47%) | **22,440 (41%)** |
>
> The corpus is unchanged at 109 pieces — nothing was deleted, only refiled: 70 →
> 63 scene, 20 → 25 essay, 19 → 21 capture. The AI share fell because padding and
> non-memoir left the book, **not** because any fabrication was corrected. The
> invented `FieldVisor` product, the pumpkin-patch allegation, the invented
> dialogue and the remaining duplicate beats are all still exactly where they
> were.

---

## They are not all the same thing

The 37 split cleanly in two, and the halves need different decisions.

### Group A — generated Medium posts with production scaffolding (19 scenes, 11,057w)

These are not drafts of memoir. They are **Medium posts built from a template**,
and the template is still in them. Every one follows the same skeleton: title,
italic maxim, a three-fragment sensory opener ("Ozone and hot plastic." /
"Metal rung. Cold bite." / "Stale coffee. Thin towels."), a compressed anecdote,
a bolded rule, an **"AI tie"** paragraph bolting 2026 AI tooling onto a
childhood memory, then:

- **`AI Playbook`** — Purpose / Prompt / Constraints. Literal prompt templates. **18 scenes.**
- **`Image Prompts`** — instructions to an image generator, "cinematic realism" and all. **15 scenes.**
- **`_Tags: memoir, AI, startups, farming, energy, leadership, resilience_`** — the identical line. **10 scenes.**
- **`Fact Pack — verify:`** — a list of the facts the generator knew it didn't have. **7 scenes.**

**3,004 words of that scaffolding were compiling into the manuscript.** Not weak
prose: image-generation prompts and prompt templates, inside the book.

> **Stripped 2026-10-31.** The figure first reported here was 2,831 words, counted
> from the `AI Playbook` / `Image Prompts` headings only. Doing the strip found
> three more block types — `Suggested Medium metadata`, `Social cut` and
> `Publishing kit` — bringing it to **3,004 words across 18 scenes**. The
> manuscript went 62,311 → **59,307 words**, 70 scenes unchanged. Verbatim record:
> `_meta/notes/ai-draft-scaffolding-removed-2026-10-31.md`.

### Group B — generated prose, no scaffolding (18 scenes, 18,525w)

These read as finished essays or memoir. No template furniture. The problem here
is not obvious on the page — it is that the specifics are invented, and they are
invented confidently.

---

## Findings, worst first

### 1. One "scene" is a pasted chat transcript

`forged/bk-roads-less-traveled-overcoming-adversity-and-.md` — 2,366 words, the
largest of the 37 — is a **raw AI chat log**. It contains your prompts verbatim:

> "I want to give you some changes and details on another article and I want you
> to rewrite the suggestion."

> "I want to give you more information on the first article and have you improve it."

plus three different article titles and their generated bodies stacked end to
end. It is in the manuscript, in the Forged arc.

**But do not delete it.** Buried inside those prompts is some of the best raw
source material in the repo — your own dictation, in your own voice, lowercase
"i" and all:

> "I grew up in a small rural town in northeast Ohio. Some of the earliest
> memories i have were riding on the tractor with my Dad as he farmed all night.
> My Mom would bring us sandwiches with long days picking up rocks in the field."

> "When i was 11, we purchased my great grandparents farm and that was the shift
> of the farm from grain only to dairy beef cattle."

That second line is also **evidence for an open conflict** — `ACC-1990` records
a dispute over whether the livestock farm was "bought" in 1990/1991 versus
Bechtel land held "since Ohio was a state". Born Dec 30 1979, age 11 = Dec 1990
to Dec 1991, which matches the 1990/1991 purchase date exactly.

**Disposition:** this is a capture, not a scene. Extract the dictated passages
to `captures/`, then the generated articles can go.

### 2. ~~An invented company asset~~ — **WRONG, corrected 2026-10-31**

> **This finding was incorrect and is retracted.** Shawn, chat 2026-10-31:
> *"FieldVisor, ScadaVisor and VisorBridge was the three products i built under
> Fielding Systems. collectively this was a digital oilfield platform, first of
> its kind in the cloud"*
>
> **FieldVisor is real.** So are two further product names the corpus had never
> recorded at all. Now captured in
> `captures/bk1-fielding-products-visor-platform.md` and added to `codes.FIELD`.

The original finding read: `bk1-pocket-computers-and-cold-thumbs.md` asserts
"**FieldVisor** stuck because it was faithful to the job. It still runs", and
"FieldVisor" appears nowhere else in the corpus — therefore an invented product.

**The observation was right and the inference was wrong**, and the distinction
matters for the rest of this document. The name genuinely was absent from every
capture, session log, profile and timeline. But *absent from the captures* is not
*false*. It meant the corpus had a hole where three product names should be, and
the generated scene happened to be the only place one of them was written down.

What this changes about how to read the other findings here: "unsourced" in the
tables below means **not corroborated in this repo** — a flag to ask Shawn, not a
verdict that the detail is fabricated. Findings #3 and #4 are still serious for a
different reason: they put a specific allegation and specific dialogue on real,
named people, where being wrong does harm beyond a factual error. The standard
there is not "is it in the corpus" but "would you publish this without asking."

One claim from the correction does still need checking before publication:
"first of its kind in the cloud" is a market-history claim, recorded as Shawn's
and uncorroborated. Logged as a `FIELD` gap.

### 3. A serious allegation about real people, AI-only

`forged/bk1-a-fall-from-grace-the-pumpkin-patch-incident.md`:

> I was mowing Hughie's yard when Pinky, Hugh's wife, came out and said, "Your
> dad just beat CJ up at the farm. I don't know how bad it is."

This says your late father assaulted your brother, and attributes the reporting
of it to a named neighbour. The `PUMPKIN-PATCH` code's own summary says the
pumpkin business is real (`FORK-40`) but **"this draft's incident details are
unverified."** The claim exists in this generated file and nowhere else.

Whatever the truth is, it should not reach a page from a generated draft.

### 4. Invented dialogue in living people's mouths

- `fractured/bk1-therapy-loneliness-and-clarity.md` — your wife, at a specific
  invented time, saying an invented line:
  > My wife finally said the quiet part at **12:40 a.m.** in the kitchen…
  > "We need you, not the person who's always almost done."

  The index already names this one: "a 12:40 a.m. kitchen scene … has no source."
- `fractured/bk1-the-30-year-echo.md` — a standing rule attributed to her: *"if
  she says, 'Are you here or somewhere else?'"*
- `forging/bk1-blackout-on-two-grids.md` — Carina given dialogue in an invented outage.

### 4b. One "unsourced" call later moved — partly (2026-10-31)

Worth recording against the tables below, because it cuts the other way from
finding #2's retraction. `bk1-pocket-computers-and-cold-thumbs.md`'s mobile pivot
— an outsourced build killed because it "wouldn't carry a public launch", then a
switch to a web app — was listed here as unsourced. Shawn later described exactly
that: three weeks from the Penn Virginia rollout, the app with a company in
Israel, pulled and rebuilt in-house, then 90 days of compression work to hold the
install under 15 MB. The *shape* was right.

The toolchain specifics (PhoneGap, Visual Studio, the "stubborn test", 3 a.m.)
remain unsourced. So a generated draft can have a true structure and invented
furniture at the same time, and "unsourced" has to be read as *not corroborated
here* — which is what finding #2's retraction already says, arrived at from the
opposite direction.

### 5. Fabrication that displaced something better

`fractured/bk1-the-30-year-echo.md` has, three days after the wreck:

> "A chaplain tried to pray. I watched his lips move and felt nothing…"

What your captures actually record, twice, is sharper and stranger and yours:

> "Told pastor at age 10 that God doesn't exist. **Pastor never came back.**"

This is the pattern worth internalising: the generated line is not merely
unsourced, it is *weaker than the truth it replaced*. Same with the Scar Map
device versus `bk1-the-delay.md`'s real image — "Little scars all over, like a
map of everywhere they took from to give back to the foot."

### 6. Six beats are in the book twice — once yours, once generated

`compile-manuscript.js` is emitting both versions.

| Code | Yours (keep) | Generated (also compiling) |
|---|---|---|
| `ASK-40` | `forging/bk1-the-forty-percent-ask.md` (ready, SoT) | `forging/bk1-fractured--forging---the-forty-percent-ask.md` |
| `SIDE-HUSTLES` | `forged/bk-stories-of-side-hustles.md` (raw, SoT) | `forged/bk-idle-hands-and-constructive-work-lessons-from.md` |
| `FIELD` | `bk1-the-garage.md`, `bk1-the-cold-call.md`, `bk1-the-forty-percent-ask.md` (all ready) | `forging/bk-from-farm-to-startup-the-journey-of-building-.md` |
| `ARM-1997` | `forged/bk1-chuck-at-sixty-seconds.md` (ready) | `foundry/bk1-scars-as-data.md` |
| `STITCH-87` | `_meta/CHARACTER-LIST.md` is the SoT; `bk1-the-forty-percent-ask.md` (ready) shares the code | `fractured/bk-how-87-stitches-and-a-broken-bone-prepared-me-.md` — note: this is the only *scene* telling the 87-stitches beat, so it is a weaker duplicate claim than the rows above |
| `ACC-1990` | `bk1-i-didnt-look.md`, `bk1-the-van.md` (both ready) | **five** generated scenes |

The `ASK-40` pair even share a title. And the accident — the spine of the whole
book — is currently told **seven times**: twice by you, five times by a model.

### 7. Non-memoir filed as memoir

The `EA-WHITEPAPERS` code says of itself: *"Not memoir; no biographical facts
should be taken from them."* It has 21 files. **17 are correctly in `essays/`.
Three are `kind: scene` in `book/`** and compile as memoir:

- `forged/bk1-neighbor-circuit.md`
- `forging/bk1-neighbor-dividend-power-food-and-quiet-hou.md`
- `forging/bk1-january-heat-compost-steam.md` — titled "**Foundry** - January Heat" while filed `arc: forging`

This is the `bk1-akron-lab.md` problem again: right kind declared, wrong folder,
so nothing flags it. `forged/bk1-designing-for-generations.md` (1,450w) is the
same class — Terrasow content, a 2022-onward company, filed in **Forged**, the
1980–1990 childhood arc.

And the leakage your Mansfield rule exists to prevent has happened:
`bk1-neighbor-dividend` carries **"55 dBA"**, **"800 ppm"**, **"900 ppm"** and
**seven** unresolved markers (six `[NEEDS CHECK]`, one `[ANON]`) — engineering specs and unresolved
placeholders, inside a memoir scene. The code's own conflict note says *"Scale/MW
figures in these papers must never be imported into memoir voice."*

### 8. Seven scenes list what they made up

The generator left its own confession. Verbatim `Fact Pack — verify:` lines:

| Scene | What it admits it does not know |
|---|---|
| `bk1-motel-whiteboard-mvp.md` | town/site, first customer title, exact loop shipped |
| `bk1-password-cracker-crash.md` | tool type, who supervised the fix, what policy changed |
| `bk1-senior-skip-day.md` | Pee Wee Hollow location, name of parts store, day of week |
| `bk1-silo-steps-no-handle.md` | silo height, season, check frequency |
| `bk1-blackout-on-two-grids.md` | outage date, exact regions, generator model, hours awake |
| `bk1-neighbor-dividend…md` | homes on the circuit, dBA code, CO₂ targets, islanding spec |
| `foundry/bk1-counting-shawns.md` | accident date and place, surgery count, which "counted Shawns" are publishable, whether family is named or anonymised, the "power campus" meeting date |

In other words: for these, the *scene* is the invention and the facts were
pending. `bk1-counting-shawns.md`'s checklist is worth a second look on its
own: it asks you to "confirm" **32 surgeries**, where every canonical source in
the repo — `CHARACTER-LIST.md`, `P2L-BOOK-CONTEXT.md`, `CLAUDE.md` — says
**40+**. The wrong number is in the checklist, not the prose, so nothing
published is wrong yet; but anyone working that list would be confirming a
figure the repo already contradicts. `bk1-password-cracker-crash.md`'s triumphant "**We owned it**" ending is
already called out in `captures/bk1-akron-lab.md`, which warns against importing
exactly that: *"Do not invent a teacher, admin, punishment, or a 'we owned it'
ending (that ending lives only in the unverified password-cracker draft)."*

### 9. They are also what broke your chronology

**28 of the 37 have no `date_event`** — and they are 28 of the 33 dateless
scenes in the entire manuscript. `event-date.js` correctly sends a dateless
scene to the end of its arc, so every arc currently ends in a pile of
undated generated essays in arbitrary order. Fixing the AI-draft problem fixes
most of the book's ordering problem at the same time.

---

## What is genuinely salvageable

Not everything here is worthless, and it would be wrong to report otherwise.

- **`bk-roads-less-traveled`'s embedded dictation** — real first-person source, see #1.
- **`bk1-senior-skip-day.md`** — its Fact Pack asks to verify "Pee Wee Hollow",
  but Pee Wee Hollow **is real**: it appears in `archive/legacy-draft/bk-short-stories.md`,
  your own raw story collection, which the index calls "the highest-trust source
  for these anecdotes". Real kernel, generated telling.
- **`agMD`** is a real company (prologue, profile, timeline) — the agMD material
  in #1 is about something that exists.
- **`foundry/bk1-the-quiet-quit-of-legacy.md`** is the best of the 36: it already
  carries a cited source ledger, a resolved-by-Shawn note from the 2026-10-30
  chat, and its own capture prompt. It is a generated draft that has been worked.
- **`PUMPKIN-PATCH`, `SILO`, `GATE-LATCH`, `SKIP-DAY`, `HAT`** all point at real
  anecdotes in `bk-short-stories.md`. The events happened; the scenes were written
  by a model that had not read them.

---

## Suggested disposition

Four buckets. Every one of these is your call; nothing here has been actioned.

**A. Out of the book — ✅ DONE 2026-10-31 (7 scenes, −4,138w).**

This bucket's arithmetic was wrong as first written: it said "8 scenes" and then
listed 3 + 1 + 5 = **nine**, and it omitted the Medium series preface found
later, making ten candidates. Checking each one before moving it cut that to
**seven**, because two of the "pure duplicates" were not duplicates at all.

Moved to `essays/` as `kind: essay`, `arc: foundry` (matching the dominant
convention of their 17 siblings) — not memoir by their own code's words:

- `bk1-neighbor-circuit.md`, `bk1-neighbor-dividend-power-food-and-quiet-hou.md`,
  `bk1-january-heat-compost-steam.md` (EA white papers)
- `bk1-designing-for-generations.md` (Terrasow, a 2022+ company, had been in Forged)
- `bk1-this-starts-here-a-genx-technologist-energ.md` (Medium series preface; its
  `arc` left as found)

Moved to `captures/` as `kind: capture` — real memoir, but a weaker retelling of
a beat already finished elsewhere, so mineable rather than publishable:

- `bk1-fractured--forging---the-forty-percent-ask.md`. Its one distinctive
  detail, the Hartford rental-car setting, turned out to be **sourced and already
  in the `ready` scene** ("I drove that night. Hartford to Avon"). And
  `_calendar.json` has carried a `duplicate_cleanup_required` task since
  2026-05-09 naming this exact file, with the same keep/remove decision.
- `bk-from-farm-to-startup-the-journey-of-building-.md` — a generic overview
  ("This narrative explores the origins, challenges…") of material told properly
  in `bk1-the-garage.md`, `bk1-the-cold-call.md` and `bk1-the-forty-percent-ask.md`.

**NOT moved, and why — these were on the list and should not have been:**

- `bk-idle-hands-and-constructive-work-lessons-from.md` shares the
  `SIDE-HUSTLES` code with a `raw` source-of-truth file, but tells different
  material: a reflection on Chuck's intolerance of idleness, versus a list of the
  actual hustles. A shared code is not a duplicate.
- `bk-how-87-stitches-and-a-broken-bone-prepared-me-.md` is the **only scene
  telling the pre-accident-injuries beat** (87 stitches by age 10, the barn-loft
  fall, the wrestling break). `STITCH-87`'s source of truth is
  `CHARACTER-LIST.md`, a reference doc, not a scene. Moving it would delete a
  beat with nothing replacing it.
- `bk-roads-less-traveled-overcoming-adversity-and-.md` belongs to bucket C: the
  dictation inside it has to be mined out before the generated articles can go.

**B. Strip the scaffolding — ✅ DONE 2026-10-31 (18 scenes, −3,004w).** Was
mechanical and safe, and was: not one sentence of narrative was touched, and every
stripped scene still ends on its closing line or `_Rule:`. One file was held back —
`bk1-this-starts-here-a-genx-technologist-energ.md` is a Medium *series preface* end
to end ("Why Medium", "My co-author is an AI", "How to read this"), so stripping its
playbook would have left a non-scene looking like a scene. It needs a whole-file
decision, and it also contains its own never-combine break in prose: "EnergiAcres and
Terrasow are what happened when I stopped hiding…". A test now fails if scaffolding
returns to any other scene.

**C. Mine, then cut (the Fact Pack seven + `roads-less-traveled`).** Pull the
real kernels and the dictation into `captures/`, note the open questions as
capture prompts, drop the generated scenes.

**D. Needs you, not me (the rest of Group B).** `knuckles--knowing`,
`counting-shawns`, `therapy-loneliness`, `the-30-year-echo`, `surgeons-revelation`,
`breaking-barriers`, the two CVF pieces. Real themes, invented scenes. Nobody
but you can say which remembered moment belongs where the invention is.

**Highest-value single edit:** #2 (`FieldVisor`) and #3 (the pumpkin-patch
allegation). Both are specific, checkable, false-or-unverified claims about a
real company and real people, and both are one line each.

---

## What this audit did NOT do

- It did **not** fact-check every sentence of 29,582 words. It identified
  structure, cross-checked the high-signal claims (named products, named people,
  dialogue, specs, duplicates) and took the index's `trust` field as given.
- It did **not** verify the 17 `dump-draft` scenes or the 15 `ready` ones. The
  `ready` label is the author's; it was not re-tested here.
- It did **not** assess prose quality, only provenance.
- `fractured/bk1-the-30-year-echo.md`'s sections 1, 2 and 4 assert further
  practices (weekly builder call, monthly red team, three blind references,
  90-day scorecards, a 9:30 p.m. alarm) on the same unsourced footing as the
  `Pain → Policy` list cut on 2026-10-31. They were not audited line by line.
- No file was changed by this audit.

---

## Per-scene table

Flags: `SCAFFOLD` = carries AI Playbook / Image Prompts · `SELF-CONFESSED` =
carries a Fact Pack · `PROMPT-TRANSCRIPT` = raw chat log in the prose ·
`UNRESOLVED-SPEC` = `[NEEDS CHECK]` / `[ANON]` left in · `ENG-SPECS` = MW/dBA/ppm
figures in memoir voice · `DUPLICATES-READY` = a `ready`/`raw` scene in the book
covers the same code · `NO-DATE` = no `date_event`, sorts to the end of its arc.

| Scene | Words | Codes | Flags |
|---|---|---|---|
| `forged/bk-expanded-comedic-stories.md` | 937 | HAT,SHORT-STORIES | NO-DATE |
| `forged/bk-idle-hands-and-constructive-work-lessons-from.md` | 462 | SIDE-HUSTLES,REF-LEGACY | DUPLICATES-READY NO-DATE |
| `forged/bk-roads-less-traveled-overcoming-adversity-and-.md` | 2366 | ACC-1990 | PROMPT-TRANSCRIPT DUPLICATES-READY NO-DATE |
| `forged/bk-the-power-of-grit-how-farming-taught-me-to-pe.md` | 456 | REF-LEGACY | NO-DATE |
| `forged/bk1-a-fall-from-grace-the-pumpkin-patch-incident.md` | 899 | PUMPKIN-PATCH | NO-DATE |
| `forged/bk1-designing-for-generations.md` | 1450 | TERRASOW | NO-DATE |
| `forged/bk1-gate-latch-hog-logic.md` | 724 | GATE-LATCH | SCAFFOLD |
| `forged/bk1-motel-whiteboard-mvp.md` | 355 | ACC-1990,OILFIELD-AI | SCAFFOLD SELF-CONFESSED DUPLICATES-READY |
| `forged/bk1-neighbor-circuit.md` | 396 | EA-WHITEPAPERS | SCAFFOLD NO-DATE |
| `forged/bk1-password-cracker-crash.md` | 326 | OILFIELD-AI | SCAFFOLD SELF-CONFESSED NO-DATE |
| `forging/bk1-pocket-computers-and-cold-thumbs.md` (refiled from `forged/` 2026-10-31) | 366 | OILFIELD-AI | SCAFFOLD NO-DATE |
| `forged/bk1-senior-skip-day.md` | 380 | SKIP-DAY | SCAFFOLD SELF-CONFESSED |
| `forged/bk1-silo-steps-no-handle.md` | 312 | SILO | SCAFFOLD SELF-CONFESSED NO-DATE |
| `forging/bk-from-farm-to-startup-the-journey-of-building-.md` | 468 | FIELD | DUPLICATES-READY |
| `forging/bk1-blackout-on-two-grids.md` | 410 | OILFIELD-AI | SCAFFOLD SELF-CONFESSED NO-DATE |
| `forging/bk1-dont-throw-out-the-baby.md` | 345 | OILFIELD-AI | SCAFFOLD NO-DATE |
| `forging/bk1-forging---we-priced-it-like-a-well-not-a-web.md` | 508 | OILFIELD-AI | SCAFFOLD NO-DATE |
| `forging/bk1-fractured--forging---the-forty-percent-ask.md` | 518 | ASK-40 | SCAFFOLD DUPLICATES-READY NO-DATE |
| `forging/bk1-january-heat-compost-steam.md` | 539 | EA-WHITEPAPERS | SCAFFOLD NO-DATE |
| `forging/bk1-mud-and-motherboards.md` | 925 | OILFIELD-AI | NO-DATE |
| `forging/bk1-neighbor-dividend-power-food-and-quiet-hou.md` | 535 | EA-WHITEPAPERS | SCAFFOLD SELF-CONFESSED UNRESOLVED-SPEC ENG-SPECS NO-DATE |
| `forging/bk1-moving-the-oilfield-to-the-cloud.md` | 1254 | OILFIELD-AI | SCAFFOLD |
| `forging/bk1-this-starts-here-a-genx-technologist-energ.md` | 915 | OILFIELD-AI | SCAFFOLD |
| `forging/bk1-when-equity-didnt-move-the-needle.md` | 501 | OILFIELD-AI | SCAFFOLD NO-DATE |
| `foundry/bk1-counting-shawns.md` | 1165 | SHAWN-INDEX,AI-MEDIUM-2025 | SELF-CONFESSED NO-DATE |
| `foundry/bk1-knuckles--knowing.md` | 935 | AI-MEDIUM-2025 | NO-DATE |
| `foundry/bk1-scars-as-data.md` | 2002 | ARM-1997,AI-MEDIUM-2025 | DUPLICATES-READY NO-DATE |
| `foundry/bk1-the-day-i-stopped-recruiting-my-family.md` | 1086 | CVF | NO-DATE |
| `foundry/bk1-the-quiet-quit-of-legacy.md` | 1190 | CVF | NO-DATE |
| `fractured/bk-breaking-barriers-my-battle-with-depression-a.md` | 458 | HS-REBEL,REF-LEGACY | NO-DATE |
| `fractured/bk-how-87-stitches-and-a-broken-bone-prepared-me-.md` | 1127 | ACC-1990,STITCH-87 | DUPLICATES-READY NO-DATE |
| `fractured/bk-how-to-turn-40-surgeries-into-a-factory-for-gr.md` | 602 | ACC-1990 | DUPLICATES-READY NO-DATE |
| `fractured/bk-the-surgeons-revelation-a-teenagers-shatter.md` | 895 | SURGEON-DREAM | NO-DATE |
| `fractured/bk1-rolling-ohio-hills.md` | 852 | ACC-1990 | SCAFFOLD DUPLICATES-READY |
| `fractured/bk1-the-30-year-echo.md` | 1116 | ACC-WARD,OS-ECHO | — |
| `fractured/bk1-therapy-loneliness-and-clarity.md` | 1151 | OS-ECHO,THERAPY | NO-DATE |
| `fractured/bk1-unbirthday-real-work-mansfield-meeting-rec.md` | 656 | UNBIRTHDAY | SCAFFOLD |
