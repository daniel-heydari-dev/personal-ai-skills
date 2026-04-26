---
tags: [design-tokens, erp-pro-ui]
---

# erp-pro-ui — Design Tokens

Tokens live in `packages/ui/src/styles/` as CSS custom properties.

Consumers get tokens by importing:

```css
@import 'tailwindcss';
@import 'erp-pro-ui/styles.css';
```

---

## Theme System

Dark mode via `[data-theme="dark"]` attribute on the root element.

```html
<html data-theme="dark">
```

Use `ThemeProvider` + `useThemeContext` from `erp-pro-ui` to toggle.

---

## Color Tokens

All colors defined as CSS variables, consumed via Tailwind utilities with `var(--token)`.

```css
/* Brand */
--color-primary: ...;
--color-primary-foreground: ...;

/* UI */
--color-background: ...;
--color-foreground: ...;
--color-muted: ...;
--color-muted-foreground: ...;
--color-border: ...;
--color-input: ...;
--color-ring: ...;

/* Status */
--color-destructive: ...;
--color-destructive-foreground: ...;
--color-success: ...;
--color-warning: ...;
```

*Note: Exact values are in `packages/ui/src/styles/` — these are the token names to use.*

---

## Border Radius

```css
--radius-sm: ...;
--radius-md: ...;   /* default */
--radius-lg: ...;
--radius-full: ...;
```

---

## Spacing

Uses Tailwind's default spacing scale with custom extensions where needed.

---

## Typography

| Token | Usage |
| --- | --- |
| `--font-sans` | Default UI font |
| `--font-mono` | Code, IDs, numbers |

---

## Tailwind v4 CSS-First Pattern

Token strategy:

1. Define CSS custom properties in `packages/ui/src/styles/`
2. Tailwind utilities reference them via `var(--token)`
3. Dark mode flips values on `[data-theme="dark"]`

No `tailwind.config.js` — configuration is in CSS.

---

## Consumer Notes

- Import `erp-pro-ui/styles.css` AFTER `tailwindcss` — order matters
- Tokens are available globally after import — no need to scope them
- To extend tokens: add CSS variables in your app stylesheet, they cascade normally
