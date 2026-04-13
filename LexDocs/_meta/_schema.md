# Frontmatter Schema for Book Writing System

All story files in LexDocs should include this YAML frontmatter at the top of the file.

## Required Fields

```yaml
---
title: "Story Title"
arc: forged                    # forged | fractured | forging | foundry
status: draft                  # idea | draft | ready | published | expanded
---
```

## Full Schema

```yaml
---
title: "Rolling Ohio Hills"
arc: forged                    # forged | fractured | forging | foundry
status: published              # idea | draft | ready | published | expanded
medium_url: ""                 # URL when published to Medium
date_event: "1990-10-29"       # When the event happened (YYYY-MM-DD or YYYY)
date_written: "2024-09-28"     # When piece was written
themes:                        # Key themes in this piece
  - accident
  - resilience
  - father
people:                        # People mentioned/featured
  - Chuck Cutter
  - CJ
locations:                     # Locations in the story
  - West Salem farm
  - hospital
related_to:                    # Links to related pieces (filenames)
  - bk1-scars-as-data.md
word_count: 1200               # Approximate word count
---
```

## Arc Definitions

| Arc | Core Question | Emotional Gear |
|-----|---------------|----------------|
| **forged** | What does brutality + love look like on a dairy farm? | Cinematic, sensory, claustrophobic |
| **fractured** | How do you rebuild when faith, body, & identity crack? | Philosophical, darker introspection |
| **forging** | How do you weaponize trauma into companies & pilots' wings? | Strategic, Feynman-style explainer |
| **foundry** | What legacy melts pain into service? | Uplifting, mentor-to-reader tone |

## Status Definitions

| Status | Description |
|--------|-------------|
| **idea** | Seed concept, rough notes, not yet drafted |
| **draft** | Being written, not ready for review |
| **ready** | Draft complete, ready for Medium publication |
| **published** | Live on Medium (set medium_url) |
| **expanded** | Has been expanded into book chapter form |

## Theme Vocabulary (Suggested)

Core themes to use consistently:
- `resilience` - bouncing back, recovery
- `father` - Chuck Cutter, paternal relationship
- `accident` - the 1990 car/ATV incident
- `surgeries` - medical journey, 40 surgeries
- `farm` - rural life, farm work
- `systems-thinking` - Feynman-style analysis
- `startup` - entrepreneurship, Fielding Systems
- `faith` - religion, loss of faith
- `depression` - mental health struggles
- `family` - siblings, mother, extended family
- `technology` - tech career, innovation
- `energiacres` - current venture
- `work-ethic` - hard work, discipline
- `identity` - self-discovery, becoming
