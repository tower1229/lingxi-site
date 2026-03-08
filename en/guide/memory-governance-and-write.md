# Memory Governance and Write

Memory writes are executed by the **lingxi-memory** subagent in an **isolated context**: it accepts only the payloads array produced by taste-recognition, validates it, then invokes the **memory-write** skill to map, govern, gate, and write directly to `memory/project/`, `memory/share/`, and `memory/INDEX.md`, returning a **brief report** to the main conversation. This page describes lingxi-memory’s responsibility boundary, execution pipeline, and governance logic so developers can see where “write” sits in the memory system.

## Role in the Memory System

- **Upstream**: The main agent first calls [taste-recognition](/en/guide/how-to-recognize-developer-taste) to produce extended payloads (7 fields + layer). Only when payloads is non-empty does it pass the **payloads array** (and optional conversation_id, generation_id) to lingxi-memory.
- **Downstream**: lingxi-memory does not produce candidates or perform elevation; after validating payloads it invokes the **memory-write** skill to “map payload to note → govern (TopK) → gate → write to disk”; when all processing is done, it returns a single brief report (counts of created/merged/skipped and Id list).
- **Retrieval**: Written notes are later retrieved by [memory-retrieve](/en/guide/memory-system#memory-retrieval) each turn via dual-path search and minimal injection; retrieval is decoupled from the write flow.

So: **what is allowed into memory and in what shape** is decided by taste-recognition; **which note it lands in, whether to merge/replace, and whether to prompt the user** is decided by lingxi-memory. See [Memory System](/en/guide/memory-system) and [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

## Responsibility Boundary

- **Accepts only** the **payloads array** produced by taste-recognition (extended structure: 7 required fields + layer; optional l0OneLiner, l1OneLiner, patternHint, patternConfidence). Raw user messages, dialogue snippets, or drafts must not be passed in.
- **Does not elevate**: no value judgment, scoring, or pattern alignment; elevation is done in taste-recognition; this subagent only receives payloads that are “already approved for write.”
- **Execution pipeline**: validate → invoke memory-write skill: map payload to note fields → govern (semantic-neighbor TopK) → gate → write directly to disk (memory/project/, memory/share/ + INDEX).

## Execution Steps (6)

After receiving the payloads array and optional conversation_id, generation_id, it runs in order:

1. **Input validation**: Ensure payloads is a non-empty array; validate each item’s required fields (7 + layer) and optional field types/enums; reject with error and suggestion if invalid.
2. **Mapping and completion**: Generate each note’s Meta, When to load, One-liner, Context/Decision, L0/L1 from the payload and mapping rules; no extra processing or elevation on the note.
3. **Governance**: Run semantic-neighbor TopK over `memory/project/` and `memory/share/` to decide the relationship with existing notes, yielding **merge / replace / veto / new**.
4. **Gating**: For merge or replace, **must** collect user confirmation via ask-questions; for new, branch on `payload.confidence`: high can write silently, medium/low require confirmation.
5. **Write**: Read/write files directly—create/update/delete note files per governance result, sync INDEX; after each write, append a memory audit entry to `audit.log`.
6. **Report to main conversation**: When all processing is done, return a **brief report** (created/merged/skipped counts and Id list); do not output procedural detail or implementation details.

## Governance Logic (Semantic-Neighbor TopK)

- Run semantic-neighbor search (Top 5) over `memory/project/` and `memory/share/`; for each neighbor evaluate same_scenario, same_conclusion, conflict, completeness.
- **merge**: Same scenario and same conclusion → merge into a more complete version; remove old note and update INDEX; new note’s Supersedes lists the replaced MEM-xxx.
- **replace**: Conflict and user explicitly chooses new conclusion → overwrite or delete old then create new; maintain Supersedes.
- **veto**: Conflict but cannot decide which is better and user has not given a decisive choice → do not write; suggest supplying more info or let user choose which to keep.
- **new**: No TopK neighbor qualifies for merge/replace → create new note and INDEX row.

Governance scope must **include notes already written in this batch this turn** so the same batch does not create duplicate semantic notes.

## User Gating

- **merge / replace**: Must trigger confirmation via ask-questions (e.g. “Governance: MERGE/REPLACE, proceed?”); only write or delete after user confirms.
- **new and confidence=high**: Can write silently; still append `memory_note_created` audit.
- **new and confidence=medium or low**: Must confirm via ask-questions before writing.
- Delete, merge, and replace **always** require the user to make an explicit choice in this conversation; no silent execution of high-risk actions.

## Write Paths and Audit

- **Project-level** (apply not team or missing): note written to `.cursor/.lingxi/memory/project/MEM-<id>.md`; INDEX File column `memory/project/MEM-<id>.md`.
- **Team-level** (apply=team): note written to `.cursor/.lingxi/memory/share/MEM-<id>.md` for cross-project reuse (e.g. git submodule).
- **Audit**: After each create/update/delete of a note or update of INDEX, append an NDJSON event to `.cursor/.lingxi/workspace/audit.log` via `append-memory-audit.mjs` (e.g. `memory_note_created`, `memory_note_updated`, `memory_note_deleted`, `memory_index_updated`) for traceability and compliance.

## Proactive memory governance: /memory-govern

Besides the **write-time** governance performed by lingxi-memory (TopK, merge/replace/veto/new), LingXi provides **/memory-govern** for **index sync and proactive library governance**:

1. **Sync**: A script (under the memory-govern skill) scans `memory/project/`, `memory/share/`, and INDEX, **removes orphan index rows** (INDEX entries whose note file is missing), and reports **unindexed notes**. The model then generates INDEX rows for each unindexed note so retrieval stays accurate.
2. **Proactive governance (optional)**: The model can suggest merge/rewrite/archive actions for the whole library; changes are applied only after your confirmation via ask-questions.

Run **/memory-govern** in Cursor after adding or updating shared memories (e.g. after `git submodule update`), or when you want to tidy the index and get governance suggestions. No separate Node.js script is required. See [Memory System — /memory-govern](/en/guide/memory-system#memory-govern--sync-index-and-proactive-governance) and [Commands Reference](/en/guide/commands-reference#memory-govern).

## Related Links

- [Memory System](/en/guide/memory-system) — Overview of retrieval, write entry points, and governance loop
- [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste) — taste-recognition and payload contract
- Main repo [lingxi-memory](https://github.com/tower1229/LingXi/blob/main/.cursor/agents/lingxi-memory.md) — Full input contract and responsibility for invoking memory-write; [memory-write](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/memory-write/SKILL.md) — Mapping rules, governance, and gating format
