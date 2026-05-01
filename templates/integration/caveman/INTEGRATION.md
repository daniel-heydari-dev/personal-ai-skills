---
name: caveman
description: Token compression skill — strips filler, hedging, and articles from AI responses while preserving technical accuracy. 65-75% fewer output tokens.
category: integrations
tags: [token-reduction, compression, output, terse]
setup: "claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman"
---

# caveman Integration

**Repo:** https://github.com/juliusbrussee/caveman
**Install (Claude Code):** `claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman`
**Install (Gemini CLI):** `gemini extensions install https://github.com/JuliusBrussee/caveman`
**Install (Cursor/Windsurf/Cline):** `npx skills add JuliusBrussee/caveman -a [agent-name]`

## What it does

Compresses AI responses to bare essentials — no articles, no filler, no hedging.
65-75% fewer output tokens. All technical accuracy preserved.

```
Without: "I would suggest that you might want to consider using..."
With:    "use X — faster, fewer deps"
```

## Intensity levels

- `lite` — professional, grammar intact
- `full` — default caveman mode (recommended)
- `ultra` — maximum compression

## Activation

- Type `/caveman` or "caveman mode" in any session
- Auto-activates in Claude Code and Gemini CLI after install
- For Cursor/Windsurf: manual activation per session (or add to system prompt)

## Commands

- `/caveman` — activate full mode
- `/caveman lite` — activate lite mode
- `/caveman-commit` — terse commit messages
- `/caveman-review` — one-line PR feedback
- `/caveman-compress` — compress input context files (~46% savings)
- `/caveman-help` — quick reference

## Rules for AI

1. When caveman mode is active, strip: articles (a/an/the), filler phrases ("I would suggest", "you might want to"), pleasantries, hedging
2. Keep: all technical terms, code, file paths, numbers, warnings
3. Pattern: `[thing] [action] [reason]` — direct, no padding
4. Never compress code blocks or error messages
