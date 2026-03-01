# Commands Reference

This page lists all LingXi commands with syntax and purpose. For workflow flow and examples see [Core Workflow](/en/guide/core-workflow); for memory-related commands see [Memory System](/en/guide/memory-system).

## Workflow Commands

### /task

```
/task <description>
```

Creates a task document; the only required step in the workflow. LingXi auto-generates a task ID (001, 002...) and title, creates `.cursor/.lingxi/tasks/001.task.<title>.md`, and guides requirement refinement and confirmation.

**Parameters:** `<description>` is required.

**Output:** Task document `.cursor/.lingxi/tasks/001.task.<title>.md`.

---

### /vet

```
/vet [taskId]
```

Multi-dimensional review of the task document (completeness, consistency, feasibility, edge cases, etc.). Produces no files; results and suggestions appear in chat. Can be run multiple times.

**Parameters:** `taskId` optional; omit to use the latest task.

**Output:** None.

---

### /plan

```
/plan [taskId]
```

Generates a task plan and test cases from the task document. Use for complex tasks or when you need clear execution steps.

**Parameters:** `taskId` optional; omit to use the latest task.

**Output:** `.cursor/.lingxi/tasks/001.plan.<title>.md`, test case document(s).

---

### /build

```
/build [taskId]
```

Implements code from the task document and (optional) plan document. Plan-driven when a plan exists; otherwise task-driven.

**Parameters:** `taskId` optional; omit to use the latest task.

**Output:** Code changes.

---

### /review

```
/review [taskId]
```

Runs a multi-dimensional review of completed code and produces a review report (functionality, tests, architecture, maintainability, regression; optionally doc consistency, security, performance, E2E).

**Parameters:** `taskId` optional; omit to use the latest task.

**Output:** Review report (e.g. under `.cursor/.lingxi/tasks/`, as implemented).

---

## Memory & Initialization

### /remember

```
/remember <description>
```

Write a memory at any time; no task ID required. LingXi turns the description into a structured note and writes it to the memory bank; merges or replacements are gated.

**Parameters:** `<description>` is required.

**Output:** Memory note(s) under `.cursor/.lingxi/memory/notes/` and INDEX update.

See [Memory System](/en/guide/memory-system).

---

### /init

```
/init
```

Initializes the project: creates the `.cursor/.lingxi/` directory skeleton if missing, then guides collection of project info and optional initial memory writes.

**Parameters:** None.

**Output:** Directories and initial files under `.cursor/.lingxi/` (tasks, memory, workspace, etc.) when not already present.

---

## Next Steps

- [Core Workflow](/en/guide/core-workflow) — Overview and examples
- [Memory System](/en/guide/memory-system) — Retrieval, writing, and sharing
- [FAQ](/en/guide/faq) — Frequently asked questions
