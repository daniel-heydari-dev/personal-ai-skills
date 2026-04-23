---
name: hooked-ux
description: Analyze where a product's habit loop breaks using the Hooked Model — trigger, action, variable reward, investment. Use when the user asks about "user retention", "habit formation", "engagement", "why users churn", "make it sticky", or wants to diagnose where their product loses users.
category: design
tags: [ux, retention, engagement, habit, hooked, product, psychology, churn]
---

# Skill: Hooked UX

Diagnose where your habit loop breaks using the Hooked Model (Nir Eyal). Output: a per-phase breakdown with specific fixes for each break point.

## The Hooked Model

```
Trigger → Action → Variable Reward → Investment → [Trigger again]
```

The model explains why some products become habits and others don't. Each phase must be working for the loop to close.

## Phase 1: Trigger

The trigger initiates the behavior. Two types:

**External triggers** (early stage — what gets them in the door):
- Notifications, emails, ads, word of mouth, press
- Sign: users only open the app when pushed; never spontaneously

**Internal triggers** (the goal — emotional cues that fire without prompts):
- Boredom → Twitter/TikTok
- Loneliness → Instagram
- Uncertainty → Google
- FOMO → Slack

**Diagnosis questions:**
- What emotion does the user feel right before they'd ideally open this product?
- Are we building toward that internal trigger, or just sending more push notifications?
- Do users who retain 90 days open the app unprompted? How often?

**Common break points:**
| Symptom | Problem | Fix |
|---------|---------|-----|
| Users only open after push | No internal trigger formed | Map the itch — what moment of day / emotion should this serve? |
| Low email open rates | External trigger irrelevant | Personalize trigger timing to user behavior pattern |
| App installed, never opened again | Trigger never lands | Onboarding must fire the first internal trigger within session 1 |

## Phase 2: Action

The simplest behavior done in anticipation of a reward. Fogg Behavior Model: **Behavior = Motivation × Ability × Trigger**.

If the action doesn't happen, it's either:
- Too hard (ability problem)
- Not rewarding enough (motivation problem)
- Trigger isn't reaching them (trigger problem)

**The 6 elements of simplicity** (reduce any of these to increase action):
1. Time — how long does it take?
2. Money — how much does it cost?
3. Physical effort — clicks, taps, scrolls
4. Brain cycles — how much thinking required?
5. Social deviance — is it socially acceptable?
6. Non-routine — does it fit their existing habits?

**Diagnosis:**
- Where do users drop off in the first session? (funnel analysis)
- What is the minimum action required to get value?
- Is the "aha moment" gated behind too much friction?

**Common break points:**
| Symptom | Problem | Fix |
|---------|---------|-----|
| High signup, low activation | Action too hard post-signup | Reduce steps to first value moment |
| Users don't complete onboarding | Onboarding too long | Cut to 3 steps max; defer everything else |
| Mobile drop-off at forms | Form friction | Auto-fill, social login, progressive disclosure |

## Phase 3: Variable Reward

Rewards must be variable — predictable rewards kill engagement. Three types:

**Rewards of the Tribe** (social):
- Likes, comments, upvotes, replies
- Social validation, belonging, recognition
- Examples: Twitter likes, Reddit karma, GitHub stars

**Rewards of the Hunt** (content/resources):
- Feed scroll, search results, deals, new items
- The uncertainty of what's next drives dopamine
- Examples: Instagram feed, eBay bidding, Product Hunt

**Rewards of the Self** (mastery):
- Progress bars, streaks, achievements, skill gains
- Intrinsic: competence, completion, control
- Examples: Duolingo streak, GitHub contribution graph

**Diagnosis questions:**
- Is our reward truly variable or always the same?
- Which reward type does our core user segment respond to most?
- How long until the user knows if they'll get a reward?

**Common break points:**
| Symptom | Problem | Fix |
|---------|---------|-----|
| Low day-3 retention | Reward not variable enough | Add social rewards; randomize discovery feed |
| Users complete onboarding and never return | Reward felt on first use, not repeatedly | Design for ongoing discovery, not one-time value |
| Power users churn at 60 days | Self-reward exhausted | Add tribe rewards (community, status) at advanced stage |

## Phase 4: Investment

The user puts something into the product that improves it for them — making the next trigger more likely.

**Forms of investment:**
- Data: profile, preferences, history, connections
- Content: posts, projects, playlists
- Social: followers, friends, reputation
- Skills: learned behaviors, shortcuts mastered

The more invested, the higher the switching cost — and the stronger the next internal trigger.

**Diagnosis questions:**
- What do users put into the product that makes it more valuable for them?
- Does the product improve with use, or stay the same?
- Are users creating content/data that would be painful to lose?

**Common break points:**
| Symptom | Problem | Fix |
|---------|---------|-----|
| Users don't personalize | Investment phase missing | Prompt profile completion as part of reward |
| No network effects | Tribe investment not rewarded | Connect users; show what they're missing in their network |
| Users leave for competitor | Investment not locked in | Make data portable but make it visible ("Your 847 notes…") |

## Full Loop Audit

Run the product through each phase:

```markdown
## Hooked Audit — [Product Name]

### Trigger
Internal trigger mapped to: [emotion]
External trigger: [channel + timing]
Break point: [where does it fail?]
Fix: [specific change]

### Action
Minimum action to reward: [steps]
Drop-off point: [funnel step]
Fix: [reduce friction at X]

### Variable Reward
Reward type: tribe / hunt / self
Variability: [high/medium/low]
Break point: [users stop caring at day X because…]
Fix: [add/change reward mechanism]

### Investment
Investment mechanism: [what they put in]
Switching cost created: [yes/no/weak]
Break point: [why investment doesn't stick]
Fix: [data flywheel, content creation, social connections]

### Loop Health: 🔴 Broken / 🟡 Weak / 🟢 Closing
```
