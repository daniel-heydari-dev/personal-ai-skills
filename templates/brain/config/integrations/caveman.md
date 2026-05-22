---
tags: [config, integration, caveman, communication]
---

# Integration: Caveman (Compressed Communication Mode)

<!--
  Caveman is a Claude Code plugin that compresses AI responses ~65-75%.
  Full technical accuracy preserved. Only fluff removed.
  Active every response once toggled — no drift, no revert.
-->

## How It Works

```
User says "caveman mode" (or /caveman)
        ↓
Claude drops: articles, filler, pleasantries, hedging
        ↓
Fragments OK. Short synonyms. Technical terms exact. Code unchanged.
        ↓
Stays active until "stop caveman" or "normal mode"
```

## Intensity Levels

| Level              | Command                       | What changes                                             |
| ------------------ | ----------------------------- | -------------------------------------------------------- |
| **full** (default) | `/caveman` or `/caveman full` | Drop articles/filler, fragments OK, short synonyms       |
| **lite**           | `/caveman lite`               | Less aggressive — drops filler but keeps more structure  |
| **ultra**          | `/caveman ultra`              | Maximum compression — single-word answers where possible |

## Toggle

- **On**: `caveman mode`, `/caveman`, `/caveman lite`, `/caveman full`, `/caveman ultra`
- **Off**: `stop caveman`, `normal mode`
- **Current level persists** across turns until changed or session ends

## Auto-Clarity Exceptions

Caveman pauses automatically for:

- Security warnings
- Irreversible action confirmations
- Multi-step sequences where fragment order risks misread

Resumes after the critical part.

## What Does NOT Change in Caveman Mode

- Code blocks — written normally
- Commit messages — written normally
- PR descriptions — written normally
- Security warnings — written normally

## Sub-Skills

| Skill              | Trigger                             | What it does                                                                         |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------ |
| `caveman-commit`   | `/caveman-commit`, "write a commit" | Ultra-compressed commit messages. Conventional Commits. Subject ≤50 chars.           |
| `caveman-review`   | `/caveman-review`, "review this PR" | One-line review comments: location + problem + fix.                                  |
| `caveman-compress` | `/caveman:compress <file>`          | Compress CLAUDE.md / memory files to caveman format. Saves backup as `.original.md`. |
| `caveman-help`     | `/caveman-help`                     | Quick-reference card. One-shot.                                                      |

## Pattern

```
Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."
Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"
```

## Install Location

Plugin installed via Claude Code. Rules injected via `SessionStart` hook every message.
Source: `~/.claude/plugins/cache/caveman/`
