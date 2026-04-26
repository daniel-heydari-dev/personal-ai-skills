---
tags: [components, erp-pro-ui]
---

# erp-pro-ui — Component Catalog

All components live in `packages/ui/src/components/` and are exported from `packages/ui/src/index.ts`.

Import pattern: `import { Button } from 'erp-pro-ui'`

---

## Basics (40+ components)

Located in `packages/ui/src/components/basics/`

Each component folder follows this structure:

```text
button/
├── Button.tsx
├── Button.stories.tsx
├── Button.test.tsx     # optional
├── types.ts            # optional
└── index.ts
```

### Layout & Structure

| Component | Description |
| --- | --- |
| Card | Container with border and shadow |
| Dialog | Modal dialog (Radix-based or custom) |
| Drawer | Side panel |
| Tabs | Tab navigation |
| Accordion | Collapsible sections |
| Separator | Visual divider |

### Form Controls

| Component | Key Props | Notes |
| --- | --- | --- |
| Button | `variant`, `size`, `disabled`, `loading` | Supports `asChild` |
| Input | `type`, `placeholder`, `error`, `disabled` | — |
| Select | `value`, `onChange`, `options` | — |
| Checkbox | `checked`, `onChange`, `indeterminate` | — |
| Switch | `checked`, `onChange` | — |
| Textarea | `rows`, `resize`, `error` | — |
| DatePicker / Calendar | `value`, `onChange`, `disabled` | — |
| ComboBox | `options`, `search`, `multi` | — |

### Data Display

| Component | Key Props | Notes |
| --- | --- | --- |
| DataTable | `columns`, `data`, `pagination` | TanStack Table powered |
| Badge | `variant`, `color` | — |
| Avatar | `src`, `fallback`, `size` | — |
| Tooltip | `content`, `side` | — |
| Popover | `trigger`, `content` | — |
| DropdownMenu | `items`, `trigger` | Radix-based |

### Feedback & Status

| Component | Description |
| --- | --- |
| Spinner | Loading indicator |
| Alert | Error / info / success message |
| Toast | Notification system |
| Progress | Progress bar |
| Skeleton | Loading skeleton |

### Navigation

| Component | Description |
| --- | --- |
| Breadcrumb | Path navigation |
| Pagination | Page controls |
| Sidebar | Navigation sidebar |
| NavBar | Top navigation bar |

---

## Icons (30 components)

Located in `packages/ui/src/components/icons/`

All icons typed as:

```tsx
type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
};
```

Usage: `import { SearchIcon } from 'erp-pro-ui'`

---

## Text Animations

Located in `packages/ui/src/components/text-animations/`

| Component | Description |
| --- | --- |
| ASCIIText | ASCII-art text animation |

---

## Spinners

Located in `packages/ui/src/components/spinners/`

Various loading spinner variants.

---

## Contexts

| Export | Purpose |
| --- | --- |
| ThemeProvider | Wraps app with theme context |
| useThemeContext | Hook for current theme + toggle |

---

## Utils

| Export | Purpose |
| --- | --- |
| cn() | `clsx` + `tailwind-merge` utility |

---

## Notes

- M5 in progress: 90+ demo files in `apps/web/tailwind/` need TypeScript conversion
- Animations, Text Animations, Components, Backgrounds categories disabled in demo until M5 complete
- Peer deps: `framer-motion`, `@tanstack/react-table`, `three` are all optional
