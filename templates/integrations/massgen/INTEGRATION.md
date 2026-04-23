---
name: massgen
description: Multi-agent AI coordination framework — run multiple AI models (Claude, GPT-5, Gemini, Grok) in parallel on the same task, share insights between agents, and reach consensus through voting.
category: integration
tags: [multi-agent, orchestration, llm, claude, gpt, gemini, consensus, parallel]
setup: pip install massgen && massgen --setup
source: https://github.com/massgen/massgen
---

# Integration: MassGen

Coordinate multiple frontier AI models to solve complex tasks together — parallel execution, cross-agent insight sharing, and consensus voting.

## Install

```bash
pip install massgen
massgen --setup   # interactive configuration wizard
```

## How It Works

1. You send a task
2. Multiple agents (each using a different model) work in parallel
3. Agents observe each other's progress via notification system
4. Agents converge through consensus voting
5. Best solution is selected and returned

## Basic Usage

```bash
# Single query
massgen "Analyze the security implications of this API design"

# Multi-agent mode (recommended for complex tasks)
massgen --config @examples/basic/multi/three_agents_default "Your task"

# Interactive mode
massgen   # launches terminal UI
```

## Config Example

```yaml
# three_agents.yaml
agents:
  - model: claude-opus-4-7
    role: architect
  - model: gpt-5
    role: critic
  - model: gemini-2-ultra
    role: implementer
consensus: voting
max_rounds: 3
```

## Supported Models

Claude (Anthropic), GPT-5 series (OpenAI), Gemini (Google), Grok (xAI), Azure OpenAI, local models (vLLM, LM Studio), and 10+ other providers.

## Best For

- Complex tasks that benefit from multiple perspectives
- Architecture decisions where you want disagreement surfaced
- Long-running analysis where parallel work saves time
- Validation tasks (one agent proposes, others critique)

## Key Options

```bash
--model gpt-5-nano          # quick setup with specific model
--plan                      # create task plan without auto-executing
--cwd-context               # give agents access to your project directory
--config @path/to/config    # load agent configuration from YAML
```
