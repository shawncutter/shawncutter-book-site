# `_inbox/` — Raw notes waiting to be routed

This folder holds **unprocessed source material**: voice memo transcripts, stray thoughts, conversation scraps, and anything else that might belong in the book but hasn't found its home yet.

## Why this exists

Capture is one decision. Routing is another. If you force yourself to decide "which story does this belong to?" at the moment you dump a transcript, you'll either:
- Spend 20 minutes making a filing decision before you've thought, or
- Skip capturing it altogether.

The inbox removes that friction. Dump first. Route later.

## Flow

```
Voice memo / note
      ↓
  _inbox/YYYY-MM-DD-slug.md       ← capture (raw, unedited)
      ↓
  /integrate-note <file>           ← slash command proposes routing
      ↓
  Fragments split to:
    • NEW story      → foundry/draft/bk1-whatever.md   (new file)
    • MERGE existing → foundry/draft/bk1-existing.md   (add/replace paragraphs)
    • RESERVE        → stays here, marked for future prompt
      ↓
  Inbox note frontmatter updated with routing + status
  Destination stories get `source_notes:` frontmatter pointing back here
```

Every routed fragment leaves a trail in both directions. You can always answer: *"Which voice memo informed this paragraph?"* and *"Where did this voice memo end up?"*

## File naming

```
YYYY-MM-DD-short-slug.md
```

Examples:
- `2026-04-14-the-fork-awareness.md`
- `2026-03-16-anguilla-morning-1.md`
- `2026-04-21-chuck-dream.md`

Keep slugs short. They're handles, not titles.

## Frontmatter schema

```yaml
---
captured: "2026-04-14"                  # date note was recorded/written
captured_time: "22:00"                  # optional, local time
source: voice-memo                      # voice-memo | text-note | conversation | email | other
session: "the-fork-awareness"           # slug matching filename
status: unprocessed                     # unprocessed | routed | integrated | archived
arc_hint: [foundry]                     # likely arc(s) — best guess, can be multiple
themes: [emotional-wall, family]        # free-form tags
fragments:
  - id: fragment-slug                   # short handle for this thread
    summary: "One-line description"
    status: unrouted                    # unrouted | routed | reserved | dropped
    routed_to: null                     # relative path to destination story, once routed
    reserved_for: null                  # e.g. "faith-gap piece" if status=reserved
---

[Raw transcript below the frontmatter. Do not edit. Do not clean up filler words.
If you want a cleaned version, that's what the routed story becomes.]
```

## Status lifecycle

| Status | Meaning |
|--------|---------|
| `unprocessed` | Dropped in inbox, not yet analyzed |
| `routed` | `/integrate-note` has proposed a plan; fragments have targets |
| `integrated` | All non-reserved fragments have been written into destination stories |
| `archived` | Fully absorbed; kept for provenance but no longer active |

An inbox note with some `reserved` fragments can still be `integrated` — reserved just means "intentionally held back for a future piece."

## Provenance in destination stories

When a fragment routes into a story, the destination gets a `source_notes` frontmatter field:

```yaml
---
title: "The Fork I Almost Missed"
arc: foundry
status: draft
source_notes:
  - _inbox/2026-04-14-the-fork-awareness.md#fork-decision
  - _inbox/2026-04-14-the-fork-awareness.md#counterfactual-regret
---
```

The `#fragment-id` suffix points to a specific thread inside the note, so multiple stories can share one inbox note without ambiguity.

## Commands

- `/integrate-note <path>` — analyze an inbox note and propose a routing plan
- `/inbox` — list all inbox notes and their current status

## Rule of thumb

> Route in days, not months. Notes that sit in the inbox past 30 days are either (a) waiting for a prompt that doesn't exist yet, or (b) actually cut material. Either way, decide — don't let them rot.
