---
name: web-artifacts-builder
description: Build elaborate, multi-component HTML artifacts using React, TypeScript, Tailwind CSS, and shadcn/ui — bundled into a single self-contained HTML file. Use when the user asks to "build an artifact", "create an interactive demo", "make a dashboard", or "build a web app" for Claude.ai.
category: design
tags: [artifacts, react, tailwind, shadcn, html, frontend, claude-ai]
source: https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
---

# Skill: Web Artifacts Builder

Build elaborate, production-grade HTML artifacts for Claude.ai using React 18, TypeScript, Tailwind CSS, and shadcn/ui — all bundled into a single self-contained HTML file.

## When to Use

- User asks to build a dashboard, interactive tool, or visual demo for Claude.ai
- User says "make an artifact", "create a web app", "build a UI"
- Prototyping a component or page with real interactivity

## Tech Stack

- **React 18** + **TypeScript** + **Vite** — component architecture
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — 40+ pre-installed components
- **Parcel** — bundles everything into one HTML file

## Anti-AI-Slop Rules

❌ **Never use these defaults** — they mark output as generic AI:
- Purple/indigo gradients as primary colors
- Every element uniformly rounded (border-radius: 9999px)
- Inter font for everything
- Centered-everything layout with no spatial variation
- Floating cards with excessive shadow

✅ **Do this instead:**
- Commit to a specific aesthetic (brutalist, editorial, luxury, retro-tech, organic)
- Mix font weights aggressively — ultra-thin + ultra-bold
- Use asymmetric layouts, intentional whitespace, grid-breaking elements
- Pick a distinctive accent color that's *not* purple or teal

## Workflow

1. **Design direction first** — ask or decide on aesthetic before writing code
2. **Scaffold with Vite** — `npm create vite@latest artifact -- --template react-ts`
3. **Develop** — use Tailwind + shadcn components, write all logic in TypeScript
4. **Bundle** — run `bundle-artifact.sh` to produce single HTML file
5. **Display** — paste artifact HTML into Claude.ai artifact viewer

## Component Usage

```tsx
// shadcn/ui imports (pre-installed, use directly)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

## Rules

- ✅ DO: Pick one strong aesthetic and commit to it fully
- ✅ DO: Use TypeScript — no implicit `any`
- ✅ DO: Make it interactive — React state, not static HTML
- ✅ DO: Include real sample data so the artifact looks complete
- ❌ DON'T: Use default Tailwind blue as the primary accent
- ❌ DON'T: Skip the bundle step — raw Vite output won't run in artifacts
- ❌ DON'T: Add external CDN dependencies — everything must be inlined

## Output

A single self-contained `artifact.html` file, ready to paste into Claude.ai.
