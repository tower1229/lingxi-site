# Quick Start

## Installation

Run one of these commands from your project root:

**Linux / macOS / Git Bash:**

```bash
curl -fsSL https://raw.githubusercontent.com/tower1229/LingXi/main/install/bash.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://raw.githubusercontent.com/tower1229/LingXi/main/install/powershell.ps1 | iex
```

## Directory Structure

After running the remote install script, you will get the following LingXi directory structure in your project:

```text
.cursor/
├── commands/              # Helper command entry points (init, remember, memory-govern, etc.)
│   ├── init.md
│   ├── remember.md
│   ├── memory-govern.md
│   └── ...
├── skills/                # Execution logic (workflow + memory, etc.)
│   ├── task/              # Workflow: task document
│   ├── vet/
│   ├── plan/
│   ├── build/
│   ├── review/
│   ├── reviewer-doc-consistency/
│   ├── reviewer-security/
│   ├── reviewer-performance/
│   ├── reviewer-e2e/
│   ├── memory-retrieve/
│   └── ...
├── agents/                # Subagents (isolated context)
│   └── lingxi-memory.md   # Memory writing
├── hooks/                 # sessionStart memory-injection convention + optional audit/gating
└── .lingxi/
    ├── tasks/                 # Task documents (unified directory)
    │   ├── 001.task.<title>.md
    │   ├── 001.plan.<title>.md
    │   └── ...
    ├── memory/                # Unified memory system
    │   ├── INDEX.md           # Unified index (SSoT)
    │   ├── project/           # Project-level memory notes (primary search surface)
    │   └── share/             # Shared memory directory (recommended as git submodule)
    └── workspace/             # Workspace
        └── audit.log          # Audit log
```

## Initialize Your Project (Recommended, Optional)

In Cursor's Chat, type:

```
/init
```

LingXi will guide you through:

1. **Silent understanding + confirmation of project info** — infer from existing docs/repo structure first, then ask only for missing items
2. **Generating a candidate memory list** — candidates are produced first; no write by default
3. **Optional write by your choice** — only when you explicitly choose `all` or `partial`, LingXi writes to `memory/project/` or `memory/share/` (by apply)

If you want to move directly on a concrete requirement, you can start with `/task` first and run `/init` later when needed.

## Your First Task (Recommended)

Try creating your first task with LingXi:

```
/task Add user login with email and phone number support
```

LingXi will:

- Auto-generate a task ID (e.g., `001`)
- Create a structured task document: `.cursor/.lingxi/tasks/001.task.user-login.md`
- Guide you through **requirement refinement**: analysis, expansion, confirmation

Then you can choose your next step:

| Next Step            | Command  | When to Use                                        |
| -------------------- | -------- | -------------------------------------------------- |
| Review task document | `/vet`   | Multi-angle review of requirement quality          |
| Plan the task        | `/plan`  | Complex task needing step breakdown and test cases |
| Build directly       | `/build` | Simple task, start coding right away               |

LingXi workflow (Skills) **act on the latest task by default**, and also support multi-task usage. See [Core Workflow — Multi-task](/en/guide/core-workflow#multi-task-characteristics).

## Next Steps

- Learn the full [Core Workflow](/en/guide/core-workflow) lifecycle
- Understand how the [Memory System](/en/guide/memory-system) works
