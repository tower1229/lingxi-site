# Self-iterate

Self-iterate is LingXi's background improvement module: on a heartbeat cycle, it runs **diagnose -> low-risk apply -> write back evidence**.

## Module Goals

- Improve system quality continuously from real runtime signals
- Turn observed behavior into actionable improvements
- Keep the main conversation uninterrupted

## Architectural Position

Self-iterate is a collaboration among three roles:

| Role | Responsibility |
| --- | --- |
| `session-init` | Checks heartbeat conditions at session start |
| Main Agent | Starts the background subagent in step A without blocking |
| `lingxi-self-iterate` | Reads audit/memory state, applies low-risk improvements, returns a brief report |

## High-level Loop

1. Runtime events are written to `audit.log`
2. Heartbeat condition is met and self-iterate is injected
3. Background diagnosis and improvement run
4. Results are written back to audit and control state
5. Next cycle repeats

This forms a closed loop: observe -> diagnose -> act -> observe.

## Current Scope

The current implementation mainly targets memory-system improvements, including:

- convergence of memory-governance signals
- index consistency related improvement opportunities
- INDEX drift signals (difference between index scale and note-file scale)

Broader workflow-level optimization follows the same mechanism over time.

## Risk Control Strategy

- Auto-apply low-risk actions only
- Keep medium/high-risk actions as suggestions
- Never block the main conversation
- Preserve session-level idempotency (no repeated trigger in one session)

## Relationship with the Audit System

Audit is both input and output for self-iterate:

- **Input**: key runtime actions and outcomes
- **Output**: proposals, applied actions, and failure reasons

At website level, the contract is capability-oriented: observable, traceable, and replayable.

## Documentation Boundary

To reduce maintenance churn, this page does not freeze:

- script execution order and parameters
- full event-field catalogs
- internal thresholds and scheduler details

Those details live in the repository implementation and internal documentation.
