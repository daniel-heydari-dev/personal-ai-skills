# {{PROJECT_NAME}} — Claude Configuration

## ⚡ ALWAYS LOAD (every message, ~200 tokens max)
- Project rules: `.ai/rules/always.md`
- Root spec: `SPEC.md`

## 🗺️ REFERENCE MAP (load only when relevant)

### Skills
Available in `.ai/skills/`. Load only when the user's task matches.

### Agents
Available in `.ai/agents/`. Load only when user explicitly requests that role.

### Sub-specs
Available in `docs/spec/*/SPEC.md`. Load only when working on that feature area.

### Obsidian Brain
Path: `~/ai-brain/`
- `wiki/hot.md` — recent session context (auto-loaded by claude-obsidian)
- `wiki/projects/{{PROJECT_SLUG}}/` — this project's notes
- Never auto-load other vault content

## 🧠 Memory Integration
- **claude-mem** runs automatically — previous session context is injected at session start
- Do not repeat context that's already in memory
