---
name: uiux-pro
description: Generate a complete, production-ready design system from a brief — tokens, components, spacing, typography, color, motion, and dark mode. Use when the user provides a product brief or asks to "design a system", "create a design language", "build a component library from scratch", or "full UI from brief".
category: design
tags: [design-system, ui, ux, tokens, components, typography, color, dark-mode, motion]
---

# Skill: UIUX Pro Max

Generate a full design system from a brief — tokens to components, light/dark, responsive, production-ready.

## Input: The Brief

Before generating anything, extract from the brief:

```
1. Product type: [app / marketing / dashboard / e-commerce / docs]
2. Audience: [consumer / enterprise / developer / creator]
3. Personality: [adjectives — e.g. "playful, modern, trustworthy"]
4. Platform: [web / iOS / Android / cross-platform]
5. Brand constraint: [existing colors/fonts or start from scratch]
```

If any of these are missing, ask before proceeding. The system must be designed for a specific context.

## Phase 1: Design Tokens

### Color System

Generate 5 token categories:

```css
:root {
  /* ── Brand ── */
  --color-brand-50:  #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-500: #3b82f6;  /* primary */
  --color-brand-600: #2563eb;  /* hover */
  --color-brand-700: #1d4ed8;  /* active */
  --color-brand-900: #1e3a8a;

  /* ── Neutral (always 11 steps) ── */
  --color-neutral-0:   #ffffff;
  --color-neutral-50:  #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;
  --color-neutral-950: #020617;

  /* ── Semantic ── */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;

  /* ── Surface (maps to neutrals, switches for dark mode) ── */
  --bg-base:      var(--color-neutral-0);
  --bg-subtle:    var(--color-neutral-50);
  --bg-muted:     var(--color-neutral-100);
  --text-primary: var(--color-neutral-900);
  --text-muted:   var(--color-neutral-500);
  --border:       var(--color-neutral-200);
}

/* Dark mode — swap surface tokens only */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-base:      var(--color-neutral-950);
    --bg-subtle:    var(--color-neutral-900);
    --bg-muted:     var(--color-neutral-800);
    --text-primary: var(--color-neutral-50);
    --text-muted:   var(--color-neutral-400);
    --border:       var(--color-neutral-700);
  }
}
```

### Spacing Scale (8pt base)

```css
:root {
  --space-1:  0.25rem;  /*  4px */
  --space-2:  0.5rem;   /*  8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */
}
```

### Typography Scale

```css
:root {
  --font-sans:  'Inter', -apple-system, sans-serif;
  --font-serif: 'Lora', Georgia, serif;
  --font-mono:  'JetBrains Mono', monospace;

  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */
  --text-5xl:  3rem;       /* 48px */

  --leading-tight:  1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Radius & Shadow

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  --shadow-xl: 0 20px 60px rgba(0,0,0,0.16);
}
```

## Phase 2: Core Components

### Button System

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 150ms ease;
}

/* Sizes */
.btn-sm  { padding: var(--space-1) var(--space-3); }
.btn-md  { padding: var(--space-2) var(--space-4); }
.btn-lg  { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }

/* Variants */
.btn-primary     { background: var(--color-brand-500); color: #fff; }
.btn-secondary   { background: var(--bg-muted); color: var(--text-primary); border-color: var(--border); }
.btn-ghost       { background: transparent; color: var(--text-muted); }
.btn-destructive { background: var(--color-error); color: #fff; }

.btn-primary:hover     { background: var(--color-brand-600); }
.btn-primary:active    { background: var(--color-brand-700); }
.btn[disabled]         { opacity: 0.4; cursor: not-allowed; }
```

### Form Fields

```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--bg-base);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  transition: border-color 150ms;
}
.input:focus { border-color: var(--color-brand-500); outline: none;
               box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.input.error  { border-color: var(--color-error); }

.field-label { font-size: var(--text-sm); font-weight: 500; margin-bottom: var(--space-1); }
.field-error { font-size: var(--text-xs); color: var(--color-error); margin-top: var(--space-1); }
```

### Card

```css
.card {
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}
.card-header { margin-bottom: var(--space-4); }
.card-title  { font-size: var(--text-lg); font-weight: 600; }
.card-footer { margin-top: var(--space-4); padding-top: var(--space-4);
               border-top: 1px solid var(--border); }
```

## Phase 3: Motion Tokens

```css
:root {
  --duration-fast:   100ms;
  --duration-base:   200ms;
  --duration-slow:   400ms;
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Use sparingly — one primary animation per interaction */
.fade-in   { animation: fadeIn var(--duration-base) var(--ease-out); }
.slide-up  { animation: slideUp var(--duration-base) var(--ease-out); }
.scale-in  { animation: scaleIn var(--duration-fast) var(--ease-spring); }

@keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp  { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
@keyframes scaleIn  { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: none } }
```

## Output Format

For each brief, deliver:

1. **Token sheet** — complete CSS custom properties
2. **Component library** — at minimum: button, input, card, badge, avatar
3. **Typography specimen** — all text styles rendered
4. **Color swatch grid** — all tokens shown
5. **Dark mode preview** — same layout, dark mode applied

All delivered as a single self-contained HTML file.

## Rules

- ✅ DO: Design tokens first — components are derived, tokens are foundational
- ✅ DO: Dark mode from the start — surface token swaps, not class hacks
- ✅ DO: Use a spacing scale — no arbitrary pixel values
- ✅ DO: Test all components at all sizes — sm / md / lg variants
- ❌ DON'T: Add components that aren't in the brief — scope creep kills systems
- ❌ DON'T: Use component-specific colors — map everything through tokens
- ❌ DON'T: Animate more than 3 properties per interaction
