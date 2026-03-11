# Taste Sniffing

Taste sniffing is the workflow's decision-sampling module: it captures your preferences and principles at key trade-off points and turns them into reusable memory.

## Position in the System

- **Trigger layer**: decision points appear in task/plan/build/review
- **Collection layer**: choices are gathered by questioning or contextual understanding
- **Recognition layer**: `taste-recognition` outputs structured payloads
- **Write layer**: `lingxi-memory-write` governs and persists
- **Reuse layer**: `memory-retrieve` reuses memory in pre/post phases

## Trigger Principles

Taste sniffing is not “always ask”; it is “ask when a decision matters”:

- solution trade-offs
- convention exceptions
- acceptance boundaries

Before asking, the system first tries memory retrieval.  
If existing memory already covers the context, it can be reused directly.

## Output Contract

Taste-sniffing output shares the same memory contract as `/remember`:

- same extended payload structure
- same write governance and gating
- different source marker (workflow-origin is typically `source=choice`)

## Responsibility Split

- **taste-recognition**: decides whether and what to capture
- **lingxi-memory-write**: decides how to govern and persist
- **memory-retrieve**: decides when to apply memory during execution

## Documentation Boundary

This page defines responsibilities and trigger principles only. It does not freeze:

- per-phase question templates
- internal rule tables and scoring details
- field-mapping implementation specifics

For those details, use the repository implementation and internal rules.

## Next Steps

- [Memory System](/en/guide/memory-system)
- [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste)
- [Commands and Workflow Reference](/en/guide/commands-reference)
