---
name: superpowers
description: Structured agent development methodology — clarify intent first, plan before coding, use TDD with RED-GREEN-REFACTOR cycles, and review against spec. Use when starting any non-trivial coding task, or when the user says "use superpowers", "plan first", "TDD", or "think before coding".
category: fundamentals
tags: [tdd, planning, methodology, debugging, code-review, agent-workflow]
source: https://github.com/obra/superpowers
---

# Skill: Superpowers

A mandatory agent workflow: clarify → plan → test-first → implement → review. Never jump straight to code.

## Core Principle

Before writing code, step back and ask: **What are we really trying to do?**

Requirements are misunderstood. Edge cases are hidden. The fastest path to a correct solution is through alignment, not implementation.

## The Mandatory Workflow

### 1. Clarify Intent (always first)

Before touching code:
- Restate the goal in your own words and ask if it's correct
- Identify what "done" looks like — specific, observable outcomes
- Surface hidden constraints: performance, security, backward compat, budget
- Break into tasks of 2–5 minutes each

### 2. Plan

Write the plan before the code:
```
Goal: [one sentence]
Approach: [2-3 sentences]
Steps:
  1. ...
  2. ...
  3. ...
Risk: [what could go wrong]
```
Get user confirmation before proceeding.

### 3. Test-Driven Development

Write the test first, then the implementation:

```
RED   → Write a failing test for the exact behavior wanted
GREEN → Write the minimum code to make it pass
REFACTOR → Clean up without breaking the test
```

```typescript
// RED: write this first
it("calculates discount for premium users", () => {
  const result = applyDiscount({ userId: "prem-1", price: 100 });
  expect(result).toBe(80); // 20% discount
});

// GREEN: now write the minimum implementation
function applyDiscount({ userId, price }: DiscountInput): number {
  const isPremium = userId.startsWith("prem-");
  return isPremium ? price * 0.8 : price;
}

// REFACTOR: extract constants, add types, improve naming
```

### 4. Systematic Debugging

When something breaks:
1. Form a hypothesis — state it explicitly
2. Add one probe at a time (log, breakpoint, test)
3. Confirm or reject the hypothesis
4. Root-cause before fixing — don't patch symptoms

```
Hypothesis: "The discount isn't applied because isPremium is always false"
Probe: console.log({ userId, startsWithPrem: userId.startsWith('prem-') })
Result: userId is undefined → root cause: missing prop in parent component
Fix: pass userId to component
```

### 5. Two-Stage Review

Before calling work done:
1. **Spec compliance** — does the implementation match the agreed plan exactly?
2. **Code quality** — naming, complexity, error handling, tests coverage

## Autonomous Execution

For extended tasks:
- Break into independently verifiable chunks
- Commit working state frequently
- Use git worktrees for parallel branches
- Report blockers immediately — never assume or guess past an ambiguity

## Rules

- ✅ DO: Always clarify before implementing
- ✅ DO: Write the test before the function
- ✅ DO: State hypotheses explicitly when debugging
- ✅ DO: Get plan confirmation for tasks > 30 minutes
- ❌ DON'T: Write code before the goal is unambiguous
- ❌ DON'T: Patch symptoms — find root cause first
- ❌ DON'T: Mark work done without running the test suite
- ❌ DON'T: Skip the review stage under time pressure
