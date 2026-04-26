---
tags: [config, identity, global]
loaded: always
---

# My Config — Identity & Defaults

<!--
  WHAT THIS FILE IS
  ──────────────────
  This is the ~50-token file that tells Claude WHO you are.
  It is referenced in EVERY project's CLAUDE.md under "Always Load".
  Keep it short — it loads every single session.

  Fill in the sections below with your real preferences.
  Delete anything that doesn't apply.
-->

## Who I Am

- **Name:** Daniel
- **Role:** Software engineer — full-stack, TypeScript-first
- **Working style:** I prefer direct, no-fluff answers. Show me code, not theory.
- **Experience level:** Senior — assume I know the fundamentals, focus on the "why"

## Code Style Defaults

These apply across ALL my projects unless a project's SPEC.md says otherwise:

- **Language:** TypeScript strict — no `any`, no `@ts-ignore`
- **Functions:** Small, single-purpose. If it does two things, split it.
- **Comments:** Only when the WHY is non-obvious. Never explain WHAT — the code does that.
- **Naming:** Explicit over short. `getUserById` not `getUser`. `isLoading` not `loading`.
- **Error handling:** Always typed, never swallow. Use Result types for expected errors.
- **Tests:** AAA pattern (Arrange, Act, Assert). Real assertions, not just "it runs".

## Communication Preferences

- Get to the point. Skip preamble ("Sure! I'd be happy to...").
- If I ask for code, give me code. Explain only if it's non-obvious.
- If there are trade-offs, tell me. Don't pick for me unless I ask.
- Flag security issues immediately — don't bury them in a footnote.
- One paragraph max for explanations unless I ask for more.

## Tools I Use Daily

- **Editor:** Claude Code (primary), Cursor (secondary)
- **Package manager:** pnpm
- **Version control:** git — conventional commits (`feat:`, `fix:`, `chore:`)
- **Deploy:** Vercel (frontend), Railway (backend/DB)

## Related

- [[integrations/obsidian]] — how the second brain vault works
- [[integrations/claude-mem]] — how session memory works
- [[integrations/graphify]] — how the knowledge graph works
