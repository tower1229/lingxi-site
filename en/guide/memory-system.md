# Memory System

The memory system is LingXi's core capability — it lets AI **learn your judgment, taste, and responsibility within projects**, reusing them naturally in every new conversation.

## How It Works

```
Conversation starts
  ↓
Auto-retrieve memories (memory-retrieve)
  ↓
Inject 0-3 most relevant memories
  ↓
AI responds with your "experience"
  ↓
Identify capturable new experience (taste-recognition)
  ↓
Write to memory bank (lingxi-memory)
```

The entire process runs **silently**, never interrupting your workflow.

## Memory Retrieval

Before each conversation turn, LingXi automatically runs `memory-retrieve` to find the most relevant notes:

- **Dual-path retrieval**: Semantic search + keyword matching, merged with weighted scoring
- **Minimal injection**: Only top 0–3 results, avoiding context pollution
- **Graceful degradation**: Falls back to keyword-only when semantic search is unavailable; stays silent when nothing matches

## Memory Writing

### Automatic Capture

LingXi evaluates each conversation turn for capturable experience. When it identifies a judgment, decision, or lesson worth recording, it automatically writes to the memory bank.

**Trigger conditions:**
- Auto-writes only when confidence is high and it's a brand new memory
- Merging or replacing existing memories requires your confirmation

### Manual Memory — /remember

Use `/remember` anytime to proactively write to memory:

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

### Memory Structure

Each memory contains 7 fields:

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

- **Scorecard system**: 5 dimensions evaluate each memory's value
- **TopK strategy**: Retains the most valuable memories
- **Conflict resolution**: When new memories conflict with old ones, a gating mechanism decides whether to merge or replace

## Cross-Project Sharing

Teams can share memory banks via **git submodule**, letting best practices flow across all projects.

### Setting Up a Shared Repository

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
