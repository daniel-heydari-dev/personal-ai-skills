---
name: canvas-design
description: Create original, museum-quality visual art as PDF or PNG artifacts — establishing a design philosophy first, then expressing it visually. Use when the user asks for "visual design", "create art", "make a poster", "design a canvas", or wants a downloadable visual artifact.
category: design
tags: [design, art, canvas, pdf, png, visual, poster, typography]
source: https://github.com/anthropics/skills/tree/main/skills/canvas-design
---

# Skill: Canvas Design

Create original visual artifacts (PDF or PNG) with museum-quality craftsmanship — starting from a design philosophy, not from code.

## When to Use

- User asks for a poster, visual, infographic, or downloadable design artifact
- User says "create art", "design a canvas", "make a visual"
- Creating a presentation title slide or hero image

## Two-Phase Process

### Phase 1: Design Philosophy (always first)

Write a 4–6 paragraph aesthetic manifesto before touching code:

- Define the **movement** this piece belongs to (e.g., Swiss grid, brutalist, Art Deco, Bauhaus, organic chaos)
- Articulate **spatial logic** — how space is divided and what that communicates
- Describe **color logic** — why these specific hues, what mood they create
- Define **typographic role** — text as form, not explanation

> The philosophy is the design. The code just executes it.

### Phase 2: Canvas Expression

Using the philosophy as foundation, create the artifact with:
- **90% visual / 10% text** — typography is a design element, not explanatory prose
- Every choice deliberate: margins, spacing, weight contrast, alignment
- Conceptual depth: subtle references that reward sustained attention
- "Painstaking attention to detail" — the kind that takes a professional hours

## Quality Standards

- ✅ DO: Think museum/magazine quality — never amateur or cartoony
- ✅ DO: Treat text as visual form — size, weight, position before legibility
- ✅ DO: Use negative space as an active design element
- ✅ DO: Create something that couldn't be AI-generated at first glance
- ❌ DON'T: Center everything with equal padding — that's default, not design
- ❌ DON'T: Use generic color palettes (muted blue-gray, "clean" white)
- ❌ DON'T: Add decorative elements that don't serve the concept

## Implementation

```python
# PDF generation with reportlab
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor

c = canvas.Canvas("output.pdf", pagesize=A4)
# ... design implementation follows philosophy
c.save()
```

```python
# PNG generation with Pillow
from PIL import Image, ImageDraw, ImageFont
img = Image.new("RGB", (2480, 3508), color=HexColor("#141413"))
draw = ImageDraw.Draw(img)
# ... design implementation
img.save("output.png", dpi=(300, 300))
```

## Output

A downloadable PDF or PNG file reflecting the design philosophy — shown to the user alongside the philosophy document.
