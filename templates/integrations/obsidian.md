# Obsidian Integration

**Vault path:** `~/ai-brain/`

## Structure (claude-obsidian pattern)

- `.raw/` — drop any source file (PDFs, docs, videos, screenshots)
- `wiki/hot.md` — session cache, auto-loaded
- `wiki/index.md` — master catalog
- `wiki/concepts/` — extracted ideas
- `wiki/entities/` — people, tools, companies
- `wiki/projects/{{PROJECT_SLUG}}/` — this project's notes
- `wiki/sources/` — ingested from `.raw/`

## Rules for AI

1. Never auto-load the whole vault
2. Always read `wiki/hot.md` first if it exists
3. Drill into `wiki/projects/{{PROJECT_SLUG}}/` only when relevant
4. Use `/wiki`, `/save`, `/autoresearch` commands from claude-obsidian
