# Memory System

The memory system is LingXi's core capability — it lets AI **learn your judgment, taste, and responsibility within projects**, reusing them naturally in every new conversation.

## How It Works

```
Conversation starts
  ↓
Auto-retrieve memories (memory-retrieve)
  ↓
Inject 0–3 most relevant memories
  ↓
AI responds with your "experience"
```

**Memory retrieval** is triggered automatically each turn by the session convention. **Memory writing** does not run automatically in this flow; it is triggered only when you run a command. **Proactive memory capture** uses **/remember** and **/extract**; **/init** can optionally write memories when you initialize a project (confirmed drafts → memory), which is part of the init flow, not a routine capture entry point. The process stays silent and does not interrupt your workflow.

## Memory Retrieval

Before each conversation turn, LingXi automatically runs `memory-retrieve` to find the most relevant notes:

- **Dual-path retrieval**: Semantic search + keyword matching, merged with weighted scoring
- **Minimal injection**: Only top 0–3 results, avoiding context pollution
- **Graceful degradation**: Falls back to keyword-only when semantic search is unavailable; stays silent when nothing matches

## Memory Writing

Memory writing is **triggered only by you via commands**; it is not automatically run every turn. **Proactive memory capture** uses **/remember** and **/extract**; **/init** is an optional write path inside initialization: it generates candidate memories first, skips writing by default, and writes only after your explicit choice. The main agent first uses taste-recognition to produce structured payloads, then calls the lingxi-memory subagent with a **payloads array**. The subagent validates, maps, governs, and gates, then writes directly to notes and INDEX and returns a **brief report** to the main conversation (counts of created/merged/skipped and Id list).

### Proactive memory capture

| Command | Purpose |
|---------|---------|
| **/remember** | Write now: extract memory from current input (and optional context) and write |
| **/extract** | Extract by conversation or time range: extract capturable content from the current conversation or a given time range, then batch-write and get a report |

These are the routine entry points for capturing memory in daily use.

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
LingXi then aggregates the relevant conversation, uses taste-recognition to extract payloads, sends them once to lingxi-memory, and shows you the report.

### Memory structure

Each memory has 7 fields (produced by taste-recognition; lingxi-memory accepts only a **payloads array**):

| Field | Meaning |
|-------|---------|
| scene | Applicable scenario |
| principles | Core principles |
| choice | Specific choice made |
| evidence | Supporting evidence |
| source | Origin of the memory |
| confidence | Confidence level |
| apply | How to apply |

## Memory Governance

LingXi's memory governance is a closed loop of **write governance + retrieval governance + audit governance**. The goal is to keep accumulating high-value experience while controlling noise and risk.

### 1) Pre-write governance (quality threshold)

- `taste-recognition` first produces standardized 7-field `payloads`; then the `lingxi-memory` subagent performs validation and mapping.
- Candidates enter a five-dimension scorecard (D1~D5, 0–2 each), with **T = D1 + D2 + D3 + D4 + D5** (max 10), then route to:
  - **veto** for low-value candidates,
  - **write L0 (fact layer)**,
  - **write L1 (principle layer)**,
  - **write L0 + L1 (both layers)**.

### 2) Deduplication and conflict governance (semantic-neighbor TopK)

- Run semantic-neighbor TopK retrieval over `notes/`, then decide with `merge / replace / veto / new`.
- When merging or replacing, maintain `Supersedes` links and sync `INDEX` to preserve a traceable evolution chain.

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

For implementation details, see [lingxi-memory](https://github.com/tower1229/LingXi/blob/main/.cursor/agents/lingxi-memory.md).

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
    Note over U,LM: 1) Memory capture and write governance (/remember or /extract)
    U->>A: /remember or /extract
    A->>TR: Extract preferences and generate payloads (7 fields)
    TR-->>A: payloads[]
    A->>LM: Invoke write (payloads + conversation_id)
    LM->>LM: Validate payloads (fields/enums)
    LM->>LM: Map note fields + five-dimension scoring (D1~D5)
    alt Low value (T<=3)
        LM-->>A: veto/skip (do not write)
    else Writable
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
    end
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

The `memory-sync` script is added to your project's `package.json` by **LingXi's install script** during installation. Run it from the **project root**; Node.js must be installed. If the script is not present, complete the [Quick Start](/en/guide/quick-start) installation first.

```bash
# 1. Add shared memory repository
git submodule add <shareRepoUrl> .cursor/.lingxi/memory/notes/share

# 2. Update shared memories
git submodule update --remote --merge

# 3. Sync memory index
npm run memory-sync
# or
yarn memory-sync
```

### Sharing Rules

- **Shared directory**: `.cursor/.lingxi/memory/notes/share/`
- **Identification**: `Audience` (team/personal) and `Portability` (cross-project/project-only) metadata fields
- **Priority**: Project-level memories override shared memories on the same topic

## Next Steps

- Review the [Core Workflow](/en/guide/core-workflow) to see how memory integrates with development flows
- Visit the [GitHub repository](https://github.com/tower1229/LingXi) for full source code
