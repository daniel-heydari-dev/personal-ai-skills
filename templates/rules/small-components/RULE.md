---
name: small-components
description: Keep UI components small and composable. Refactor oversized components into smaller, reusable pieces when you touch them.
---

# Small Components Rule

## Rule

UI components must stay small and single-purpose. When you touch a component that is too big, **refactor first, then make your change** — never grow a bloated file.

## Size Limits

| Component file | Line count | Action |
| --- | --- | --- |
| Healthy | ≤ 150 lines | Just edit it |
| Warning | 151–200 lines | OK to extend, but consider splitting |
| Refactor zone | 201–250 lines | When touching this file: split before adding |
| Hard limit | > 250 lines | Must be split — do not add new code until refactored |

Lines counted: only the component file itself (`.tsx`/`.jsx`), excluding type files and test files.

## Signals That a Component Should Be Split

Split when **any** of these are true — line count is just a heuristic, these are the real triggers:

1. **Multiple responsibilities** — the component renders UI, fetches data, AND owns business logic. Split fetch + logic into hooks; split UI into sub-components.
2. **More than 3 `useState` hooks tied to different concerns** — group them into separate components, each owning its own state.
3. **JSX nested deeper than 4 levels** — extract the inner block into a sub-component.
4. **A JSX section is conceptually reusable** — header, list row, empty state, error state, loading state, modal body, form section. Extract it.
5. **A section has its own conditional rendering tree** — if you have `{isEditing ? <Edit /> : <View />}` over 30 lines, those are two components.
6. **Props list > 8 items** — the component is doing too much. Split or use composition (children, slots).
7. **Repeated JSX patterns** — three buttons with similar styling and slightly different props means a single Button component.

## How to Split

```tsx
// ❌ Bad — 280-line ProductCard does everything
function ProductCard({ product, onEdit, onDelete, onAddToCart, ... }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: stock } = useQuery(...);
  // 200+ more lines: header, image gallery, price block,
  // edit form, delete confirm modal, add-to-cart logic...
  return <div>...everything inline...</div>;
}

// ✅ Good — small composable pieces
function ProductCard({ product }) {
  return (
    <Card>
      <ProductHeader product={product} />
      <ProductGallery images={product.images} />
      <ProductPriceBlock price={product.price} />
      <ProductActions productId={product.id} />
    </Card>
  );
}
// Each sub-component lives in its own file, owns its own state,
// and stays under the line limits.
```

## Refactor-On-Touch Workflow

When the user asks you to change a component file > 200 lines:

1. **Stop and read the whole file first** — don't blindly edit.
2. **Identify split points** using the signals above.
3. **Propose the split** — list the new files and what each owns. Get user confirmation if the split is non-trivial.
4. **Extract the obvious sub-components first** — header, list rows, modals — these are usually low-risk.
5. **Then make the requested change** in the now-smaller component.
6. **Update the import sites and tests.**

Skip the refactor only when:
- The user explicitly says "just patch it, no refactor"
- The file is already pending a planned rewrite (and you can see a TODO/issue noting that)

## Sub-component Conventions

- **Live in a folder** when the component has its own sub-components: `ProductCard/{ProductCard,ProductHeader,ProductActions}.tsx`
- **Single-file** when standalone: `Button.tsx`
- **Co-locate types** in the same folder (`types.ts`) when shared by multiple files
- **Export named, not default** — easier to refactor and rename
- **Keep props typed explicitly** — no `as any`, no implicit `props: any`

## Anti-patterns

- ❌ "I'll just add 50 more lines, it's fine" → no, fix the size first
- ❌ Premature splitting (every JSX block in its own file) → extract on signal, not on principle
- ❌ Splitting by line count alone with no semantic boundary → produces tightly-coupled fragments
- ❌ Comment headers (`// === Header section ===`) instead of extracting → that's the smell that says "extract this"
