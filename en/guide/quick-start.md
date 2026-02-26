# Quick Start

Get LingXi running in your project in just two steps.

## Installation

### Option 1: Cursor Plugin Marketplace (Recommended)

Open the **Plugin Marketplace** in Cursor, search for **"LingXi"**, and click Install.

Once installed, LingXi's Commands, Skills, Agents, and Hooks load with the plugin and are available in any open workspace.

### Option 2: Script Install

If the plugin isn't yet available in the marketplace, run one of these commands from your project root:

**Linux / macOS / Git Bash:**

```bash
curl -fsSL https://raw.githubusercontent.com/tower1229/LingXi/main/install/bash.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://raw.githubusercontent.com/tower1229/LingXi/main/install/powershell.ps1 | iex
```

## Initialize Your Project

In Cursor's Chat, type:

```
/init
```

LingXi will guide you through:

1. **Collecting project info** — tech stack, patterns, coding conventions
2. **Creating workspace directories** — `.cursor/.lingxi/` skeleton and templates
3. **Generating initial memory** — writing project context to `memory/notes/` (optional)

Once initialized, LingXi is ready to go!

## Your First Task

Try creating your first task with LingXi:

```
/req Add user login with email and phone number support
```

LingXi will:
- Auto-generate a task ID (e.g., `001`)
- Create a structured task document: `.cursor/.lingxi/tasks/001.req.user-login.md`
- Guide you through **requirement refinement**: analysis, expansion, confirmation

Then you can choose your next step:

| Next Step | Command | When to Use |
|-----------|---------|-------------|
| Review requirements | `/review-req 001` | Multi-angle review of requirement quality |
| Plan the task | `/plan 001` | Complex task needing step breakdown and test cases |
| Build directly | `/build 001` | Simple task, start coding right away |

## Directory Structure

After initialization, your project will have these new directories:

```
.cursor/.lingxi/
├── tasks/              # Task documents
│   └── 001.req.user-login.md
├── memory/             # Memory system
│   ├── INDEX.md        # Unified index
│   ├── notes/          # Memory notes
│   │   └── share/      # Shared memories (can be a git submodule)
│   └── references/     # Templates and specs
└── workspace/          # Workspace metadata
```

## Next Steps

- Learn the full [Core Workflow](/en/guide/core-workflow) lifecycle
- Understand how the [Memory System](/en/guide/memory-system) works
