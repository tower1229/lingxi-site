# Commands and Workflow Reference

This page is a quick guide to LingXi's current foreground capabilities and lower-level runtime commands.

## Foreground Capabilities

LingXi currently keeps its explicit workflow surface focused on two capabilities:

| Capability | Purpose | Typical output |
| --- | --- | --- |
| `task` | Turn a rough request into an engineer-ready task document | `.lingxi/tasks/*.md` |
| `vet` | Challenge task quality before implementation starts | VetReport (structured output) |

These capabilities run only when explicitly invoked.

## Background Capabilities

LingXi also runs a background memory loop:

| Capability | Purpose | Typical output |
| --- | --- | --- |
| `session-distill` | Distill durable engineering taste from historical sessions | writes to `.lingxi/memory/` and updates state and index |
| `memory-retrieve` | Retrieve the smallest useful set of memory for current work | memory brief / retrieval hits |
| `memory-write` | Govern and persist adjudicated candidates | notes + `INDEX.md` updates |

## Common Scripts

These are the most useful runtime scripts in the current LingXi surface:

### `lx-bootstrap`

```bash
npm run lx:bootstrap
# or
node scripts/lx-bootstrap.mjs
```

Purpose:

- initialize `.lingxi/`, write `AGENTS.md`
- create or merge `.codex/config.toml`, `.codex/hooks.json` (Codex adapter)
- generate `.codex/agents/lingxi-session-distill.toml`
- create or merge `.claude/settings.json` (Claude Code adapter)
- generate `.claude/agents/lingxi-session-distill.md`, copy skills to `.claude/skills/`
- write `CLAUDE.md`, generate `.lingxi/setup/automation.session-distill.toml`
- register the session-distill automation (Codex only)

### `lx-distill-sessions`

```bash
npm run lx:distill-sessions
# or
node scripts/lx-distill-sessions.mjs
```

Purpose:

- scan session artifacts
- select valid sessions
- hand selected sessions to the single-session worker

### Generic Conversation Memory Consumption

The current mainline no longer ships a supported manual `lx-memory-brief` command.

For meaningful repository turns, LingXi injects the smallest relevant memory brief automatically through a repo-local `UserPromptSubmit` hook (Codex or Claude Code).

Notes:

- `task` and `vet` still call the underlying retrieval flow directly rather than going through the hook
- on native Windows, setup still generates hook config, but the current Codex runtime does not execute hooks natively yet

### `lingxi-setup`

```bash
npm run lx:setup
# or
node scripts/lingxi-setup.mjs
```

Purpose:

- initialize the LingXi runtime directory layout `.lingxi/`
- write `AGENTS.md` only when missing
- create or merge `.codex/config.toml`, `.codex/hooks.json` (Codex adapter)
- generate `.codex/agents/lingxi-session-distill.toml`
- create or merge `.claude/settings.json` (Claude Code adapter)
- generate `.claude/agents/lingxi-session-distill.md`, copy skills to `.claude/skills/`
- write `CLAUDE.md` only when missing
- generate `.lingxi/setup/automation.session-distill.toml`

Supports `--host` parameter: `codex`, `claude`, `all` (default).

### `lx-create-automation`

```bash
npm run lx:create-automation
# or
node scripts/lx-create-automation.mjs
```

Purpose:

- register or update LingXi's session-distill automation from setup artifacts

## Uninstall

```bash
npm run lx:uninstall
# or
yarn lx:uninstall
```

For non-interactive environments:

```bash
yarn lx:uninstall --yes
```

## Testing And Release Checks

The main repository currently uses these checks to keep installation, workflow, and memory behavior aligned:

- `npm test`
- `install-manifest-exists`
- `install-manifest-coverage`
- `install-manifest-version-sync`

## Next

- [Core Workflow](/en/guide/core-workflow)
- [Memory System](/en/guide/memory-system)
- [FAQ](/en/guide/faq)
