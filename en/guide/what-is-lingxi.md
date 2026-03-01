# What is LingXi

LingXi is a **Cursor plugin** that gives developers a **persistent memory workflow** — making AI work the way you do.

## The Problem

When working with AI coding tools like Cursor, you likely run into these issues:

- **Every conversation starts from scratch** — AI doesn't remember your past decisions, preferences, or lessons learned
- **No engineering process** — AI jumps straight to code without requirements analysis, design review, or code review
- **Context overload** — As conversations grow longer, information gets noisy and AI output quality drops
- **Team knowledge stays siloed** — Each person's AI collaboration experience is locked inside their own chat history

## How LingXi Solves This

### 🧠 Persistent Memory

LingXi captures your judgments, preferences, and lessons learned during development **when you run /remember or /refine-memory**, or optionally when you run **/init** to set up the project, distilling them into structured "memory notes." In every new conversation, LingXi **automatically retrieves and injects** the most relevant memories, so AI truly "knows" how you work.

### 🔄 Flexible Workflow

An end-to-end development flow:

```
/task → /vet → /plan → /build → /review
```

Every step is **optional**. Simple tasks can go straight from `/task` to `/build`. Complex tasks can follow the full flow. You decide when to use which command.

### 🛡️ Human in the Loop

AI never acts on its own. Key decisions — requirement confirmation, memory writes, approach selection — always need your approval.

### 🎯 Context Curation

Using a dual-path retrieval system (semantic + keyword), LingXi injects only 0–3 of the most relevant memories per conversation turn, avoiding information overload and keeping the model focused.

## Design Philosophy

| Principle | Meaning |
|-----------|---------|
| **In Sync With You** | Persistent memory so the AI works the way you do |
| **AI Native** | Respect AI capability and leave room for evolution; key decisions are human-led, with gates |
| **To Your Liking** | Lower cognitive load, smooth user-friendly experience |

## How This Differs From Cursor Rules and Other Approaches

LingXi provides **persistent memory plus a structured workflow**, unlike static Cursor Rules or one-off prompts: it focuses on cross-session "learning" and an optional pipeline (task → vet → plan → build → review). Memories are captured **via /remember and /refine-memory** or optionally during **/init**, and are injected when relevant in new conversations, rather than being fixed rules.

## Next Steps

Ready to get started? Head to [Quick Start](/en/guide/quick-start) to install LingXi in your project.
