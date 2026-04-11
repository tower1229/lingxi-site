# LingXi Website Research Notes

> Updated on 2026-04-11 against the current `tower1229/LingXi` repository implementation.

## Product Definition

LingXi is a Codex-native engineering workflow product.

Its current visible surface is intentionally narrow:

1. `task`
2. `vet`
3. `memory` as a durable background judgment layer

The current product is best described as:

- a narrow foreground workflow
- a durable engineering taste memory system
- a project-local runtime installed into the target repository

## Core Positioning

LingXi helps teams:

1. turn rough requests into engineer-ready task documents
2. challenge task quality before implementation starts
3. accumulate durable engineering judgment over time

This means the website should describe LingXi as a quality-focused engineering workflow system rather than a broad workflow suite.

## Current Architecture

LingXi 2.0 is built from three layers:

1. `plugin`
2. `setup`
3. `runtime`

### Plugin

The installable shell packages:

- `.codex-plugin/plugin.json`
- `skills/`
- `scripts/`
- `templates/`

### Setup

Setup and bootstrap create project-local runtime artifacts such as:

- `.lingxi/`
- `.codex/agents/`
- `AGENTS.md`
- session-distill automation artifacts

### Runtime

The runtime lives in the target repository and stores:

- task documents
- memory notes
- memory index
- processed sessions state
- distill journal
- memory ops logs

## Foreground Workflow

The current foreground workflow is:

```text
task → vet
```

### `task`

`task` turns rough requests into structured task documents that an engineer can actually build from.

It combines:

- user intent
- repository context
- relevant memory

to produce a stronger task artifact with boundaries, constraints, acceptance criteria, and development guidance.

### `vet`

`vet` challenges task quality before implementation starts.

It inspects:

- ambiguity
- missing constraints
- hidden breadth
- hidden risk
- weak acceptance coverage
- weak solution framing
- weak development guidance

It returns a stable structured VetReport.

## Memory System

The memory system is one of LingXi's defining capabilities.

It distills durable engineering taste from historical sessions and applies that judgment back into future work.

### Current Mainline

```text
session selection
→ taste extract
→ taste adjudicate
→ governance
→ write
→ retrieval
```

### What Is Being Distilled

LingXi distills reusable engineering judgment such as:

- stable preferences
- recurring constraints
- reusable heuristics
- anti-pattern signals
- review tendencies
- troubleshooting experience

### Why The New Memory System Matters

The current implementation no longer treats memory as generic conversation recall.

It now explicitly separates:

1. high-recall extraction
2. precision-first adjudication
3. governance and persistence
4. task/vet-intent retrieval

That gives the current product a clearer and more coherent memory architecture.

## Retrieval Model

LingXi retrieval is intent-aware.

It distinguishes between:

- `task` intent
- `vet` intent

For `task`, retrieval prioritizes:

- implementation boundaries
- contract constraints
- rollback guidance
- stable engineering preferences

For `vet`, retrieval prioritizes:

- anti-patterns
- review tendencies
- hidden risk
- missed constraints
- historical failure modes

## Runtime State

Current runtime data roots include:

```text
.lingxi/
  tasks/
  memory/
    INDEX.md
    project/
    share/
  state/
    processed-sessions.json
    distill-journal.jsonl
    memory-ops.jsonl
  setup/
    automation.session-distill.toml
.codex/
  agents/
    lingxi-session-distill.toml
AGENTS.md
```

## Website Implications

The website should consistently present LingXi as:

1. a Codex-native engineering workflow product
2. centered on `task`, `vet`, and durable engineering taste memory
3. running through `plugin + setup + runtime`
4. strengthened by a memory system with explicit extraction, adjudication, governance, and retrieval

The website should use current product terminology such as:

- `task` and `vet` as the foreground workflow
- `plugin + setup + runtime` as the product structure
- `.lingxi/` and `.codex/agents/` as the runtime roots
- `taste extract` and `taste adjudicate` as the distillation stages
- `session-distill` as the background accumulation loop

## Current Website Rewrite Rule

When rewriting website content, prefer these questions:

1. What does LingXi do?
2. How does LingXi do it?
3. Why is it designed that way?

This keeps the site aligned with the current product without relying on legacy contrast.
