# Quick Start

Get LingXi running in your project in just two steps. `/init` is recommended, but optional.

## Prerequisites

- **Cursor IDE**: Ensure you have the **latest stable Cursor** installed. See the main [README](https://github.com/tower1229/LingXi) for version details.
- **Node.js**: Only needed when using `memory-sync` to update the memory index or when running scripts such as workspace-bootstrap; you can use the basic workflow (e.g. `/task`, `/plan`, `/build`, `/review`, `/remember`, `/init`, `/refine-memory`) without Node.js.
- For more on environment requirements, see [FAQ](/en/guide/faq).

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

## Initialize Your Project (Recommended, Optional)

In Cursor's Chat, type:

```
/init
```

LingXi will guide you through:

1. **Collecting project info** — tech stack, patterns, coding conventions
2. **Generating initial memory** — writing project context to `memory/notes/` (optional)

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

These commands **act on the latest task by default**; you don't need to type a task ID. For how task IDs work and multi-task behavior, see [Core Workflow — Multi-task support](/en/guide/core-workflow#multi-task-support).

## Directory Structure

After running `/init` or when using related commands for the first time, `.cursor/.lingxi/` is created in your project with this structure:

```
.cursor/.lingxi/
├── tasks/              # Task documents
│   └── 001.task.user-login.md
├── memory/             # Memory system
│   ├── INDEX.md        # Unified index (SSoT)
│   ├── notes/          # Memory notes (flat)
│   │   └── share/      # Shared memories (can be a git submodule)
│   └── references/     # Templates and specs
└── workspace/          # Workspace
    └── audit.log       # Audit log (if enabled)
```

## Next Steps

- Learn the full [Core Workflow](/en/guide/core-workflow) lifecycle
- Understand how the [Memory System](/en/guide/memory-system) works
