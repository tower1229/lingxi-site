# Memory System

The memory system is LingXi's long-term capability layer: it turns decisions from past conversations into reusable assets, then reuses them with minimal interruption.

This page focuses on **architecture-level consistency** and **solution-level accuracy**, not implementation-level details.

## Module View

The memory system has five functional modules:

| Module | Purpose | Stable responsibility |
| --- | --- | --- |
| **Capture** | Turn inputs into candidate knowledge | Identify reusable signals and produce structured payloads |
| **Write** | Persist candidates to memory | Validate, govern, gate, and write to project/team memory |
| **Retrieve** | Reuse memory when needed | Return minimal actionable context |
| **Index & Governance** | Keep the memory base maintainable | Keep INDEX consistent and support proactive governance |
| **Audit & Self-iterate** | Improve over time from runtime signals | Record evidence and apply periodic low-risk improvements |

## Core Data Layers

- **Memory notes**: `memory/project/` + `memory/share/`
- **Unified index**: `memory/INDEX.md` (SSoT, minimal metadata)
- **Audit log**: `audit.log` (runtime evidence + improvement signals)

These form a three-layer model: content, index, and evidence.

## Runtime Contract

Each turn follows a consistent sequence:

1. **Step A/B**: Session init and convention injection (including heartbeat checks)
2. **Step C (pre)**: Run retrieval before response/implementation
3. **Main execution**: response, coding, tests, etc.
4. **Step D (post, conditional)**: Run retrieval again only when files were written

`TriggerTiming` declares when a memory should apply: `pre`, `post`, or `both`.

## Memory Write Paths

Memories enter the system through three paths:

- **Manual capture**: `/remember`
- **Init capture**: `/init` (write only after explicit confirmation)
- **Automatic capture**: session distillation and workflow taste sniffing

Writing is handled by `lingxi-memory-write` with a stable chain: validate -> govern -> gate -> write.  
In short: recognition decides **whether** to write; write module decides **how/where** to write.

## Governance Strategy

The goal is not “store more,” but “keep high-value, low-noise, traceable memory”:

- **Write governance**: dedupe, merge, replace, veto, new
- **Retrieval governance**: minimal injection (adopt only, limited count)
- **User gating**: explicit confirmation for high-risk changes
- **Structure governance**: INDEX and notes stay consistent
- **Audit governance**: key actions remain replayable

## Index Sync and Proactive Governance

Use `memory-govern` when shared memory changes or when you need cleanup:

- Sync INDEX with notes
- Resolve orphan rows and unindexed notes
- Apply optional governance suggestions after confirmation

## Documentation Boundary

To reduce frequent doc-code re-alignment, this page intentionally does not freeze:

- script-level parameters and internal thresholds
- full event-field catalogs
- subagent internal execution details

Those belong to the repository implementation and internal docs. The website guarantees architecture and solution contracts.

## Next Steps

- [Memory Governance and Write](/en/guide/memory-governance-and-write)
- [Self-iterate](/en/guide/self-iterate)
- [Commands and Workflow Reference](/en/guide/commands-reference)
