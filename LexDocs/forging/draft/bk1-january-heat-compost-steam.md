---
title: "Foundry - January Heat, Compost Steam"
arc: forging
status: draft
date_written: "2026-01-04"
themes: [resilience, farm, systems-thinking, startup, technology]
---

# Foundry - January Heat, Compost Steam

## The low‑tech experiment that made me trust the trend, not the spike.

January bit the air. The greenhouse smelled like wet soil and tomato vine. Outside, the wind had teeth. Inside, a faint ribbon of steam lifted off a compost windrow we’d plumbed with simple PEX—poor man’s heat exchanger feeding a water loop under seed benches.

The sensor ticked up—58°F, 62°, 68°. We grinned. A pile of biology was paying our heat bill.

Then, two hours later, the magic died. Temperature plunged, rose, stalled, lied. The next morning it “worked” at 4 a.m., failed at noon, worked again after sunset. The plants looked fine; the graph looked drunk.

We found the culprit: not compost, calibration. One cheap probe with a bias. Another with lag. A third near the edge of the pile reading more wind than heat. Spikes felt like victory until a week of mean values told the truth.

We did three things. We **moved the sensors** to where the physics lived, not where the cable reached. We **averaged across redundancy** —three imperfect sensors are better than one heroic liar. And we **set rules** : harvest shifts, not spikes. Adjusting heat on spike data is gambling; on trend data it’s farming.

AI earns its keep at that seam. We train a tiny local model to learn “normal” compost thermal curves. It flags drift slowly and ignores drama. The agent fuses readings, discounts the outlier, and asks for human eyes before it takes any action that matters. If clouds cut solar, it nudges the generator schedule. If battery SOC dips too low, it pauses noncritical loads. Small, local, traceable.

We built for drift elsewhere too. pH sensors age. Flow meters sulk after grit. We treat instruments like livestock—they need checking, feed, water, and to be kept out of trouble. AI doesn’t replace that; it reminds us before neglect turns expensive.

A week later, the graph was boring. The beds stayed warm. Boring is how you win winters.

The lesson wasn’t “compost heat works.” It was “don’t let first spikes name the project.” That applies to everything we run—microgrids, teams, budgets, stress. A good trend is humility made visible.

_Rule: Trust the trend; calibrate your instruments; design for drift._

## **AI Playbook — Sensor Fusion Starter**

**Purpose:** Make small systems resilient by smoothing lies and acting on signal.

**Prompt:** “List 3 critical variables I measure (e.g., temp, pH, flow). For each: (1) map all sensor locations and failure modes, (2) define a fused metric (e.g., trimmed mean) and a minimum sensor quorum, (3) set two thresholds—‘nudge’ and ‘page,’ (4) write a local‑first rule that requires human acknowledgment before actuation, (5) schedule a weekly calibration ritual with a printable checklist.”

**Constraints:**

- No single sensor is a king.

- Local storage of raw data (no cloud required).

- Any auto‑actuation must roll back on operator “No.”

**Image Prompts**

1. **Header:** “Night greenhouse in winter; faint steam rising from a compost windrow; warm interior glow against cold blue outside; cinematic documentary realism.”

2. **Inline (close‑up):** “Gloved hand holding a temperature probe inserted into compost; small handheld display showing stable reading; moisture on the probe; macro detail.”

_Tags: memoir, AI, startups, farming, energy, leadership, resilience_

