---
name: brand-guidelines
description: Apply consistent brand identity — colors, typography, and visual style — to any artifact. Use when the user asks to apply brand styling, use brand colors, or mentions "brand guidelines", "brand consistency", or "visual identity".
category: design
tags: [branding, design, colors, typography, visual-identity]
source: https://github.com/anthropics/skills/tree/main/skills/brand-guidelines
---

# Skill: Brand Guidelines

Apply consistent brand identity to artifacts — presentations, documents, code output, and UI components.

## When to Use

- User says "apply our brand", "use our brand colors", "make this on-brand"
- Creating presentations, documents, or visual artifacts
- User mentions a specific color palette or typography system

## Core Rules

- ✅ DO: Load brand colors from `.ai/context/brand.md` or ask the user for their palette
- ✅ DO: Apply typography consistently — one heading font, one body font
- ✅ DO: Use brand colors for primary actions, headings, and accents
- ✅ DO: Maintain sufficient contrast (WCAG AA minimum: 4.5:1 for text)
- ❌ DON'T: Mix too many accent colors — pick one per semantic role
- ❌ DON'T: Override the user's existing color variables without asking
- ❌ DON'T: Use system defaults (Arial, Times) when a brand font is specified

## Brand Configuration

If no brand config exists, prompt the user:

```
I need your brand colors to apply consistent styling. Please share:
1. Primary color (backgrounds, headers)
2. Accent color (CTAs, highlights)
3. Text color
4. Optional: font names for headings and body
```

Save responses to `.ai/context/brand.md` for future sessions.

## Implementation

### Color Application
```css
/* Use CSS variables for brand tokens */
:root {
  --brand-primary: #141413;    /* Dark backgrounds, primary text */
  --brand-accent:  #d97757;    /* CTAs, highlights, accents */
  --brand-text:    #f5f5f0;    /* Body text on dark */
  --brand-muted:   #8a8a82;    /* Secondary text, borders */
}
```

### Typography Pairing
```css
/* Headings: characterful display font */
h1, h2, h3 { font-family: 'Poppins', sans-serif; }

/* Body: readable serif or clean sans */
body { font-family: 'Lora', Georgia, serif; }
```

### Color Rotation for Multi-Accent Designs
Use accent colors in rotation when multiple visual elements need differentiation:
- Primary accent → CTAs and active states
- Secondary accent → Charts, data visualization
- Tertiary accent → Tags, badges, callouts

## Artifact Types

| Artifact | Apply |
|---------|-------|
| HTML/CSS | CSS variables in `:root`, update class names |
| Presentations | Slide master: background, headings, accent shapes |
| Documents | Heading styles, callout box colors |
| Charts | Dataset colors follow brand accent rotation |
