# Organization Review — P2L Corpus

*Hand-written review, 2026-10-27. Not generated; do not regenerate.*
*Companion to `STORY-MAP.md` (which describes what exists) — this describes
what is wrong with how it is filed, and what to do about it.*

---

## The headline

**`LexDocs/` is holding five different kinds of document in one tree, and
nothing distinguishes them.** Every count you plan from — "136 pieces,
~194K words" — is really five corpora added together. Measured by content:

| Kind | Pieces | Words | What it is |
|------|-------:|------:|------------|
| **Memoir scenes** | 65 | ~54,400 | **The actual book.** Discrete scenes, `bk1-` prefix. |
| Legacy book draft | 20 | ~45,700 | A *prior complete draft* — `bk-chapter-1…10`, `bk-prologue-`, `bk-my-book-`, `bk-memoir-outline-`. Own chapter numbering, truncated filenames. |
| Lex-imported essays | 23 | ~16,600 | Imported from Lex (all open with an `lex-img-p.s3` embed). Roughly half EnergiAcres business thesis, half memoir. |
| Capture scaffolds | 13 | ~24,100 | Files whose own first line reads **"CAPTURE SCAFFOLD — not finished memoir."** |
| Meta-notes | 11 | ~19,000 | Process files filed as stories: `bk-psychoanalysis-of-shawn`, `bk-initial-feedback`, `bk1-master-question-list-…`, `bk---family`, `bk1-welcome-test`. |

So the drafted memoir is **~54K words, not 194K**. The other 140K is a prior
draft, a business-thesis pamphlet, raw capture, and project admin. All four
non-memoir classes are currently indistinguishable from scenes to every
script, every count, and every agent that reads this folder.

### Why that matters immediately

`scripts/compile-manuscript.js` is the thing that assembles the book. It
excludes only `status: idea` (there are none) and files without frontmatter.
**Everything else goes in.** Compile the manuscript today and you get the
memoir interleaved with gas-backed-compute market positioning, capture
scaffolds that say they aren't memoir, and a second complete draft of the
same life.

---

## The nine problems, in priority order

### 1. There is no book order. At all.
No file in the corpus carries `chapter:`, `order:`, `part:`, or `sequence:`
— I checked all 132. Arc is the only structure, and arcs run 24–44 pieces
each. Nothing answers "what is Chapter 1, what's in it, what follows."

The compiler's fallback is `arc`, then `date_event` ascending, **missing
dates to the end**. And `date_event` is missing on **89 of 136** pieces:

| Arc | Unordered tail |
|-----|----------------|
| forged | 26 of 44 |
| fractured | 15 of 24 |
| forging | 22 of 38 |
| foundry | **26 of 30** |

So two thirds of the book currently compiles in filename order. Foundry is
effectively unordered. This is the single highest-leverage fix: the writing
isn't the blocker, the sequencing is.

### 2. The arc folder is doing three jobs and failing at all three.
`arc/status/file.md` encodes chronology, doneness, and location at once.
- **Chronology breaks:** 10 pieces have a `date_event` outside their arc's
  year window — `bk1-senior-skip-day` (1998) in forged (1980–1990),
  `bk1-the-yard` (2026) in forged, `bk1-the-30-year-echo` (2010) in
  fractured (ends 2003), `bk1-unbirthday-…` (1980) in fractured.
- **Doneness is decorative:** `scan-stories.js` reads status from
  frontmatter only (`fm.status || 'draft'`) and ignores the `draft/`
  `ready/` folder entirely. They happen to agree on all 132 files right
  now, but nothing enforces it — promoting a piece takes a `git mv` *and*
  a field edit, and only the field counts.
- **Business essays have no chronological home**, so they scattered at
  random: "Pads We Can Ship in Six Months" and "The Permit Ledger" sit in
  **forged** — 1980s farm childhood. "The AI Race Is an Energy Race" sits
  in foundry. Same genre, three different arcs.

### 3. `_topics.json` is stale and silently wrong.
All **91** theme keys shared with the frontmatter disagree on counts, and
it caps at 6 stories per theme. Frontmatter says `technology` is on 99
pieces; `_topics.json` says 6. It also carries 3 themes (`authenticity`,
`midwest`, `universe-frame`) that no file uses any more.

`STORY-MAP.md` builds its **cluster table from `_topics.json`**, so those
six clusters are meaningless — one "cluster" is 87 pieces. The map's theme
index (from `_index.json`) is fine. Trust the themes, ignore the clusters.

### 4. The theme vocabulary has no usable middle.
91 keys on 132 files, bimodal and unhelpful at both ends:
- **5 themes sit on 50–99 pieces** (`technology` 99, `family` 87,
  `systems-thinking` 84, `resilience` 81, `startup` 70). A tag on 75% of
  the corpus carries no information.
- **78 themes appear on fewer than 5 pieces.**
- **4 are case/plural splits of each other:** `accident`/`accidents`,
  `chuck`/`Chuck`, `cj`/`CJ`, `brother`/`brothers`, plus
  `surgeries`/`surgery`.

### 5. Metadata you'd actually query by is unpopulated.
- `date_event`: 62 of 132
- `people`: **16 of 132** — despite `_meta/CHARACTER-LIST.md` tracking 18
- `locations`: 14 of 132

You cannot currently ask "every scene with CJ in it" or "everything set at
the Mansfield site" and get a real answer.

### 6. Six near-duplicate pairs, uncrossreferenced.
Same material in two versions, sometimes in different arcs, with no
`supersedes:` link to say which wins:

| Pair | Where |
|------|-------|
| `the-permit-ledger-if-it-isnt-dated-and-owned` / `-turning-maybe-into-dates` | both forged |
| `pads-we-can-ship-in-six-months` / `-standard-block` | forged **+** foundry |
| `private-infra-first-build-without-grants` / `-building-` | both forged |
| `jobs-delta-energy-campus-vs-pure-data-cente` / `-vs-data-center-alo` | forging **+** foundry |
| `the-forty-percent-ask` / `fractured--forging---the-forty-percent-ask` | forging (one `ready`, one `draft`) |
| `bk-chapter-6` ×2, `bk-chapter-7` ×2 | different subjects, same number |

No two are byte-identical, so each needs a read-and-merge, not a delete.

### 7. Three places state corpus size, all stale.
`CLAUDE.md` and `_meta/P2L-BOOK-CONTEXT.md` both say "87 stories, ~105K
words, 35 timeline events." Actual: 132 story files, ~194K raw words, 33
timeline events. Any agent handed those files plans against numbers that
are a year old.

### 8. Status workflow is half-built.
117 `draft`, 15 `ready`, **0 `published`**, 0 `expanded`, 0 `idea`. Nine
files carry a `medium_url:` key, all empty. The schema documents a five-state
workflow; two states are in use.

### 9. File clutter.
13 `.bak*` files on disk in `_meta/` (untracked, but they're in the way),
one **tracked** `.bak` story file
(`forged/draft/bk1-gate-latch-hog-logic.md.bak-1777743573956`),
a stray `__probe.tmp`, and `_index.json` / `_timeline.json` /
`_backlog.json` existing in **both** `LexDocs/` and `LexDocs/_meta/` — all
three **diverged**, so there are two different answers to every question
they cover.

---

## The proposal

Three things are collapsed into one folder path today: **what kind of
document it is**, **where it goes in the book**, and **how done it is**.
Separate them. Kind becomes the folder. Book position and doneness become
frontmatter, because that is what the scripts already read.

### Tree

```
LexDocs/
  book/                     # the 65 memoir scenes — and only these
    forged/  fractured/  forging/  foundry/
  essays/                   # EnergiAcres thesis pieces (not memoir)
  captures/                 # scaffolds + raw dumps awaiting scene work
  archive/
    legacy-draft/           # the 20 bk-chapter-* prior draft
  _meta/                    # process, questions, characters, plans
  _inbox/
```

`draft/` and `ready/` directories go away — the scanner never read them.

### Frontmatter additions

```yaml
kind: scene            # scene | essay | capture | legacy | meta
chapter: 3             # which chapter this scene belongs to
order: 2               # position within the chapter
supersedes: ""         # relative path of the version this replaces
```

`kind` is what lets `compile-manuscript.js` include the book and nothing
else. `chapter` + `order` is the table of contents, and it removes the
dependency on `date_event` for sequencing — which matters, because a third
of the scenes are memory-dated and may never get a real date.

### Theme vocabulary

Normalize to three tiers and cap at roughly 40 keys:
- **Drop the 5 broad themes from frontmatter.** `technology`, `family`,
  `systems-thinking`, `resilience`, `startup` describe the book, not any
  piece in it. If they're wanted for the dashboard, derive them from arc.
- **Merge the case/plural splits** (5 merges, listed in §4).
- **Keep the tail** — it's the only part that discriminates.

---

## Suggested sequence

Each step is independently useful and leaves the corpus working.

1. **Reclassify.** Add `kind:` to all 132 files and move them into the new
   tree. Mechanical; the class boundaries are detectable (`bk-chapter-*`
   prefix, `CAPTURE SCAFFOLD` first line, `lex-img-p.s3` embed) **except**
   the Lex import, which is genuinely mixed and needs your call — see below.
2. **Teach `compile-manuscript.js` to filter on `kind: scene`.** One-line
   change, and the compiled manuscript becomes readable for the first time.
3. **Build the TOC.** With 65 scenes and a clean `book/`, draft ~20–24
   chapters across the 4 arcs and assign `chapter:`/`order:`. This is the
   step that turns a pile of scenes into a book, and the only one that
   needs you rather than a script. It will also show you the real gaps.
4. **Backfill `people:` and `locations:`** from `_meta/CHARACTER-LIST.md`
   and scene text. Makes the corpus queryable by who and where.
5. **Normalize themes**, then regenerate `_topics.json` from frontmatter so
   the clusters mean something.
6. **Merge the 6 duplicate pairs**, recording `supersedes:`.
7. **Housekeeping.** Delete the tracked `.bak`, the `.bak*` pile and
   `__probe.tmp`; pick one home for `_index`/`_timeline`/`_backlog.json`;
   refresh the stale counts in `CLAUDE.md` and `P2L-BOOK-CONTEXT.md`.

### The Lex import needs your judgment

The 23 Lex files were detected by an import artifact, not by genre, and the
class is about half and half. By title, my read:

**Business thesis → `essays/`:** Pads We Can Ship in Six Months · Private
Infra First · The Microgrid Is a Neighborhood · The Permit Ledger · Digital
Twin Before Theater · Jobs Delta · Minimums and Non-Negotiables · Removing
the Blockers · The AI Race Is an Energy Race · The Compute Block · Why
Gas-Backed Compute Now · Boring Wins Winters

**Memoir → `book/`:** Silo Steps No Handle · This Starts Here · Scars as
Data · The Day I Stopped Recruiting My Family · The Quiet Quit of Legacy ·
Rolling Ohio Hills · The 30-Year Echo · Therapy Loneliness and Clarity ·
The Night We Moved the Oilfield to the Cloud · When Equity Didn't Move the
Needle · Don't Throw Out the Baby

That split is from titles, themes and opening lines, not a full read of all
23 — treat it as a starting point to correct, not a conclusion.

---

## What I checked, and what I didn't

**Verified by script across all 132 files:** the five-way classification and
its word counts; absence of `chapter`/`order`/`part`/`sequence`; `date_event`
coverage per arc; arc-window violations; frontmatter key census; folder-status
vs frontmatter-status agreement; `_topics.json` drift against frontmatter;
theme counts, tiers and case/plural collisions; byte-level duplicate search
(none exact) and shared-opening near-duplicate search; `.bak`/`.tmp`
inventory and tracked status; divergence of the three doubled JSON files;
how `scan-stories.js` and `compile-manuscript.js` derive arc, status and
order.

**Not verified:** the quality of any individual piece — this is a review of
filing, not of writing. The memoir/thesis split of the 23 Lex files (titles
and openings only). Whether the 20-piece legacy draft contains material not
present in the 65 scenes — it very likely does, and archiving is not
deleting, but someone should mine it before it's treated as superseded.

---

## Migration log — step 1 complete (2026-10-27)

All 132 story files carry `kind:` and sit in the kind-based tree. Verified:
**137 renames, zero deletions, zero body bytes changed, exactly 132 `kind:`
lines added and no other frontmatter touched.**

| kind | Count | Lives in |
|------|------:|----------|
| `scene` | 70 | `book/forged` 28 · `fractured` 13 · `forging` 20 · `foundry` 9 |
| `essay` | 18 | `essays/` |
| `capture` | 14 | `captures/` |
| `legacy` | 20 | `archive/legacy-draft/` |
| `meta` | 10 | `_meta/notes/` |

The 4 arc `*-QUESTIONS.md` moved to `_meta/questions/`.

**The index is now 102 pieces / ~95K words** (was 136 / ~194K) — `legacy` and
`meta` are excluded entirely. Of that, **`kind: scene` is 70 pieces /
60,048 words**: the actual book.

### Decisions made during the move, beyond the agreed Lex split

- **`bk-dad-121122.md` → `capture`, not `meta`.** My first pass classified it
  by filename. Reading it, it is raw first-person material about Chuck, the
  half-sister discovery and the hero-destruction — real memoir source, not
  admin. It would have been archived into `_meta/`.
- **6 extra pieces → `essay`.** Four are the non-Lex twins of a Lex thesis
  duplicate pair (`private-infra-first-build`, `permit-ledger-if-it-isnt-dated`,
  `pads-we-can-ship-standard-block`, `jobs-delta-vs-pure-data-cente`) — kept
  with their twins so the later merge pass sees both halves. Two more
  (`speed-is-a-system`, `mansfield-proof-of-speed`) have **zero first-person
  voice** and heavy site-ops vocabulary.

### Code changed to match the tree

- `scripts/scan-stories.js` — arc dirs read from `book/<arc>`; `archive/`
  added to the skip list; `kind` now recorded on every index record.
- `scripts/compile-manuscript.js` — shared `isSkippedDir()` so the
  cache-signature walk and the file walk agree; `archive/` excluded.
- `server.js` — the two open-questions endpoints read `_meta/questions/`.
  Both verified live: 5 open questions across 3 arcs.
- `_schema.md` — `kind` documented.

Dashboard verified in-browser after the move: 102 pieces / ~95K, arc bars
populated, and files served correctly from `book/`, `essays/` and
`captures/`.

### Flagged, not acted on

- **`_meta/notes/bk1-10-to-consider-for-future.md`** — the author's own first
  line reads *"these are full of hullucinations."* It contains ten
  AI-generated story concepts in finished prose. Classified `meta` so it
  cannot reach the manuscript. It should probably be deleted outright.
- **`captures/bk1-unbirthday-real-work-mansfield-meeting-rec.md`** — a
  meeting record dated 1980 in the fractured arc. Both the date and the arc
  look wrong; left as-is pending your call.
- **Three pieces break `compile-manuscript.js`'s date parser** with
  approximate dates — `~1982`, `~1962`, `~1985` (`chuck-at-175`,
  `operator-in-command`, `riding-shotgun`). Pre-existing, not caused by the
  move; the compiler reports them as errors and sorts them to the tail.
- **`_topics.json` regenerated** as a side effect and now agrees with the
  frontmatter (problem §3 resolved). The stale counts in `CLAUDE.md` and
  `P2L-BOOK-CONTEXT.md` are still wrong and are step 7.

**Step 2 is now one line:** `compile-manuscript.js` reads `kind` into its
record and filters to `scene`, taking the manuscript from 102 pieces to 70.

---

## Migration log — step 2 complete (2026-10-27)

`compile-manuscript.js` now reads `kind` and compiles **only `kind: scene`**.

**The manuscript is 70 pieces / 60,044 words**, ordered forged 28 ·
fractured 13 · forging 20 · foundry 9. It was 102 pieces before the filter
and 136 before the restructure.

### How it behaves

| Call | Result |
|------|--------|
| `compile({scope:'all'})` | 70 scenes — the book |
| `compile({kinds:'all'})` | 102 — scenes + essays + captures |
| `compile({kinds:['essay']})` | 18 essays |
| `compile({kinds:['legacy','meta']})` | 0 — they are not on disk in the walk |

`kind` is also validated: an unknown value is reported in `errors` and the
piece falls back to `scene`, so a typo surfaces instead of vanishing a file
from the book. `totals.by_kind` is on every response.

### Deliberate edge-case decisions

- **`scope:'story:<path>'` bypasses the kind filter.** Naming one file is an
  explicit request; filtering it out would return an empty manuscript with
  nothing to explain why. `scope:'arc:<name>'` still honours the filter.
- **Junk or empty `kinds` falls back to `['scene']`**, not to an empty
  manuscript — the more useful failure for an HTTP query param. A junk value
  mixed with a valid one keeps the valid one.
- **Missing `kind` defaults to `scene`**, matching `scan-stories.js`, so a
  file written before the migration stays visible rather than silently
  dropping out of the book.

### Surface area

- `scripts/compile-manuscript.js` — `VALID_KINDS`, `MANUSCRIPT_KINDS`,
  `parseKindsParam` exported; `--kinds=a,b|all` added to the CLI.
- `server.js` — `kinds` threaded through `/api/compile`,
  `/api/export/docx`, `/api/export/pdf`.
- `tests/compile-manuscript.test.js` — **12 new tests**, all passing.
  Verified live: docx 153KB / pdf 464pp at scene-only, docx 237KB at
  `kinds=all`.

### Still failing, and it is not from this change

`compile orders stories by arc, then date, then filename` fails. Confirmed
against a clean worktree at `HEAD`: **it failed before any of this work**
(two tests failed there; this change fixed the other one, which expected
`*-QUESTIONS.md` to be skipped).

The cause is the three approximate dates — `~1982`, `~1962`, `~1985` on
`chuck-at-175`, `operator-in-command`, `riding-shotgun`. `dateSortKey()`
cannot parse a leading `~`, returns `Infinity`, and sorts them to the tail
of their arc alongside the undated pieces. Teaching that one regex to
accept `~` is a few lines and would fix the test and the ordering together.

---

## Migration log — date parsing fixed (2026-10-27)

The sort test passes, and the fix was larger than the one regex it looked
like. The corpus writes `date_event` in six shapes, not two:

| Shape | Example | Count | Before this change |
|-------|---------|-------|--------------------|
| full date | `1990-10-29` | 5 | correct |
| year + month | `1991-02` | 4 | correct |
| bare year | `1985` | 20 | correct |
| approximate | `~1982` `~1985` `~1962` | 3 | **`Infinity` — sorted to the arc tail** |
| span, dashed | `1999-2003` | 1 | **read as month 20 of 1999** |
| span, slashed | `1990/2000` `1972/2010` | 3 | **read as bare 1990 / 1972, by luck** |

The `~` dates were the visible failure. `1999-2003` was the dangerous one:
`/^(\d{4})(?:-(\d{1,2}))?/` matched `-20` as a month and produced `19992000`,
a number that sorts plausibly and never complains. Nothing would have caught
that by eye.

### What changed

`scripts/event-date.js` — **new**, the single parser for `date_event`, in the
same spirit as `scripts/frontmatter.js`: one implementation so the manuscript
order, the story map and the dashboard cannot disagree about when a piece
happened. Exports `parseEventDate`, `dateSortKey`, `isUnparseableDate`,
`yearOf`. It reads all six shapes above, plus `circa 1982` / `c. 1982` /
`about 1982` / `1982?` / `≈1982`, en- and em-dash spans, and ISO timestamps.

- `scripts/compile-manuscript.js` — local `dateSortKey()` deleted in favour of
  the shared parser. Each record now carries `date_sort_key` (the number it
  was actually ordered by), `date_approx` and `date_end_year`.
- `scripts/build-story-map.js` — its own duplicate `yearOf()` deleted.
  STORY-MAP.md regenerates **byte-identical**, which is the proof that
  consolidating the two parsers changed no behaviour.

### Ordering rules, chosen deliberately

- **A span sorts by where it starts.** `1999-2003` belongs where it opens.
- **A coarse date leads its own year**: `1985` < `1985-03` < `1985-03-02`, so
  an unplaced piece never jumps ahead of a dated one from the year before.
- **`~1982` sorts exactly where `1982` would.** The uncertainty is recorded on
  the record for display, not smeared across the sort — two runs must produce
  the same book.
- **Unreadable values stay loud.** They return `null`, land in the undated
  tail, *and* appear in `errors`. A backwards span (`2003-1999`) and an
  out-of-range month (`1999-20`) are rejected rather than guessed at, since
  either guess would read downstream as a real date.

### Result

The forged arc now opens where it should: `~1962` (grandfather,
`operator-in-command`) first, then `1972/2010`, then `~1982`. Before, all
three sat at the back with the undated pieces.

Live: 70 scenes / 60,044 words unchanged, **zero date errors across all 102
indexed pieces**, docx 149KB and PDF 553KB both still valid.

### Tests

- `tests/event-date.test.js` — **new, 29 tests**: every shape in the corpus,
  every "about" spelling, spans and their spacing, ISO timestamps,
  out-of-range and malformed values, non-string inputs, purity, and a
  mixed-set ordering invariant over the real corpus dates.
- `tests/compile-manuscript.test.js` — the sort test now compares the
  compiler's own `date_sort_key` instead of raw `date_event` text. **Comparing
  the text was itself a bug in the test**: `~` is `0x7E`, above every digit,
  so a string compare put `~1982` after `2026` and called everything
  following it a regression. Two further tests added: every corpus date must
  parse, and the approximate/span pieces must sort by their real year.

**Suite: 201 tests, 200 pass, 1 skipped, 0 fail.**

### Two integration tests were broken by step 1, and I had missed it

`POST /api/save` × 2 in `tests/integration/api.test.js` wrote to
`LexDocs/forged/sample-1.md`. Step 1 moved the arc folders under `book/`, and
`/api/save` returns 400 when the target's directory does not exist. I had only
run `tests/*.test.js` after step 1, which does not glob the nested
directories — so I reported 107/108 without having run these. Verified
against a clean `HEAD` worktree (with `node_modules` linked, or all 21
integration tests fail for want of dependencies and prove nothing): **61/61
passed there**, so these two were mine.

Both now write to `_meta/notes/__api-save-test.md` — `_`-prefixed directories
are skipped by both walkers, so a scratch file cannot join the index or the
manuscript even while a compile test runs in a parallel process. Their
cleanup was also leaking: it restored the file only when it had pre-existed,
which left the scratch file in LexDocs after every run. It now removes it.

### Flagged, not acted on

- **`web/story-search.js` and `web/dashboard-recommender.js` still parse dates
  by hand** (`parseInt(String(d).slice(0, 4))`), which is `NaN` for `~1982`.
  Both guard the `NaN`, so the three approximate pieces are *dropped* rather
  than mis-sorted — they are invisible to the dashboard's year filter and to
  narrative-gap detection. Sharing `event-date.js` with the browser needs a
  UMD footer plus a static-serve allowlist entry in `server.js`, which is a
  separate unit of work, not a line change.
- **`book/forged/bk1-the-yard.md` is dated `2026-03`** and sits in the farm
  childhood arc, where it now sorts last. That looks like `date_written`
  written into `date_event`.
- **`book/forged/bk1-motel-whiteboard-mvp.md` is dated `1990-10-29`**, the
  accident date, in the forged arc. The title suggests a business story.
- `captures/bk1-unbirthday-real-work-mansfield-meeting-rec.md` — still a
  meeting record dated 1980 in the fractured arc, from the step-1 log.

---

## Migration log — origin/main merged (2026-10-27)

The Oct 18–21 daily-progress work was written against the old
status-folder layout while the restructure was happening here. Git
followed the renames by itself: **no content conflicts.** The Karp answer
landed in `captures/bk1-the-switch-that-never-turned-off.md` and the
FOUNDRY-QUESTIONS edits in `_meta/questions/`, both keeping their `kind:`.

Git stopped on one *directory rename split* — it will not guess where
`foundry/draft/` went, because step 1 split it four ways. That is not a
text conflict; it is the two new files needing a home.

### bk1-today.md → `captures/`, `kind: capture`

Its own frontmatter says `scene_draft: "capture scaffold"`,
`rewrite_status: "dump-only / pending Claude edit"`. That is what
`capture` means. Its `related_to` and `sources` paths were rewritten for
the new tree (`_essays/…` → bare filename, `foundry/FOUNDRY-QUESTIONS.md`
→ `_meta/questions/…`).

### `LexDocs/_essays/` → `LexDocs/essays/`, `kind: essay`

Upstream had independently solved the same problem a different way. Its
README said so outright: *"The underscore keeps this folder out of the
book-piece scanner, so essays don't count as chapters."* That is the job
`kind: essay` now does.

Keeping both would have re-introduced exactly the drift this restructure
removed — a document's nature encoded in its path **and** in its
frontmatter, free to disagree. So: one place, one marker.

Essays stay **indexed and searchable** rather than hidden, because
`kind: essay` already guarantees they cannot become a chapter, and they
are live writing material — the dashboard should show them. The README's
editorial rules are kept verbatim (only the underscore sentence is
rewritten) and survive in `essays/` because `scan-stories.js` skips
`README.md` by name.

`arc: essays` became `arc: foundry`. `arc` is one of the four book arcs;
every other essay carries a real one, and `essays` would have been
reported as an unknown arc.

### Result

| | Before merge | After |
|---|---|---|
| Indexed pieces | 102 | **104** |
| Indexed words | 95K | **98,733** |
| Manuscript | 70 scenes / 60,044 words | **unchanged** |
| Frontmatter errors | 0 | **0** |

The manuscript not moving is the point: the merge brought one essay and
one capture, and neither is the book. Verified live — index 104,
`/api/compile` 70, zero errors. Suite: 201 tests, 200 pass, 1 skipped.

### Still ahead: six open PRs written against the old tree

`gh pr list` shows **7 open drafts, 6 of which touch the old
`LexDocs/<arc>/<status>/` paths** — the daily-progress branches for Oct
22 through Oct 27:

| PR | Branch | Old-tree files |
|----|--------|----------------|
| 36 | daily/2026-10-27 | 9 |
| 35 | daily/2026-10-26 | 8 |
| 34 | daily/2026-10-25 | 7 |
| 33 | daily/2026-10-24 | 6 |
| — | daily/2026-10-23 | 2 |
| — | daily/2026-10-22 | 1 |

They are stacked — the Oct 27 branch already contains the Oct 22–26
commits — so merging the newest should subsume the rest. Each will hit
the same directory-rename-split and bring new files needing a `kind:`,
including two more foundry drafts (`bk1-farm-engineer-and-orphan-steel.md`,
`bk1-still-my-north-star.md`). The longer they sit, the more daily work
accumulates against a layout that no longer exists.

**Whatever writes these daily branches needs to learn the new tree**, or
this filing exercise repeats every morning. That is the one piece of
step-7 housekeeping that is now urgent rather than cosmetic.

---

## Step 7 (partial) — teaching the tooling the new tree (2026-10-27)

The merge log above closed with the real risk: six open daily branches still
write `LexDocs/<arc>/<status>/`, so the filing exercise would repeat every
morning. The fix is instructions and path data, not more hand-filing.

### Instructions

`CLAUDE.md` gained a **Filing Rules** section, placed immediately after the
architecture tree so it is read before any file is created:

- the `kind` → folder table, and the rule that **status never moves a file**
- the folders that no longer exist, with an old → new translation table, and
  the explicit statement that a merge landing a file in an old path is a
  **misfile, not a new convention**
- that `compile-manuscript.js` compiles `kind: scene` only, so the `kind` you
  write is what decides whether a piece can ever become a chapter
- the accepted `date_event` shapes, and **never write a second date or
  frontmatter parser** — `scripts/event-date.js` and `scripts/frontmatter.js`
  are the single implementations
- cross-reference conventions: `related_to:` is bare filenames, `sources:` and
  `source_notes:` are repo-relative paths, and references resolve by basename
  across the whole tree rather than by assuming `book/<arc>/`

The stale corpus figures throughout the file were refreshed (87 stories →
104 documents / 70 scenes / ~98.7K indexed words / 33 timeline events), the
architecture tree now shows the kind-based tree, the frontmatter example
carries `kind:`, and the "No tests" debt item was replaced with the one that is
actually still true (a stale May copy of `_index.json` in `_meta/`).

### Two commands, so the check is one word

| Command | Does |
|---------|------|
| `npm run reindex` | scan-stories → sync-topics → build-story-map |
| `npm run check:filing` | all-kinds compile; prints totals, then `0 frontmatter errors` or the error list, exit 1 |

`check:filing` is the gate: it catches a misfile, a missing `kind` and an
unreadable `date_event` in one pass. Every writing command now ends by running
both.

### Slash commands and skills retargeted

| File | Was | Now |
|------|-----|-----|
| `write-new.md` | "create a new file in `LexDocs/`", no `kind` | `LexDocs/book/<arc>/`, `kind: scene`, date shapes, reindex step |
| `integrate-note.md` | `<arc>/draft/bk1-<slug>.md`, `<arc>/<arc>-QUESTIONS.md` | `book/<arc>/` or `captures/`, `_meta/questions/`, STORY-MAP first, reindex step |
| `inbox.md` | `foundry/draft/…` in every routing example | `book/foundry/…` |
| `expand.md` | `LexDocs/chapters/ch-<slug>.md` | a `scene` in `book/<arc>/`; chapter grouping is frontmatter, not a folder, and is not assigned yet |
| `publish-and-share/SKILL.md` | scanned `{arc}/ready/*.md`, **moved** the file to `published/` | reads `status` from `_index.json`; **does not move the file**; reindexes |

### Stale path data retargeted

Every `<arc>/<status>/<file>.md` reference was rewritten to `book/<arc>/<file>.md`
by a script that refused to rewrite any reference whose new target did not exist
on disk. Nothing was left behind — all 20 referenced basenames resolved.

| Where | Refs |
|-------|------|
| `.story/tickets/T-031 … T-045` (publish tickets an agent picks up) | 15 |
| `LexDocs/_calendar.json` (publishing calendar → Linear sync) | 23 |
| `PUBLISHING_ENGINE.md` | 5 |
| `tests/export-docx.test.js` (synthetic fixture) | 1 |
| `web/index.html` `related_to` placeholder | 1 (now a bare filename, per schema) |

### Verified

- `npm run check:filing` → 104 pieces (70 scene / 19 essay / 15 capture), **0 frontmatter errors**
- `npm test` → **201 tests, 200 pass, 1 skipped, 0 fail**
- `npm run reindex` is idempotent — `_index.json`, `_topics.json` and
  `STORY-MAP.md` came back byte-identical, confirming the index was current
- every edited JSON file re-parses

### Left undone, deliberately

- **~20 frontmatter and ~88 in-prose cross-references inside LexDocs** still
  spell old paths. These are author content, and they split three ways: a few
  are genuinely historical (dated changelog lines, HTML source comments) and
  should stay; the `related_to:` ones should collapse to bare filenames per the
  schema; the `sources:`/`source_notes:` ones need a real resolved path. That is
  a content pass with per-field judgment, not a regex, so it is logged here and
  noted in CLAUDE.md rather than guessed at.
- **The six open daily PRs are untouched.** The instructions above are what a
  future branch reads; the branches already cut still carry the old shape and
  still need translating as they merge.
- **The stale `_meta/_index.json`** (a May copy) is still there. Noted as debt
  in CLAUDE.md; deleting a data file is the author's call.

---

## Step 7 (cont.) — what the merged backlog actually landed (2026-10-31)

PRs #30–#38 were merged upstream on 2026-10-30 with rename-aware merges, so the
file *placement* came out right: every new piece landed in `book/<arc>/`,
`captures/` or `_meta/`, and none of the removed `<arc>/<status>/` folders came
back. Verifying that merge turned up three defects it carried in with it.

### 1. Two raw captures were in the compiled manuscript

`captures/bk1-farm-engineer-and-orphan-steel.md` and
`captures/bk1-still-my-north-star.md` arrived with no `kind` field. The default
was `DEFAULT_KIND = 'scene'` regardless of folder — a deliberate choice from
before the restructure, when a kind-less file had no folder to fall back on —
so both were compiled into the book. Both carry
`rewrite_status: "dump-only / pending Claude edit"` and
`review_status: "not clear-ready"`.

`check:filing` reported **0 errors** the whole time: it only flagged an
*unknown* declared kind, never an absent one.

**Fix:** `scripts/doc-kind.js`, now the single arbiter of `kind`, used by both
`scan-stories.js` and `compile-manuscript.js` (the third module of its kind,
after `frontmatter.js` and `event-date.js`):

| Frontmatter | Folder | Result |
|-------------|--------|--------|
| nothing | `captures/` | `capture` — the folder decides |
| nothing | loose file | `scene` — keeps an un-migrated piece visible |
| `capture` | `captures/` | `capture`, clean |
| `capture` | `book/forged/` | `capture` **+ error**: one of the two is wrong |
| not a kind | any | folder's kind **+ error** |

A declaration still beats the folder, so moving a file never silently changes
what it is — but a disagreement is now loud, because only a human knows which
half is wrong. Manuscript went 73 → **71 scenes**; the two captures are out.

### 2. The shorthand index pointed at the old tree

PR #32 added `LexDocs/_meta/story-index.json` (91 shorthand codes) plus
`find-story.js`, `build-shorthand.js` and `story-index-lib.js`. It was authored
against the pre-restructure tree:

- **283 path references** to `<arc>/<status>/…` and `<arc>/<ARC>-QUESTIONS.md`.
  All 132 unique paths resolved by basename to exactly one file — and they
  spread across `book/` (70), `archive/` (20), `essays/` (18), `captures/` (15)
  and `_meta/` (9). A third of them are not scenes, which is why resolving by
  basename rather than assuming `book/<arc>/` matters.
- `STORY_DIRS = ['forged', 'fractured', 'forging', 'foundry', '_inbox', '_essays']`
  — five of those six folders no longer exist. `storyFiles()` therefore saw
  almost nothing, so `validate()`'s "every story file is mapped" check passed by
  having nothing to check, and `extractCutterRules()` scanned only `_inbox/`.
  Now `['book', 'essays', 'captures', '_inbox']`: 109 story files, 36 Cutter
  Rules (was 0 reachable).
- Its own tests hardcoded old paths, so **2 tests were failing on `main`**.

### 3. The generator refused to run, leaving its docs stale

`build-shorthand.js` exited 1 on any problem, so with three new pieces lacking
codes it would not regenerate `SHORTHAND.md`/`PRIMITIVES.md` — which still held
the old paths. It now makes the split `compile-manuscript.js` already makes: a
reference to a missing file is **wrong** and aborts; a story file with no code
yet is **incomplete**, warned about every run, docs still written. `--strict`
restores the hard gate.

### Verified

- `npm test` → **232 tests, 231 pass, 1 skipped, 0 fail** (was 207 / 2 failing)
- `npm run check:filing` → 107 pieces (71 scene / 19 essay / 17 capture), **0 errors**
- manuscript: **71 scenes**, nothing outside `book/` in it
- 20 new tests for `doc-kind.js`, plus 4 corpus invariants in
  `compile-manuscript.test.js`: nothing outside `book/` compiles, kind and
  folder never disagree, a kind-less file takes its folder's kind
- 0 old-shape paths left in `story-index.json`, `SHORTHAND.md`, `PRIMITIVES.md`

### Left for Shawn — three decisions, not mechanical

1. **`book/fractured/bk1-akron-lab.md` is probably misfiled.** It is the only
   file under `book/` (1 of 71) carrying `RAW CAPTURE` / `rewrite_status:
   dump-only`; the other six files with those markers are all in `captures/`.
   Deliberately left where the daily branch put it rather than moved — if it is
   a capture, it belongs in `captures/` with `kind: capture`, and it is in the
   manuscript until then.
2. **Three pieces have no shorthand code**: `bk1-akron-lab.md`,
   `bk1-farm-engineer-and-orphan-steel.md`, `bk1-still-my-north-star.md`. Each
   already declares a `shorthand_code` in its own frontmatter
   (`AKRON-LAB`, `EA-FARMENG`, `EA-NORTHSTAR`), but a code needs a summary,
   aliases and a trust tier in Shawn's framing — all three say "Shawn to clear".
   Listed as `UNMAPPED_BACKLOG` in `tests/find-story.test.js`, where a *fourth*
   unmapped file fails the suite.
3. **~20 frontmatter and ~88 in-prose cross-references inside LexDocs** still
   spell old paths (unchanged from the previous entry). Still a content pass.

### PR #39 overlaps this work, and wins on the part it covers

PRs **#39** and **#40** (`daily/2026-10-30-*`) are open drafts cut after the
filing rules landed, and both file correctly: **zero** old-tree paths between
them. But #39 is titled "repair story index after kind-tree rename" and repairs
the same three files repaired here.

Compared field by field, #39's index and this one agree on every path but one,
and **#39 is a superset**: 94 codes against 91, because it adds the three
entries this pass deliberately would not invent — `AKRON-LAB`, `EA-FARMENG`,
`EA-NORTHSTAR`, with summaries and trust tiers. Its `STORY_DIRS` is the same
four folders. The single disagreement is the `GATE-LATCH` backup entry, pointed
here at `archive/bk1-gate-latch-hog-logic.md.bak-1777743573956` (where the file
actually is).

So #39 was brought up to date with main and merged (`67f91c6`), per file:

| File | Took | Why |
|------|------|-----|
| `story-index.json` | **#39** | superset — 94 codes vs 91, paths otherwise identical |
| `story-index-lib.js` | main | same four folders either way, and main's carries the comment |
| `SHORTHAND.md`, `PRIMITIVES.md` | neither | generated; rebuilt from the resolved index |

One correction on top of #39's index: its `GATE-LATCH` `role: backup` entry had
been retargeted onto the canonical file, so the entry listed the same path twice
and the role said nothing. Repointed at the backup that is actually on disk,
`archive/bk1-gate-latch-hog-logic.md.bak-1777743573956`.

With #39's three codes in, **all 109 story files map to a code** (was 106), so
`UNMAPPED_BACKLOG` in `tests/find-story.test.js` is now empty — and a new piece
arriving without a code fails the suite rather than being waved through. #39's
timeline age fix (accident age 10) and WRITING-QUEUE update came along with it.

What #39 does *not* contain, and this commit does: the `doc-kind.js` fix for the
two captures in the manuscript, the tests for it, the repair of #32's own
hardcoded test paths, the broken-vs-incomplete split in `build-shorthand.js`,
and the CLAUDE.md corrections.

### PR #40 merged — and the two timeline files are not duplicates

#40 (`6e84fa2`) is fact confirmation, merged clean: birth date **December 30,
1979**, accident **age 10**, Fielding Systems officially 2009 with Shawn not
full time until 2010, and CJ cleared for public use. It touches
`CHARACTER-LIST.md`, `FORGING-QUESTIONS.md`, `bk1-the-quiet-quit-of-legacy.md`
and both timeline files. Verified on the merge before landing it: 232 tests,
231 pass, 0 fail; 107 pieces, 0 frontmatter errors; 94 codes, 109/109 mapped.

That merge corrects something this review had wrong. The two timeline files were
logged as a "doubled JSON file" for housekeeping. They are not copies — they are
**two different timelines with no event in common**:

| File | Events | Read by |
|------|--------|---------|
| `LexDocs/_timeline.json` | 34 | `server.js`, `date-inference.js`, `backfill-frontmatter.js` |
| `LexDocs/_meta/_timeline.json` | 37 | **nothing in code** |

Zero overlap on `date|title`, and they use different naming throughout
(`Born` vs `Birth`, `Hit by car - life-changing accident` appears only in the
`_meta` copy). The `_meta` one is the richer of the two — it carries granular
entries like the 1985 ice-cube rock-picking and the 1988 Genesis concert that
the live file does not have — and the dashboard never shows it. #40 edited both,
so whatever writes these is maintaining a file no code consumes.

Not merged here: picking which events are canonical is authorial. But the
housekeeping item should read "two divergent timelines, one unread" rather than
"a duplicate to delete". By contrast `_meta/_index.json` **is** a stale
generated copy — 87 stories on flat pre-restructure paths — and is safe to drop.

### PR #41 merged — the stacked branch carried a pre-restructure index

#41 (`6f192aa`) is the Scars as Data trust audit: a 7-flag trust pass and a
verbatim source ledger appended to `bk1-scars-as-data.md`, plus Shawn's
2026-10-31 chat answers propagated through `CHARACTER-LIST.md`,
`P2L-BOOK-CONTEXT.md`, `FORGING-QUESTIONS.md`, `FRACTURED-QUESTIONS.md`, both
timelines and `story-index.json`. The fact work is careful: the arm-pins **age
is resolved to 16** on Shawn's own words, the **year is left open** (1996 if 16
against the prior capture's fall 1997 / age 17), and the left-leg ankle pins are
recorded as a separate injury whose accident is explicitly **not** assumed.

It was stacked on #40's branch, cut before #39 and the kind-resolver work, which
made it the third PR in a row to arrive holding a pre-restructure
`story-index.json` — 91 codes, **329** references to the old `<arc>/<status>/`
tree, no `book/` paths at all. Merging it as written would have reverted both
the path retargeting and #39's three codes. The base was retargeted from
`daily/2026-10-30-shawn-answers` to `main`, and the overlap resolved by taking
main's index and reapplying this branch's four semantic edits:

| Field | Resolution |
|-------|-----------|
| `ACC-1990.gaps` | took the branch's verbatim ankle-pins prompt |
| `ARM-1997` title / date / summary | took the branch's age-16 rewrite |
| `ARM-1997` CHARACTER-LIST note, 2 conflict lines | took the branch |
| `ACC-1990` age 10-vs-11 conflict line | **kept main's** — see below |
| all 148 `book/` paths, 94 codes | kept main's |

The last row is the one that needed judgment. The branch deleted that conflict
line, working from the older text where it still read as an open conflict.
Main's copy is already the *resolved* form and records which PR fixed which file
(`#37` for P2L-BOOK-CONTEXT, 2026-10-30 for the `_meta` timeline). Taking the
branch's deletion would have discarded the audit trail rather than a stale
claim, so the line stays.

Two corrections made while here:

- `LexDocs/_timeline.json` declared `total_events: 44` against **34** actual
  events before this branch and 36 after. Nothing in the repo reads the field —
  it is the only occurrence of the string — so it was simply a wrong number in a
  data file. Set to 36.
- `npm run reindex` regenerated `_index.json` and `STORY-MAP.md` for the one
  scene that grew: `bk1-scars-as-data.md` moves size band `S` → `L`, +1,042
  words, and the corpus goes ~106K → ~107K indexed words.

Verified on the merged tree before landing it: 232 tests, 231 pass, 1 skipped,
0 fail; `check:filing` 107 pieces (71 scene / 19 essay / 17 capture), 0
frontmatter errors; `build-shorthand --check` 94 codes, 109/109 mapped, 36
Cutter Rules; manuscript **71 scenes / 62,918 words**.

Left for Shawn, both carried in the PR's own prompts rather than guessed at:
confirm whether the left-leg ankle pins are from the Oct 29, 1990 accident, and
optionally pin the arm-crash year. The `'At EnergiAcres and Terrasow'` heading
in that scene is on HOLD under the never-combine rule, and its empty
countermeasure rows are marked PLACEHOLDER — the scene is still
`trust: unreliable-ai-generated` and pending a real edit pass.

Still open from before: `book/fractured/bk1-akron-lab.md` is the only file under
`book/` carrying `RAW CAPTURE` / `dump-only` markers, and it is in the
manuscript. PR #42 (`daily/2026-10-31-muse-philosophy`) is unmerged.

### PR #42 merged — an additive index overlap, and two misfiles the rules caught

#42 (`ec2f1f8`) files the Meta Muse philosophy material: a capture of the
Oct 27–31 side-chat with Shawn's turns verbatim, the Turtles All the Way Down
long-form, and an inventory of Muse Library artifacts not yet pulled. Two new
codes, `CAP-MUSE-PHIL` and `ESSAY-TURTLES`, with `SWITCH` linked to both.

Unlike #39 and #41 this one was cut off `main` and keeps the retargeted `book/`
paths — its index was simply **missing #39's three codes** rather than
contradicting the restructure. The two sides were additive, so the index is a
**union**: main's 94 plus these 2 = **96 codes**. Its other three conflicts —
`_index.json`, `SHORTHAND.md`, `PRIMITIVES.md` — are all generated; neither side
was taken, they were regenerated from the merged tree, which is the only way to
get a derived file that describes what is actually there.

Two filing problems were fixed on the way in.

**1. An essay that could never be indexed.** `essays/_muse-library-index.md`
declared `kind: essay` while sitting behind an underscore, and
`scan-stories.js:143` skips `_`-prefixed files. So it was an essay that could
never appear in `_index.json`, the dashboard or `STORY-MAP.md` — the exact
disagreement between frontmatter and folder that `doc-kind.js` exists to
surface, except the underscore hid it from `check:filing` as well. The file is
an inventory of material not yet pulled, which is project admin, so it is now
`_meta/notes/muse-library-index.md` with `kind: meta`, where being out of the
index is the intended behaviour rather than a side effect of the filename. Its
two `story-index.json` paths and the `essays/README.md` row follow it.

Worth noting as a gap: an underscore-prefixed file inside a kind-owned folder is
currently invisible to `scan-stories.js` but **visible** to
`story-index-lib.js`'s `storyFiles()`, which only excludes `README.md`. The two
walkers disagree. Here that worked in our favour — the file was mapped to codes,
so nothing warned — but a future `_`-prefixed file nobody maps would fail
`find-story.test.js` while never appearing in the index at all.

**2. Nine cross-references in path form.** The three new files spelled
`related_to:` as relative paths (`../_meta/PHILOSOPHY-BRIEF.md`). The rule is
bare filenames precisely so that refiling a piece does not invalidate everything
pointing at it — and refiling the inventory above would have broken two of these
nine. All are now bare filenames, resolvable by basename.

The restriction handling in this PR is sound and worth keeping as the pattern:
the three PRIVATE/RESTRICTED beats are marked in the file's own frontmatter, as a
section heading, inline at each beat, and as a clearing action item — not only in
the PR description, which does not survive into the repo. The repo is private.

Verified on the merged tree before landing it: 232 tests, 231 pass, 1 skipped, 0
fail; `check:filing` **109 pieces** (71 scene / 20 essay / 18 capture), 0
frontmatter errors; `build-shorthand --check` 96 codes, **111/111** story files
mapped, 36 Cutter Rules. The manuscript is **unchanged at 71 scenes / 62,918
words** with nothing outside `book/` in it — correct, because this PR adds a
capture and an essay and neither kind can reach the book. That is the kind
system doing the job it was built for.

CLAUDE.md's corpus counts were refreshed at the same time (104 → 109 documents,
70 → 71 scenes, ~98.7K → ~109K indexed words, 33 → 36 timeline events, 201 → 232
tests), and the debt list's numbering, which had gone 1-2-3-6-4-5 when the
timeline item was inserted, was renumbered.

**All daily PRs are now merged — #30 through #42, nothing open.** Still waiting
on an authorial decision: `book/fractured/bk1-akron-lab.md` is the only file
under `book/` carrying `RAW CAPTURE` / `dump-only` markers and it is in the
manuscript; `bk1-scars-as-data.md` is in the manuscript while still
`trust: unreliable-ai-generated`; which timeline's events are canonical; and
whether the unread `_meta/_index.json` should be dropped.

### `bk1-akron-lab.md` refiled as a capture (2026-10-31)

Resolved, and not as the authorial judgment this log twice called it. It is a
misfile, and the evidence is its twin.

`bk1-akron-lab.md` and `captures/bk1-still-my-north-star.md` come from the
**same Plaud recording** — `f_01a16ade6985703690a9641d048bfa23`, 2026-10-22 —
with the same `date_written: 2026-10-24`, the same
`scene_draft: "dump-only / RAW CAPTURE 2026-10-24"`, and the same preamble word
for word. Two halves of one capture run off one recording: one was filed to
`captures/`, this one to `book/fractured/`.

It contains **no prose at all.** A line census of the body: 7 verbatim ASR quote
lines, 5 headings, 3 source comments, 3 bold notes — and 15 remaining lines that
are every one of them an interview prompt ("Which year at Akron was the
fast public-internet stretch?"), an exclusion note, or a production-status table
row. Its three content sections are headed `## RAW CAPTURE —` and its
PLACEHOLDER blocks say *"Do not fill a year"* and *"Do not invent the bridge."*
Of the 13 files in the corpus carrying a dump-only marker, it was the only one
outside `captures/` and the only one of the three `## RAW CAPTURE`-template
files with no `kind:` field.

It was also not load-bearing: `bk1-150-credit-hours.md` is `status: ready`, 838
words, and already opens the Akron material in finished prose ("I'd started at
the University of Akron on a full academic scholarship"). This capture is raw
material for a different beat, as its own exclusion note says.

Moved to `captures/bk1-akron-lab.md` with `kind: capture`. Its four
`related_to:` entries were path-shaped and three were **broken as written** —
resolving by basename, one landed in `archive/legacy-draft/`, the superseded
draft, and another on its own twin — so all four are now bare filenames. The
`AKRON-LAB` index path, the twin's back-reference, and the in-prose paths in
`CONSOLIDATED-GAPS.md` and `fractured-arc-plan.md` follow it.

**Manuscript: 71 → 70 scenes, 62,918 → 62,066 words** (Fractured 14 → 13). The
corpus is unchanged at 109 pieces — it is still indexed and searchable, just no
longer book prose. Every dump-only piece in the repo is now under `captures/`.

#### The gap this exposed in the kind resolver

`doc-kind.js` closes the case of a file in the right folder with no `kind`. It
**cannot** close the case of a file in the wrong folder with no `kind`, because
there the folder *is* the error and there is nothing for a declaration to
contradict. `check:filing` reported 0 errors on this file throughout and always
would have. The earlier claim in this log that the resolver had closed the
missing-`kind` hole was too broad: it closed half of it.

The other half is now a corpus invariant in `tests/compile-manuscript.test.js` —
no file under `book/` may carry a `dump-only` marker or a `## RAW CAPTURE`
heading. Verified by reintroducing the misfile, which fails that guard plus
three of the existing invariants, and passes once removed. 233 tests.

Note on test stability: one run during this work reported 1 failure that did not
recur in 11 subsequent runs and could not be attributed. Unexplained rather than
dismissed; recorded here in case it reappears.

### Trust audit flags #4 and #7 actioned (2026-10-31)

Acting on the one flag in `bk1-scars-as-data.md`'s audit that was a rule break
rather than a gap, plus the duplication flag, after verifying both against the
repo.

**#4, the rule break.** The heading read `### At EnergiAcres and Terrasow:
scars → playbooks`, and the never-combine rule it breaks is real and written
down — `_meta/notes/muse-library-index.md:93`, "Never combine EnergiAcres and
Terrasow." Under it sat four practice labels (budget tripwires, hiring fuses,
brownout protocols, founder fuses) that no capture describes as anything
actually run. Both are **cut, not reworded**: the heading is now
`### Scars → playbooks` and names no company; the labels are gone. Rewording
invented practice into vaguer invented practice would only make it harder to
spot later. A third capture prompt was added asking for one real practice at one
named company, which is what rebuilding the section needs.

**#7 was wider than "duplicate".** The flag said `book/fractured/bk1-the-30-year-echo.md`
also carries "Scar Map on paper" (it does, and did — line 163). But that scene
also carried **"Budget fuses"** and **"Role fuses"** — the same unsourced
practice vocabulary as #4. So this was not one device appearing twice; it was
the same fabricated operating-practice language in two scenes, both of which
compile into the book. Its `Pain → Policy` list is cut on the same terms.

**Not decided, deliberately.** Whether the Scar Map device survives at all. The
flag framed it as "which chapter owns it", but it is unsourced in *both* places,
so there is no owner to assign — only Shawn can say whether the thing is real.
Both cut markers say so.

**What #4's verification turned up about #2.** The audit calls the shoulder
twinge "unsourced"; it is worse than that. The piece's central conceit is a
shoulder scar that warns him before bad hires, and the corpus puts that scar on
his **back** — the latissimus dorsi flap taken for the foot rebuild, confirmed
in `_meta/SESSION-8-FACTS.md` #37, `archive/legacy-draft/bk-chapter-2-the-day-the-earth-shook.md`
and `CHARACTER-LIST.md`. A search of the whole corpus finds **no shoulder scar
on file anywhere**. The device is mounted on a body part that has no scar. Left
as-is — rebuilding the chapter's spine is authorial, and flag #2 already carries
the open prompt.

**Scope note, and the number behind it.** Checking how far this pattern ran
produced the figure that reframes the whole list: of the 70 scenes in the
manuscript, **37 — 29,337 of 62,311 words — are marked `ai-draft` in
`story-index.json` and nothing else.** No other code calls any of them raw,
ready or dump-draft; the index's trust vocabulary is exactly five values, so
this is not a loose match. The remaining 33 are 17 `dump-draft`, 1 `raw`, and
**15 `ready` (13,025 words)** — the actual spine (The Van, The Hilltop, Chuck at
175, Three Thirty AM, The Quorum Bed, The Dave Problem, and nine more).
`bk1-scars-as-data.md` is one of 37 and the only one that has been audited.
`bk1-the-30-year-echo.md`'s other numbered sections assert practices on exactly
the same unsourced footing and are **not** audited; its cut marker says so.

Two honest limits on this change. The word counts went **up** — scars-as-data
1,817 → 2,002, the echo 1,056 → 1,116, manuscript 62,066 → 62,311 — because the
cut markers are longer than the bullets they replaced. Claims were removed, not
text. And those markers compile into the manuscript, as the pre-existing TRUST
FLAG, HOLD and PLACEHOLDER blocks in these files already did; that is unchanged
by this edit, not introduced by it.

Verified: 233 tests, 232 pass, 1 skipped, 0 fail; 109 pieces, 0 frontmatter
errors; 96 codes, 111/111 mapped; no heading anywhere under `book/` now names
both companies.

### All 37 ai-draft scenes mapped (2026-10-31)

Full audit written to `_meta/AI-DRAFT-AUDIT.md` (hand-written, do not
regenerate). It maps every generated scene in the manuscript, scene by scene,
with a flag table. Nothing was changed by it. Headlines:

The 37 split into two populations that need different decisions. **19 are
generated Medium posts that still contain their own production scaffolding** —
`AI Playbook` prompt templates, `Image Prompts` ("cinematic realism"), an
identical `_Tags:` line, and in seven cases a `Fact Pack — verify:` list where
the generator names the facts it did not have. **2,831 words of that scaffolding
compile into the book.** The other 18 are generated prose with no template
furniture, where the invention is invisible on the page.

Worst findings, each verified against the corpus rather than taken from the
index: `bk-roads-less-traveled` (2,366w, the largest) is **a pasted AI chat
transcript**, prompts and all — but those prompts contain real dictation in
Shawn's voice, including a line that independently corroborates the open
`ACC-1990` farm-purchase conflict. **`FieldVisor`**, named in
`bk1-pocket-computers` as a product that "still runs", appears **nowhere else in
the corpus**. `bk1-a-fall-from-grace-the-pumpkin-patch-incident` carries an
unverified allegation that Chuck assaulted CJ, attributed to a named neighbour,
existing only in generated prose. Invented dialogue is put in Carina's mouth in
three places. And `bk1-the-30-year-echo`'s "a chaplain tried to pray" **replaced
a better captured truth** — "told pastor at age 10 that God doesn't exist;
pastor never came back."

Two structural findings worth more than the individual errors. **Six codes have
an AI scene competing with a `ready`/`raw` scene already in the book** — the
`ASK-40` pair even share a title, and ACC-1990, the spine of the book, is
currently told **seven times**: twice by Shawn, five times by a model. And
**28 of the 37 have no `date_event`**, which is 28 of the 33 dateless scenes in
the whole manuscript — so these drafts are also what piles every arc's ending
into arbitrary order. Fixing them fixes most of the ordering problem.

The `bk1-akron-lab.md` class of misfile recurs: three `EA-WHITEPAPERS` pieces
(whose own code says "not memoir") and `bk1-designing-for-generations.md`
(Terrasow, a 2022+ company, filed in the 1980–1990 Forged arc) are `kind: scene`
in `book/` while 17 siblings sit correctly in `essays/`. One of them carries
`55 dBA`, `800/900 ppm` and seven unresolved `[NEEDS CHECK]`/`[ANON]` markers
inside memoir voice — the exact leak the Mansfield rule forbids.

Also salvageable, and said so in the audit: Pee Wee Hollow is **real** (it is in
`bk-short-stories.md`, the highest-trust source) even though its scene's Fact
Pack asks to verify it; agMD is real; and `bk1-the-quiet-quit-of-legacy.md` is
the best of the 36, already carrying a cited source ledger and its own capture
prompt.

Three figures in the first draft of the audit were wrong and were corrected
before commit: the `[NEEDS CHECK]` markers are seven not six, the `Fact Pack`
scenes are seven not six (the seventh spells it lowercase), and the `STITCH-87`
duplicate row overstated what exists in Shawn's voice. The seventh Fact Pack
also asks him to "confirm **32 surgeries**" where every canonical source says
**40+** — wrong in the checklist, not the prose.

Limits stated in the audit: it did not fact-check all 29,582 words sentence by
sentence, did not re-test the 15 `ready` or 17 `dump-draft` scenes, and judged
provenance rather than prose quality.

### Scaffolding stripped from 18 ai-draft scenes (2026-10-31)

Bucket B of `AI-DRAFT-AUDIT.md`, executed. **3,004 words removed; manuscript
62,311 → 59,307 words, still 70 scenes.** Not one sentence of narrative was
touched.

The figure in the audit was first reported as 2,831 words, counted from the
`AI Playbook` / `Image Prompts` headings only. Doing the work found three more
block types — `Suggested Medium metadata`, `Social cut` and `Publishing kit` —
so the real total is 3,004. The audit has been corrected rather than left to
read low.

Method, because a blanket delete would have been wrong: the strip was dry-run
first with a prose-detector over every removed block, which flagged two files a
naive cut would have damaged.

- **`bk1-counting-shawns.md`** — the cut starts at `# Social cut (≈180 words)`,
  which *is* prose: a ready-made ~180-word Medium version of the essay. It is a
  condensation of text that remains above it, not unique material, so it was
  cut — but it is preserved verbatim in the archive, because short-form Medium
  pieces are the point of this project.
- **`bk1-this-starts-here-a-genx-technologist-energ.md`** — **held back
  entirely.** It is not a scene with scaffolding attached; it is a Medium
  *series preface* from first line to last ("What this series is", "Why
  Medium", "My co-author is an AI", "What you'll get in every story", "How to
  read this", "Next up"). Stripping its playbook would have left 784 words of
  non-memoir looking like a cleaned-up scene. It needs the whole-file decision
  in bucket A. It also carries its own never-combine break, in prose this time:
  *"EnergiAcres and Terrasow are what happened when I stopped hiding behind
  roadmaps and spreadsheets"* — the same defect fixed in `bk1-scars-as-data.md`
  earlier today, not fixed here because the file's fate is undecided.

Nothing was destroyed. Every removed block is recorded verbatim in
`_meta/notes/ai-draft-scaffolding-removed-2026-10-31.md` (`kind: meta`, so it
stays out of the index), including the seven `Fact Pack` checklists — which are
the only record of what each generator knew it was missing — and the social cut
above.

**One real change beyond scaffolding, and it is a de-duplication rather than a
loss.** Extracted Cutter Rules went 36 → 35. The rule removed was the social
cut's restatement, *"If a belief can't survive heat, weight, and repetition,
it's costume."* The canonical, fuller phrasing survives in the body of the same
file: *"…it isn't knowledge—it's costume."* `counting-shawns` still contributes
exactly one Cutter Rule, the better-worded one.

A dangling `* * *` separator left behind in `bk1-neighbor-dividend` was removed;
every other stripped scene already ended on its closing line or `_Rule:`.

Guarded: `tests/compile-manuscript.test.js` now fails if any scene under `book/`
carries `AI Playbook`, `Image Prompts`, `Suggested Medium metadata`, `Social
cut`, `Publishing kit`, `Fact Pack` or the `Tags: memoir…` line, with
`bk1-this-starts-here` named as the one known exception. Proven by appending a
fake playbook to a scene (test fails, names the file) and removing it (passes).

Verified: 234 tests, 233 pass, 1 skipped, 0 fail; 109 pieces (70 scene / 20
essay / 19 capture), 0 frontmatter errors; 96 codes, 111/111 mapped.

### Bucket A refile — seven pieces out of the book (2026-10-31)

**Manuscript 70 → 63 scenes, 59,307 → 55,169 words.** The corpus is unchanged at
109 pieces: nothing was deleted, only refiled (scene 70 → 63, essay 20 → 25,
capture 19 → 21). `check:filing` still reports 0 errors and nothing outside
`book/` reaches the manuscript.

**The count in the audit was wrong, and checking each file is what found it.**
Bucket A said "8 scenes" and then listed 3 + 1 + 5 = **nine**; it also omitted
the Medium series preface discovered during the scaffolding strip, making ten
candidates. Verifying each one before moving it brought the real number to
**seven**, because two of the "pure duplicates" were not duplicates.

To `essays/` as `kind: essay`, `arc: foundry` — not memoir, by their own code's
words ("no biographical facts should be taken from them"):
`bk1-neighbor-circuit`, `bk1-neighbor-dividend-power-food-and-quiet-hou`,
`bk1-january-heat-compost-steam`, `bk1-designing-for-generations` (Terrasow, a
2022+ company, had been filed in the 1980–1990 Forged arc), and
`bk1-this-starts-here-a-genx-technologist-energ` (the series preface held back
from the strip; its `arc` left as found rather than guessed). `arc: foundry`
matches the dominant convention of their 17 siblings and closes the
`EA-WHITEPAPERS` conflict note about white papers sitting in `forged/` and
`fractured/`. The `55 dBA` / `800-900 ppm` / `[NEEDS CHECK]` leak is out of
memoir voice as a side effect.

To `captures/` as `kind: capture` — real memoir, but a weaker retelling of a beat
already finished elsewhere:

- `bk1-fractured--forging---the-forty-percent-ask`. Its one distinctive detail,
  the Hartford rental-car setting, turned out to be **sourced and already in the
  `ready` scene** — "I drove that night. Hartford to Avon." Independent
  corroboration: `_calendar.json` has carried a `duplicate_cleanup_required`
  entry since **2026-05-09** naming this exact file, `keep` /
  `remove_or_merge`, with the same decision reached here from the content.
- `bk-from-farm-to-startup-the-journey-of-building-` — a generic overview of
  material told properly in `bk1-the-garage`, `bk1-the-cold-call` and
  `bk1-the-forty-percent-ask`.

**Two were on the list and should not have been.** Said plainly because moving
them would have been a quiet loss:

- `bk-idle-hands-and-constructive-work-lessons-from` shares the `SIDE-HUSTLES`
  code with a `raw` source-of-truth file but tells **different material** — a
  reflection on Chuck's intolerance of idleness, against a list of the actual
  hustles. A shared code is not a duplicate.
- `bk-how-87-stitches-and-a-broken-bone-prepared-me-` is the **only scene telling
  the pre-accident-injuries beat** (87 stitches by age ten, the barn-loft fall,
  the wrestling break). `STITCH-87`'s source of truth is `CHARACTER-LIST.md`, a
  reference doc, not a scene. Moving it would have deleted a beat outright.

`bk-roads-less-traveled` stays for bucket C: the dictation buried in its prompts
has to be mined out before the generated articles around it can go.

References repointed: 7 paths in `story-index.json`, 1 in `_calendar.json`, 4
heading locators in the scaffolding archive. The scaffolding guard's one
exception was `bk1-this-starts-here`, which has now left `book/`, so the
exception was removed and the guard is strict with no exemptions.

**What this did not do.** The AI share of the book fell from 47% to **41% of
words (30 of 63 scenes)** — but that is padding and non-memoir leaving, **not**
fabrication being corrected. `FieldVisor`, the pumpkin-patch allegation, the
invented dialogue and the remaining duplicate beats are untouched.

Also noted while in `_calendar.json`: two further duplicate pairs are still
outstanding there — `bk1-the-permit-ledger-*` ×2 and `bk1-private-infra-first-*`
×2. Both are in `essays/`, so neither is a manuscript problem.

Verified: 234 tests, 233 pass, 1 skipped, 0 fail; 109 pieces (63 scene / 25
essay / 21 capture), 0 frontmatter errors; 96 codes, 111/111 mapped.

### Bucket C (first file) — the Roads Less Traveled transcript mined (2026-10-31)

**Manuscript 63 → 62 scenes, 55,169 → 52,803 words.** The corpus went 109 → 110
pieces, because this produced a new capture rather than only moving one.

`bk-roads-less-traveled-overcoming-adversity-and-.md` was `kind: scene` in
`book/forged/` and the largest of the 37 ai-draft scenes at ~2,400 words. It is
not a scene and not even really a draft: it is a **ChatGPT conversation export**,
with the web UI's user-avatar image (`chat.openai.com/_next/image?url=…gravatar…`),
`ChatGPT` speaker labels, "Certainly, here's the revised version", article
*outlines* in bullets, and three generated articles stacked end to end.

**Seven verbatim passages of Shawn's own dictation were extracted** to
`captures/bk1-farm-roots-shawn-dictation.md` — the tractor nights, Mom's
sandwiches on the rock-picking days, the great-grandparents' farm purchase and
the grain→cattle shift, the run-down farm and its transformation, great-grandma
watching close to a dozen kids, the Murphy's-Law lesson, the pumpkins and sweet
corn and animals at the fair, and why farming could never hold his ambition.
Lowercase `i` preserved; nothing added, cleaned or completed. It is registered in
the index at `trust: raw` under `FARM-ORIGIN` and `SIDE-HUSTLES` — the same tier
as `bk-short-stories.md`, because these are his own words.

The transcript itself moved to `captures/` as `kind: capture` with a header
saying plainly what it is and pointing at the extraction, so nothing is lost and
nobody mistakes it for prose again.

**Four facts cross-checked rather than assumed, and two of them pay off:**

- "When i was 11, we purchased my great grandparents farm" — **sharpens an open
  conflict rather than settling it.** `characters.json` dates the Bechtel
  purchase to 1990 and records that West Salem was sold to buy it; he turned 11
  on 1990-12-30, so his "11" would put it Dec 30 1990 – Dec 1991. First-person
  evidence for the purchase, not for the year. Recorded as a new `FARM-ORIGIN`
  gap with a one-breath capture prompt.
- The Murphy line connects to a **known** thread — `FRACTURED-QUESTIONS` #10's
  "Murphy's Law philosophy" ("I've tested all the bad ways to do things"). Two
  phrasings of one rule; which is canonical is his call.
- Pumpkins / sweet corn / fair: corroborated by `PUMPKIN-PATCH`, `SIDE-HUSTLES`
  and `FORK-40`.
- "#2 oil producer in the State of Ohio in 2010" (from an outline, not the
  dictation): **sourced, but only in a backup** — see below.

**Two gaps this surfaced, neither of them about this file:**

1. **A real fact is surviving only in a `.bak`.** "CUTTER OIL RANK: became the #2
   OIL PRODUCER IN THE STATE OF OHIO in 2010" is in `LexDocs/_facts.json.bak`
   and **absent from the live `LexDocs/_facts.json`**. Recoverable today; lost
   the moment backups are tidied.
2. **The 1990 farm purchase is missing from the live timeline.**
   `LexDocs/_timeline.json` runs from "Farm Life Begins" (1980) straight to the
   accident with no Bechtel event, although `characters.json` dates it. The event
   that turned the farm from grain to cattle is not in the timeline the dashboard
   reads.

The AI share of the book is now **29 of 62 scenes, 20,074 of 52,803 words (38%)**,
down from 47% at the audit — still almost entirely because padding, non-memoir
and transcripts have left, not because fabrication has been corrected.

Verified: 234 tests, 233 pass, 1 skipped, 0 fail; 110 pieces (62 scene / 25
essay / 23 capture), 0 frontmatter errors; 96 codes, 112/112 mapped.

### Two data gaps fixed, two new facts from Shawn, one audit finding retracted (2026-10-31)

#### The FieldVisor finding was wrong

Shawn, chat 2026-10-31: *"FieldVisor, ScadaVisor and VisorBridge was the three
products i built under Fielding Systems. collectively this was a digital oilfield
platform, first of its kind in the cloud"*.

`AI-DRAFT-AUDIT.md` finding #2 called FieldVisor "an invented company asset".
**It is real.** The observation behind the finding was correct — the name
appeared nowhere in the corpus outside one generated scene — but the inference
was not. *Absent from the captures* is not *false*; it meant the corpus had a
hole where three product names belonged, and a generated scene was the only
place one of them had been written down.

`ScadaVisor` and `VisorBridge` appeared **nowhere at all**, and neither did the
phrase "digital oilfield". Now in
`captures/bk1-fielding-products-visor-platform.md` at `trust: raw`, added to
`codes.FIELD` with four aliases. The finding is struck through and corrected in
the audit, which now also says plainly that "unsourced" in its tables means *not
corroborated in this repo* — a flag to ask Shawn, not a verdict of fabrication.
Findings #3 and #4 stand on different ground: they put a specific allegation and
specific dialogue on named real people, where the test is not "is it in the
corpus" but "would you publish this without asking."

One claim from the correction does need checking before print: "first of its kind
in the cloud" is market history, recorded as his and uncorroborated. Logged as a
`FIELD` gap.

#### New: the Franks farm

Shawn, chat 2026-10-31: *"I purchased the Franks farm with my brother Josh Cutter
- Ever Root Land LLC. we purchases on 10/28/26"*. Captured in
`captures/bk1-franks-farm-ever-root-land.md` with a new code **`EVERROOT`**, and
added to the live timeline as a 2026-10-28 `business` event at age 46. Josh
Cutter checks out — brother, born 1989, ten years younger (`CHARACTER-LIST`),
and not CJ. Acreage, location, price, purpose and any link to EnergiAcres /
Terrasow / Cedar Valley are **not stated and not guessed**; they are listed as
gaps with three capture prompts.

#### Gap 1 — `_facts.json` had a root cause, not a missing line

`_facts.json` is **generated** by `scripts/build-facts.js`, so hand-editing it
would have been wrong and would have been overwritten. Two real defects:

1. It read question files from `LexDocs/<arc>/<ARC>-QUESTIONS.md` — a path the
   2026-10-27 restructure removed. All four were missing, so it found no open
   questions and would write an `_facts.json` with those lists emptied. The same
   stale-path failure as `story-index-lib.js`'s `STORY_DIRS`. Fixed to
   `_meta/questions/`, and it now warns loudly per arc instead of silently
   publishing an empty list.
2. It was **not in `npm run reindex`**, so nothing ever ran it and the stale
   output from before the restructure sat there. Added to `reindex`.

Regenerating lifted open questions 5 → 6. `facts_log` stays at 15: its source is
`_meta/running-questions.md`, which no longer contains the older entries the
`.bak` copies hold. Guarded by a new test asserting the paths `build-facts.js`
depends on exist.

**Correction to the previous entry:** it said the Cutter Oil "#2 oil producer in
Ohio" fact survived "only in a backup". That was wrong. It was in
`LexDocs/_meta/_timeline.json` — a **live** file, just the timeline nothing
reads. Less alarming than reported, and it is now in the live timeline too.

#### Gap 2 — the live timeline, ported rather than invented

`_meta/_timeline.json` (which no code reads) held two events the live
`_timeline.json` lacked. Both ported rather than written from scratch, **with
their ages corrected**: that file computes age as year − 1979 and ignores the
1979-12-30 birthday, so it runs a year high.

| Event | Ported as | `_meta` said |
|---|---|---|
| Parents buy the great-grandparents' farm — grain to cattle | `1990/1991`, age **11** | 1991, age 12 |
| Cutter Oil = #2 oil producer in Ohio | `2010`, age **30** | 2010, age 31 |

Its third candidate, "Chairman/Co-Founder Cedar Valley Farms" (age 41), was
**not** ported — the live timeline already has Cedar Valley Farms at 2020 with
the correct age 40. Checked for near-duplicates before writing, which is what
caught it.

The farm-purchase year is left **unresolved on purpose** and the description says
so: `characters.json` dates the Bechtel purchase to 1990, while
`_meta/_timeline.json` and Shawn's own "when i was 11" point to 1991. Porting it
as a single year would have silently picked a side.

Timeline now 36 → **39 events**, `total_events` updated, and the age corrections
recorded in `metadata.canon_corrections`.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces (62 scene / 25
essay / 25 capture), 0 frontmatter errors; **97 codes, 114/114 mapped**;
manuscript unchanged at 62 scenes / 52,803 words.

### Fielding products researched — all three confirmed, two repo conflicts moved (2026-10-31)

Shawn gave the build order by voice and said to research the "first of its kind"
claim. Both done; `captures/bk1-fielding-products-visor-platform.md` rewritten.

**The sequence, in his words:** FieldVisor and ScadaVisor started "more or less
at the same time" as **two separate products**; they did **not** own the polling
engine — "the system that actually did the communication between all of the
devices and sensors in the field… that would come later"; forced into order
**FieldVisor → ScadaVisor → VisorBridge**; and "**now I look at it just as one
system**." That last clause is the one that matters for the prose: the single
platform is a **retrospective** framing, so a scene set in 2009–2012 that calls
it "the platform" is the memoir version, not the true one.

**External research confirms all three names**, which closes out the retracted
audit finding completely:

| Product | Externally documented as |
|---|---|
| FieldVisor | field data capture + production reporting (also FieldVisor Mobile) |
| ScadaVisor | remote SCADA monitoring / field automation — flow meters, pump-off controllers, tanks, compressors, PLCs, artificial lift (also ScadaVisor Mobile, which added control of plunger-lift and POC cycles, valves, VFDs) |
| VisorBridge | Fielding's **own cloud communication and polling engine** |

**VisorBridge independently matches his account** — he said the polling engine
came later, and the external record calls VisorBridge exactly that. Two accounts
a decade apart, agreeing.

**It also dissolves an apparent contradiction in the book.**
`bk1-the-garage.md` (ready) calls Fielding "an operations platform… field
tickets, crew dispatch, job tracking" while `codes.FIELD` says it "came to
monitor hundreds of thousands of wells". Both are correct — FieldVisor was the
first, ScadaVisor the second. The previous entry here flagged that as a tension
to resolve before writing; it is resolved, and in the book's favour.

**A logged conflict moved on external evidence.** `codes.FIELD` carried "Jeff
Taton … vs Taynton". The Quorum acquisition release names "Fielding Chief
Technology Officer **Jeff Taynton**", and a Quorum byline reads "Jeff Taynton,
CTO, Fielding Systems". The conflict note now records that external sources
favour Taynton, pending Shawn's confirmation — it is not closed unilaterally.
Also surfaced: the acquisition release calls him "Fielding **President**", while
the Microsoft Azure guest post bylines him "**Founder and CEO**". Both on record;
logged as a gap, not picked.

**The "first of its kind" claim, honestly graded.** Windows Azure reached
general availability on **1 February 2010** (billing and SLAs began that day
after a free January), so before 2010 there was essentially no production Azure
to be in — the claim is close to structurally true for the period. Fielding
itself claimed it contemporaneously (~2012–15): ScadaVisor as "the only truly
cloud-based service of its kind since it is supported by our own cloud-based
communication and polling engine called VisorBridge", and a Fielding rep on a
control-systems forum saying Azure "makes it the first of its kind". That is
evidence the claim was **made**, not that it was **true**. No independent source
confirms first-in-Azure or first-in-App-Store; equally, **no counterexample was
found** — searching for an earlier oil-and-gas iPhone app turned up only consumer
fuel-price tools (iGas 2008, GasBuddy 2010) and a magazine iPad app (OGJ 2010),
nothing upstream. "No other app in the App Store before '10" is a negative search
cannot settle.

Recorded as: do not print it unqualified. The checkable version — Azure went
commercial in February 2010 and Fielding was already building oilfield SCADA on
it, with its own cloud polling engine, carried on Microsoft's own blog — is
stronger because it survives a fact-check. Shawn's "I work directly with the
teams and know that" is testimony rather than citation, which a memoir can
legitimately use in his voice.

`node scripts/find-story.js ScadaVisor` now resolves to `FIELD`.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript unchanged at 62 scenes / 52,803
words.

### Fielding title resolved: Founder / CEO (2026-10-31)

Shawn's choice. Recorded on `codes.FIELD` — in the summary, and as a resolved
conflict rather than a deleted one, so the reasoning survives.

**No prose needed changing, which is worth stating rather than implying.**
Checking every "president" in the live corpus first: nothing in `book/` or
`essays/` ever asserted a Fielding title for Shawn. The hits were all something
else —

- the **2024 cofounder conflict** material ("one guy tried to become the
  president and CEO"), a different company and a different person, still
  deliberately unnamed and on HOLD;
- `bk-shawn-cutter-timeline.md`: "Joins Quorum Software as **Vice President**
  after Fielding Systems is acquired" — a real, different role at a different
  company, correctly stated;
- `characters.json`: "Founder, President & CEO — ByDesign Technologies", which is
  **Jeff Ayscue's** record, not Shawn's;
- this session's own research notes, recording the source discrepancy.

So the decision closes a question the research raised rather than correcting
anything previously written. The repo only ever said "founder" loosely ("The
Founder Lesson", "farm-kid-turned-founder"), which is now backed by a canonical
answer.

One rule written into the conflict note: **the Quorum acquisition release still
gets quoted as written** wherever it is cited. It says "Fielding President Shawn
Cutter", and an external source does not get edited to match the book's choice.
Both titles stay on record; the book uses Founder / CEO.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript unchanged at 62 scenes / 52,803
words.

### Taynton confirmed — the spelling corrected across the repo (2026-10-31)

Shawn confirmed **Jeff Taynton**. `codes.FIELD`'s long-standing spelling
conflict is closed, and `primitives.people` re-keyed.

**I nearly flagged this as a contradiction and should not have.**
`FORGING-QUESTIONS.md` appeared to have Shawn spelling it out letter by letter in
Session 5 — "T-A-T-O-N" — which would have conflicted with his answer. Reading
the whole line, it says **"T-A-T-O-N, or possibly Taynton — need to verify
spelling"**, and a second note at line 163 said the transcript **"sounds like
T-A-Y-N-T-O-N"**. It was logged as unverified from the start. The lesson is the
same one as the FieldVisor retraction: read the whole entry before treating it as
evidence.

Everything of weight pointed one way: `characters.json` was **already keyed
`jeff_taynton`**, `scripts/sync-to-obsidian.py` already used `jeff_taynton` as
its canonical key with Taton as an alias, and the 2015 Quorum release names
"Fielding Chief Technology Officer Jeff Taynton".

**Corrected — 17 occurrences across 14 files**, including four `ready`/finished
scenes, which is the part worth naming because it is Shawn's own prose:
`bk1-the-garage.md` ("Jeff was there first. Jeff Taynton."),
`bk1-the-quorum-bed.md`, `bk1-the-dave-problem.md`, `bk1-founder-employee.md`.
Also `P2L-BOOK-CONTEXT.md`, `running-questions.md`, `characters.json`,
`family-recording-questions.md`, the two `_meta/characters/` prompt docs,
`WRITING_PARTNER.md` (whose "possibly Taynton" hedge is gone), a publication-plan
spec under `docs/`, and `story-index.json` throughout.

**Deliberately left spelling "Taton":**

- `scripts/sync-to-obsidian.py`'s alias list — it maps old text to the canonical
  `jeff_taynton` key, so the superseded spelling has to stay for matching.
- The resolution notes themselves, in `FORGING-QUESTIONS.md`, the capture and
  this log. They quote the old spelling to record what changed; blanking it would
  erase the audit trail.
- `.bak` files, which are historical snapshots.

**And "Taton" is now a search alias on `FIELD` and `TERRASOW`.** After the
rename, `find-story.js Taton` returned no code match. Old notes, old transcripts
and Shawn's own memory may still use it, and a search that finds nothing is worse
than one that returns the right code. It now resolves to both.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; `_facts.json` regenerated clean (0 Taton);
manuscript unchanged at 62 scenes / 52,803 words.

### The polling engine: a question of mine corrected, not just answered (2026-10-31)

Shawn: *"There was not a polling engine before Visor Bridge."*

**The open question in the capture was malformed and the fault was mine.** His
earlier message said "we had the system on top of the polling engine", which I
read as a third-party engine underneath, and I logged "which polling engine did
they sit on top of before VisorBridge?" He meant the opposite: they had the layer
that *would* sit on top, and there was **no polling engine at all** until
VisorBridge. There was nothing to name. The gap is removed rather than answered,
and the capture says why — a wrong question left in a gap list is worse than no
question, because someone will eventually go looking for the answer.

**His explanation of what a polling engine is has been kept verbatim**, because
it is the clearest technical account of his own work anywhere in the corpus and
it is in his voice rather than a brochure's: "the heart of the SCADA
communication… what actually talks to the devices… does the translation… holds
socket connections open… super complicated, multi-threaded. Distributed
application across multiple data center regions."

That last clause matters more than it looks. A multi-region distributed service
holding live socket connections open to field devices is what makes "SCADA in the
cloud" technically substantive rather than marketing — it is the hard part, and
it is the detail that would make an engineer believe the claim. Added to
`codes.FIELD` as a quote.

**The sequence is now a platform, not three products.**

| Step | Product | Added |
|---|---|---|
| 1 | FieldVisor | field data capture + production |
| 2 | ScadaVisor | SCADA **and measurement** |
| 3 | VisorBridge | communication / polling |

Both of his framings are on record and they do not conflict: "two separate
products… now I look at it just as one system" (first message) and "think of it
more as a platform play where I was building out starting with…" (this one). The
products were separately named; the platform was the intent they were built
against. Recorded as a refinement rather than a replacement, and for prose his
own version is the better one — a platform built in three moves, not three
products that later had a platform story attached.

**`measurement` is new to the corpus.** It appears nowhere else, and in oil and
gas it is its own discipline (custody transfer, allocation) rather than a synonym
for SCADA monitoring. Logged as a `FIELD` gap worth one line from him.

**`FieldVisor Mobile` closed one question and left a warning.** "FieldVisor
Mobile was the mobile app that went along with the hosted service" settles which
mobile product existed. But `book/forged/bk1-pocket-computers-and-cold-thumbs.md`
is still `ai-draft`, and this answer does **not** verify its specifics —
BlackBerry and Windows CE, a killed PhoneGap build inside Visual Studio,
"web-first until native earns its keep". Those remain unsourced and the capture
says so, so the one confirmed fact is not read as blessing the paragraph around
it.

`codes.FIELD` is down to **three** open gaps: dates for the three products
(now the last thing blocking a fact-checkable version of the cloud claim), the
"first of its kind" grading, and what measurement meant.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript unchanged at 62 scenes / 52,803
words.

### The Fielding product dates — and a tension they expose (2026-10-31)

Shawn gave the years: **FieldVisor 2009, ScadaVisor 2010, FieldVisor Mobile 2011,
VisorBridge 2012.** One product a year, four years running.

**Three corroborations, none of them trivial:**

- **FieldVisor 2009 is the founding-year product.** `FORGING-QUESTIONS` has
  "Fielding officially started 2009" from his 2026-10-30 chat.
- **ScadaVisor 2010 is the year he went full time.** Same source: "not full time
  until 2010." The SCADA product and his own full commitment arrive together —
  that is a narrative beat, not just a date.
- **ScadaVisor 2010 is also the year Azure went commercial** (GA 2010-02-01). He
  was building oilfield SCADA on Azure in the year the platform opened.

**And one tension that would have embarrassed him in print.** He said "there was
no other app in oil and gas in the App Store before '10", but **FieldVisor Mobile
is 2011**. Those do not line up: if his mobile app shipped in 2011 it was not in
the App Store before 2010, so the claim cannot be his app arriving first into an
empty store. Three readings could reconcile it, and the one that fits the corpus
is that the earlier BlackBerry and Windows CE work described in
`bk1-pocket-computers-and-cold-thumbs.md` was **not** an App Store product at
all, making 2011 the first App Store release. **Not assumed** — logged as a
`codes.FIELD` gap, and the note says do not print the claim until it is settled.

**The claim now has a form that survives a fact-check**, written into the capture
and `P2L-BOOK-CONTEXT.md`:

> Windows Azure opened for commercial business on 1 February 2010. That same year
> Fielding was running oilfield SCADA on it, and by 2012 had built its own
> communication and polling engine — multi-threaded, distributed across several
> data-centre regions, holding socket connections open to field devices.

Every element is dateable and Microsoft's own blog carried Fielding as an ISV.
"First" can still be said in his voice as his own knowledge — that is what "I
work directly with the teams and know that" is, and a memoir may use testimony
where a press release may not.

**Four timeline events added** (2009/2010/2011/2012, `category: project`), each
with its related captures. The 2011 entry carries the App Store tension in its
own description so it cannot be read without the caveat. Timeline 39 → **43
events**, `total_events` updated. Checked afterwards that **every** year-only
event's age equals year − 1980 — correct for a 1979-12-30 birthday — including
the two ported earlier today: none are off.

`P2L-BOOK-CONTEXT.md`'s Fielding entry now carries the title, all four products
with their years, the no-polling-engine-before-VisorBridge fact, and the
instruction to state the cloud claim with dates rather than as "first of its
kind". `codes.FIELD` is down to three gaps: the App Store tension, the cloud-claim
grading, and what "measurement" meant.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript unchanged at 62 scenes / 52,803
words.

### App Store year corrected to '11 — the contradiction dissolves (2026-10-31)

Shawn corrected the year: the claim is **"no oil and gas app in the App Store
before '11"**, not '10. I had recorded '10 from his earlier message and flagged
it as contradicting FieldVisor Mobile's 2011 date.

**With '11 there is no contradiction, and the claim is sharper than the one I was
worried about.** FieldVisor Mobile shipped 2011; by his account nothing in oil and
gas was in the App Store before it; so FieldVisor Mobile was the first. That fits
his own dates exactly, and it is a more specific claim than "first of its kind".

**What research supports.** No verifiable oil-and-gas App Store release before
2011 was found. Two caveats, neither a refutation:

- Industry **media** apps exist — E&P (Hart Energy), GEO ExPro, World Oil, Oil &
  Gas Journal — but none could be reliably dated, and Oilfield Technology's was
  2014. The iPad did not exist until April 2010, so iPad magazine apps cannot
  predate that. The Oil & Gas Journal iPad app, which the previous entry here
  cited loosely as 2010, **could not be confirmed** on a follow-up search — it is
  recorded as undated rather than as a counterexample.
- **iGas** (2008) was an oil-price app, but consumer retail fuel pricing.

**So the printable version specifies the kind of app:** the first **operational /
field** oil-and-gas app in the App Store. That is the meaningful claim anyway, and
it survives someone later turning up a dated 2010 magazine app.

Corrected in the capture (the tension section is replaced by a resolution
section, and the earlier research paragraph updated), `codes.FIELD` (the gap
removed, a resolved conflict recorded in its place), the 2011 timeline event's own
description, and `P2L-BOOK-CONTEXT.md`. One straggler with a different apostrophe
was caught on a second pass.

`codes.FIELD` is down to **two** gaps: the "first of its kind in the cloud"
grading, and what "measurement" meant in ScadaVisor.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript unchanged at 62 scenes / 52,803
words.

### Measurement defined — and a line that may be bigger than the book's bridge (2026-10-31)

Shawn: *"Measurement is gas and liquids measurement. Quantifying the molecules
that are flowing through pipelines and stored in tanks."*

**It corroborates the external product copy without having been written to it.**
The independent account of ScadaVisor says it monitored "**flow meters**,
pump-off controllers, **tanks**, compressors, PLC's, artificial lifts". Flow
meters and tanks are exactly the two halves he just described: product in motion
through pipelines, and product at rest in tanks. His definition and 2013-era
marketing copy describe the same thing from opposite ends, thirteen years apart.

What he did **not** say is recorded too, so nobody fills it in: he defined the
domain, not the commercial use. Whether ScadaVisor's measurement served **custody
transfer** (numbers a sale is billed on, audit-grade), **allocation** (splitting
commingled production back to wells and owners) or operational metering only is
still unrecorded. He was asked and answered at the physical level, which may be
the honest answer, but it is not the same question. Gap rewritten accordingly —
low stakes unless a scene gets specific.

**"Quantifying the molecules" is usable prose**, and flagged as such: it is the
`CLAUDE.md` voice profile working — direct, Feynman-style, a regulated technical
discipline in six words a reader outside the industry can hold.

Then he added: *"i quantified matter and energy."*

**That reaches past the product.** Measurement at Fielding was matter; EnergiAcres
is energy. And it lands on an existing thesis lock — `codes.SWITCH` holds "energy
is everything" from `PHILOSOPHY-BRIEF.md`, alongside the post-accident
cause-and-effect habit ("turtles all the way down"). "I quantified matter and
energy" is that same thought arriving from the engineering side rather than the
philosophical one. `SWITCH` and `FIELD` are now cross-linked, with the quote on
`FIELD`.

**Deliberately not interpreted.** Two readings exist and he has not said which:
(a) a description of Fielding's measurement work, or (b) a claim about the whole
working life — oilfield measurement, then power campuses, one activity throughout.
Reading (b) would **restructure the Forging→Foundry bridge**, which is precisely
why it must not be inferred from six words. Logged as a gap on both codes with
that stake stated.

Also fixed: the measurement quote failed `build-shorthand`'s verbatim check
because I had wrapped it across two blockquote lines — the validator normalises
whitespace but keeps the `> `. Same mistake as the Franks farm quote earlier
today; the quote now sits on one line.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript unchanged at 62 scenes / 52,803
words.

### "Matter and energy" is Fielding only — the bridge withdrawn (2026-10-31)

Asked directly whether *"i quantified matter and energy"* described Fielding's
measurement work or the whole working life, Shawn said **just Fielding**.

**This is the restrictive answer, and it closes something off.** The line
describes what the software did — gas and liquids, molecules in pipelines and
tanks — and is **not** a thesis about the career.

- Not to be used to bridge Forging→Foundry.
- Not to be used to tie Fielding to EnergiAcres' "energy is everything" lock. The
  resemblance to `codes.SWITCH` was real, it was put to him, and he declined it.
- Fine inside a Fielding scene, where it is accurate.

**The `SWITCH`→`FIELD` link added an hour earlier has been withdrawn**, and the
decision is recorded as a conflict on **both** codes — not simply deleted — so
the connection is not rebuilt later from the phrasing alone. A link removed
without a note is a link someone re-adds.

Worth keeping as a method note: the career reading was the *more attractive* one.
It would have handed the book a clean spine from oilfield measurement to power
campuses, which is exactly the kind of tidy structure a model is prone to find
and an author is prone to be talked into. It was wrong. Six words that sounded
like a thesis were a description of a product, and the only reason that is on
record correctly is that it was asked rather than inferred — the same lesson as
the FieldVisor retraction and the malformed polling-engine question, three times
in one session.

`codes.FIELD` now has **no open factual gaps** — two standing notes remain, both
guidance rather than questions: how to phrase the cloud claim, and that
measurement's commercial use (custody transfer vs allocation vs operational) is
unrecorded and only matters if a scene gets specific.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript unchanged at 62 scenes / 52,803
words.

### The Fielding products written into the two AI scenes (2026-10-31)

Both are `ai-draft`, so editing them costs nothing — and both were already
circling this material without naming it. Deliberately **no finished scene was
touched**: `bk1-the-garage.md` and `bk1-the-cold-call.md` refuse product detail on
purpose and that refusal is the writing working.

What went in: all four products with their years, the measurement definition, the
polling-engine description in his words, and the dated form of the cloud claim.
Both scenes gained a `products:` frontmatter list and a `sources:` pointer to the
capture.

**Two real defects were fixed, neither of which was about missing names.**

**1. The cloud scene compressed four years into one night.** It opens on a
midnight in the garage and has "production in a browser, on Azure" and "on your
phone from the App Store" happening in the same scene. Azure reached GA
2010-02-01 and FieldVisor Mobile shipped 2011 — those are two years apart and
cannot share a midnight. `date_event` widened 2009 → **2009-2012**, the "one
night" flagged as the draft's invention, and the choice put to Shawn: pick one
real night and say what shipped that night, or let the scene be the build rather
than the evening. Also replaced "the first-of-its-kind software company" with the
dated version, per the `FIELD` guidance.

**2. The mobile scene was in the wrong arc entirely.**
`bk1-pocket-computers-and-cold-thumbs.md` was `arc: forged` — the 1980–1990
childhood arc — with **no `date_event`**, while describing Fielding-era iPhone
work. Refiled to `book/forging/` with `date_event: 2011`. This is the third
instance today of the same class of misfile (after `bk1-akron-lab.md` and the
EA white papers): right `kind`, wrong folder, which nothing flags.

**And one assertion removed rather than sourced.** The draft said FieldVisor
"**still runs**", present tense. Whether the product names survived the 2015
Quorum acquisition is an open `FIELD` question, so the clause is gone. The scene
now says it "stuck because it was faithful to the job", which is what is actually
supported.

**What was explicitly NOT blessed.** The mobile scene's marked note says so in
the file: BlackBerry and Windows CE, "one of the first oilfield web apps", the
3 a.m. killed PhoneGap build inside Visual Studio, and "web-first until native
earns its keep" remain **unsourced**. Shawn named the product, not the toolchain,
and one confirmed fact must not read as blessing the paragraph around it.

**The ordering payoff.** Both scenes now sort into their real places in the
Forging arc — the cloud build at #6 (2009-2012) and the mobile scene at #8
(2011), between Chuck's death and the Quorum close — instead of one floating
undated in the childhood arc. Corpus by arc: forged 34 → 33, forging 24 → 25.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript 62 scenes.

### "The Night" becomes the build (2026-10-31)

Shawn chose: the scene is the **whole build**, 2009–2012, not one night.

**The title and the filename both asserted the night, so both changed.**
`bk1-the-night-we-moved-the-oilfield-to-the-cloud.md` → `bk1-moving-the-oilfield-to-the-cloud.md`,
title "The Night We Moved the Oilfield to the Cloud" → **"Moving the Oilfield to
the Cloud"**. Renaming cost seven hand-written repoints (two captures, the
scaffolding archive, `story-index.json`, `AI-DRAFT-AUDIT.md`, `_calendar.json`,
`_meta/_timeline.json`) plus the generated files, which `reindex` handled.

That cost was worth paying rather than leaving a filename that asserts a fact the
author has rejected. Note the repo already tolerates title/filename drift —
`bk-how-87-stitches-and-a-broken-bone-prepared-me-.md` is truncated, and several
slugs no longer match their titles — so this is not a new convention being
imposed. The difference is that a *truncated* slug is untidy, while a slug
claiming a single night that did not happen is wrong.

**The old title stays searchable.** It was the piece's name for months, so it is
an alias on `OILFIELD-AI`; `find-story.js "night we moved the oilfield"` still
resolves. A rename that makes the old name un-findable just moves the problem.

**Three prose claims reframed, nothing invented.** "People call that night 'the
start-up moment'" → "People want a single night to call…", and "That night was
proof" → "The build was the proof." Both remove the false night and keep his
point. "Midnight made everything honest" was left: decoupled from the title it
reads as habitual about late work, not as one evening.

**And what reframing did NOT fix is flagged in the file.** Removing the false
night did not supply the true shape. The passage about watching the trend settle
and cross-checking the operator's clipboard still reads as one sitting, and no
capture says which milestone it was. Nothing was written to fill that — whether
it belongs to FieldVisor's first production data (2009), ScadaVisor's first live
device (2010) or VisorBridge's first poll (2012) is his to say, and the note says
so instead of picking.

One stale reference to the old filename remains in `LexDocs/_meta/_index.json`.
That is the stale generated copy already logged as droppable debt (87 stories,
flat pre-restructure paths, read by nothing) — editing it would be pointless.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 112 pieces, 0 frontmatter
errors; 97 codes, 114/114 mapped; manuscript 62 scenes.

### The Fielding customer ladder — new material, externally checked (2026-10-31)

Two messages from Shawn gave the growth arc the corpus did not have: **Cutter Oil
→ a FieldVisor customer → a saltwater disposal operation → a few Texas
measurement companies → "pieced together smaller deals" → Penn Virginia →
Gulfport → exit.** New capture
`captures/bk1-fielding-customer-ladder.md`, new code **`FIELD-CUSTOMERS`**
(98 codes now).

**The go-to-market in one line of his:** *"FieldVisor or [ScadaVisor] could be the
lead in, but the goal was to get them with everything."* That is land-and-expand,
and it is the **commercial** half of the "platform play" he described for the
build. Worth noting because the two arrived separately and unprompted — he
described the platform from the engineering side on one occasion and from the
selling side on another, and they agree.

**It also narrows a gap rather than opening one.** `codes.FIELD` asked what
measurement's commercial use was. Texas measurement companies *as customers*
means measurement was a market in its own right, pointing at the service-company
side rather than operators metering their own wells. Not conclusive; the gap now
says so instead of asking from scratch.

**Both named customers verified as real public companies.** Penn Virginia
Corporation is an SEC filer (CIK 0000077159) whose FY2012 10-K describes
operations in Texas, the Mid-Continent and Mississippi — supporting "multiple
regions of production" — and whose filings confirm it **sold its own gas** off
Henry Hub, supporting "they also marketed their own gas". Gulfport Energy is
public, Utica-focused, grew production **255% in 2014**, and a company
presentation shows **market cap $4.0B / EV $4.6B**. The timing fits exactly:
Gulfport's breakout was 2014 and the Quorum close was March 2015, so "that is
what took us to an exit" lands.

**Three of his descriptive details did NOT verify, and are logged as gaps rather
than written down as fact:**

1. Penn Virginia's "multi-billion-dollar enterprise value" — no clean dollar EV
   found for 2012 or 2014, only valuation ratios. Plausible, and a number a
   reader can look up.
2. Penn Virginia's "non-operated working interest" — not in its filings, which
   describe joint-venture participation in the Eagle Ford and Granite Wash.
   Adjacent, not the same.
3. Gulfport's "shale production all over" — it was **concentrated** in the Utica
   (OGJ: 97% of net 2Q production). "Almost entirely Utica" is truer *and* the
   more impressive sentence.

**And a decision deliberately left to him: whether to name these customers.**
Both are public, the relationships are 2010–2015, and Fielding was sold in 2015,
so this is **not** the repo's `[REDACTED-partner]` situation, which protects
current confidential EnergiAcres partners. Naming them is probably fine and makes
the arc concrete — but it is a choice about real counterparties, so nothing was
promoted into a scene. `find-story.js "Penn Virginia"` and `Gulfport` now resolve.

**Unanswered, and said so in the capture:** the customer ladder does not tell us
which milestone the "watched the trend settle / cross-checked against the
operator's clipboard" passage belongs to. That question is still open.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 113 pieces (62 scene / 25 essay
/ 26 capture), 0 frontmatter errors; 98 codes, 115/115 mapped; manuscript
unchanged at 62 scenes.

### Naming approved; Harpold recorded; the ladder's mechanism found (2026-10-31)

Shawn: **"Yes you can name them."** Penn Virginia and Gulfport may be named in
the book. The gap is closed and recorded as a resolved conflict on
`FIELD-CUSTOMERS`.

**Harry Harpold is recorded but his print decision is NOT made, deliberately.**
He was the Penn Virginia contact. He is a named **private individual**, and the
permission Shawn gave was about the two **companies**. Recording his name is what
Shawn asked for; publishing it is a separate decision about a real person who has
not been asked. Added to `primitives.people` with that distinction written into
the entry, and logged as a `FIELD-CUSTOMERS` gap saying do not put him in prose
without a yes. No research was done on him — verifying a private individual is
not something to do unprompted.

**And the new material reframes the ladder.** Shawn: *"we built a relationship
over a year before he decided to move forward. each time we connected, we had
more custoemrs. that built confidence."*

The capture written an hour earlier listed "pieced together smaller deals" as a
holding phase between the small customers and the big one. **That was wrong.**
Those deals were the *argument*: over more than a year, every time Fielding came
back to Harpold it was a bigger company than the time before, and the growth did
the convincing. So the saltwater disposal operation and the Texas measurement
companies are not filler on the way to Penn Virginia — they are **why Penn
Virginia said yes.**

For the book that inverts the obvious structure: the unglamorous deals are the
plot and the enterprise logo is the consequence. It also pairs with
`bk1-the-cold-call.md` (`ready`), whose Cutter Rule is "Learn the language of the
room before you try to change what happens in it" — the Harpold year is that
lesson at a longer timescale: not a cold call that lands, but a year of returning
with more proof each time.

**No year was inferred.** "Over a year before he moved forward" would date the
courtship if the rollout had a date, and it does not yet. Logged as a gap rather
than computed.

**A repo convention finally written down.** `build-shorthand`'s validator rejected
a `quotes` entry for the third time today with "quote not verbatim" — it
normalises whitespace and case but does **not** strip the `> ` from a wrapped
blockquote line, so a quote split across two blockquote lines fails even when the
words are identical. Fixed here, and the rule is now in `CLAUDE.md`'s shorthand
section: write a quoted sentence on one long line and let the editor soft-wrap
it. Three identical mistakes in one session is a missing instruction, not three
slips.

`find-story.js Harpold` resolves. `FIELD-CUSTOMERS` has seven open gaps, five of
them questions for Shawn and three of those about details research could not
confirm.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 113 pieces, 0 frontmatter
errors; 98 codes, 115/115 mapped; manuscript unchanged at 62 scenes.

### Harry Harpold cleared for print (2026-10-31)

Shawn: **"Yes, name him."** Asked separately from the two companies, because he is
a named private individual rather than a public filer. He may appear in published
prose. The gap is closed and recorded as a resolved conflict on
`FIELD-CUSTOMERS`; `FIELD-CUSTOMERS` is down to six gaps.

**One caution written into both the capture and his `primitives.people` entry,
and it is not about permission.** Everything on file about him is a *single fact*
— he was the Penn Virginia contact and the relationship took over a year to
close. Nothing about his character, his reasons, or anything he said has been
captured. A named living third party with one fact attached is exactly the
condition under which a generated draft would invent a personality, which is what
half of today's audit was about. He is deliberately **not** in
`CHARACTER-LIST.md`; if he becomes more than a name in the book he needs his own
capture first.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 113 pieces, 0 frontmatter
errors; 98 codes, 115/115 mapped; manuscript unchanged at 62 scenes.

### The Penn Virginia rollout scene, and a mapping correction (2026-10-31)

"Really tested us" has an answer, and it is a scene. New capture
`captures/bk1-three-weeks-to-a-mobile-app.md`: three weeks from a public-company
rollout, the mobile app sitting with a company in Israel because "we didn't have
that expertise in-house", Shawn pulling it — "we made the call. **I** made the
call" — and having it rebuilt in-house in three weeks, then 90 days of keeping it
alive, including new compression strategies to hold the install footprint under
15 MB.

**Both Apple constraints he named are real, and they are two different limits.**
Separated in the capture because an engineer reading the book will know the
difference: the **install footprint** ran against the App Store's
over-the-air cellular cap — 10 MB (2008) → **20 MB (Feb 2010)** → 50 MB (2012,
iOS 5.1) → 100 MB (2013, iOS 7) — and the **database** limit was Web SQL's 5 MB
default on iOS, with larger quotas unreliable and `SECURITY_ERR` above 5 MB on
iOS 4. Both recorded as well-corroborated secondary sourcing, not Apple
documentation; no official Apple page was found for any of the cap changes.

**The technical detail independently dates the scene.** A 15 MB target is what you
aim for against a 20 MB ceiling, and that ceiling held from February 2010 to early
2012. FieldVisor Mobile is his 2011 product. So the Penn Virginia rollout was most
likely **2011** — the ladder's missing date — and the two facts agree without
either having been fitted to the other. Logged as **derived, not stated**: the
gap now carries the chain and says one word from him closes it.

**A hypothesis I put to him came back no.** I had asked whether Penn Virginia's
scale is what forced VisorBridge to be built — the customer who breaks the system
and makes you build the hard thing. His answer: *"never saw Visor Bridge to Penn
Virginia, actually, we just sold that to Gulfport, Penn Virginia was only an
enterprise FieldVisor customer."* So **Penn Virginia = FieldVisor only;
VisorBridge went to Gulfport.** Recorded on `FIELD-CUSTOMERS` and in `FIELD`'s
summary.

That was the second tidy story in two days to be wrong — after "i quantified
matter and energy" as a career thesis — and both were caught the same way.

**It also sharpens the land-and-expand line instead of contradicting it.** The goal
was "to get them with everything"; the first big account only ever took one
product. The full platform did not land until Gulfport, which is a better story
than the strategy working first time and explains why Gulfport is the one that
"really set the company."

**And one of today's audit calls moved — partly.** `AI-DRAFT-AUDIT.md` listed
`bk1-pocket-computers-and-cold-thumbs.md`'s mobile pivot as unsourced. The
*shape* is now corroborated first-hand: outsourced build killed over a public
launch, switch to a web app. The toolchain specifics (PhoneGap, Visual Studio,
"a stubborn test", 3 a.m.) are still unsourced. A new section `4b` records this,
because it cuts the opposite way from the FieldVisor retraction and arrives at the
same conclusion: "unsourced" means *not corroborated here*, and a generated draft
can have a true structure with invented furniture bolted to it.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces (62 scene / 25 essay
/ 27 capture), 0 frontmatter errors; 98 codes, 116/116 mapped; manuscript
unchanged at 62 scenes.

### Penn Virginia was 2013 — my derivation was wrong (2026-10-31)

Shawn: **"no. Penn Virginia was 2013."** Date recorded. The 2011 I derived an hour
earlier is **retracted**, and the retraction is kept in
`captures/bk1-three-weeks-to-a-mobile-app.md` rather than quietly overwritten,
because of how it failed.

**What I argued.** FieldVisor Mobile is his 2011 product; the three-week scramble
is that app's build; an "under 15 MB" target is what you aim for against the App
Store's 20 MB cellular cap, which held February 2010 – early 2012; therefore
2011. I described it as *independent corroboration* — the product date and the
technical constraint agreeing without having been fitted to each other.

**Why it was wrong, and the error is mine, not his memory.** By 2013 that cap was
**50 MB** (raised in 2012 with iOS 5.1) and about to be 100 MB with iOS 7, so
15 MB has nothing to do with it. Worse: I had both limits written out side by side
**in that same file** and still reached for the wrong one. A mobile *web* app is
not downloaded from the App Store at all, so the cellular cap was never the
plausible constraint. The number to reach for was the one he named in the same
breath — the **database quota**. "Under 15 MB" was almost certainly local storage
for an offline-capable web app, which also collapses his two clauses into one
constraint: the footprint *was* the database.

**The pattern, stated because this is the third in two days.** "I quantified
matter and energy" as a career thesis; Penn Virginia forcing VisorBridge; now
15 MB dating the rollout to 2011. Every one was tidy, plausible, and false, and
every one was caught by his correction rather than by my checking. The specific
failure mode is now written into the capture: **a coincidence that confirms a
convenient answer deserves more suspicion than one that contradicts it.** Numeric
neatness is not evidence.

**And the correction exposes a real tension worth more than the date.**
FieldVisor Mobile is dated **2011**; this rollout is **2013**. So what was the
mobile app built in three weeks? A rebuild, a second app, or are the two dates
about different products? Logged as a gap on both `FIELD` and `FIELD-CUSTOMERS`
and asked as a capture prompt — **not reconciled here**, since reconciling it is
exactly the kind of tidy inference that has gone wrong three times.

The Fielding sequence now reads coherently: FieldVisor 2009 → ScadaVisor 2010 →
FieldVisor Mobile 2011 → VisorBridge 2012 → **Penn Virginia rollout 2013** →
Gulfport → exit March 2015. Timeline event added (44 events), and every year-only
age re-checked against year − 1980: none inconsistent.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces, 0 frontmatter
errors; 98 codes, 116/116 mapped; manuscript unchanged at 62 scenes.

### The size ceiling was 20 MB — and my replacement guess was wrong too (2026-10-31)

Shawn: *"make it a 20MB limit. i know it was small !"* Recorded as his.

**It is internally coherent in a way that favours him.** A target of "under
15 MB" against a **20 MB** ceiling is exactly the headroom an engineer leaves, and
the two numbers came on separate occasions without being fitted together.

**And it withdraws my own correction.** An hour ago, having been wrong about the
2011 date, I concluded the 15 MB was "almost certainly" the **Web SQL database
quota** rather than a download cap. If the ceiling was 20 MB, that points back at
the **App Store cellular download cap** — 5 MB and 50 MB are not 20 MB. So both
of my guesses were confident and both were wrong, in opposite directions. His
recollection is the only number in this thread that has held.

**One tension is left open on purpose.** The documented 20 MB cellular cap ran
February 2010 – early 2012; he dates the Penn Virginia rollout to 2013, when the
documented cap was 50 MB. A single hypothesis would reconcile everything — that
the **mobile build predates the rollout**, say 2011, which is also the FieldVisor
Mobile date and would dissolve the other open tension in the same move.

**That is precisely why it is not adopted.** One move explaining two awkward facts
at once is the shape of every inference in this thread that proved false: the 2011
date, the database quota, Penn Virginia forcing VisorBridge, "matter and energy"
as a career thesis. Four for four. The cap dates are also secondary sources —
reported by outlets after developers noticed the change, with no Apple
documentation found — and that is not strong enough to overrule a first-hand
memory. Possible answers all stay listed: carriers or regions holding 20 MB
longer, the number remembered a notch low, build and rollout in different years,
or the documented timeline simply not matching his case.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces, 0 frontmatter
errors; 98 codes, 116/116 mapped; manuscript unchanged at 62 scenes.

### Resolved: the rebuild was 2012, and there was an app before it (2026-10-31)

Shawn: *"actually it was in 2012. We had a web mobile app prior to that, And this
was one of the limitations.. The third party company that built the first app got
it to the app store but it didn't run worth a crap."*

**Everything fits now:**

| Year | What |
|---|---|
| **2011** | **FieldVisor Mobile** — the *first* app, third-party built. It **reached the App Store** but "didn't run worth a crap", and the 20 MB ceiling was one of its limitations. |
| **2012** | the **three-week in-house rebuild**, then 90 days keeping it alive |
| **2013** | the **Penn Virginia rollout** |

**And the 20 MB stops contradicting the record.** The App Store cellular cap was
20 MB from February 2010 until early 2012 — exactly the window the 2011 first app
and the 2012 rebuild occupy. His number was right and the published cap history
was right. The only error was mine: anchoring the mobile build to the rollout
year.

**The hypothesis I refused to adopt was directionally correct — and would still
have been wrong.** I had written that "the mobile build predates the 2013
rollout" would reconcile everything, and declined to adopt it. The direction was
right. The year I floated with it, 2011, was not; the answer is 2012. So adopting
my own tidy reconciliation would have produced a fourth wrong date on a hypothesis
whose *structure* was correct.

That is the strongest case in this log for asking rather than inferring: being
directionally right is not being right, and a confident near-miss is still a wrong
year in a published book.

**It also supports the App Store claim, with an honest shape.** The first app
reached the store in the 2011 era, which is consistent with his separate claim
that nothing in oil and gas was there before '11. The product that got there first
was the one that did not work — which is a better sentence than the boast.

Timeline: the 2011 event now says what that app actually was, a new **2012**
rebuild event was added (45 events), and every year-only age was re-checked
against year − 1980 — none inconsistent. The arc reads cleanly end to end:
Fielding starts 2009 → FieldVisor 2009 → full time 2010 → ScadaVisor 2010 →
Chuck dies Nov 2010 → FieldVisor Mobile 2011 → VisorBridge 2012 → the rebuild
2012 → Penn Virginia 2013 → Gulfport → exit March 2015.

**One wrinkle left, unasserted.** He first described the three weeks as "3 weeks
out… deliver it for public company", and Penn Virginia is that company — but the
build is 2012 and the rollout 2013. Most likely the mobile deliverable was due in
2012 with the enterprise rollout completing in 2013. Logged as a gap rather than
smoothed over, since smoothing is what went wrong four times today. Also logged:
whether the third-party firm should be named, which is a harder call than the
public companies — it built something that "didn't run worth a crap".

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces, 0 frontmatter
errors; 98 codes, 116/116 mapped; manuscript unchanged at 62 scenes.

### The third-party mobile firm stays generic (2026-10-31)

Shawn: **keep generic.** The company that built the first FieldVisor Mobile is not
to be named in published prose. Recorded as a resolved conflict on
`FIELD-CUSTOMERS`.

**The asymmetry with the customers is deliberate and worth stating.** Penn
Virginia, Gulfport and Harry Harpold were all cleared for print; this vendor is
not. Naming a customer is neutral — it says someone bought the software. Naming a
vendor next to "didn't run worth a crap" is an allegation about a business that
has no voice in this book and was not asked. Same decision, different stakes,
different answer.

The captures keep every detail he gave, verbatim, because that is what a capture
is for. **The constraint is on prose.**

One smaller question logged rather than decided: whether "a company out of Israel"
is itself generic enough for the page. Country plus project plus year is narrower
than it looks to anyone who was in oilfield software at the time, and "an offshore
development shop" carries the same meaning for a reader while identifying nobody.
His call, and lower stakes than the name itself.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces, 0 frontmatter
errors; 98 codes, 116/116 mapped; manuscript unchanged at 62 scenes.

### `_index.json` was non-deterministic — two bugs, found by a push collision (2026-10-31)

A push to `main` was rejected: a **GitHub Action** ("chore: regenerate index and
facts", 2026-11-01 00:04 UTC) had regenerated `_index.json` and rewritten
**1,254 of its lines**. Merging it conflicted. The conflict was worth more than
the inconvenience, because it exposed two real defects in `scan-stories.js`.

**Bug 1 — the sort key was filesystem state.** `stories.sort((a, b) =>
b.modified.localeCompare(a.modified))` ordered the index by **mtime**. A fresh CI
checkout sets every file's mtime to checkout time, so in CI the sort was
effectively arbitrary while locally it was real edit order. Same 114 pieces, two
different orderings, a ~1,250-line diff of pure noise, and a guaranteed conflict
every time CI and a laptop took turns. **Fixed:** sort by `file` path, the only
reproducible key. The one order-dependent consumer — `build-story-map.js` picking
an example row with `.find()` — now gets a stable example too, removing a second
churn source.

**Bug 2 — the `modified` field was wrong in CI, not just unstable.** It came from
`stats.mtime`, so the nightly Action recorded **all 114 pieces as modified on the
day it ran**. 112 of 114 values disagreed with the local tree. The field is
currently **write-only** — nothing in `web/`, `server.js`, `scripts/` or `tests/`
reads it — but CLAUDE.md lists "Recent edits on dashboard" as a Quick Win, and
wrong data is worse than none for a feature that is going to be built.
**Fixed:** `modified` now comes from **git** — the file's last commit date, via a
single `git log --name-only` pass for the whole corpus. Uncommitted files fall
back to mtime, which for them is the honest answer, and the whole thing is
wrapped so that a missing git, a shallow clone or no repository at all falls back
to mtime rather than failing.

**Proved rather than assumed.** Regenerating twice gives a byte-identical file;
`touch`-ing three tracked files and regenerating **still** gives the identical
file, where before it changed the hash. Verified it also runs with no `.git`
present at all. The working diff for this change is **16 lines** of
`_index.json`, against the 1,254 the Action produced.

Note for whoever reads the history: the Action's `cb912bf` and everything before
it carries the old mtime-derived dates, so `modified` values in commits before
today should not be trusted.

A scratch copy used for the no-git test is left at `/tmp/nogit-test` — removing
it needs your approval, since `/tmp` is one of this session's working
directories.

Verified: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces, 0 frontmatter
errors; 98 codes, 116/116 mapped; manuscript unchanged at 62 scenes.

### Kai removed (2026-10-31)

Shawn: "remove kai tools." Four things went, and one deliberately stayed.

**Removed:**

- `CLAUDE.md`'s `## Code Analysis` section, which told every agent to "prefer the
  Kai MCP tools (`kai_diff`, `kai_context`, `kai_callers`, `kai_callees`,
  `kai_impact`) over raw Read/Grep/git-diff". Those tools were not available in
  this session and the whole of today's work was done with Read, Grep and Bash —
  so the instruction was pointing agents at tooling they could not reach.
- `kai.modules.yaml` — an empty template (`modules: []`), referenced nowhere.
- `.github/workflows/kai-sync.yml` — ran on every push to `main`, installed Kai
  with `curl -sSL https://get.kaicontext.com | sh`, then `kai capture` and
  `kai push` using a `KAI_TOKEN` secret.
- the dead `.kai` line in `.gitignore`. No local `.kai` cache exists.

**Kept:** `.gstack/security-reports/2026-05-05-135924.json`, which is a **dated
audit artifact** and should not be edited. It is also the find of the day on this
task — that report had already flagged this exact workflow:

> **MEDIUM — curl | sh supply chain risk in CI workflow.** "The Kai sync workflow
> pipes a remote shell script directly to sh without verification… If
> get.kaicontext.com is compromised or DNS-hijacked, arbitrary code runs in the CI
> environment."

Its recommendation was to pin the installer and verify a checksum. **Deleting the
workflow resolves the finding outright**, which is the stronger remedy. That
workflow had been running on every push to `main`, including every push made
today.

**Two things for Shawn, neither of which can be done from here:**

1. **Revoke the `KAI_TOKEN` secret** in the GitHub repository settings. The
   workflow is gone, so nothing uses it, but the secret still exists and still
   grants whatever it granted.
2. Consider whether any Kai-side hosted graph of this repository should be
   deleted at kaicontext.com. Every push to `main` was captured there.

**Checked before removing:** `.github/workflows/deploy.yml`, not `kai-sync.yml`,
is what makes the nightly "chore: regenerate index and facts" commit — the
automation whose non-determinism was fixed an hour ago. It is untouched, as is
`deploy-site.yml`.

Verified after removal: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces, 0
frontmatter errors; 98 codes, 116/116 mapped.

### The determinism fix was incomplete — CI was shallow-cloning (2026-10-31)

A second push rejection, a second Action run, and a result worth reporting
honestly: the fix cut the churn from **1,254 lines to 150**, not to zero.

**Diagnosis.** Of the 114 pieces, **75 differed only in `modified`** and **zero
differed in any other field** — so the path-sort half of the fix worked exactly
as intended, and all remaining churn was the date. Cause:
`.github/workflows/deploy.yml` uses `actions/checkout@v4` with no `fetch-depth`,
which defaults to a **shallow clone of depth 1**. `scan-stories.js` now derives
`modified` from `git log`, and at depth 1 git log sees one commit — so every file
not touched by that single commit silently fell through to the mtime fallback,
which in CI is the checkout date.

The fallback I added for robustness was quietly masking the failure. It did its
job and hid the problem at the same time.

**Fixed:** `fetch-depth: 0` on that checkout, with the reason in a comment beside
it.

**Reproduced and then proved, in both directions:**

- `git clone --depth 1` of this repo → **1 commit visible**, and all 114 pieces
  dated `2026-10-31`, the checkout date. Exactly what CI was writing.
- full `git clone` → **257 commits visible**, and four real dates:
  `2026-10-27`, `2026-10-30`, `2026-10-31`, `2026-11-01`.

**And I should be straight about my own verification.** The previous entry said
"proved rather than assumed". What I actually proved was local determinism,
independence from mtime, and that it survives having no git at all. I did **not**
test a shallow clone — the single environment the bug lived in. The gap was that
I verified on my own machine rather than on the machine that caused the problem,
which is the same mistake in a different costume as the four wrong inferences
logged above.

Verified after the fix: 235 tests, 234 pass, 1 skipped, 0 fail; 114 pieces, 0
frontmatter errors; 98 codes, 116/116 mapped.
