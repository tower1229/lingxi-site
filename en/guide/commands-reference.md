# Commands and Workflow Reference

Use this page as a quick contract: entry, purpose, and output.

## Workflow Skills

LingXi workflow is skill-driven: `task -> vet -> plan -> build -> review`.  
These skills run only when explicitly invoked (command or clear natural-language request).

| Skill | Purpose | Typical output |
| --- | --- | --- |
| `task` | Define goal, boundaries, acceptance | `*.task.*.md` |
| `vet` | Review task quality | In-chat review conclusions |
| `plan` | Build implementation and test mapping | `*.plan.*.md` + `*.testcase.*.md` |
| `build` | Implement and test | Code and test changes |
| `review` | Requirement-level acceptance audit | `*.review.*.md` |

## Memory Commands

### `/remember`

```bash
/remember <description>
```

- Purpose: capture one memory immediately
- Output: write to `memory/project/` or `memory/share/`, update `INDEX`

### `/memory-govern`

```bash
/memory-govern [--dry-run] [--skip-govern] [--root <memoryRoot>]
```

- Purpose: index sync and optional proactive governance
- Effect: restore INDEX/notes consistency and apply governance suggestions after confirmation

### `/init`

```bash
/init
```

- Purpose: initialize project context and generate memory candidates
- Default behavior: candidate-first, no automatic write until explicit confirmation

## Debug and Tuning Helpers

### `about-lingxi` (Skill)

- Role: LingXi's human+AI co-readable technical handbook (knowledge base), exposed as a Skill for on-demand automatic loading
- Think of it as one capability with two layers:
  - **Documentation layer (Human + AI Readable)**: background, architecture, mechanisms, design principles, evaluation criteria
  - **Invocation layer (Skill)**: quickly loads that knowledge when the model needs LingXi-specific context
- Use when:
  - you need to align on what LingXi is and how/why it is designed this way
  - you are evaluating long-term benefit/cost/boundary of mechanism changes
  - you are choosing among `Command / Skill / Hook / Subagent`
- Loading:
  - primarily auto-loaded by the model when LingXi background is needed
  - can also be manually triggered (type `/about-lingxi` in Cursor and select the skill)
- Boundary: provides background and evaluation context only; performs no concrete actions directly

### `/start-tuning`

```bash
/start-tuning
```

- Role: an upper-layer application of `about-lingxi` (debug/tuning shortcut entrypoint)
- Goal: switch the model into LingXi tuning mode so developers can debug LingXi efficiently
- What happens: it auto-loads `about-lingxi` as background context, then starts tuning analysis and discussion
- Use when: debugging LingXi, aligning optimization goals, clarifying constraints, planning evolution paths
- Boundary: session starter for tuning; it does not own the underlying knowledge content (that is `about-lingxi`)

## Automatic Background Tasks (No Manual Command)

At session start, LingXi may trigger background subagents by convention:

- **Session distillation** via `lingxi-session-distill`
- **Self-iterate** via `lingxi-self-iterate`

Both run in background and do not block the main conversation.

## Uninstall

```bash
yarn lx:uninstall
# or
npm run lx:uninstall
```

For non-interactive environments:

```bash
yarn lx:uninstall --yes
```

## Install Manifest Automation

Run these three tests in CI:

- `install-manifest-exists`: manifest path validity (manifest -> repo)
- `install-manifest-coverage`: structural coverage (repo -> manifest)
- `install-manifest-version-sync`: version consistency (manifest = package)

## Next Steps

- [Core Workflow](/en/guide/core-workflow)
- [Memory System](/en/guide/memory-system)
- [FAQ](/en/guide/faq)
