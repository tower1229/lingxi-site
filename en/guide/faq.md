# Frequently Asked Questions

## Environment & Installation

### What Cursor version does LingXi require?

LingXi requires the **latest stable Cursor**. Ensure Cursor is installed and working before installing LingXi; see the main [README](https://github.com/tower1229/LingXi) for version details.

### Do I need Node.js?

**Not for the basic workflow.** You can use `/task`, `/vet`, `/plan`, `/build`, `/review`, `/remember`, `/init`, and `/extract` without Node.js on your machine.

You need Node.js when:

- Using **`memory-sync`** to update the memory index (e.g. after cross-project memory sharing)
- Running **workspace-bootstrap** directly (e.g. `.cursor/skills/workspace-bootstrap/scripts/workspace-bootstrap.mjs`)

### Where does memory-sync come from and where do I run it?

**LingXi’s install script** adds the `memory-sync` script to your project’s `package.json` during installation. Run **`yarn memory-sync`** or **`npm run memory-sync`** from the **project root** to sync `.cursor/.lingxi/memory/INDEX.md` after adding or updating shared memories. Node.js must be installed. See [Memory System — Cross-project sharing](/en/guide/memory-system#cross-project-sharing). If the script is not present, complete the [Quick Start](/en/guide/quick-start) installation first.

---

## Workflow & Cursor Integration

### How do LingXi’s /plan and /build relate to Cursor’s built-in Plan/Build?

They **complement each other**. LingXi’s `/plan` and `/build` are centered on **task documents** (`.cursor/.lingxi/tasks/`) and fit into the optional pipeline with vet, review, etc. Cursor’s Plan mode and Build feature can replace or combine with them when appropriate (e.g. using Cursor’s built-in build in Plan mode and skipping LingXi’s `/build`). See [Core Workflow](/en/guide/core-workflow).

---

## Memory System

### What if I have too many memories or too much noise?

LingXi applies **automatic governance**: a [scorecard](/en/guide/memory-system#scorecard-system) evaluates value, TopK keeps high-value notes, and **gates** let you decide merge/replace when new and existing memories conflict. You can rely on these to trim over time; the [Memory System — Scorecard system](/en/guide/memory-system#scorecard-system) describes the scoring dimensions, and the main repo has more on pruning and maintenance.

---

## More

- [Commands Reference](/en/guide/commands-reference) — Syntax and parameters for all commands
- [Quick Start](/en/guide/quick-start) — Installation and first task
- [GitHub repository](https://github.com/tower1229/LingXi) — Source and Issues
