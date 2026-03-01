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

**Memory retrieval** is triggered automatically each turn by the session convention. **Memory writing** does not run automatically in this flow; it is triggered only when you run a command. **Proactive memory capture** uses **/remember** and **/refine-memory**; **/init** can optionally write memories when you initialize a project (confirmed drafts → memory), which is part of the init flow, not a routine capture entry point. The process stays silent and does not interrupt your workflow.

## Memory Retrieval

Before each conversation turn, LingXi automatically runs `memory-retrieve` to find the most relevant notes:

- **Dual-path retrieval**: Semantic search + keyword matching, merged with weighted scoring
- **Minimal injection**: Only top 0–3 results, avoiding context pollution
- **Graceful degradation**: Falls back to keyword-only when semantic search is unavailable; stays silent when nothing matches

## Memory Writing

Memory writing is **triggered only by you via commands**; it is not automatically run every turn. **Proactive memory capture** uses **/remember** and **/refine-memory**; **/init** optionally writes memories during project initialization (confirmed drafts → memory), as part of the init flow, not a routine capture entry point. The main agent first uses taste-recognition to produce structured payloads, then calls the lingxi-memory subagent with a **payloads array**. The subagent validates, maps, governs, and gates, then writes directly to notes and INDEX and returns a **brief report** to the main conversation (counts of created/merged/skipped and Id list).

### Proactive memory capture

| Command | Purpose |
|---------|---------|
| **/remember** | Write now: extract memory from current input (and optional context) and write |
| **/refine-memory** | Refine by conversation or time range: extract capturable content from the current conversation or a given time range, then batch-write and get a report |

These are the routine entry points for capturing memory in daily use.

### Optional write during init

**/init** can turn user-confirmed drafts into memories after guiding project-info collection. This is an optional byproduct of the init flow, not a routine capture path; for day-to-day memory capture, use **/remember** or **/refine-memory**.

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

**Use cases:**

| Scenario | Example |
|----------|---------|
| State a principle | `/remember Use PascalCase for component names` |
| Extract from conversation | `/remember Capture the lesson from that bug` |
| Keyword-guided capture | `/remember Best practices for database indexing` |

### /refine-memory — Refine by conversation or time range

Refine capturable content from the current conversation or a given time range and write to the memory bank.

```
/refine-memory
/refine-memory Refine today's conversation
/refine-memory Refine the last 2 days
/refine-memory 1d
/refine-memory 24h
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

LingXi automatically governs the memory bank to prevent unbounded growth:

- **Scorecard system**: 5 dimensions evaluate each memory's value and determine whether to write and at which layer. See [Scorecard system](#scorecard-system).
- **TopK strategy**: Retains the most valuable memories
- **Conflict resolution**: When new memories conflict with old ones, a gating mechanism decides whether to merge or replace

## Scorecard System

Before writing a memory, LingXi scores the candidate with a **scorecard**. Only memories above a certain value are stored, so the bank doesn’t fill with “correct but useless” entries.

**Five dimensions (0–2 points each)**:

| Dimension | Meaning |
|-----------|---------|
| D1 Decision gain | How much this memory improves future decisions |
| D2 Transferability | Whether it applies to similar scenarios and can be reused |
| D3 Triggerability | How likely it is to be retrieved and loaded when relevant |
| D4 Verifiability | Whether it’s backed by verifiable facts or evidence |
| D5 Stability | Whether it stays valid over time and across contexts |

**Total score T** = D1 + D2 + D3 + D4 + D5 (max 10). Based on T and dimension thresholds, LingXi decides:

- **Don’t write**: T ≤ 3 → low value (e.g. one-off facts, hard to transfer, weak triggers, or short-lived). Not written to avoid noise.
- **Write L0 (fact layer)**: T in 4–5 with sufficient verifiability → store verifiable instance-level facts.
- **Write L1 (principle layer)**: T in 6–7 with sufficient decision gain and transferability → store reusable principles and strategies.
- **Write L0 + L1 (both)**: T ≥ 8 with transferability and verifiability → store both facts and principles.

L0 answers “what happened in what context and what was the outcome”; L1 answers “what to prefer or avoid in similar contexts and why.” The scorecard, together with governance and gating, keeps the memory bank growing with high-value experience without unbounded growth. For implementation details see the main repo [lingxi-memory](https://github.com/tower1229/LingXi/blob/main/.cursor/agents/lingxi-memory.md).

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
