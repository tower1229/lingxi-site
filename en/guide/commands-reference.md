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

- initialize `.lingxi/`
- generate `.codex/agents/lingxi-session-distill.toml`
- generate `.lingxi/setup/automation.session-distill.toml`
- register the session-distill automation

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

### `lx-memory-brief`

```bash
npm run lx:memory-brief -- --prompt "current request"
# or
node scripts/lx-memory-brief.mjs --prompt "current request"
```

Purpose:

- retrieve relevant memory for the current request
- return a minimal high-signal memory brief

### `lingxi-setup`

```bash
npm run lx:setup
# or
node scripts/lingxi-setup.mjs
```

Purpose:

- initialize the LingXi runtime directory layout
- generate the runtime skeleton

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
