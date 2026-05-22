# Global AI Rules

<!--
  GLOBAL IDENTITY — installed to ~/.ai/always.md
  Loaded on EVERY message, for EVERY project on this machine.
  Target: under 200 tokens. Be ruthless — only put things here
  that truly apply to every single conversation.

  WHAT BELONGS HERE:
    ✅ Your name and preferred communication style
    ✅ Universal coding defaults (language, strict mode, formatting)
    ✅ Hard no's that apply everywhere (no console.log, no any)

  WHAT DOES NOT BELONG HERE:
    ❌ Project-specific rules → put in SPEC.md
    ❌ Technology-specific rules → put in .ai/skills/<name>/
    ❌ Agent behavior → put in .ai/agents/<name>/
    ❌ Anything longer than 2 lines → it doesn't belong here
-->

<!--
  ⚠️ EDITME — replace "Your Name" with your real name, then remove this banner.
-->

## Identity

- Developer: Your Name
- Response style: concise, direct, no filler phrases, no emoji unless asked

## Language & Defaults

- TypeScript strict mode everywhere (`"strict": true`)
- Functional patterns over classes where practical
- No `console.log` in committed code — use a logger or remove before PR
- No implicit `any` — always type explicitly or use `unknown`
- Prefer `const` over `let`; never use `var`

## Communication

- If I ask a question, answer it first — then explain if needed
- When showing code, show only the changed parts unless I ask for the full file
- Flag non-obvious trade-offs but don't over-explain obvious ones
- Ask before making large structural changes (refactors, new files, schema changes)

<!-- Keep this file UNDER 200 tokens. Add project rules to SPEC.md instead. -->
