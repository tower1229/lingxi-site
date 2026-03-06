# Memory System

The memory system is LingXi's core capability — it lets AI **learn your judgment, taste, and responsibility within projects**, reusing them naturally in every new conversation.

## How It Works

```
Conversation starts
  ↓
Auto-retrieve memories (memory-retrieve)
  ↓
Inject 0–2 most relevant memories
  ↓
AI responds with your "experience"
```

**Memory retrieval** is triggered automatically each turn by the session convention. **Memory writing is never automatic**; it is triggered only when you run a command or when the workflow runs built-in taste sniffing (see below). **Proactive memory capture** uses **/remember** and **/extract**; **/init** can optionally write memories when you initialize a project (confirmed drafts → memory), which is part of the init flow, not a routine capture entry point. The process stays silent and does not interrupt your workflow.

## Memory Retrieval

Before each conversation turn, LingXi automatically runs `memory-retrieve` to find the most relevant notes:

- **Dual-path retrieval**: Semantic search + keyword matching, merged with weighted scoring
- **Minimal injection**: Only top 0–2 results, avoiding context pollution
- **Graceful degradation**: Falls back to keyword-only when semantic search is unavailable; stays silent when nothing matches

## Memory Writing

Memory writing is **triggered only by you or by the workflow**; it never runs automatically in the background. There are two main sources of memory capture:

1. **Proactive memory capture**: **/remember** and **/extract**; **/init** is an optional write path during initialization (candidates first, write only after your explicit choice).
2. **Workflow built-in taste sniffing**: During task / plan / build / review, when the context calls for it, LingXi uses ask-questions to collect your choices, runs taste-recognition to produce payloads (`source=choice`), and writes them to memory — no separate command needed.

The main agent first uses taste-recognition to produce structured payloads, then calls the lingxi-memory subagent with a **payloads array**. The subagent validates, maps, governs, and gates, then writes directly to notes and INDEX and returns a **brief report** to the main conversation (counts of created/merged/skipped and Id list). Taste-recognition performs **pattern alignment** and **elevation** (write or not, L0/L1) after identifying capturable content; only entries that pass elevation are output as payloads and sent to lingxi-memory. **Lingxi-memory does not perform scoring** — it only validates, maps payload to note, governs (TopK), and gates. For how taste-recognition identifies "taste" and produces the extended payload contract, see [How to Effectively Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste). For lingxi-memory governance and write details, see [Memory Governance and Write](/en/guide/memory-governance-and-write).

### Proactive memory capture

| Command | Purpose |
|---------|---------|
| **/remember** | Write now: extract memory from current input (and optional context) and write |
| **/extract** | Extract by conversation or time range: extract capturable content from the current conversation or a given time range, then batch-write and get a report |
| **/memory-govern** | Sync INDEX with notes (remove orphan index rows, have the model complete INDEX rows for unindexed notes) and optionally run full-library governance (merge/rewrite/archive suggestions with your confirmation) |

These are the routine entry points for capturing memory in daily use; workflow taste sniffing also captures choices during task/plan/build/review when context calls for it, without a separate command.

### Optional write during init

After guiding project-info collection, **/init** first presents a candidate memory list. Writing is skipped by default; only when you explicitly choose a write strategy (for example, all/partial) will confirmed candidates be written as memories. This is an optional byproduct of the init flow, not a routine capture path; for day-to-day memory capture, use **/remember** or **/extract**.

**Gating**: Merging or replacing existing memories requires your confirmation; new memories with confidence **high** can be written silently; **medium** or **low** require confirmation.

### /remember — Write now

Use `/remember` anytime to write a memory:

```
/remember <description>
```

**Examples:**
```
/remember Capture the lesson from that bug we just fixed
/remember Always use pnpm instead of npm
/remember API responses in this project must follow RESTful conventions
```

### /extract — Extract by conversation or time range

Refine capturable content from the current conversation or a given time range and write to the memory bank.

```
/extract
/extract Refine today's conversation
/extract Refine the last 2 days
/extract 1d
/extract 24h
```

- **No arguments**: Refines the **current conversation** — use after a round of dialogue.
- **With arguments**: Accepts natural-language time ranges (e.g. “today's conversation”, “last N days”, “Nd”, “Nh”). If the time range cannot be parsed, an error is shown and the command stops.  
LingXi then aggregates the relevant conversation, uses taste-recognition to extract payloads, sends them once to lingxi-memory, and shows you the report. See [How to Effectively Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste) for trigger points and recognition criteria.

### /memory-govern — Sync index and proactive governance

Use **/memory-govern** to keep INDEX in sync with `notes/` and optionally run proactive governance:

- **Sync**: A script removes orphan index rows (INDEX entries whose note file no longer exists) and detects unindexed notes; the model then generates INDEX rows for each unindexed note so retrieval stays accurate.
- **Proactive governance (optional)**: The model can suggest merge/rewrite/archive actions for the whole library; changes are applied only after your confirmation via ask-questions.

Run `/memory-govern` in Cursor whenever you add or update shared memories (e.g. after `git submodule update`), or when you want to tidy the index and get governance suggestions. No Node.js script is required for this command. See [Commands Reference — /memory-govern](/en/guide/commands-reference#memory-govern).

### Memory structure

Each memory corresponds to an **extended payload** (7 business fields + **layer**) produced by taste-recognition; lingxi-memory accepts only a **payloads array**. Field definitions and scope are in [How to Effectively Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste):

| Field | Meaning |
|-------|---------|
| scene | Applicable scenario |
| principles | Core principles |
| choice | Specific choice made |
| evidence | Supporting evidence |
| source | Origin of the memory |
| confidence | Confidence level |
| apply | Whether in share (`project` \| `team`) |
| layer | Layer (`L0` \| `L1` \| `L0+L1`, set by taste-recognition elevation) |

## Memory Governance

LingXi's memory governance is a closed loop of **write governance + retrieval governance + audit governance**. The goal is to keep accumulating high-value experience while controlling noise and risk.

### 1) Pre-write governance (quality threshold)

- **Taste-recognition** runs **pattern alignment** (against a design-pattern catalog), then **elevation** (D1 decision gain, D2 reusability/triggerability, D3 verifiability, D4 stability; 0–2 each, total T). Only when T≥4 and no exception is triggered does it output that entry as a payload with layer (L0/L1/L0+L1); when T≤3 or an exception applies, that entry is not output and the main agent does not call lingxi-memory for it.
- So only elevation-approved entries enter the **payloads array**. **Lingxi-memory** does not score or elevate; it only: validate payloads → map payload to note → semantic-neighbor TopK governance (merge/replace/veto/new) → gate → write to notes and INDEX.
- For taste-recognition responsibility boundaries and common pitfalls, see [How to Effectively Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

### 2) Deduplication and conflict governance (semantic-neighbor TopK)

- Run semantic-neighbor TopK retrieval over `notes/`, then decide with `merge / replace / veto / new`.
- When merging or replacing, maintain `Supersedes` links and sync `INDEX` to preserve a traceable evolution chain.
- The actual governance logic and gating are performed by the **lingxi-memory** subagent; see [Memory Governance and Write](/en/guide/memory-governance-and-write).

### 3) User gating (non-bypassable)

- `merge / replace` must be confirmed via ask-questions.
- `new` can be silently written only when `confidence=high`; `medium/low` requires confirmation.
- Any delete-or-replace behavior requires user confirmation and cannot be bypassed.

### 4) Retrieval-side governance (minimal per-turn injection)

- Before each response, run `memory-retrieve` with the flow: **understand → distill → dual-path retrieval (semantic + keyword) → top 0-2 → adopt/reject/ask**.
- Only adopt results are injected as a one-line minimal context; reject results are not shown to the user.

### 5) Structure governance (SSoT)

- `INDEX.md` stores only minimal metadata as the authoritative index (SSoT).
- Full semantic content lives in `notes/*.md`.
- Supports `active / local / archive` lifecycle layers and cross-project reuse through the `share` directory.

### 6) Audit governance

- Both memory retrieval and memory writing emit audit events to `.cursor/.lingxi/workspace/audit.log`.
- Audit logs support traceability for queries, hits, adoption decisions, and write actions.

For implementation details, see [lingxi-memory](https://github.com/tower1229/LingXi/blob/main/.cursor/agents/lingxi-memory.md). For the site’s dedicated page, see [Memory Governance and Write](/en/guide/memory-governance-and-write).

### Governance sequence diagram (write to retrieval injection)

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant A as Main Agent
    participant TR as taste-recognition
    participant LM as lingxi-memory subagent
    participant AQ as ask-questions
    participant N as memory/notes/*.md
    participant I as memory/INDEX.md
    participant AU as audit.log

    rect rgb(245, 250, 255)
    Note over U,LM: 1) Memory capture and write governance (/remember, /extract, or workflow taste sniffing)
    U->>A: /remember or /extract
    A->>TR: Extract taste + pattern alignment + elevation, produce payloads (7 fields + layer)
    TR-->>A: payloads[] (only elevation-approved entries)
    A->>LM: Invoke write (payloads + conversation_id)
    LM->>LM: Validate payloads (fields/enums)
    LM->>LM: Map payload to note fields (no scoring)
    LM->>LM: Semantic-neighbor TopK governance (merge/replace/veto/new)
    alt merge or replace
            LM->>AQ: Ask for confirmation
            AQ-->>LM: User decision
            alt User confirms
                LM->>N: Update/delete old note and write new content
                LM->>I: Sync Supersedes and index row
            else User cancels
                LM-->>A: Cancel execution
            end
        else new
            alt confidence=high
                LM->>N: Create note directly
                LM->>I: Append index row
            else confidence=medium/low
                LM->>AQ: Ask whether to write
                AQ-->>LM: User decision
                LM->>N: Write or cancel by selection
                LM->>I: Sync index if needed
            end
        end
        LM->>AU: Append memory_note_* and memory_index_updated audit events
    LM-->>A: Return brief report (created/merged/skipped)
    A-->>U: Output result
    end

    rect rgb(250, 255, 245)
    Note over U,AU: 2) Per-turn memory retrieval and minimal injection (before response)
    U->>A: Normal question
    A->>A: Execute /memory-retrieve
    A->>A: Distill semantic summary + keywords
    A->>N: Semantic retrieval (SemanticSearch)
    A->>N: Keyword retrieval (rg + INDEX Title/When to load)
    A->>A: Union + weighted rerank, take top0-2
    A->>A: Make adopt/reject/ask decisions on hits
    A->>AU: Append memory_retrieve audit(query/hits/adopted/rejected)
    alt Has adopt
        A-->>U: One-line minimal injection hint (optionally [MEM-xxx])
    else No adopt
        A-->>U: Silent; do not show reject
    end
    end
```

## Cross-Project Sharing

Teams can share memory banks via **git submodule**, letting best practices flow across all projects.

### Setting Up a Shared Repository

After adding or updating a shared memory repository, run **/memory-govern** in Cursor to sync INDEX with notes (and optionally run proactive governance). No separate Node.js script is required. If you have not installed LingXi yet, complete [Quick Start](/en/guide/quick-start) first.

```bash
# 1. Add shared memory repository
git submodule add <shareRepoUrl> .cursor/.lingxi/memory/notes/share

# 2. Update shared memories
git submodule update --remote --merge

# 3. Sync memory index and optional governance: run /memory-govern in Cursor
```

### Sharing Rules

- **Shared directory**: `.cursor/.lingxi/memory/notes/share/`
- **Identification**: memories with `apply=team` go in `notes/share` for cross-project reuse; `apply=project` stays in the current project only.
- **Priority**: Project-level memories override shared memories on the same topic

## Next Steps

- Review the [Core Workflow](/en/guide/core-workflow) to see how memory integrates with development flows
- Read [How to Effectively Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste) for the taste-recognition contract
- Read [Memory Governance and Write](/en/guide/memory-governance-and-write) for lingxi-memory governance and write flow
- Visit the [GitHub repository](https://github.com/tower1229/LingXi) for full source code
