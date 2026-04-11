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

- `.agents/plugins/marketplace.json`
- `.codex-plugin/plugin.json`
- `skills/`
- `scripts/`
- `templates/`

It also creates project-local runtime artifacts such as:

- `.lingxi/`
- `.codex/config.toml`
- `.codex/hooks.json`
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
    memory-ops.jsonl   # created on demand
  setup/
    automation.session-distill.toml
.codex/
  config.toml
  hooks.json
  agents/
    lingxi-session-distill.toml
AGENTS.md
```

These areas are used for:

- `tasks/`: task documents
- `memory/`: project and shared memory notes
- `INDEX.md`: the memory index
- `state/`: processed sessions, distill journal, and lazily-created memory ops logs
- `.codex/config.toml`: enables repo-local Codex hooks
- `.codex/hooks.json`: defines LingXi's repo-local `UserPromptSubmit` hook
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
2. creates or merges `.codex/config.toml`
3. creates or merges `.codex/hooks.json`
4. generates `.codex/agents/lingxi-session-distill.toml`
5. generates `.lingxi/setup/automation.session-distill.toml`
6. registers the session-distill automation

Additional notes:

- For meaningful repository requests, LingXi now injects the smallest relevant memory set automatically through a repo-local Codex `UserPromptSubmit` hook.
- On native Windows, setup still writes the hook config, but the current Codex runtime does not execute hooks natively yet.

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
```

There is no longer a supported `lx-memory-brief` manual command in the current mainline. Generic repository-turn memory consumption now happens automatically through the repo-local Codex hook, while `task` and `vet` continue to retrieve memory directly.

Or run:

```bash
npm run lx:bootstrap
```

## Next

- [What Is LingXi](/en/guide/what-is-lingxi)
- [Core Workflow](/en/guide/core-workflow)
- [Memory System](/en/guide/memory-system)
