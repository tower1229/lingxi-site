# Commands Reference

This page lists all LingXi commands with syntax and purpose. For workflow flow and examples see [Core Workflow](/en/guide/core-workflow); for memory-related commands see [Memory System](/en/guide/memory-system).

## Workflow Commands

### /task

```
/task <description>
```

Creates a task document to lock goal, boundaries, and acceptance criteria. LingXi auto-generates a task ID (001, 002...) and title, creates `.cursor/.lingxi/tasks/001.task.<title>.md`, and guides requirement refinement and confirmation.

**Parameters:** `<description>` is required.

**Output:** Task document `.cursor/.lingxi/tasks/001.task.<title>.md`.

---

### /vet

```
/vet [taskId]
```

Multi-dimensional review of the task document (completeness, consistency, feasibility, edge cases, etc.). Produces no files; results and suggestions appear in chat. Can be run multiple times.

**Parameters:** `taskId` optional; omit to fall back to the latest task ID.

**Output:** None.

---

### /plan

```
/plan [taskId]
```

Generates implementation-level planning and test cases from the task document, with `F→T→TC` mapping. Use for complex tasks or when you need a clear execution path (optional for simple tasks).

**Parameters:** `taskId` optional; omit to fall back to the latest task ID.

**Output:** `.cursor/.lingxi/tasks/001.plan.<title>.md`, `.cursor/.lingxi/tasks/001.testcase.<title>.md`.

---

### /build

```
/build [taskId]
```

Executes implementation from the task document and (optional) plan. Plan-driven when plan exists; otherwise task-driven (skip-plan), which must complete testcase and coverage checks before coding. For `unit/integration`, enforce test-before-implementation loop.

**Parameters:** `taskId` optional; omit to fall back to the latest task ID.

**Output:** Code changes.

---

### /review

```
/review [taskId]
```

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

**Output:** Memory note(s) under `.cursor/.lingxi/memory/notes/` and INDEX update.

See [Memory System](/en/guide/memory-system).

---

### /extract

```
/extract
/extract <time range>
```

Extracts capturable content from the current conversation or a given time range and writes to the memory bank. With **no arguments**, extracts from the **current conversation** (e.g. after a round of dialogue). With **arguments**, accepts natural-language time ranges (e.g. “refine today's conversation”, “last 2 days”, “1d”, “24h”); if the time range cannot be parsed, an error is shown and the command stops. LingXi aggregates the conversation, uses taste-recognition to extract payloads, sends them once to lingxi-memory, then shows the report.

**Parameters:** Optional. Omit for current conversation; pass a time-range description for a scope.

**Output:** Memory notes (written to `.cursor/.lingxi/memory/notes/` and INDEX) plus the lingxi-memory report (created/merged/skipped counts and Id list).

See [Memory System](/en/guide/memory-system).

---

## Initialization Commands

### /init

```
/init
```

Guided initialization for projects that already have some progress: LingXi first infers context from existing docs/repo structure, asks only for missing or uncertain items (selection interactions use the ask-questions protocol), and produces a candidate memory list. It does **not** write by default; memories are written only after your explicit choice.

**Parameters:** None.

**Output:** An initialization summary plus candidate memory list; if you explicitly choose to write, memories are written to `.cursor/.lingxi/memory/notes/` and INDEX is updated. If `.cursor/.lingxi/` is missing, required skeleton directories are created first.

---

## Next Steps

- [Core Workflow](/en/guide/core-workflow) — Overview and examples
- [Memory System](/en/guide/memory-system) — Retrieval, writing, and sharing
- [FAQ](/en/guide/faq) — Frequently asked questions
