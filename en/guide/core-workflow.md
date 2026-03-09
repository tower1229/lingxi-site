# Core Workflow

## Top-Level Workflow Design

### Design Goals

Under a multi-entry and decoupled process model, LingXi advances work from "decidable goals" to "executable implementation" to "verifiable delivery":

- Use `task` to lock goal, scope, acceptance criteria, and architecture-level decisions
- Use `vet` to review task document quality and support high-quality requirement and acceptance design (optional, repeatable)
- Use `plan` to refine implementation paths and break work down, reducing `build` failure rate
- Use `build` to execute the implementation-and-testing loop, while supporting both with-plan and skip-plan inputs (so simple tasks can still go straight to implementation)
- Use `review` to run independent acceptance audits by requirement IDs (`F`) and close the evidence loop

### Lifecycle (On Demand, Not Strictly Serial)

Recommended progression:

1. `/task <description>`: create `001.task.<title>.md`
2. `/vet` (optional): inspect task quality
3. `/plan` (optional): generate `001.plan.<title>.md` and `001.testcase.<title>.md`
4. `/build` (optional): implementation and testing
5. `/review`: delivery audit and acceptance conclusion

Workflow properties:

- Every step can be skipped on demand
- Entry points are decoupled; invoke each workflow Skill explicitly (e.g. `/task`, `/plan`)

### Multi-task Characteristics

The workflow naturally supports parallel tasks. `taskId` is the unique context anchor:

- Artifacts are named and isolated by `taskId`: `001.task.*`, `001.plan.*`, `001.testcase.*`, `001.review.*`
- You can explicitly switch between tasks via `taskId` when invoking workflow skills; single-task serial flow is not required
- If `taskId` is omitted, skills fall back to the latest task number for convenience
- In multi-task scenarios, passing `taskId` explicitly is recommended to avoid ambiguity

## Command Roles

Workflow steps are driven by **Skills**; `/task`, `/plan`, etc. are explicit triggers (manual or explicit invocation only, not auto-loaded by semantic match). Below are the roles and usage of each step.

### /task — Lock Goal and Boundaries (Architecture Level)

```
/task <description>
```

**Role:**

- Produces goal, boundaries, acceptance criteria, architecture-level solution, verification method, and evidence format
- Does not carry implementation-level details; those are refined in `/plan`

**What LingXi does:**

- Auto-generates task ID (001, 002...) and title
- Refines requirements and clarifies acceptance criteria
- Creates task document: `.cursor/.lingxi/tasks/001.task.<title>.md`

**Output:**

- `001.task.<title>.md`

### /vet — Inspect Task Quality (Optional)

```
/vet [taskId]
```

**Role:**

- Reviews task quality to improve feasibility and decidability

**What LingXi does:**

- Provides review conclusions and suggestions across completeness, consistency, and edge conditions
- Supports repeated runs for iterative refinement

**Output:**

- No file output (results appear in chat)

### /plan — Refine Implementation (Implementation Level, Optional)

```
/plan [taskId]
```

**Output:**

- `001.plan.<title>.md`
- `001.testcase.<title>.md`

**Role:**

- Refines task into an implementation plan (change points, dependencies, order, risks)
- Performs optional requirement clarification and task decomposition when needed

**What LingXi does:**

- Breaks task into executable work items and verification paths
- Organizes sequencing, dependencies, and major risks
- For unit-testable items, it can apply a `Txa(test) -> Txb(implementation)` test-first pattern

### /build — Execute Implementation (Execution Level, Optional)

```
/build [taskId]
```

**Role:**

- Supports both with-plan and skip-plan inputs to drive implementation and testing loop
- Enforces a test-before-implementation loop for `unit/integration`

**What LingXi does:**

- Selects execution mode based on available inputs and drives implementation

**Output:**

- Code and corresponding test changes

### /review — Independent Acceptance Audit (Acceptance Level)

```
/review [taskId]
```

**Role:**

- Runs independent acceptance audit by requirement item (Feature, denoted as `F`)
- Produces traceable delivery conclusions

**What LingXi does:**

- Gives Pass/Fail per requirement item (`F`)
- Attaches evidence references to each conclusion
- Marks any unverifiable requirement item (`F`) as Fail

**Output:**

- Acceptance conclusions with evidence references (can be materialized as `001.review.<title>.md`)

## Flow Examples

### Simple Task (Skip Plan)

```
/task Fix form validation bug on login page
/build
/review
```

### Complex Task (Recommended Full Chain)

```
/task Refactor user permission system to support RBAC
/vet
/plan
/build
/review
```

### Parallel Multi-task

```
/vet 002
/plan 001
/build 001
/review 002
```

## Next Steps

- Full syntax and parameters: [Commands Reference](/en/guide/commands-reference)
- Learn how the [Memory System](/en/guide/memory-system) captures experience in workflows
- Per-phase taste-sniffing content: [Taste Sniffing](/en/guide/taste-sniffing)
