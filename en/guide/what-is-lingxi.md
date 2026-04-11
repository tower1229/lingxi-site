# What Is LingXi

LingXi is a Codex-native engineering workflow product.

It does three things:

1. Use `task` to turn rough requests into engineer-ready task documents
2. Use `vet` to challenge task quality before implementation starts
3. Use `memory` to distill durable engineering judgment into reusable project memory

LingXi makes engineering work more executable at the start, more reviewable before implementation, and more consistent over time.

## What LingXi Strengthens

In AI-assisted engineering work, LingXi strengthens the parts that shape quality early and keep standards reusable over time:

- framing requests into implementation-ready tasks
- clarifying boundaries, constraints, and acceptance criteria
- challenging task quality before implementation begins
- carrying forward engineering judgment from prior sessions
- turning recurring project standards into reusable memory

LingXi addresses this with a deliberately narrow product surface:

- `task` and `vet` in the foreground
- a durable engineering taste memory system in the background

## What LingXi Does

### `task`

`task` turns rough requests into structured task documents.

It combines repository context and relevant memory to shape goals, boundaries, constraints, acceptance criteria, functional requirements, and implementation guidance into an artifact an engineer can actually start from.

### `vet`

`vet` challenges task quality before implementation begins.

It reviews tasks before implementation starts. It checks whether the request is clear, bounded, constrained, testable, and justified strongly enough to trust.

### `memory`

`memory` distills durable engineering taste from historical sessions.

It preserves future-reusable engineering choices such as:

- stable preferences
- recurring constraints
- reusable heuristics
- anti-pattern signals
- repeated review sensitivities

## How LingXi Works

LingXi is composed of three layers:

1. `plugin`
2. `setup`
3. `runtime`

### Plugin

The plugin provides the installable product shell, including skills, templates, and bootstrap scripts.

### Setup

Setup creates project-local runtime artifacts such as:

- `.lingxi/`
- `.codex/agents/`
- `AGENTS.md`
- session-distill automation config

### Runtime

Runtime lives inside the target repository and stores long-lived state:

- task documents
- memory notes
- the memory index
- processed session state
- distill journal
- memory ops logs

## Why The Surface Is Small

LingXi deliberately keeps the visible workflow narrow around `task` and `vet`.

That is because:

1. these two stages most directly determine pre-implementation quality
2. they are the best place to accumulate stable engineering standards
3. a smaller surface is easier to keep clear, coherent, and testable
4. the memory layer can strengthen broad repository work without turning everything into an explicit workflow

LingXi is designed to feel small at the surface and strong underneath.

## Why Memory Matters

Memory is the long-term engine that makes the product improve with use.

The background distillation loop analyzes historical sessions, identifies durable engineering judgment, writes that judgment into `.lingxi/memory/`, and then feeds it back into future `task` and `vet` work with the smallest useful amount of context.

That is how LingXi gradually accumulates standards instead of restarting from scratch every time.

## Next

- [Quick Start](/en/guide/quick-start)
- [Core Workflow](/en/guide/core-workflow)
- [Memory System](/en/guide/memory-system)
