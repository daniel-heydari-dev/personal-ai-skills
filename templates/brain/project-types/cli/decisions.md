---
tags: [decisions, architecture, personal-ai-skills]
---

# Architecture Decisions

---

## ADR-001: Three-Tier Context Architecture

**Decision:** Global (`~/.ai/`) → Project (`.ai/`) → Page (`docs/spec/`) instead of one flat config file.

**Why:** A single flat config either has too little (useless) or too much (wastes tokens). The three tiers allow token-efficient loading — global defaults apply everywhere, project context applies only to that repo, page specs apply only when working on that feature.

**Trade-off:** More files to manage. Solved by `personal-ai-skills` generating and managing them.

---

## ADR-002: MAP Pattern for CLAUDE.md

**Decision:** `CLAUDE.md` is always a routing table (MAP), never a content dump.

**Why:** `CLAUDE.md` is loaded every session. Every token in it is paid every session. A routing table (<200 tokens) that says "load `.ai/skills/testing/` when working on tests" costs nothing when you're not writing tests. Dumping all skill content directly in `CLAUDE.md` would waste tokens on every session regardless of task.

**Rule:** If `CLAUDE.md` grows over 300 words, something is wrong — move content to a skill file.

---

## ADR-003: .skill-lock.json as Source of Truth

**Decision:** Installed state is tracked in `.ai/.skill-lock.json`, not inferred from filesystem.

**Why:** Skills can be installed globally (symlinked) or per-project (copied). The lock file records which skills are installed, which assistants they target, and when. `update` and `remove` commands rely on it. Without it, update would have to guess which assistants to reinstall to.

---

## ADR-004: Bridge Files Over Single Standard

**Decision:** Generate per-editor bridge files rather than waiting for a universal standard.

**Why:** Every editor reads from a different path. There is no universal AI context standard yet. Generating thin per-editor bridge files (CLAUDE.md, .cursor/rules/, .vscode/settings.json, etc.) that all point to the same `.ai/` directory means one `.ai/` directory works everywhere.

---

## ADR-005: Skills Read from Templates at Install Time

**Decision:** `templates/` directory is the source of truth. Skills are never bundled inline.

**Why:** Skills evolve. If they were bundled inline at publish time, users would need to re-run the installer to get improvements. Reading from `templates/` at install time means the installed copy is always the latest version at the moment of install.

---

## ADR-006: No Spinner for Long-Running Memory Tool Setup

**Decision:** Graphify and other slow commands skip the @clack/prompts spinner and use `stdio: "inherit"` directly.

**Why:** @clack/prompts spinner and `execSync({ stdio: "inherit" })` conflict — the spinner overwrites the terminal output. For fast commands (claude-mem), the spinner works fine. For slow commands like graphify (pip install + codebase indexing), the terminal must be handed off directly so the user can see progress.

---

## ADR-007: Integrations Excluded from Step 2 When Selected in Step 1

**Decision:** If the user selects memory tools in Step 1 of the wizard, "Integrations" is hidden from the Step 2 content type list.

**Why:** Memory tools (obsidian, claude-mem, graphify) are the same items listed under the "Integrations" content type. Showing them again in Step 2 after Step 1 was confusing and redundant. The wizard now treats them as mutually exclusive selections.
