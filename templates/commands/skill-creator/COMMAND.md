---
name: skill-creator
description: Create or update a repo-local AI skill in .ai/skills using the project's skill conventions.
---

# Skill Creator Command

Create or refine a reusable AI skill for this repository.

## Command Intent

Use this command when the user wants to:

- create a new skill in `.ai/skills/`
- turn a repeated workflow into a skill
- improve an existing `SKILL.md`
- add references, templates, or assets to support a skill
- improve skill triggering via better frontmatter descriptions

## Required Workflow

1. Read all relevant files in `.ai/rules/` before making changes.
2. Read `.ai/skills/skill-creator/SKILL.md` and follow that workflow.
3. Inspect related existing skills or commands before drafting anything new.
4. Prefer adapting local patterns over copying external skill repos verbatim.
5. Create or update the skill in `.ai/skills/<skill-name>/`.
6. Validate frontmatter, file references, and markdown issues before finishing.

## Output Expectations

Provide:

- the new or updated skill files
- a short note on how the skill should trigger
- any important assumptions or limitations

## Constraints

- Keep the implementation repo-local
- Preserve an existing skill's name and folder unless the user explicitly asks to rename it
- Keep `SKILL.md` focused and move bulky details into bundled references when needed
