# Memory System

The memory system is LingXi's long-term capability layer.

It distills stable engineering judgment from historical sessions and applies that judgment back into future `task`, `vet`, and other meaningful repository work.

## What The Memory System Stores

LingXi memory focuses on reusable engineering judgment and experience.

It focuses on future-reusable engineering judgment such as:

- stable implementation preferences
- recurring project constraints
- reusable heuristics
- anti-pattern signals
- repeated review sensitivities

LingXi refers to this as durable engineering taste.

## Core Flow

The current memory mainline can be understood as six steps:

1. select valid sessions
2. `taste extract`
3. `taste adjudicate`
4. `governance`
5. `write + index rebuild`
6. `retrieve for task / vet / meaningful repo turn`

### 1. Select Valid Sessions

The background distill runner first filters historical sessions down to valid source material.

It prioritizes sessions with real repository engineering signal and excludes unsuitable material such as bookkeeping-only conversations or memory-about-memory chatter.

### 2. Taste Extract

`taste extract` is the high-recall extraction stage.

It first identifies plausible judgment candidates with fields such as:

- `scene`
- `content_type`
- `alternatives`
- `choice`
- `rationale`
- `evidence`
- `pattern_hint`
- `confidence`

This stage is about recovering the decision structure before trying to finalize durable memory.

### 3. Taste Adjudicate

`taste adjudicate` is the precision-first decision stage.

LingXi uses it to decide which candidates really deserve durable memory treatment, and to produce note-ready durable-memory fields. Adjudication considers value dimensions such as:

- `decision_gain`
- `reusability`
- `trigger_clarity`
- `verifiability`
- `stability`

Accepted candidates are enriched with fields like:

- `title`
- `kind`
- `one_liner`
- `decision`
- `when_to_load`
- `durability_reason`
- `value_scores`
- `suggested_storage_kind`

## 4. Governance

Candidates that pass adjudication still go through governance before persistence.

Governance answers:

1. should this create a new note
2. should it merge into an existing note
3. should it be skipped to avoid polluting memory

The current main actions are `create / merge_into_existing / skip_as_not_durable`, using `content_type`, `value_scores`, and `suggested_storage_kind` as primary signals.

## 5. Write And Index

Approved notes are written into the project runtime:

- `.lingxi/memory/project/`
- `.lingxi/memory/share/`

LingXi also rebuilds:

- `.lingxi/memory/INDEX.md`

The runtime keeps additional state for safe operation:

- `.lingxi/state/processed-sessions.json`
- `.lingxi/state/distill-journal.jsonl`
- `.lingxi/state/memory-ops.jsonl` (created lazily after retrieval / distill / governance operations begin)

Together, these give LingXi:

- session dedupe and re-distill control
- a visible distill journal
- auditable retrieval, distill, and governance operation logs

## 6. Retrieval

After notes are written, the system becomes useful through retrieval.

LingXi retrieval combines the query with caller context, ranks notes semantically, and returns only the smallest useful high-signal set.

It already distinguishes between two explicit workflow intents, and it also serves generic repository turns:

### Task Intent

For `task`, LingXi prioritizes memories about:

- implementation boundaries
- contract constraints
- rollback and delivery guidance
- stable engineering preferences

### Vet Intent

For `vet`, LingXi prioritizes memories about:

- anti-patterns
- review tendencies
- hidden risk
- prior failure modes
- important constraints the task may have ignored

### Meaningful Repository Turns

In addition to `task` and `vet`, LingXi now consumes memory for generic but meaningful repository conversations.

In Codex and Claude Code, this path no longer depends on a manual command. Instead, a repo-local `UserPromptSubmit` hook:

- checks whether the current prompt is meaningful repository work
- retrieves the smallest relevant memory set using prompt, caller, and project context
- injects the resulting brief as hidden turn context when there is a hit

That means LingXi now has two main memory-consumption paths:

1. `task` / `vet`: direct retrieval from the workflow implementation
2. generic repository turns: automatic injection through the repo-local hook (Codex or Claude Code)

## How Memory Feeds Task And Vet

When `task` drafts a new task document, it retrieves relevant memory and records the memories that materially shaped the task in the task's memory-application layer.

When `vet` reviews a task, it retrieves relevant memory again and checks whether the task already reflects those important judgments. If the task ignored material memory, LingXi treats that as an explicit quality gap.

For generic repository turns, LingXi injects the smallest useful memory brief through the hook adapter.

That is why memory in LingXi serves as a broader judgment layer: it keeps strengthening `task`, `vet`, and meaningful repository conversations.

## Why It Is Designed This Way

LingXi uses a hybrid model of semantic reasoning plus deterministic safety.

LLMs handle:

- candidate extraction
- adjudication
- governance judgment
- retrieval ranking

Deterministic scripts handle:

- schema validation
- state safety
- persistence
- id allocation
- index rebuild
- session dedupe

This split exists because semantic judgment needs model reasoning, while contracts, state, and persistence need stable and testable behavior.

## Next

- [Core Workflow](/en/guide/core-workflow)
- [Quick Start](/en/guide/quick-start)
