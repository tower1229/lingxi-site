# Core Workflow

LingXi keeps its explicit workflow surface intentionally small. The current foreground workflow is built around:

1. `task`
2. `vet`

Both are continuously strengthened by the same memory system underneath.

## Workflow Mainline

The visible foreground flow is:

```text
task → vet
```

`task` turns a request into an executable task artifact, and `vet` challenges that artifact before implementation begins.

LingXi focuses on making the two most important pre-implementation steps much stronger.

## What `task` Does

`task` turns a rough request into an engineer-ready task document.

It uses:

- user intent
- repository context
- relevant memory

to shape a structured task artifact containing elements such as:

- goals
- scope
- constraints
- acceptance criteria
- functional requirements
- development guidance

This stage matters because many implementation problems are already baked in before coding starts: weak boundaries, missing constraints, vague acceptance, or shallow solution framing.

## What `vet` Does

`vet` challenges task quality before implementation starts.

It looks for issues such as:

- ambiguity
- missing constraints
- non-testable acceptance criteria
- hidden breadth
- hidden risk
- weak rationale
- weak implementation guidance

Its output stays in a structured VetReport format.

## How Memory Participates

The workflow works together with the memory system.

When `task` drafts a task document, LingXi retrieves relevant memory and writes the memories that materially shaped the task into `memory_refs`.

When `vet` reviews the task, LingXi retrieves relevant memory again and checks whether the task already reflects those important standards. If key memory is missing from the task, `vet` treats that as a clear quality gap.

So the effective workflow can be understood as:

```text
task → vet
```

It is closer to:

```text
memory ↘
         task → vet
memory ↗
```

## Why The Workflow Has Only Two Explicit Steps

LingXi keeps the visible workflow focused on `task` and `vet` because these two stages most directly determine whether engineering work starts from a strong foundation.

This has several advantages:

1. the product boundary stays clear
2. foreground interaction stays lighter and easier to trust
3. more effort can go into memory quality, contracts, state safety, and output quality
4. it matches real engineering usage, where getting the task right and challenging it early often matters more than adding more named workflow stages

## Runtime Shape

LingXi runs inside the target repository, with primary runtime roots under:

- `.lingxi/`
- `.codex/config.toml`
- `.codex/hooks.json`
- `.codex/agents/`

A typical usage flow is:

1. install LingXi into the repository
2. run bootstrap to create runtime and automation artifacts
3. use `task` to create a task document
4. use `vet` to challenge it before implementation
5. let background `session-distill` accumulate durable engineering taste

Outside the explicit `task → vet` path, generic but meaningful repository turns also consume memory automatically through the repo-local Codex hook. That path complements `task` and `vet` rather than replacing them.

## What The Workflow Is Trying To Achieve

LingXi is trying to make three things true:

1. requests become clear enough before implementation starts
2. tasks survive a serious quality challenge before coding begins
3. engineering judgment accumulates instead of being re-explained from scratch

When those three things hold, the whole project becomes more stable than simply asking AI to start coding immediately.

## Next

- [What Is LingXi](/en/guide/what-is-lingxi)
- [Memory System](/en/guide/memory-system)
- [Quick Start](/en/guide/quick-start)
