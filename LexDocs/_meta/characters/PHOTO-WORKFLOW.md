# Photo Processing Workflow — P2L Characters

## Quick Start
1. Drop photos into the right character folder under `photos/`
2. Tell Claude: **"process the character photos"**
3. Claude reads each image, extracts physical descriptions, and updates `characters.json`

## Auto-Add Rule
**Any time a NEW folder is created under `photos/`, that character is automatically added to:**
- `characters.json` (new entry with placeholder fields + photo extraction)
- `CHARACTER-LIST.md` (new section with ⚠️ flags for missing info)

This means: just creating `photos/new_person_name/` is enough to register them as a character. Claude will prompt for relationship/arc context on first encounter.

## What Claude Extracts Per Photo

For each image, Claude generates:

```json
{
  "filename": "chuck-1985-oilfield.jpg",
  "era": "mid-1980s, approximately age 29-30",
  "physical": {
    "height_estimate": "5'10\"-6'0\" based on proportions relative to truck",
    "build": "Stocky, working-man build. Thick forearms.",
    "hair": "Dark brown, kept short. No hat in this photo.",
    "face": "Square jaw, deep-set eyes. Weathered skin — outdoor worker.",
    "distinguishing_features": "Thick hands. Wedding band on left hand.",
    "expression_energy": "Not smiling but not stern. Resting competence.",
    "clothing_style": "Carhartt jacket, work boots, jeans. Utility, not fashion.",
    "posture": "Shoulders back, weight on heels. Owns the ground he's on."
  },
  "setting": "Next to a Cutter Oil truck, gravel yard, winter",
  "writer_details": "The kind of man whose hands tell you everything before he opens his mouth. Grease under the nails that soap gave up on. Jacket zipped exactly halfway — too busy to finish, too practical to leave it open."
}
```

## What Gets Updated

1. **`characters.json`** → `physical` block gets populated with composite description from ALL photos
2. **`physical.photos[]`** → array of individual photo analyses
3. **`physical.photo_extracted`** → flips to `true`
4. **`physical.description`** → composite narrative description for use in writing

## The Composite Description

When multiple photos exist (different eras), Claude creates a composite like:

> "Chuck Cutter in his thirties was built like the trucks he drove — square, solid, nothing wasted. 5'10\" with hands that could palm a basketball or crack a walnut. Dark brown hair kept short, face weathered from years of Ohio winters and oilfield sun. By his fifties, the edges had softened slightly — the jaw still square but the eyes warmer, the shoulders still broad but carrying something heavier than pipe."

This composite becomes the **canonical physical description** used across all writing.

## Multiple Era Photos = Character Arc

| Photo Era | What It Shows |
|---|---|
| Childhood/teens | Who they were BEFORE the story shaped them |
| 20s-30s | Prime years — the version doing the thing |
| 40s-50s | The version that got weathered by the story |
| Recent | Who they became |

For Chuck, a photo from 1985 and 2008 would show the "softening" — confirming what Shawn described.

## Tips for Best Results

- **Candid > posed** — reveals body language, natural posture
- **Full body when possible** — height/build estimates need proportion context
- **Include context** — a photo of Chuck next to his truck tells more than a headshot
- **Label group photos** — "Chuck is on the left, CJ center, Shawn right"
- **Include old photos** — scanned prints, polaroids, whatever you have
- **Phone photos of printed photos work** — just get the image to Claude

## Character Priority for Photos

| Priority | Character | Why |
|---|---|---|
| 🔴 Critical | Chuck | Most-referenced character, no description exists |
| 🔴 Critical | Beth | Her portrait piece ("The Yard") needs physical grounding |
| 🔴 Critical | Shawn (childhood + now) | Protagonist — readers need to see him |
| 🟡 High | Carina | Key character from Forging onward |
| 🟡 High | CJ | Shared bedroom, the fighting — need size contrast |
| 🟡 High | Gia | Legacy thread — what does she look like? |
| 🟢 Medium | Jeff Taton | The garage, the build years |
| 🟢 Medium | Sasha Nelson | "The One Resource" piece needs him |
| ⚪ When available | Everyone else | Any photo adds dimension |
