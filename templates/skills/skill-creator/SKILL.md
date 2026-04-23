---
name: skill-creator
description: Meta-skill for creating, improving, and testing AI skills. Use when the user asks to "create a skill", "write a SKILL.md", "improve an existing skill", or "benchmark this skill".
category: meta
tags: [skill-creator, meta, ai-skills, benchmarking, iteration]
source: https://github.com/anthropics/skills/tree/main/skills/skill-creator
---

# Skill: Skill Creator

Create, test, and iterate on AI skills following the Agent Skills specification.

## When to Use

- User says "create a skill for X" or "write a SKILL.md"
- User wants to improve or benchmark an existing skill
- User is authoring new skills for their `.ai/skills/` directory

## Workflow

### 1. Capture Intent

Ask four questions before writing anything:

1. **What should it do?** Core behavior and output format
2. **When should it trigger?** Exact phrases or context that activate it
3. **What should it NOT do?** Explicit constraints to avoid scope creep
4. **Test cases?** 2–3 example inputs and expected outputs

### 2. Write the Skill

- Use imperative form: "Return X", "Never do Y", "Always include Z"
- Keep SKILL.md under 500 lines — use `references/` files for deep content
- Structure: frontmatter → Core Purpose → Trigger Phrases → Rules → Examples
- Frontmatter `description` field is the trigger text — optimize it last

**Frontmatter template:**
```yaml
---
name: my-skill
description: What this skill does and WHEN to load it. Include trigger keywords.
category: fundamentals | design | testing | meta | integration
tags: [tag1, tag2, tag3]
---
```

### 3. Test

Run the skill against your test cases:
- With skill loaded vs without
- Edge cases that should NOT trigger
- Different phrasings of the same intent

### 4. Evaluate

Score each test on:
- **Trigger accuracy** — loads when it should, silent when it shouldn't
- **Output quality** — matches expected format and depth
- **Constraint compliance** — respects all "never do" rules

### 5. Iterate

- Generalize rules rather than add case-by-case patches
- Explain the *why* behind constraints so the model can handle edge cases
- Optimize the `description` field: it's the primary trigger signal

## Rules

- ✅ DO: Write skills as concise, imperative instructions
- ✅ DO: Include concrete examples with ❌ bad / ✅ good patterns
- ✅ DO: Reference other files for deep content (`references/`)
- ✅ DO: Test against phrases that should NOT trigger the skill
- ❌ DON'T: Duplicate content that belongs in SPEC.md or rules
- ❌ DON'T: Make SKILL.md a tutorial — keep it dense and actionable
- ❌ DON'T: Add skills that are too broad (split into focused skills)

## Output Format

A new skill file at `.ai/skills/<name>/SKILL.md` (project) or `~/.ai/skills/<name>/SKILL.md` (global).
