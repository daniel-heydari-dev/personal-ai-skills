---
name: frontend-design
description: Create distinctive, production-grade web interfaces with high design quality — committing to a bold aesthetic before writing code. Use when building UI components, pages, dashboards, or full web applications where design quality matters.
category: design
tags: [frontend, design, ui, css, react, aesthetics, typography, anti-ai-slop]
source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
---

# Skill: Frontend Design

Build web interfaces that look intentionally crafted — not AI-generated. Commit to a bold aesthetic direction before writing a single line of CSS.

## When to Use

- Building UI components, pages, dashboards, landing pages
- User mentions design quality, "make it look good", "distinctive UI"
- Any frontend work where visual output matters

## Step 0: Aesthetic Direction (Always First)

Before writing code, choose and state your aesthetic:

| Direction | Characteristics |
|-----------|----------------|
| **Brutalist Minimalist** | Raw grids, mono fonts, high contrast, no decoration |
| **Editorial** | Magazine-style, large type, dramatic whitespace |
| **Retro-Futuristic** | CRT effects, terminal fonts, neon on dark |
| **Luxury** | Serif headings, gold accents, generous spacing |
| **Organic** | Flowing shapes, natural textures, earth tones |
| **Maximalist** | Layered elements, pattern mixing, visual density |

> The aesthetic direction is a commitment — half-measures produce generic AI output.

## Anti-Generic Rules

❌ **Never default to these:**
- Inter / Roboto / system-ui as the heading font
- Purple or teal as the accent color
- `border-radius: 0.75rem` on every element uniformly
- Centered layout with symmetric padding throughout
- Blue CTA buttons with white text
- Floating white cards with `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`

✅ **Do this instead:**
```css
/* Commit to a character */
--font-display: 'Playfair Display', Georgia, serif;  /* not Inter */
--color-accent: #c2410c;   /* not purple/teal */
--radius-base: 2px;        /* sharp, intentional */

/* Break the grid deliberately */
.hero { margin-left: -5vw; width: 110vw; }

/* Typography contrast */
.headline { font-size: clamp(3rem, 8vw, 7rem); font-weight: 900; }
.subtext  { font-size: 0.875rem; font-weight: 300; letter-spacing: 0.15em; }
```

## Design System

### Typography
```css
/* Display: large, expressive, personality */
h1, .display { font-family: var(--font-display); }

/* Body: readable, secondary to display */
body { font-family: var(--font-body); font-size: 1rem; line-height: 1.6; }

/* Mono: code, data, technical */
code, .data { font-family: 'JetBrains Mono', monospace; }
```

### Color Tokens
```css
:root {
  --bg:       #0f0f0f;  /* background */
  --surface:  #1a1a1a;  /* cards, panels */
  --text:     #f0ece4;  /* body text */
  --muted:    #6b6b6b;  /* secondary text */
  --accent:   #e84855;  /* primary action color */
  --accent-2: #ffd166;  /* data visualization, tags */
}
```

### Spatial Composition
- Use asymmetry intentionally — offset grids, overlapping elements
- Negative space is a design element, not wasted space
- Break out of the container on full-bleed sections
- Layer z-index deliberately for depth

### Motion
```css
/* Entry: staggered reveal, not all at once */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}
.card:nth-child(1) { animation: slide-up 0.4s 0.1s both; }
.card:nth-child(2) { animation: slide-up 0.4s 0.2s both; }
```

## Rules

- ✅ DO: State the aesthetic direction before any code
- ✅ DO: Match code complexity to the vision (maximalist → elaborate, minimalist → restrained)
- ✅ DO: Use CSS custom properties for all design tokens
- ✅ DO: Test at multiple viewport sizes — responsive by default
- ❌ DON'T: Mix aesthetic directions — commit fully or redesign
- ❌ DON'T: Use more than 2 display fonts + 1 body font
- ❌ DON'T: Add animations to every interactive element — use restraint
