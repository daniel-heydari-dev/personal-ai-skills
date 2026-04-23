---
name: ux-heuristics
description: Evaluate UI/UX against Nielsen's 10 Usability Heuristics and produce severity-scored usability issues. Use when the user asks for "usability audit", "UX review", "heuristic evaluation", "find UX problems", or to evaluate a product, screen, or flow.
category: design
tags: [ux, usability, heuristics, nielsen, audit, accessibility, evaluation]
---

# Skill: UX Heuristics

Severity-scored usability audit using Nielsen's 10 Heuristics. Output is a prioritized list of issues with specific fixes.

## Severity Scale

Score every issue before listing it:

| Score | Severity | Action |
|-------|---------|--------|
| 0 | Not a problem | Note only |
| 1 | Cosmetic | Fix if time allows |
| 2 | Minor | Low priority fix |
| 3 | Major | High priority — fix before launch |
| 4 | Catastrophic | Must fix — blocks usage |

> Severity = (frequency × impact) — if it happens rarely but breaks the flow = 3; if it happens always but users recover quickly = 2.

## The 10 Heuristics

### H1 — Visibility of System Status

The system should always keep users informed about what is going on.

**Common violations:**
- Button pressed, nothing happens for 2+ seconds, no loading indicator
- File upload with no progress bar
- Form submission with no success/error state
- Background process with no status

**Fixes:**
```jsx
// Loading state on async actions
<button disabled={isLoading}>
  {isLoading ? <Spinner /> : "Save"}
</button>

// Toast for async results
toast.success("Saved!") // or toast.error("Failed — try again")
```

### H2 — Match Between System and the Real World

Use words, phrases, and concepts familiar to the user — not system-oriented language.

**Common violations:**
- "404 Not Found" → users don't know what that means
- "Null pointer exception" in error messages
- Technical field names: `user_id`, `created_at`, `is_active`
- Jargon: "Invalidate cache", "Commit changes", "Flush session"

**Fixes:** Use plain language. "Page not found", "Something went wrong", "Last active", "Save changes".

### H3 — User Control and Freedom

Users often choose system functions by mistake. They need a clearly marked "emergency exit."

**Common violations:**
- No undo after delete
- No way to cancel a long process
- Multi-step wizard with no "Back" button
- Drawer/modal with no close button

**Fixes:** Soft-delete with undo toast (30s window), cancel button on all async ops, `Escape` closes modals.

### H4 — Consistency and Standards

Users should not have to wonder whether different words, situations, or actions mean the same thing.

**Common violations:**
- "Delete" in one place, "Remove" in another (same action)
- Primary button is blue on page A, green on page B
- Date formats mixed: "Jan 5" vs "01/05" vs "2024-01-05"
- Form labels sometimes above, sometimes inline

**Fix:** Establish a design token system and component library — enforce it via code review.

### H5 — Error Prevention

Design to prevent problems from occurring in the first place.

**Common violations:**
- Destructive action with no confirmation
- Form clears on browser back
- Password field with no "show password" toggle
- Required fields not marked until submission

**Fixes:**
```jsx
// Confirm destructive actions
<ConfirmDialog
  title="Delete project?"
  description="This cannot be undone."
  confirm="Delete" confirmVariant="destructive"
/>

// Persist form state
sessionStorage.setItem('draft', JSON.stringify(formValues))
```

### H6 — Recognition Over Recall

Minimize user memory load. Make objects, actions, and options visible.

**Common violations:**
- Icon-only toolbar with no labels or tooltips
- Dropdown with 30+ options, no search
- Settings changed elsewhere that affect current view, not surfaced
- Recent items not shown (user must remember exact name to search)

**Fix:** Labels under icons, searchable selects (`<Combobox>`), contextual breadcrumbs, recents list.

### H7 — Flexibility and Efficiency of Use

Accelerators — unseen by novice users — allow experts to work faster.

**Common violations:**
- No keyboard shortcuts for power users
- No bulk actions (must act on items one by one)
- No saved filters or views
- Copy-paste blocked in password fields

**Fixes:** `Cmd+K` command palette, bulk select with shift-click, saved views, keyboard nav on all interactive elements.

### H8 — Aesthetic and Minimalist Design

Don't show information that is irrelevant or rarely needed — every extra unit competes with relevant units.

**Common violations:**
- Every field has a helper text (even obvious ones)
- Marketing copy on app screens ("The easiest way to…")
- Multiple CTAs competing (3 primary buttons on one card)
- Empty state with 5 paragraphs of explanation

**Fix:** One primary action per screen section. Empty states: icon + one-line message + one CTA.

### H9 — Help Users Recognize, Diagnose, and Recover from Errors

Error messages should be plain language, precisely indicate the problem, and constructively suggest a solution.

**Common violations:**
- "An error occurred" with no detail
- Red border on field, no message about what's wrong
- Generic "Invalid input" without saying which field or why
- Error modal that blocks the user from fixing the problem

**Fix:**
```jsx
// Inline field error — specific and helpful
<FormField
  error="Email already in use — sign in instead?"
  // not: "Invalid email"
/>
```

### H10 — Help and Documentation

Even though it's better if the system can be used without documentation, sometimes help is necessary.

**Common violations:**
- No contextual help for complex fields
- Help docs not searchable
- FAQ hidden in footer
- Tooltips have zero delay (flash on accidental hover)

**Fix:** Inline `?` icon with tooltip for complex fields (350ms hover delay), searchable help center surfaced in `Cmd+K`.

## Audit Output Format

```markdown
## UX Audit — [Screen/Product Name]

### 🔴 Severity 4 — [Heuristic violated]
**Where**: [specific location]
**Issue**: [what happens]
**Fix**: [specific solution]

### 🟠 Severity 3 — [Heuristic violated]
...
```

Always score before listing. Sort by severity descending.
