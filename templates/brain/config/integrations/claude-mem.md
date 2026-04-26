---
tags: [config, integration, claude-mem, memory]
---

# Integration: claude-mem (Session Memory)

<!--
  claude-mem is a Claude Code hook. It runs automatically at the end of every session
  and writes a summary to wiki/hot.md. You never need to manually log sessions.
-->

## How It Works

```
You work in Claude Code
        ↓  (session ends)
claude-mem hook fires automatically
        ↓
Writes summary to ~/ai-brain/wiki/hot.md
        ↓
Next session: hot.md is injected into Claude's context
        ↓
Claude remembers what you were doing — no repeating yourself
```

## What It Captures Per Session

- What you worked on and why
- Decisions made (and the reasoning)
- Bugs found and how they were fixed
- What's next / open questions
- Files changed and their purpose

## Setup

Installed via: `npx claude-mem install`

This registers a hook in `~/.claude/settings.json`. Claude Code runs it automatically.
To verify it's installed: `cat ~/.claude/settings.json | grep claude-mem`

## Memory Viewer

Live session log: `http://localhost:37777` (when Claude Code is running)

## Using Older Sessions

claude-mem writes to `hot.md` (last session only). For older sessions:

```
Use `search_memory` MCP tool in Claude Code
Or: browse ~/ai-brain/wiki/projects/<name>/ for project-level history
```

## What NOT to Store in hot.md

hot.md is auto-overwritten every session — don't write permanent notes there.
For permanent decisions: `wiki/projects/<name>/decisions.md`
For permanent architecture notes: `wiki/projects/<name>/architecture.md`
