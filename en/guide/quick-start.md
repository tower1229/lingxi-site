# Quick Start

## Install

Run the install script at the root of your target repository.

**Linux / macOS / Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/tower1229/LingXi/main/install/bash.sh | bash
```

**Windows PowerShell**

```powershell
irm https://raw.githubusercontent.com/tower1229/LingXi/main/install/powershell.ps1 | iex
```

## What Installation Adds

LingXi installs the currently supported product surface into your repository, including:

- `.codex-plugin/plugin.json`
- `skills/`
- `scripts/`
- `templates/`

It also creates project-local runtime artifacts such as:

- `.lingxi/`
- `.codex/agents/`
- `AGENTS.md` when missing

## Runtime Layout

The current runtime layout looks roughly like this:

```text
.lingxi/
  tasks/
  memory/
    INDEX.md
    project/
    share/
  state/
    processed-sessions.json
    distill-journal.jsonl
    memory-ops.jsonl
  setup/
    automation.session-distill.toml
.codex/
  agents/
    lingxi-session-distill.toml
AGENTS.md
```

These areas are used for:

- `tasks/`: task documents
- `memory/`: project and shared memory notes
- `INDEX.md`: the memory index
- `state/`: processed sessions, distill journal, and memory ops logs
- `setup/`: generated automation artifacts
- `.codex/agents/`: local LingXi agent config

## Bootstrap

If you used the remote install script, bootstrap is usually already handled for you.

If you synced LingXi files manually, or want to rerun runtime and automation registration, run:

```bash
npm run lx:bootstrap
# or
node scripts/lx-bootstrap.mjs
```

This step:

1. initializes `.lingxi/`
2. generates `.codex/agents/lingxi-session-distill.toml`
3. generates `.lingxi/setup/automation.session-distill.toml`
4. registers the session-distill automation

## First Use

The main foreground capabilities in LingXi are `task` and `vet`.

A good starting pattern is:

1. use `task` to turn a rough request into a task document
2. use `vet` to challenge the task before implementation begins

The visible flow is:

```text
task → vet
```

In the background, `session-distill` keeps extracting durable engineering judgment from historical sessions so future task and vet work can benefit from it.

## Debugging And Useful Commands

If you want to inspect runtime state or debug the memory system, these lower-level commands are useful:

```bash
npm run lx:setup
npm run lx:create-automation
npm run lx:distill-sessions
npm run lx:memory-brief -- --prompt "current request"
```

Or run:

```bash
npm run lx:bootstrap
```

## Next

- [What Is LingXi](/en/guide/what-is-lingxi)
- [Core Workflow](/en/guide/core-workflow)
- [Memory System](/en/guide/memory-system)
