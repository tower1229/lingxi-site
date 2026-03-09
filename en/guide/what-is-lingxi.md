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

LingXi captures your judgments, preferences, and lessons learned during development through **three capture paths**: **automatic** (automatic session distillation), **manual** (/remember, /init), and **workflow taste sniffing** (collecting your choices during task/plan/build/review when context calls for it; see [Taste Sniffing](/en/guide/taste-sniffing)), distilling them into structured "memory notes." In every new conversation, LingXi **automatically retrieves and injects** the most relevant memories, so AI truly "knows" how you work.

### 🔄 Self-iterate

LingXi **self-iterates**: it continuously collects system run state and, on a default 24-hour heartbeat, audits that state. Low-risk improvements found during audit (e.g. memory merge suggestions, index completion) are applied in the background—no extra action from you, and your main conversation is never interrupted; you only get a short brief. Self-iterate is a global feature and will gradually extend to the workflow, gating, and more subsystems, so LingXi becomes more stable and more attuned to you the longer you use it.

### 🔄 Flexible Workflow

An end-to-end development flow driven by **task, vet, plan, build, review** **Skills**:

```
task → vet → plan → build → review
```

Invoke them **explicitly** via `/task`, `/plan`, etc. or natural language (e.g. “run task”). These workflow Skills are for manual or explicit invocation only; they are not auto-loaded by semantic match. The flow is composable on demand with decoupled entry points; you decide when to use each skill.

**When to use this workflow**: The LingXi workflow is intended for tasks that are **larger than ~3 person-days and of medium-to-high complexity** — such tasks benefit from upfront architecture and solution design; **task + vet** help architects (or whoever owns the design) shape the architecture and overall plan. For simpler tasks, using your IDE's Agent mode is enough; there is no need to start the LingXi workflow.

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

LingXi provides **persistent memory plus a structured workflow**, unlike static Cursor Rules or one-off prompts: it focuses on cross-session "learning" and a decoupled, on-demand workflow (task / vet / plan / build / review **Skills**). Memories are captured through **three paths** — **automatic** (automatic session distillation), **manual** (/remember, /init), and **workflow taste sniffing** (context-driven during task/plan/build/review; see [Taste Sniffing](/en/guide/taste-sniffing)) — and injected when relevant in new conversations; **self-iterate** is a global feature that runs diagnosis and auto-improvements in the background on a schedule, with memory-related improvements implemented today and more of the system to be covered over time.

## Next Steps

Ready to get started? Head to [Quick Start](/en/guide/quick-start) to install LingXi in your project.
