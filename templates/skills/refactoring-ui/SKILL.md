---
name: refactoring-ui
description: Audit and fix UI visual hierarchy, spacing, color, and typography using Refactoring UI principles. Use when the user asks to "improve the UI", "make this look better", "audit the design", "fix the hierarchy", or when reviewing a screenshot or design file.
category: design
tags: [ui, design, refactoring, hierarchy, spacing, color, typography, visual-design]
---

# Skill: Refactoring UI

Audit existing UI and produce a prioritized list of visual fixes — hierarchy, spacing, color, and typography. Based on Refactoring UI by Adam Wathan & Steve Schoger.

## Audit Process

When reviewing a UI (screenshot, code, or description), evaluate in this order:

### 1. Visual Hierarchy

Everything on the page is shouting at the same volume. The audit question: **what is the ONE thing the user must do or understand first?**

Common hierarchy problems:

| Problem | Fix |
|---------|-----|
| All text same size | Create 3 levels: primary (18–24px bold), secondary (14–16px regular), tertiary (12–13px muted) |
| Labels compete with values | Mute labels (60% opacity or lighter color); bold the values |
| CTA buried in form | Raise contrast, increase padding, move to visual center |
| Everything center-aligned | Left-align body content; center only hero text |
| All elements same weight | Use `font-weight: 700` for one thing per screen section |

```css
/* Three-level hierarchy */
.primary   { font-size: 1.25rem; font-weight: 700; color: #111; }
.secondary { font-size: 0.9375rem; font-weight: 400; color: #374151; }
.tertiary  { font-size: 0.8125rem; font-weight: 400; color: #9ca3af; }
```

### 2. Spacing & Density

Too much or too little whitespace destroys usability. Use a spacing scale — never arbitrary values.

**The spacing scale (8px base):**
```
4px  — micro gaps (icon to label)
8px  — tight (list items)
12px — compact (form fields)
16px — default (section padding)
24px — comfortable (card padding)
32px — section separation
48px — major section breaks
64px+ — hero / full-bleed separation
```

Common spacing fixes:
- ❌ `padding: 10px 15px` → ✅ `padding: 12px 16px`
- ❌ `margin-bottom: 7px` → ✅ `margin-bottom: 8px`
- ❌ Same spacing between all elements → ✅ Group related items tightly, separate groups generously

### 3. Color

**The color audit:**

```
Primary (brand action color)  → used for ONE type of element only
Neutral (grays)               → 5–7 shades from near-white to near-black
Semantic (green/red/yellow)   → success / error / warning only
Accent                        → max 1, use sparingly
```

**Don't use gray text on colored backgrounds** — it goes muddy:
```css
/* ❌ Bad: gray on blue */
background: #1d4ed8; color: #9ca3af;

/* ✅ Good: transparent white on blue */
background: #1d4ed8; color: rgba(255,255,255,0.75);
```

**The saturation trick** — colored shadows, not gray:
```css
/* ❌ Generic */
box-shadow: 0 4px 12px rgba(0,0,0,0.15);

/* ✅ On-brand */
box-shadow: 0 4px 12px rgba(29, 78, 216, 0.25);
```

### 4. Typography

**The 4 rules:**
1. **2 fonts max** — one for headings, one for body (often one is enough)
2. **Line height** — `1.5` for body, `1.2` for headings, `1.7` for long-form reading
3. **Line length** — 45–75 characters per line (set `max-width: 65ch`)
4. **Optical size** — small text needs letter-spacing; large text needs negative tracking

```css
/* ❌ Default browser rendering */
h1 { font-size: 32px; }
p  { font-size: 16px; line-height: 1; }

/* ✅ Typographically correct */
h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; }
p  { font-size: 1rem; line-height: 1.6; max-width: 65ch; }
small { font-size: 0.8125rem; letter-spacing: 0.01em; }
```

### 5. Borders & Shadows

Borders and shadows signal depth. Use them to create layers, not decoration.

```
Elevation levels:
  0 → flat (no shadow, no border)
  1 → subtle (0 1px 3px rgba(0,0,0,.12)) — cards on white bg
  2 → raised (0 4px 12px rgba(0,0,0,.15)) — modals, dropdowns
  3 → floating (0 20px 60px rgba(0,0,0,.20)) — tooltips, toasts
```

**Remove unnecessary borders first** — if two backgrounds have enough contrast, the border is noise.

## Severity Scoring

Rate each issue:

| Score | Severity | Example |
|-------|---------|---------|
| 🔴 P0 | Broken | CTA invisible, form unusable |
| 🟠 P1 | High | Hierarchy flat, primary action not obvious |
| 🟡 P2 | Medium | Spacing inconsistent, color muddy |
| 🟢 P3 | Low | Minor typography polish, icon alignment |

## Output Format

For each audit, produce:

```
## UI Audit — [Component/Screen Name]

### 🔴 P0 — [Issue]
Current: [what it is]
Fix: [exact CSS or instruction]

### 🟠 P1 — [Issue]
...
```

Always include code snippets for each fix, not just descriptions.
