---
name: algorithmic-art
description: Generate creative computational art through p5.js — seeded, parametric, and interactive. Use when the user asks for "generative art", "algorithmic art", "p5.js sketch", "procedural art", "creative coding", or wants a visual artifact powered by code.
category: design
tags: [generative-art, p5js, creative-coding, algorithmic, procedural, visual, interactive]
source: https://github.com/anthropics/skills/tree/main/skills/algorithmic-art
---

# Skill: Algorithmic Art

Generate meticulous, seeded, parametric generative art via p5.js — output is a single self-contained HTML file.

## Three-Phase Process

### Phase 1: Algorithmic Philosophy (4–6 paragraphs)

Write the philosophy before any code. It must articulate:

- The **mathematical/natural law** governing the system
- The **noise or randomness strategy** — Perlin noise, simplex, seeded random
- The **emergent behavior** — what the system becomes over time
- The **parametric handles** — what the user can control

Philosophy examples:
| Name | Core Idea |
|------|-----------|
| **Organic Turbulence** | Flow fields + Perlin noise; particle trails → density maps |
| **Quantum Harmonics** | Phase-valued particles; constructive/destructive interference |
| **Recursive Whispers** | Golden ratio branching; self-similarity across scales |
| **Field Dynamics** | Vector fields made visible; particles seek equilibrium |
| **Stochastic Crystallization** | Voronoi + relaxation; chaos crystallizes into order |

### Phase 2: Conceptual Deduction

Find one **subtle embedded reference** — not announced, just present. Like a jazz musician quoting another song through harmonic structure. Those who know, know.

### Phase 3: p5.js Implementation

#### Seeded Randomness (always)
```javascript
let seed = 12345;
function setup() {
  randomSeed(seed);
  noiseSeed(seed);
  // same seed = identical output, every time
}
```

#### Parameter Design
Ask: "What qualities of this system can be adjusted?" — not "which patterns exist?"

Good parameters control:
- **Quantities**: particle count, branch depth
- **Scales**: speed, magnitude, size multipliers
- **Probabilities**: threshold for behavioral change
- **Ratios**: golden ratio variation, symmetry factor
- **Thresholds**: at what density does clustering begin?

#### Required Interactive Features

```
Sidebar layout (fixed):
  SEED    → display + Prev / Next / Random / Jump
  PARAMS  → your custom sliders and inputs
  COLORS  → color pickers (omit if fixed palette)
  ACTIONS → Regenerate / Reset / Download PNG
```

#### Artifact Rules
- Self-contained HTML — no external files
- p5.js from CDN only (single external dep)
- All CSS, JS, controls inline
- Works immediately in Claude artifact viewer

## Craftsmanship Standards

Every implementation must feel hand-refined:

- ✅ DO: Thoughtful color palettes — not randomized RGB
- ✅ DO: Visual hierarchy within randomness (foreground / midground / background)
- ✅ DO: Smooth performance — optimize for 60fps if animated
- ✅ DO: Identical seeds produce identical outputs (test this)
- ❌ DON'T: Use default p5 colors (no `fill(random(255))`)
- ❌ DON'T: Animate everything — stillness is a design choice
- ❌ DON'T: Copy existing generative artists' signatures (create original thinking)
- ❌ DON'T: Skip the philosophy — it's where the quality comes from

## Quick Reference: p5.js Patterns

```javascript
// Flow field
let angle = noise(x * scale, y * scale, t) * TWO_PI * 2;
let v = p5.Vector.fromAngle(angle);
particle.add(v);

// Perlin noise terrain
for (let x = 0; x < cols; x++) {
  for (let y = 0; y < rows; y++) {
    let h = noise(x * 0.1, y * 0.1, t * 0.01) * 200;
  }
}

// Seeded palette
randomSeed(seed);
let palette = [
  color(random(50, 100), random(100, 180), random(150, 220)),
  // ...
];
```
