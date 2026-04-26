# {{PAGE_NAME}} — Spec

<!--
  PAGE SPEC — target ~200 tokens when filled in.
  This file is loaded ON DEMAND — only when the user's task mentions
  keywords related to this feature area (see SPEC.md Spec Map).

  FILLING IN THIS FILE:
    - "Purpose"       → 1–2 sentences. What user problem does this page/feature solve?
    - "Current State" → honest status using ✅ / 🔄 / ❌ markers
    - "Data Model"    → TypeScript types for the main entities. Keep it exact.
    - "Business Rules"→ domain-specific invariants for THIS feature only.
                        (Global rules stay in root SPEC.md)
    - "Components"    → actual file paths + one-line descriptions.
                        This is what makes the AI navigate correctly.

  HOW THIS GETS LOADED:
    You say "I'm working on {{PAGE_NAME}}" or mention a keyword from
    the Spec Map in root SPEC.md → Claude reads this file (~200 tokens).
    Claude now has precise context for this feature without loading anything else.
-->

## Purpose

{{WHY_THIS_EXISTS}}

<!--
  EXAMPLE:
  Warehouse staff use this page to view, search, and manage stock levels.
  Managers need bulk-edit and CSV export for end-of-month reporting.
-->

---

## Current State

<!--
  Be honest. Stale status is worse than no status — the AI will
  confidently work on something that's already done or broken.
  Update this file every time you complete or start a task.
-->

- ✅ {{DONE_1}}
- 🔄 {{IN_PROGRESS_1}} — in progress
- ❌ {{TODO_1}} — not started
- ❌ {{TODO_2}} — not started

<!--
  EXAMPLE:
  - ✅ List view with pagination
  - ✅ Search by SKU and name
  - ✅ Single item edit
  - 🔄 Bulk edit modal — in progress (50% done, missing validation)
  - ❌ CSV export — not started
  - ❌ Low stock alerts — not started (depends on bulk edit)
-->

---

## Data Model

<!--
  Use TypeScript. Include only the fields relevant to THIS feature.
  If the type lives in a shared file, note the import path.
  The AI uses this to write correct queries, components, and API routes.
-->

```ts
// {{SOURCE_FILE_PATH}}

export interface {{ENTITY_NAME}} {
  id: string
  orgId: string       // always present — multi-tenant filter
  // add fields here
  createdAt: Date
  updatedAt: Date
}
```

<!--
  EXAMPLE:
  // types/inventory.ts

  export interface StockItem {
    id: string
    orgId: string           // always filter by this
    sku: string             // unique per org
    name: string
    quantity: number        // always integer (units)
    reorderPoint: number    // alert when quantity < this
    location: string        // format: ZONE-ROW-SHELF (e.g. A-01-03)
    updatedAt: Date
  }
-->

---

## Business Rules

<!--
  Rules specific to THIS feature. Global rules (multi-tenant, currency, dates)
  are already in root SPEC.md — don't repeat them here.
-->

- {{RULE_1}}
- {{RULE_2}}

<!--
  EXAMPLE:
  - Low stock = quantity < reorderPoint (not zero — the reorder point matters)
  - Location format must match /^[A-Z]-\d{2}-\d{2}$/ — validate on input
  - SKU must be unique per org — check before save, return 409 if duplicate
  - Bulk edits must be atomic — all succeed or all fail (use a transaction)
  - CSV export is limited to 10,000 rows — paginate if org exceeds this
-->

---

## Components

<!--
  List every file that belongs to this feature. Be specific with paths.
  This is the most valuable section — the AI navigates directly to the right files.

  Format:
    - `path/to/file.tsx` — what it does (what state it owns, what it renders)
    - `path/to/api/route.ts` — what endpoints it exposes
-->

- `{{PAGE_FILE}}` — {{PAGE_DESCRIPTION}}
- `{{COMPONENT_FILE}}` — {{COMPONENT_DESCRIPTION}}
- `{{API_FILE}}` — {{API_DESCRIPTION}}

<!--
  EXAMPLE:
  - `app/(dashboard)/inventory/page.tsx` — server component, fetches initial stock list
  - `components/inventory/StockTable.tsx` — client component, renders table with inline edit
  - `components/inventory/BulkEditModal.tsx` — modal for editing multiple items at once
  - `components/inventory/StockFilters.tsx` — search bar + location filter
  - `api/inventory/route.ts` — GET list (paginated), POST create
  - `api/inventory/[id]/route.ts` — GET one, PUT update, DELETE
  - `api/inventory/bulk/route.ts` — PUT bulk update (atomic)
  - `hooks/useInventory.ts` — client-side data fetching and optimistic updates
-->

---

## Open Questions

<!--
  Optional: track unresolved decisions here. Remove section if not needed.
-->

- [ ] {{OPEN_QUESTION_1}}

<!--
## Further reading (Tier 4 — uncomment when this spec gets dense)

> Load ONLY when the user explicitly asks for history / background / why-decisions.
> Keeps Tier 2 lean. When this file grows past ~300 tokens of historical notes,
> move them to the brain and replace with the pointers below.

- Brain: `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/{{PAGE_NAME}}-history.md`
- Decisions: `~/ai-brain/wiki/projects/{{PROJECT_SLUG}}/decisions.md`
- Cross-project contracts: `~/ai-brain/wiki/projects/shared/api-contracts.md`
-->

