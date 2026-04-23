---
name: design-sprint
description: Run a compressed Google Ventures Design Sprint — map the problem, sketch solutions, decide, prototype, and test — all within a single session or across 5 focused phases. Use when the user says "design sprint", "how should we approach this feature", "we need to validate this idea", or has a high-stakes design decision to make.
category: design
tags: [design-sprint, product, ux, prototyping, validation, decision-making, gv-sprint]
---

# Skill: Design Sprint

A 5-phase compressed sprint based on the Google Ventures Sprint methodology. Produces a testable prototype and a clear go/no-go decision by the end.

## When to Run a Sprint

A design sprint is right when:
- ✅ A critical question needs answering before building
- ✅ A feature has multiple viable directions and no clear winner
- ✅ You're starting a new product or major pivot
- ✅ A design decision has high stakes (costs weeks of engineering if wrong)

Skip the sprint when:
- ❌ The answer is already known — just build it
- ❌ No real users exist to test with
- ❌ The problem isn't defined enough to prototype

---

## Phase 1: MAP (Day 1 — Understand & Define)

**Goal:** Agree on the long-term goal and map the user journey.

### Long-Term Goal
One sentence: "In two years, [product] will [outcome] for [user]."

### Sprint Question
The critical question this sprint must answer: "Can [user] accomplish [task] without [specific friction]?"

### User Journey Map

```
[User] → Trigger → Step 1 → Step 2 → Step 3 → Goal achieved
                    ↓         ↓
                  Pain?     Pain?
```

Mark the "target moment" — the one step that matters most. The sprint focuses here.

**Output:** A whiteboard-style map with the target step circled.

---

## Phase 2: SKETCH (Day 2 — Solutions)

**Goal:** Generate diverse solutions, individually, before group discussion.

### Four-Step Sketch Process

1. **Notes** (20 min) — Walk the map silently. Capture existing ideas, inspiration, problems.
2. **Ideas** (20 min) — Rough doodles, mind maps — no editing, no filters.
3. **Crazy 8s** (8 min) — Fold paper into 8 panels. Sketch 8 variations of your best idea. One per panel.
4. **Solution sketch** (30 min) — A 3-panel storyboard showing the user's experience at the target step.

**Rules:**
- Work alone, not in a group
- Self-explanatory — your sketch must communicate without explanation
- Ugly is fine; clear is required

**Output:** One 3-panel storyboard per participant.

---

## Phase 3: DECIDE (Day 3 — Choose One Direction)

**Goal:** Pick the single best solution to prototype.

### Heat Map Vote

1. Give each participant dot stickers
2. Everyone reads all sketches silently
3. Place dots on parts you find most interesting (no discussion yet)
4. Dot clusters reveal consensus

### Structured Critique (15 min)

Present each sketch with the "note-and-vote" method:
- Facilitator narrates what they see (not what author intended)
- Authors stay silent while their sketch is critiqued
- One question per participant, answered by author only at the end

### Supervote

The Decider (product owner / CEO / PM) places 3 large dots. Their vote wins — this is not consensus, it's a decision.

**Output:** One chosen solution sketch. Rumbles (conflicts worth testing) noted.

---

## Phase 4: PROTOTYPE (Day 4 — Build the Facade)

**Goal:** Build just enough to test — not a real product, a realistic-looking facade.

### Prototype Principles

- **Goldilocks quality**: Too rough → testers react to quality, not idea. Too polished → testers don't give honest feedback.
- **Only the target moment**: Don't build the full product. Build from entry to the target step + 2 steps after.
- **Fake everything**: Hardcode data. Skip auth. Use Lorem Ipsum outside the critical path.

### Tools by Fidelity

| Fidelity | Tool | When |
|---------|------|------|
| Paper | Photos + Keynote | Fastest, earliest stage |
| Lo-fi clickable | Figma / Balsamiq | Most common |
| Hi-fi web | HTML + CSS | When visual design matters |
| Real prototype | React + mock API | When interactions are the product |

### Storyboard → Prototype

Break the chosen sketch into screens:
```
Screen 1 → Screen 2 → Screen 3 → [success state]
           (target)
```

Each screen is one "beat" — one action, one response.

**Output:** Clickable prototype covering the critical path only.

---

## Phase 5: TEST (Day 5 — Interview Real Users)

**Goal:** Learn from 5 users whether the prototype solves the problem.

### Recruiting

5 users minimum — patterns emerge by the 4th or 5th interview. Any fewer = noise.

### Interview Structure (60 min each)

```
1. Warm-up (5 min)    — Background, context, current behavior
2. Setup (5 min)      — Explain the test, give permission to be honest
3. Tasks (40 min)     — Watch them use the prototype unguided
4. Debrief (10 min)   — What did you expect? What confused you?
```

**Golden rule:** Don't help. Don't explain. Say "What would you do next?" when they get stuck.

### Note-Taking

Use a 2x2 grid per user:
```
| Positive reaction | Negative reaction |
|-------------------|-------------------|
| Quote / behavior  | Quote / behavior  |
```

After 5 interviews, cluster patterns:
- 🟢 Things that worked (3+ users)
- 🔴 Things that failed (3+ users)
- 🟡 Unclear (split reactions)

### Sprint Verdict

| Outcome | Decision |
|---------|---------|
| 5/5 users succeeded | Ship it |
| 3–4/5 succeeded | Iterate, re-test key failures |
| 0–2/5 succeeded | Pivot or abandon this direction |

---

## Compressed Sprint (1 session)

When you can't spend 5 days:

```
30 min — Map + Sprint Question
45 min — Sketch (skip Crazy 8s, go straight to 3-panel)
20 min — Vote + Decide
90 min — Prototype (paper or Figma lo-fi)
60 min — Test with 3 users (internal if external unavailable)
```

**Output:** Prototype + verdict with 3 data points.

## Rules

- ✅ DO: Commit to the decider role — no consensus, one person decides
- ✅ DO: Test with real users — internal team testing is not a sprint
- ✅ DO: Time-box every phase — open-ended → scope creep
- ✅ DO: Prototype only the critical path — nothing else
- ❌ DON'T: Skip the map phase — a sprint without a target step is unfocused
- ❌ DON'T: Help users during testing — let them struggle, that's the data
- ❌ DON'T: Build a real product in phase 4 — it's a facade
- ❌ DON'T: Require consensus in phase 3 — decisions need a decider, not a committee
