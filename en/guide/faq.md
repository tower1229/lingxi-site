# Frequently Asked Questions

## Environment & Installation

### What Cursor version does LingXi require?

LingXi requires the **latest stable Cursor**. Ensure Cursor is installed and working before installing LingXi; see the main [README](https://github.com/tower1229/LingXi) for version details.

### Do I need Node.js?

**Not for the basic workflow.** Using **task/vet/plan/build/review** skills (e.g. `/task`, `/plan`) or **/remember**, **/init** and other commands does not require Node.js on your machine.

You need Node.js when:

- Running **workspace-bootstrap** directly (e.g. `.cursor/skills/workspace-bootstrap/scripts/workspace-bootstrap.mjs`)
- Running **lx:uninstall** (the uninstall script is Node-based)

To **sync the memory index** after adding or updating shared memories, run the **memory-govern** skill (e.g. `/memory-govern`) in Cursor; no Node.js is required.

### How do I sync the memory index after adding shared memories?

Run the **memory-govern** skill (e.g. `/memory-govern`) in Cursor. It syncs INDEX with notes (removes orphan index rows, has the model complete INDEX rows for unindexed notes) and can optionally run full-library governance. See [Memory System — Cross-project sharing](/en/guide/memory-system#cross-project-sharing).

### How do I uninstall LingXi?

From the **project root**, run **`yarn lx:uninstall`** or **`npm run lx:uninstall`**. This removes `.cursor/.lingxi/` and all LingXi-installed files (commands, skills, hooks, agents, references, etc.) according to the install manifest. In an interactive environment you will be asked to confirm; in non-interactive environments (e.g. CI) use **`yarn lx:uninstall --yes`** to skip confirmation. The script is added to your project’s `package.json` during installation.

---

## Workflow & Cursor Integration

### How do LingXi’s /plan and /build relate to Cursor’s built-in Plan/Build?

They **complement each other**. LingXi’s **plan** and **build** skills are centered on **task documents** (`.cursor/.lingxi/tasks/`) and work with vet/review in a decoupled, on-demand workflow. Cursor’s Plan mode and Build feature can replace or combine with them when appropriate (e.g. using Cursor’s built-in build in Plan mode and skipping LingXi’s build skill). See [Core Workflow](/en/guide/core-workflow).

---

## Memory System

### What if I have too many memories or too much noise?

LingXi applies **automatic governance**: taste-recognition runs **elevation** (write or not, L0/L1) before outputting payloads, so only approved entries are written; lingxi-memory then does semantic-neighbor TopK and gating, and **gates** let you decide merge/replace when new and existing memories conflict. If noise still feels high, rely on these mechanisms to trim over time. See the governance loop in [Memory System](/en/guide/memory-system) and [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

---

## More

- [Commands and Workflow Reference](/en/guide/commands-reference) — Workflow skills and command syntax
- [Quick Start](/en/guide/quick-start) — Installation and first task
- [GitHub repository](https://github.com/tower1229/LingXi) — Source and Issues
