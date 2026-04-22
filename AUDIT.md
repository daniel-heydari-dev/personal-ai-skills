# Repo Audit — personal-ai-skills

> Generated 2026-04-22. This is a pre-refactor snapshot. Findings are grouped by category with recommended actions.

---

## 1. Dead Code & Stale Artifacts

### 1a. Dead compiled files in `dist/`

Three compiled JavaScript files exist with **no corresponding TypeScript source**:

| Dead file | Was probably | Status |
|-----------|-------------|--------|
| `dist/detect.js` | `src/detect.ts` | Deleted from src, compiled artifact left behind |
| `dist/scaffold.js` | `src/scaffold.ts` | Same |
| `dist/update.js` | `src/update.ts` | Same |

**Recommendation:** Delete all three. `dist/` is a build artifact directory — these will cause confusion if someone tries to trace functionality.

### 1b. Dead `build:catalog` script reference

`package.json` declares:
```json
"build:catalog": "tsx scripts/build-catalog.ts"
```
But **`scripts/` directory does not exist**. Running this script will fail immediately.

**Recommendation:** Remove the `build:catalog` script from `package.json`, or create the directory and implement the script (useful for auto-generating `web/src/data/catalog.ts`).

### 1c. Stub function bodies that shouldn't exist as-is

| Function | File | Issue |
|----------|------|-------|
| `cmdUpdate()` | `src/cli.ts:601` | Body is just `showInfo("Update checking coming soon!")` |
| `cmdServe()` | `src/cli.ts:783` | Body is just `showInfo("Web viewer coming soon!")` with commented-out TODO |
| `checkForUpdates()` | `src/lock.ts:241` | Returns `[]` with a comment "In future, compare hashes" |

**Recommendation:** Either implement or remove. Stub functions advertised in `--help` output mislead users. At minimum, remove the `serve` and `update` entries from the `HELP` constant if the commands aren't usable.

---

## 2. Synchronous File I/O

Two `fs.existsSync()` calls in `src/catalog.ts` block the event loop:

| Location | Call | Impact |
|----------|------|--------|
| `catalog.ts:41` | `fs.existsSync(devPath)` inside `getTemplatesRoot()` | Called on every catalog load |
| `catalog.ts:305` | `fs.existsSync(typeDir)` inside `loadContentType()` | Called per content type |

All other file I/O in the codebase correctly uses `fs.promises`. These two are the only outliers.

**Recommendation:** Replace with `await fs.promises.stat(...).catch(() => false)` or the existing `dirExists()` helper pattern from `src/agents.ts`.

---

## 3. TypeScript Issues

### 3a. Unused parameter causes silent bug: `_method` in `installItems`

`src/install.ts:127`:
```ts
export async function installItems(
  items: CatalogItem[],
  assistants: AssistantConfig[],
  scope: InstallScope,
  _method: InstallMethod,  // ← underscore = intentionally ignored
  ...
```

Then at line 154:
```ts
method: "symlink",  // ← hardcoded, ignores the parameter entirely
```

When a user selects "Copy to all agents" via the interactive prompt, the lock file records `method: "symlink"`. This is a **logic bug** — the method is silently dropped.

**Recommendation:** Either use the `method` parameter properly, or remove it from the function signature and always use `"symlink"` (and update call sites + types).

### 3b. Unused parameters in `uninstallItem` and `isItemInstalled`

`src/install.ts:176` — `uninstallItem(item, assistant, scope, projectRoot)`:
The `assistant` parameter is accepted but never used; all content lives in `.ai/` regardless.

`src/install.ts:199` — `isItemInstalled(item, assistant, scope, projectRoot)`:
Same — `assistant` is accepted but not referenced in the function body.

**Recommendation:** Remove the `assistant` parameter from both signatures (and update callers in `src/cli.ts`).

### 3c. Type cast instead of typed response

`src/github.ts:239`:
```ts
const contents = (await response.json()) as Array<{ name: string; type: string }>;
```
This pattern repeats in `listGitHubSkillsRoot`. The cast suppresses potential `unknown` type errors.

**Recommendation:** Add a runtime shape check, or at minimum use a shared `GitHubContent` interface instead of inline object types.

### 3d. `any`-equivalent cast in `catalog.ts`

`catalog.ts:61`:
```ts
let value: unknown = line.slice(colonIndex + 1).trim();
```
Then immediately cast to `string` via `(value as string).startsWith(...)`. The `unknown` annotation doesn't protect against invalid assumptions — the parse is line-by-line with no real validation.

**Recommendation:** This is low-risk but the pattern would fail on multi-line YAML values or nested structures. Document the limitation: this parser only handles flat key-value YAML.

---

## 4. Weak Content Hashing

`src/install.ts:61-65`:
```ts
async function getContentHash(filePath: string): Promise<string> {
  const content = await fs.promises.readFile(filePath, "utf-8");
  const hash = `${content.length}-${content.charCodeAt(0)}-${content.charCodeAt(content.length - 1)}`;
  return Buffer.from(hash).toString("base64").slice(0, 12);
}
```

This "hash" only considers file length + first + last character. Two different files that share those properties produce the same hash. The lock file's update detection will fail to catch content changes in many cases.

**Recommendation:** Replace with `node:crypto`'s `createHash('sha256')` — already available in Node.js, no new dependency. Keep the output at 12 chars for compactness.

---

## 5. Missing Test Coverage

Only `test/catalog.test.ts` exists (28 tests). Completely untested modules:

| Module | Complexity | Risk |
|--------|-----------|------|
| `src/bridge.ts` | Medium | Generates files users depend on |
| `src/install.ts` | Medium | Core install logic + lock file writes |
| `src/lock.ts` | Medium | State management |
| `src/cli.ts` | High | All commands |
| `src/prompts.ts` | Low | Prompts (hard to unit test) |
| `src/github.ts` | Medium | External fetch, URL parsing |

**Recommendation (per refactor plan):** Add tests for bridge.ts (VS Code merge behavior), bridge selection logic, and the new `init spec` command. GitHub/fetch tests can be deferred as they require mocking.

---

## 6. Architecture Debt (token-efficiency)

### 6a. Bridge files are content-heavy, not map-pattern

All bridge generators in `src/bridge.ts` produce verbose content with `buildDirectorySection()` + `buildCoreInstructions()`:

```
# CLAUDE.md

## AI Configuration

This project uses `.ai/` as the single source of truth for AI behavior.
Always read and follow the guidelines in:

- `.ai/skills/` — Coding best practices, patterns, and playbooks
- `.ai/rules/` — Hard constraints and conventions (always follow these)
...
```

This verbose format loads on every message. The new architecture targets **map-pattern** bridges (< 200 tokens in the always-load section, with load-on-demand references).

**Recommendation:** Update `claudeBridge()`, `cursorBridge()`, etc. to use the map pattern from `templates/shared/CLAUDE.md` (TASK 4).

### 6b. `templates/claude/CLAUDE.md` is not used by `bridge.ts`

`src/bridge.ts` generates CLAUDE.md content programmatically and never reads `templates/claude/CLAUDE.md`. The template is a 74-line content-heavy file that `bridge.ts` ignores.

**Recommendation:** Keep for backward compatibility (it might be used by future `init` flows), but note it represents the old pattern. The new `templates/shared/CLAUDE.md` from TASK 4 is the authoritative template.

### 6c. `web/src/data/catalog.ts` (16.8 KB) is manually maintained

The web viewer has a hand-edited catalog that duplicates the `templates/` directory. As templates are added or changed, this file must be manually updated — creating drift risk.

**Recommendation:** Implement the `build:catalog` script (see 1b) to auto-generate `web/src/data/catalog.ts` from templates. Not blocking for this refactor, but worth doing.

---

## 7. Minor Issues

| Issue | Location | Notes |
|-------|---------|-------|
| `docs/` directory doesn't exist | — | TASK 6 creates `docs/README-legacy.md`; directory will be created then |
| `const path = ...` inside `switch` case | `github.ts:325` | Triggers lint warning (no-case-declarations); wrap in `{}` |
| `commandExists()` uses `exec` which is not sandboxed | `agents.ts:63` | Acceptable but worth noting |
| `installItems` always passes `"symlink"` to lock file | `install.ts:154` | See §3a |

---

## Summary

| Category | Severity | Count |
|----------|---------|-------|
| Dead compiled artifacts | Medium | 3 files |
| Dead script reference | Low | 1 |
| Stub functions misleading users | Medium | 3 |
| Sync file I/O | Low | 2 calls |
| Unused parameter / silent bug (`_method`) | High | 1 |
| Unused parameters (safe to remove) | Low | 2 |
| Weak hashing | Medium | 1 |
| Zero test coverage on 5 modules | High | — |
| Token-inefficient bridge templates | High | All bridges |

---

**Awaiting your approval to proceed with TASK 2 (VS Code bridge) and beyond.**
