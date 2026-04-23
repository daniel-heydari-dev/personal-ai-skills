---
name: context-engineering
description: Build production-grade AI agent systems through effective context management — multi-agent architecture, memory systems, context compression, and evaluation. Use when designing agents, debugging agent failures, building multi-agent pipelines, or when the user mentions "context window", "lost-in-middle", "agent memory", "orchestrator", or "context engineering".
category: fundamentals
tags: [agents, context, multi-agent, memory, orchestration, llm, evaluation, context-engineering]
source: https://github.com/muratcankoylan/agent-skills-for-context-engineering
---

# Skill: Context Engineering

Design and build production-grade AI agent systems. Context is not just prompt text — it's the complete state available to the model at inference time.

## Core Principle

> Context windows are constrained not by raw token capacity but by attention mechanics. Curate the highest-value information — don't stuff everything in.

## Multi-Agent Architecture

### Three Patterns

**Supervisor / Orchestrator**
```
Orchestrator
  ├── Worker A (isolated context)
  ├── Worker B (isolated context)
  └── Worker C (isolated context)
```
- Orchestrator decomposes tasks, assigns to workers
- Workers have isolated context — they don't know about each other
- Orchestrator synthesizes results

**Peer-to-Peer Swarm**
- Agents communicate directly via shared message bus
- Use when tasks are loosely coupled and emergent coordination is needed
- Higher coordination overhead — use sparingly

**Hierarchical**
- Multi-level orchestration for complex, long-running tasks
- Each level has its own context scope

> Sub-agents primarily isolate context, not replicate org charts.

## Memory Systems

### Four Types of Agent Memory

| Type | Storage | Persistence | Example |
|------|---------|-------------|---------|
| **In-context** | Token window | Session only | Working memory, current task state |
| **External** | Files, DB | Permanent | Knowledge base, past decisions |
| **Filesystem** | Disk | Permanent | Unlimited context via file reads |
| **Cached** | KV cache | Cross-turn | System prompts, loaded skills |

### Filesystem-Based Context (Recommended)

Instead of stuffing context, write to files and load selectively:

```
.context/
  session.md      ← current task state
  decisions.md    ← key decisions made
  entities.md     ← named entities discovered
  handoff.md      ← latent briefing for next agent
```

Worker agents read only what they need, when they need it.

## Context Compression

When approaching the limit:

1. **Structured summarization** — keep decisions + outcomes, drop deliberation
2. **Entity extraction** — compress to key entities and their relationships
3. **Delta encoding** — only store what changed, not full state

Target: minimize tokens-per-task-unit, not tokens-per-response.

```
Before: 8,000 tokens of full conversation history
After:  400 tokens of structured handoff briefing
```

## Lost-in-Middle Fix

Long contexts cause attention degradation in the middle. Mitigations:

- ✅ Put critical instructions at the start AND end of context
- ✅ Use sub-agents to isolate relevant context per task
- ✅ Chunk documents — don't load entire codebases at once
- ✅ Use structured formats (JSON, YAML) for facts — easier to retrieve than prose

## Latent Briefing

Technique for passing compressed state between agents:

```markdown
## Handoff Brief — [timestamp]
**Task**: Build checkout flow
**Decisions made**: Use Stripe Elements (not custom), skip saved cards v1
**Current state**: PaymentForm component created, needs validation
**Next**: Implement form validation, then wire to /api/checkout
**Blockers**: None
**Token budget used**: 12k / 200k
```

## Tool Design

- Prefer fewer, comprehensive tools over many narrow ones
- Each tool call has coordination overhead — consolidate when possible
- Tools should return structured data (JSON), not prose

## Evaluation Framework

Score agent systems on:

| Dimension | What to measure |
|-----------|----------------|
| **Task completion** | Did it accomplish the goal? |
| **Context efficiency** | Tokens per successful task |
| **Hallucination rate** | False claims per 100 outputs |
| **Recovery rate** | % of errors self-corrected |
| **Latency** | Wall time per task |

## Rules

- ✅ DO: Use filesystem for persistent state — not the context window
- ✅ DO: Write latent briefings when handing off between agents
- ✅ DO: Isolate sub-agent context — workers shouldn't share prompts
- ✅ DO: Compress before truncating — structured summary > chopped history
- ❌ DON'T: Stuff everything into the system prompt
- ❌ DON'T: Use peer-to-peer when a supervisor would do — prefer simplicity
- ❌ DON'T: Load entire files — load the relevant section
- ❌ DON'T: Ignore attention degradation — test at your actual context size
