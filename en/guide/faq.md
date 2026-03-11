# Frequently Asked Questions

## Environment and Installation

### Which Cursor version is required?

Use the latest stable Cursor. Final compatibility details follow the main repository README.

### Do I need local Node.js?

Typical usage of workflow skills plus `/remember` and `/init` usually does not require local Node.js.  
Direct script execution (for example uninstall scripts) does.

### How do I sync the memory index?

Run `/memory-govern` in Cursor. It restores INDEX/notes consistency and can optionally run governance suggestions.

### How do I uninstall LingXi?

From project root:

```bash
yarn lx:uninstall
# or
npm run lx:uninstall
```

For CI/non-interactive environments:

```bash
yarn lx:uninstall --yes
```

### How do I automatically verify install-manifest integrity?

Run three tests in CI:

- `install-manifest-exists`
- `install-manifest-coverage`
- `install-manifest-version-sync`

## Workflow

### How do LingXi `/plan` and `/build` relate to Cursor Plan/Build?

They are complementary. LingXi workflow is task-document-centric and layered; Cursor built-in features can be used as replacement or in combination depending on context.

## Memory System

### What if memory noise grows over time?

Noise is controlled through write governance, minimal retrieval injection, and user gating.  
When needed, use `/memory-govern` for periodic convergence.

## More

- [Commands and Workflow Reference](/en/guide/commands-reference)
- [Memory System](/en/guide/memory-system)
- [Quick Start](/en/guide/quick-start)
