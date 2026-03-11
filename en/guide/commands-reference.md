# Commands and Workflow Reference

This page lists **workflow Skills** and **helper commands** in LingXi. For workflow flow and examples see [Core Workflow](/en/guide/core-workflow); for memory-related commands see [Memory System](/en/guide/memory-system).

## Workflow Skills

The workflow (task → vet → plan → build → review) is driven by **Skills**. Invoke them explicitly by typing `/task`, `/plan`, `/build`, `/review`, or `/vet` (Cursor shows the matching skill) or by natural language (e.g. “run task”, “plan task 001”). **Workflow Skills are for manual or explicit invocation only**; they are not auto-loaded by semantic match, to keep context lean.

### task

**Trigger:** `/task <description>` or natural language “create task…”

Creates a task document to lock goal, boundaries, and acceptance criteria. LingXi auto-generates a task ID (001, 002...) and title, creates `.cursor/.lingxi/tasks/001.task.<title>.md`, and guides requirement refinement and confirmation.

**Parameters:** `<description>` is required.

**Output:** Task document `.cursor/.lingxi/tasks/001.task.<title>.md`.

---

### vet

**Trigger:** `/vet [taskId]` or “review task document”

Multi-dimensional review of the task document (completeness, consistency, feasibility, edge cases, etc.). Produces no files; results and suggestions appear in chat. Can be run multiple times.

**Parameters:** `taskId` optional; omit to fall back to the latest task ID.

**Output:** None.

---

### plan

**Trigger:** `/plan [taskId]` or “plan task…”

Generates implementation-level planning and test cases from the task document, with `F→T→TC` mapping. Use for complex tasks or when you need a clear execution path (optional for simple tasks).

**Parameters:** `taskId` optional; omit to fall back to the latest task ID.

**Output:** `.cursor/.lingxi/tasks/001.plan.<title>.md`, `.cursor/.lingxi/tasks/001.testcase.<title>.md`.

---

### build

**Trigger:** `/build [taskId]` or “implement task…”

Executes implementation from the task document and (optional) plan. Plan-driven when plan exists; otherwise task-driven (skip-plan), which must complete testcase and coverage checks before coding. For `unit/integration`, enforce test-before-implementation loop.

**Parameters:** `taskId` optional; omit to fall back to the latest task ID.

**Output:** Code changes.

---

### review

**Trigger:** `/review [taskId]` or “review delivery”

Runs independent acceptance audit by requirement IDs (`F`) and produces a review report: Pass/Fail per `F` with evidence references. If evidence is missing or unverifiable, that `F` must Fail and overall conclusion cannot be Pass.

**Parameters:** `taskId` optional; omit to fall back to the latest task ID.

**Output:** Review report (e.g. under `.cursor/.lingxi/tasks/`, as implemented).

---

## Memory Commands

### /remember

```
/remember <description>
```

Write a memory proactively at any time. LingXi converts the description into structured memory and writes it to the memory bank.

**Parameters:** `<description>` is required.

**Output:** Memory note(s) under `memory/project/` or `memory/share/` and INDEX update.

See [Memory System](/en/guide/memory-system). Memory writing has **three capture paths**: **automatic** (automatic session distillation), **manual** (this command and /init), and **workflow taste sniffing** (context-driven during workflow Skills; per-phase content in [Taste Sniffing](/en/guide/taste-sniffing)); see the “Automatic capture” section in Memory System for session distillation. Self-iterate is a global feature; see [Self-iterate](/en/guide/self-iterate).

### Automatic tasks and background subagents (no user command)

When you start a **new conversation**, LingXi runs a check and may inject conventions so the main agent invokes a background subagent in step A:

| Type | Trigger | Subagent | Description |
|-----------|---------|----------|-------------|
| **Automatic session distillation** | >30 min since last distillation | **lingxi-session-distill** | Enqueue up to 3 unrefined sessions; distill and write to memory in the background (source=heartbeat); main conversation does not wait. |
| **Self-iterate** | Time since last run exceeds configured interval (default 24 h) | **lingxi-self-iterate** | Run diagnosis and low-risk-only auto-improvements in the background; currently memory-focused, with more of the system to be covered over time. Main conversation does not wait and only consumes a brief report. **Triggered at most once within the same conversation_id session**. |

Both tasks are checked and injected automatically; you do not run any command. Audit events are written to `.cursor/.lingxi/workspace/audit.log` (e.g. `heartbeat.triggered`, `heartbeat.distillation_completed`, `memory.improvement.*`). For the full self-iterate description (audit and implementation), see [Self-iterate](/en/guide/self-iterate).

---

### memory-govern (index sync and proactive governance)

Provided by the **memory-govern** skill; invoke by typing `/memory-govern` or natural language (e.g. “sync memory index”).

```
/memory-govern [--dry-run] [--skip-govern] [--root <memoryRoot>]
```

Sync the memory INDEX with `memory/project/` and `memory/share/` and optionally run proactive governance. LingXi runs a script to remove orphan index rows (INDEX entries whose note file is missing) and to detect unindexed notes; the model then generates INDEX rows for unindexed notes. Optionally, the model can suggest full-library governance (merge/rewrite/archive); changes are applied only after your confirmation.

**Parameters:** All optional. `--dry-run`: only run the script and show results, do not write INDEX or call the model. `--skip-govern`: sync and complete unindexed entries only, skip full-library governance. `--root <path>`: memory root (default `.cursor/.lingxi/memory`).

**Output:** A brief report (orphans removed, unindexed notes completed, optional duplicate Id hints); if phase 2 runs, a summary of adopted governance changes.

See [Memory System](/en/guide/memory-system) and [Memory Governance and Write](/en/guide/memory-governance-and-write).

---

## Initialization Commands

### /init

```
/init
```

Guided initialization for projects that already have some progress: LingXi first infers context from existing docs/repo structure, asks only for missing or uncertain items (selection interactions use the ask-questions protocol), and produces a candidate memory list. It does **not** write by default; memories are written only after your explicit choice.

**Parameters:** None.

**Output:** An initialization summary plus candidate memory list; if you explicitly choose to write, memories are written to `memory/project/` or `memory/share/` and INDEX is updated. If `.cursor/.lingxi/` is missing, required skeleton directories are created first.

---

## Uninstall

During installation, LingXi adds **`lx:uninstall`** to your project’s `package.json` scripts. From the **project root**, run:

```bash
yarn lx:uninstall
# or
npm run lx:uninstall
```

This removes `.cursor/.lingxi/` and all LingXi-installed files (commands, skills, hooks, agents, references, etc.) according to the install manifest, so no LingXi artifacts remain. In an interactive environment you will be prompted to confirm; in non-interactive environments (e.g. CI) pass `--yes` to skip confirmation:

```bash
yarn lx:uninstall --yes
```

---

## Next Steps

- [Core Workflow](/en/guide/core-workflow) — Overview and examples
- [Memory System](/en/guide/memory-system) — Retrieval, writing, and sharing
- [FAQ](/en/guide/faq) — Frequently asked questions
