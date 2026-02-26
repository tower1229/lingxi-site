# Core Workflow

LingXi provides a **flexible development workflow** covering the full lifecycle from requirements to delivery. Every step is optional — compose the flow that fits your task.

## Workflow Overview

```
/req  →  /review-req  →  /plan  →  /build  →  /review
 Required   Optional      Optional   Optional   Recommended
```

::: tip Design Philosophy
LingXi is a **toolkit**, not a pipeline. Apart from `/req` as the starting point, every other step can be skipped. You decide the flow.
:::

## /req — Create a Task

Everything starts with a requirement. `/req` is the entry point and the only required step.

```
/req <description>
```

**Examples:**
```
/req Add user login with email and phone number support
/req Improve homepage load performance, target LCP < 1s
```

**What LingXi does:**
- Auto-generates a task ID (001, 002...) and title
- Creates a structured task document: `.cursor/.lingxi/tasks/001.req.<title>.md`
- Guides you through **requirement refinement**: analysis, expansion, confirmation

The task document is the core artifact — all subsequent commands revolve around it.

## /review-req — Review Requirements (Optional)

Multi-dimensional review of the task document to improve requirement quality.

```
/review-req [taskId]
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
| Req-driven | No plan document | Agent decides approach based on req document |

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
/req Fix form validation bug on login page
/build
/review
```

### Complex Task (Full Flow)

```
/req Refactor user permission system to support RBAC model
/review-req 001
/plan 001
/build 001
/review 001
```

### Minimal Flow

```
/req Update installation instructions in README
/build
```

## Next Steps

- Learn how the [Memory System](/en/guide/memory-system) automatically captures your experience during workflows
