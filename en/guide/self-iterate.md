# Self-iterate

Self-iterate is a **global feature** of LingXi: the system continuously collects run-state during operation, runs audits on a heartbeat interval, and performs **low-risk-only** auto-improvements based on audit results. The design will eventually cover memory, workflow, gating, and the rest of the system; **what is implemented today** is mainly memory-related (e.g. improvement proposals and applications). This page describes the self-iterate mechanism from architecture to implementation, and covers the **audit system**, which is a key input to self-iterate.

## Overview

- **Role**: LingXi writes important actions and outcomes to an audit log (`audit.log`) as it runs, forming a traceable “run state.” When a configured time interval has passed since the last run (default 24 hours), the session layer triggers one “diagnosis + auto-improvement” cycle: it reads recent audit and memory state, produces improvement proposals, and applies only **low-risk** actions; the main conversation does not wait and only consumes a brief report.
- **Value**: Lets LingXi become more stable and aligned with you over time; audit provides the evidence, and self-iterate consumes it and feeds back into the system (e.g. merge suggestions, index completion).

## Architecture

### Data flow

```
Runtime → Events written to audit.log (run state)
         ↓
SessionStart heartbeat check: has the interval since last self-iterate passed? (default 24h)
         ↓ Yes
Main agent step A invokes lingxi-self-iterate (background, run_in_background=true)
         ↓
Subagent: read audit.log + memory → produce proposals → apply low-risk only → write back to audit
         ↓
Main conversation does not wait; only consumes report; last_improvement_cycle_at updated
```

### Roles and responsibilities

| Role | Responsibility |
|------|----------------|
| **session-init (sessionStart)** | Read `heartbeat-control.json`; if `last_improvement_cycle_at` is older than the configured interval, inject the “self-iterate” convention. |
| **Main agent** | In step A, per convention, call mcp_task to start **lingxi-self-iterate** subagent (`run_in_background=true`); do not wait before step B/C. |
| **lingxi-self-iterate subagent** | In an isolated context: run proposal script (read audit + memory) → run apply script (approve low-risk only) → write `memory.improvement.*` etc. to audit and update `last_improvement_cycle_at`. |
| **Audit system** | Continuously append run state to `audit.log` for self-iterate to read and analyze; **key input** to self-iterate. |

## Audit system (key input to self-iterate)

Self-iterate’s “diagnosis” depends on run state, which the **audit system** writes to disk. Understanding audit clarifies what self-iterate “reads” and “changes.”

### Audit log location and format

- **Path**: `.cursor/.lingxi/workspace/audit.log`
- **Format**: NDJSON (one JSON object per line) for append and time-window reads.

### Write sources

| Source | Description |
|--------|-------------|
| **lingxi-audit.mjs** | Triggered by Cursor’s 9 hook types (beforeSubmitPrompt, afterAgentResponse, preToolUse, postToolUse, postToolUseFailure, subagentStart, subagentStop, sessionEnd, stop). **By default** only `session_end` and `stop` are written to limit size. |
| **append-memory-audit.mjs** | Called by main agent, lingxi-memory, lingxi-self-iterate, etc.; writes memory and self-iterate business events; always writes. |
| **Subagents/scripts** | e.g. lingxi-session-distill writes `heartbeat.*`; lingxi-self-iterate scripts write `memory.improvement.*`, etc. |

### Core events (written by default; relevant to self-iterate)

These events are written reliably; self-iterate uses them for diagnosis and improvement:

- **Memory and index**: `memory_note_created`, `memory_note_updated`, `memory_note_deleted`, `memory_index_updated`
- **Memory retrieval**: `memory.retrieve.performed`, `memory.retrieve.skipped`, `memory.retrieve.missing`, `memory.retrieve.invalid`
- **Session distillation**: `heartbeat.triggered`, `heartbeat.distillation_completed`, `heartbeat.distillation_failed`
- **Governance and improvement**: `memory.merge.diagnosed`, `memory.merge.invalid`; `memory.improvement.proposed`, `memory.improvement.approved`, `memory.improvement.rejected`, `memory.improvement.applied`, `memory.improvement.failed`
- **Session lifecycle**: `session_end`, `stop` (written by lingxi-audit by default)

### Debug events (optional)

With `LINGXI_AUDIT_DEBUG=1`, all 9 hook event types (e.g. `pre_tool_use`, `post_tool_use`) and retrieval-integrity events (e.g. `memory.retrieve.missing`) are written for troubleshooting and health metrics; self-iterate can use finer-grained events when debug is on.

### How audit relates to self-iterate

- **Audit**: Continuously and passively records “who did what when and with what result,” forming run-state snapshots.
- **Self-iterate**: Actively reads a time window of audit (and memory state) on a heartbeat, runs diagnosis, applies only low-risk improvements, and writes back to audit (e.g. `memory.improvement.applied`), closing the loop.

So the audit system is a **key input** to self-iterate; without it, self-iterate cannot make evidence-based improvements.

## Implementation details

### Trigger condition

- **When checked**: At each session start, by **session-init.mjs** (sessionStart).
- **Logic**: Read `last_improvement_cycle_at` from `.cursor/.lingxi/workspace/heartbeat-control.json`; if missing or older than the **configured interval** (default 24 hours), inject the “self-iterate” convention for this turn.
- **Who runs**: Main agent invokes **lingxi-self-iterate** via mcp_task in step A with `run_in_background=true`, then proceeds to step B (memory retrieval) and step C (response) without waiting.

### Control file: heartbeat-control.json

Path: `.cursor/.lingxi/workspace/heartbeat-control.json`.

Relevant fields for self-iterate:

| Field | Meaning |
|-------|---------|
| `last_improvement_cycle_at` | Timestamp (ISO 8601) of the last completed self-iterate cycle. Updated by the self-iterate subagent when a cycle finishes; used for the next trigger check. |

The file also holds session-distillation fields (e.g. `last_distillation_completed_at`, `heartbeat`, `pending_distillation`, `processed_conversation_ids`); both features share the same file, with each subagent updating its own fields.

### Subagent execution flow (current implementation)

**lingxi-self-iterate** runs in an isolated context in this order:

1. **Proposal generation**  
   Run `memory-improvement-proposal.mjs` (default 24h window): read recent `audit.log` and memory (e.g. `memory.merge.diagnosed`, note state), produce improvement proposals (findings + actions), and write `memory.improvement.proposed`.

2. **Auto-improvement**  
   Run `memory-improvement-apply.mjs --approve-all`: execute only **low-risk** actions (e.g. merge suggestions, index completion); medium/high risk are not applied and are recorded in audit (e.g. `memory.improvement.rejected`, `memory.improvement.failed`). Results written as `memory.improvement.applied`, etc.

3. **Update control file**  
   Set `heartbeat-control.json`’s `last_improvement_cycle_at` to the current time so the next cycle runs only after the interval has passed again.

4. **Return report**  
   Return a short report to the main conversation (proposal_id, findings, applied/failed/skipped, etc.); no confirmation prompts.

### Current scope and events

- **Implemented**: Mainly memory-related improvements (proposals from merge diagnostics, unindexed notes, etc., then auto-apply).
- **Events**: The full self-iterate flow produces `memory.improvement.proposed`, `memory.improvement.approved`, `memory.improvement.rejected`, `memory.improvement.applied`, `memory.improvement.failed`, all in `audit.log` for traceability and future diagnosis extensions.

### Interval and configuration

- **Default interval**: 24 hours (from an implementation constant, e.g. `IMPROVEMENT_THRESHOLD_HOURS = 24`).
- The interval is intended to be configurable; docs use “configured interval (default 24 hours)” so the default or a config option can change without rewording.

## Relation to Commands Reference

When and how self-iterate is triggered is summarized in [Commands Reference — Automatic tasks and background subagents](/en/guide/commands-reference#automatic-tasks-and-background-subagents-no-user-command). This page expands from an architecture and audit perspective. For a quick “when it runs, who runs it, does the main conversation wait,” use the Commands Reference; for “where run state comes from and how self-iterate uses audit to improve,” use this page.

## Next steps

- [Memory System](/en/guide/memory-system) — Retrieval, writing, and governance
- [Commands Reference](/en/guide/commands-reference) — Automatic tasks table
- [GitHub repository](https://github.com/tower1229/LingXi) — Main repo: `.cursor/agents/lingxi-self-iterate.md`, `heartbeat-check.mjs`, `memory-improvement-proposal.mjs`, etc.
