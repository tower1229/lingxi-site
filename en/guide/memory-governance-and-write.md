# Memory Governance and Write

This page describes the stable solution contract of LingXi's memory write module, not script-level implementation details.

## Module Position

`lingxi-memory-write` sits in the middle of the memory pipeline:

- **Upstream**: `taste-recognition` decides whether a memory should be written and in what structure.
- **Midstream**: `lingxi-memory-write` decides how to govern, gate, and persist it.
- **Downstream**: `memory-retrieve` consumes memories in `pre/post` phases for execution fulfillment.

## Stable Responsibility Boundary

The write module keeps these boundaries over time:

- Accept structured payloads only (not raw conversation text)
- Do not repeat value judgment done upstream
- Execute unified governance actions: `dedupe / merge / replace / veto / new`
- Require user confirmation for high-risk paths
- Keep notes and INDEX consistent

## Governance Strategy

Governance follows a “semantic convergence first” strategy:

1. Determine relation to existing memory (same, complementary, conflicting, unrelated)
2. Choose an action (dedupe, merge, replace, veto, new)
3. Gate when needed
4. Emit audit evidence for traceability

The contract is about decision principles, not fixed internal thresholds.

## Gating Strategy

- **Low risk**: can be auto-applied (for example, clear dedupe)
- **Medium/high risk**: explicit user confirmation is required
- **New path**: confidence-based split for silent vs confirmed writes

The core objective is to balance speed with user control over critical decisions.

## Relation to Retrieval Timing

Writes can include timing metadata (`TriggerTiming`):

- `pre`: applies before execution
- `post`: applies after execution
- `both`: applies in both phases

Retrieval uses this in step C and step D, so writing directly serves execution-time behavior.

## Separation from `memory-govern`

- **Write module**: transaction-level governance during this write operation
- **memory-govern**: repository-level sync and proactive governance

They are complementary, not overlapping.

## Documentation Boundary

The website intentionally does not lock down:

- TopK thresholds and scoring internals
- complete audit event-field enumerations
- script parameters and orchestration internals

For those details, use the repository implementation and internal docs.
