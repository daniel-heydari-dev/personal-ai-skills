---
name: theme-factory
description: Apply professional color and font themes to presentations, slide decks, and visual artifacts. Use when the user asks to "apply a theme", "style this presentation", "change the look", or "make this more professional".
category: design
tags: [themes, design, presentations, colors, typography, slides]
source: https://github.com/anthropics/skills/tree/main/skills/theme-factory
---

# Skill: Theme Factory

Apply cohesive, professional color + typography themes to presentations and artifacts.

## When to Use

- User asks to "theme" or "style" a presentation or document
- User says "make this look more professional", "apply a color scheme"
- Creating any visual artifact that needs consistent styling

## Workflow

1. **Show theme options** — display the theme showcase
2. **User selects** — confirm their choice
3. **Apply consistently** — update all slides/sections with the theme

## Available Themes

| Theme | Primary | Accent | Mood |
|-------|---------|--------|------|
| **Ocean Depths** | `#0a2342` | `#00b4d8` | Professional, calm |
| **Sunset Boulevard** | `#2d1b69` | `#f77f00` | Creative, energetic |
| **Forest Canopy** | `#1a3a2a` | `#52b788` | Natural, trustworthy |
| **Modern Minimalist** | `#f8f9fa` | `#212529` | Clean, focused |
| **Golden Hour** | `#2c1810` | `#ffd700` | Premium, warm |
| **Arctic Frost** | `#e8f4f8` | `#0077b6` | Fresh, clear |
| **Desert Rose** | `#3d1a1a` | `#e07a5f` | Earthy, distinctive |
| **Tech Innovation** | `#0d1117` | `#58a6ff` | Technical, modern |
| **Botanical Garden** | `#1c2e1c` | `#a8c5a0` | Organic, sophisticated |
| **Midnight Galaxy** | `#0a0a1a` | `#7b2fff` | Bold, futuristic |

## Theme Structure

Each theme includes:
- Background color (primary)
- Text color (body + headings)
- Accent color (CTAs, highlights, bullets)
- Complementary font pairing (heading + body)
- Border/divider color

## Custom Theme Creation

When no preset fits:
1. Ask about the mood, audience, and industry
2. Generate a 5-color palette (background, surface, text, accent, muted)
3. Pair a display font with a body font
4. Name the theme and present for review
5. Apply after confirmation

## Application Rules

- ✅ DO: Apply theme to ALL elements — don't leave unstyled sections
- ✅ DO: Maintain readable contrast ratios (WCAG AA minimum)
- ✅ DO: Use the accent color sparingly — it should pop, not dominate
- ✅ DO: Keep font pairing to two typefaces maximum
- ❌ DON'T: Mix theme colors — stick to the defined palette
- ❌ DON'T: Apply different themes to different slides — consistency is the goal
- ❌ DON'T: Override with inline styles after theme application
