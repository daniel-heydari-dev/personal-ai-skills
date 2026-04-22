# claude-mem Integration

**Install:** `npx claude-mem install`

## What it does

- Auto-captures tool usage during sessions
- Generates semantic summaries
- Injects relevant context into future sessions
- ~10x token savings via progressive disclosure

## Rules for AI

1. Don't repeat context that's already in memory
2. Use MCP tools in order: `search` → `timeline` → `get_observations`
3. Use `<private>` tags to exclude sensitive content

## Config location

`~/.claude-mem/settings.json`
