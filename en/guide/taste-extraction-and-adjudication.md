# Engineering Taste Extraction and Adjudication

This page explains how LingXi turns engineering judgment from historical sessions into structured candidates that can eventually become reusable memory.

The current extraction mainline in LingXi is built around:

1. `taste extract`
2. `taste adjudicate`

Together, these form the engineering-taste distillation stage of the current memory system.

## What LingXi Is Distilling

LingXi is distilling durable engineering taste: engineering judgment that can still help future work.

Typical examples include:

- stable preferences
- decision experience
- domain knowledge
- product or business knowledge
- organization experience
- reusable heuristics
- recognizable patterns
- anti-pattern signals
- troubleshooting and root-cause experience

LingXi first tries to recover their decision structure before they move into the rest of the memory pipeline.

## Step One: Taste Extract

`taste extract` is the high-recall extraction stage.

Its goal is to recover plausible engineering judgment candidates from historical sessions.

Current candidates carry fields such as:

- `scene`
- `content_type`
- `alternatives`
- `choice`
- `rationale`
- `evidence`
- `pattern_hint`
- `confidence`

The key idea is that LingXi remembers the situation, the nearby alternatives, and the reason for the choice alongside the conclusion.

## Step Two: Taste Adjudicate

`taste adjudicate` is the precision-first decision stage.

This stage asks whether the judgment is worth becoming long-lived memory.

LingXi currently evaluates dimensions such as:

- `decision_gain`
- `reusability`
- `trigger_clarity`
- `verifiability`
- `stability`

Only candidates that pass adjudication get note-ready durable-memory fields such as:

- `title`
- `kind`
- `one_liner`
- `decision`
- `when_to_load`
- `durability_reason`
- `value_scores`
- `suggested_storage_kind`

## Why LingXi Splits This Into Two Steps

LingXi separates `extract` and `adjudicate` because they optimize for different things:

### Extract Optimizes For Recall

This stage asks whether there might be a reusable judgment worth preserving.

### Adjudicate Optimizes For Precision

This stage asks whether the candidate is really valuable enough for durable reuse.

That split lets LingXi avoid missing important judgment too early while also preventing noisy candidates from reaching the memory store.

## What `content_type` Is For

LingXi first identifies a candidate's `content_type`, then later maps it to a more stable storage `kind`.

This is intentional:

1. the recognition layer cares about what kind of engineering judgment is being recognized
2. the storage layer cares about what durable note kind it should become

That is why the system uses both:

- a more expressive `content_type`
- a more stable `kind`

This allows more precise extraction without sacrificing storage stability.

## Boundary Between Distillation And Governance

The distillation stage prepares durable candidates for downstream governance.

Its job is to:

1. recover judgment candidates from sessions
2. adjudicate their long-term value
3. produce a durable candidate set for downstream governance

Only after that does memory governance decide whether to:

- create a new note
- merge into an existing note
- skip the candidate to avoid polluting memory

So the current LingXi memory mainline is:

```text
session selection
→ taste extract
→ taste adjudicate
→ governance
→ write
→ retrieval
```

## Why This Approach Fits LingXi

LingXi is building a reusable engineering judgment layer.

Without extraction and adjudication first:

- memory would drift toward session summaries
- governance would have to clean up too many weak candidates
- retrieval would struggle to consistently surface the judgments that really matter

Extraction, then adjudication, then governance makes the memory system behave more like an engineering judgment store than a conversation archive.

## Next

- [Memory System](/en/guide/memory-system)
- [Memory Governance and Write](/en/guide/memory-governance-and-write)
