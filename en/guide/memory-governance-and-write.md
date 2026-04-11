# Memory Governance and Write

This page describes the stable responsibilities of LingXi's memory midstream: how durable candidates enter governance, how they are written, and why that layer exists.

## Module Position

The LingXi memory mainline can be understood in three parts:

1. upstream extraction and adjudication
2. midstream governance and write
3. downstream retrieval and application

The governance-and-write layer is the part that turns adjudicated durable candidates into stable memory notes.

## What This Layer Does

The current write layer is responsible for:

1. accepting structured candidates
2. deciding create, merge, or skip
3. assigning note ids
4. writing note files
5. rebuilding `INDEX.md`
6. updating runtime state and operation logs

It works from structured candidates and carries the persistence contract of the memory system.

## Current Governance Actions

In the current LingXi mainline, the primary governance actions are:

- `create`
- `merge_into_existing`
- `skip_as_not_durable`

This means the main job of the governance layer is to:

- write new high-value judgment into memory
- merge semantically equivalent or stronger judgment into existing notes
- actively skip content that should not become long-lived memory

## What Governance Uses To Decide

The governance layer considers signals such as:

- the candidate's semantic meaning
- `content_type`
- `value_scores`
- `suggested_storage_kind`
- the existing notes already present in the memory store

It cares about semantic relation. For example:

- whether two candidates express the same engineering judgment
- whether a candidate is a stronger version of an existing note
- whether a candidate is still too transient or noisy

## Why Governance Is Separate From Distillation

LingXi separates upstream distillation from midstream governance so the system keeps a cleaner contract:

### Upstream answers

- is this worth treating as durable engineering judgment
- what kind of judgment is it
- in what scene is it useful

### Midstream answers

- should this become a new note
- should it merge into an existing note
- should it be skipped to avoid polluting memory

If these are collapsed into one step, the system easily degrades into direct note generation, which is weaker for both quality control and long-term governance.

## Stable Artifacts After Write

After governance succeeds, LingXi writes notes into:

- `.lingxi/memory/project/`
- `.lingxi/memory/share/`

And maintains:

- `.lingxi/memory/INDEX.md`

It also updates runtime state such as:

- `.lingxi/state/processed-sessions.json`
- `.lingxi/state/distill-journal.jsonl`
- `.lingxi/state/memory-ops.jsonl`

So this layer writes notes and maintains the consistency of the whole memory runtime.

## Why The Write Layer Is Deterministic

LingXi lets LLMs handle extraction, adjudication, governance judgment, and ranking, but it keeps persistence deterministic.

That is because:

1. semantic judgment needs model reasoning
2. ids, files, indexes, and state need stability
3. repeated runs must not silently corrupt memory
4. the memory runtime must remain auditable and testable

So the write layer is optimized less for cleverness and more for consistency and safety.

## How It Relates To Retrieval

The point of write governance is to keep the notes useful for downstream application.

Those notes are ultimately consumed by retrieval:

- `task` uses them while drafting
- `vet` uses them while challenging tasks
- other meaningful repository work can use them through memory brief primitives

So the write layer is always in service of better downstream judgment.

## Next

- [Memory System](/en/guide/memory-system)
- [Engineering Taste Extraction and Adjudication](/en/guide/how-to-recognize-developer-taste)
