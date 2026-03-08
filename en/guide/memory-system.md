# Memory System

The memory system is LingXi's core capability — it lets AI **learn your judgment, taste, and responsibility within projects**, reusing them naturally in every new conversation.

## How It Works

The memory system has two sides: **retrieval** and **writing**.

- **Retrieval (every turn)**: When a conversation starts, LingXi automatically pulls the most relevant notes from the memory bank and injects them into context, so the AI can respond with your "experience."
- **Writing (three paths)**: Memories enter the bank through automatic capture (heartbeat session distillation), manual capture (/remember, /init), or workflow taste sniffing. See [Memory Writing](#memory-writing) below.

The per-turn retrieval flow:

```
Conversation starts
  ↓
Auto-retrieve memories (memory-retrieve)
  ↓
Inject 0–2 most relevant memories
  ↓
AI responds with your "experience"
```

## Memory Retrieval

Before each conversation turn, LingXi automatically runs `memory-retrieve` to find the most relevant notes:

- **Dual-path retrieval**: Semantic search + keyword matching, merged with weighted scoring
- **Minimal injection**: Only top 0–2 results, avoiding context pollution

## Memory Writing

Memory writing has **three capture paths**: **automatic** (heartbeat-triggered session distillation), **manual** (/remember, /init), and **workflow taste sniffing** (built into task/plan/build/review).

### Automatic capture: heartbeat session distillation

When you start a **new conversation**, LingXi checks whether it has been more than 30 minutes since the last session distillation. If so, it automatically enqueues up to 3 finished, unrefined sessions. The **lingxi-session-distill** subagent runs in the background, fetches conversation content, uses taste-recognition to produce payloads (`source=heartbeat`), and writes to memory. The main conversation does not wait; distillation runs asynchronously. You can inspect `heartbeat.triggered`, `heartbeat.distillation_completed`, and related events in `.cursor/.lingxi/workspace/audit.log`.

### Manual capture: /remember and /init

| Command | Purpose |
|---------|---------|
| **/remember** | Write now: extract memory from current input (and optional context) and write |
| **/init** | Optional write during init: after guiding project-info collection, presents a candidate memory list; writes only after your explicit choice |

Examples: `/remember Capture the lesson from that bug we just fixed`, `/remember Always use pnpm instead of npm`.  
/init is optional write during project initialization, not a routine capture path.

**Gating**: Merging or replacing existing memories requires your confirmation; new memories with confidence **high** can be written silently; **medium** or **low** require confirmation.

### Workflow taste sniffing (built-in)

During task / plan / build / review **skills**, when the context calls for it, LingXi uses ask-questions to collect your choices, runs taste-recognition to produce payloads (`source=choice`), and writes them to memory — no separate command needed.

## Memory structure

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

## Index sync and proactive governance

Use the **memory-govern** skill (e.g. type `/memory-govern` in Cursor) to keep INDEX in sync with `memory/project/` and `memory/share/` and optionally run proactive governance:

- **Sync**: A script removes orphan index rows (INDEX entries whose note file no longer exists) and detects unindexed notes; the model then generates INDEX rows for each unindexed note so retrieval stays accurate.
- **Proactive governance (optional)**: The model can suggest merge/rewrite/archive actions for the whole library; changes are applied only after your confirmation via ask-questions.

Run the **memory-govern** skill (e.g. `/memory-govern`) in Cursor whenever you add or update shared memories (e.g. after `git submodule update`), or when you want to tidy the index and get governance suggestions. No Node.js script is required. See [Commands Reference — memory-govern](/en/guide/commands-reference#memory-govern).

## Memory Governance

LingXi's memory governance is a closed loop of **write governance + retrieval governance + audit governance**. The goal is to keep accumulating high-value experience while controlling noise and risk.

### 1) Pre-write governance (quality threshold)

- **Taste-recognition** runs **pattern alignment** (against a design-pattern catalog), then **elevation** (D1 decision gain, D2 reusability/triggerability, D3 verifiability, D4 stability; 0–2 each, total T). Only when T≥4 and no exception is triggered does it output that entry as a payload with layer (L0/L1/L0+L1); when T≤3 or an exception applies, that entry is not output and the main agent does not call lingxi-memory for it.
- So only elevation-approved entries enter the **payloads array**. **Lingxi-memory** does not score or elevate; it validates, then invokes the **memory-write** skill to: map payload to note → semantic-neighbor TopK governance (merge/replace/veto/new) → gate → write to memory/project/, memory/share/, and INDEX.
- For taste-recognition responsibility boundaries and common pitfalls, see [How to Effectively Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

### 2) Deduplication and conflict governance (semantic-neighbor TopK)

- Run semantic-neighbor TopK retrieval over `memory/project/` and `memory/share/`, then decide with `merge / replace / veto / new`.
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
- Full semantic content lives in `memory/project/*.md` and `memory/share/*.md`.
- Supports `active / local / archive` lifecycle layers and cross-project reuse through the **memory/share** directory.

### 6) Audit governance

- Both memory retrieval and memory writing emit audit events to `.cursor/.lingxi/workspace/audit.log`.
- Audit logs support traceability for queries, hits, adoption decisions, and write actions.

For implementation details, see [lingxi-memory](https://github.com/tower1229/LingXi/blob/main/.cursor/agents/lingxi-memory.md) and [memory-write](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/memory-write/SKILL.md). For the site’s dedicated page, see [Memory Governance and Write](/en/guide/memory-governance-and-write).

### Governance sequence diagram (write to retrieval injection)

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant A as Main Agent
    participant TR as taste-recognition
    participant LM as lingxi-memory subagent
    participant AQ as ask-questions
    participant N as memory notes (project & share)
    participant I as memory/INDEX.md
    participant AU as audit.log

    rect rgb(245, 250, 255)
    Note over U,LM: 1) Memory capture and write governance (three paths: automatic / manual / workflow taste sniffing)
    U->>A: /remember or heartbeat trigger
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

After adding or updating a shared memory repository, run the **memory-govern** skill (e.g. `/memory-govern`) in Cursor to sync INDEX with project/share (and optionally run proactive governance). No separate Node.js script is required. If you have not installed LingXi yet, complete [Quick Start](/en/guide/quick-start) first.

```bash
# 1. Add shared memory repository
git submodule add <shareRepoUrl> .cursor/.lingxi/memory/share

# 2. Update shared memories
git submodule update --remote --merge

# 3. Sync memory index and optional governance: run the memory-govern skill (e.g. /memory-govern) in Cursor
```

### Sharing Rules

- **Shared directory**: `.cursor/.lingxi/memory/share/`
- **Identification**: memories with `apply=team` go in **memory/share** for cross-project reuse; `apply=project` stays in the current project (memory/project) only.
- **Priority**: Project-level memories override shared memories on the same topic

## Next Steps

- Review the [Core Workflow](/en/guide/core-workflow) to see how memory integrates with development flows
- Read [How to Effectively Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste) for the taste-recognition contract
- Read [Memory Governance and Write](/en/guide/memory-governance-and-write) for lingxi-memory governance and write flow
- Visit the [GitHub repository](https://github.com/tower1229/LingXi) for full source code
