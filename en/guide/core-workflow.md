# Core Workflow

LingXi provides a **flexible development workflow** covering the full lifecycle from requirements to delivery. Every step is optional — compose the flow that fits your task. For full command syntax and parameters, see [Commands Reference](/en/guide/commands-reference).

## Workflow Overview

```
/task  →  /vet  →  /plan  →  /build  →  /review
 Required   Optional      Optional   Optional   Recommended
```

::: tip Design Philosophy
LingXi is a **toolkit**, not a pipeline. Apart from `/task` as the starting point, every other step can be skipped. You decide the flow.
:::

## Multi-task Support

LingXi lets you have multiple tasks (001, 002, 003…) in the same project. Each task has its own task document and optional plan, testcase, and review artifacts. `/vet`, `/plan`, `/build`, and `/review` all accept an optional **taskId** so you can target a specific task when several are in progress.

### How task ID (taskId) works by default

**You don’t need to pass a task ID by default.** When you omit taskId, the command applies to the **current latest task**—the one created most recently with `/task` or last operated on. So for a single task you can run `/vet`, `/plan`, `/build`, `/review` in sequence without any ID.

**Pass taskId only when you have multiple tasks in parallel** and need to act on a specific one. For example, with 001 (login), 002 (permissions), and 003 (reports) in progress, to review 002 and plan 001:

```
/vet 002
/plan 001
/build 001
```

That way you can switch between tasks in one conversation while keeping commands short when working on a single task.

### Summary

| Scenario | Use taskId? | Example |
|----------|-------------|---------|
| Single task, sequential | No | `/vet` → `/plan` → `/build` |
| Multiple tasks, target one | Yes | `/vet 002`, `/plan 001` |

## /task — Create a Task

Everything starts with a requirement. `/task` is the entry point and the only required step.

```
/task <description>
```

**Examples:**
```
/task Add user login with email and phone number support
/task Improve homepage load performance, target LCP < 1s
```

**What LingXi does:**
- Auto-generates a task ID (001, 002...) and title
- Creates a structured task document: `.cursor/.lingxi/tasks/001.task.<title>.md`
- Guides you through **requirement refinement**: analysis, expansion, confirmation

The task document is the core artifact — all subsequent commands revolve around it.

## /vet — Review Task Document (Optional)

Multi-dimensional review of the task document to improve requirement quality.

```
/vet [taskId]
```

- Can be run multiple times for iterative improvement
- Produces no files — review results appear in chat only
- Omit `taskId` to use the latest task

**Review dimensions:** completeness, consistency, feasibility, edge cases, and more.

## /plan — Task Planning (Optional)

Generate a detailed execution plan and test cases from the task document.

```
/plan [taskId]
```

**Output:**
- Planning document: `.cursor/.lingxi/tasks/001.plan.<title>.md`
- Test case document

**When to use:** Complex tasks, multi-module changes, or when you need clear execution steps. Simple tasks can skip this.

::: tip
`/plan` works well alongside Cursor's built-in Plan mode — the two complement each other.
:::

## /build — Execute Build (Optional)

Implement code based on the task document and (optional) planning document.

```
/build [taskId]
```

**Two execution modes:**

| Mode | Condition | Behavior |
|------|-----------|----------|
| Plan-driven | Plan document exists | Structured execution following the plan (recommended) |
| Task-driven | No plan document | Agent decides approach based on task document |

::: tip
When using Cursor's Plan mode, you can also use its built-in build feature and skip LingXi's `/build` command.
:::

## /review — Review Delivery (Recommended)

Comprehensive review of completed code with a generated review report.

```
/review [taskId]
```

**Core review dimensions:**
- Functional completeness
- Test coverage
- Architecture quality
- Maintainability
- Regression risk

**On-demand review dimensions:**
- Documentation consistency
- Security
- Performance
- End-to-end testing

## Flow Examples

### Simple Task (Fast Track)

```
/task Fix form validation bug on login page
/build
/review
```

### Complex Task (Full Flow)

```
/task Refactor user permission system to support RBAC model
/vet 001
/plan 001
/build 001
/review 001
```

### Minimal Flow

```
/task Update installation instructions in README
/build
```

## Next Steps

- Full command syntax and parameters: [Commands Reference](/en/guide/commands-reference)
- Learn how the [Memory System](/en/guide/memory-system) captures experience via commands during workflows
