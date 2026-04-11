# Frequently Asked Questions

## Environment and Installation

### What environment does LingXi run in?

LingXi is currently a Codex-native engineering workflow product. After installation, its runtime lives inside the target repository, primarily under:

- `.lingxi/`
- `.codex/config.toml`
- `.codex/hooks.json`
- `.codex/agents/`

### Do I need local Node.js?

Yes.

LingXi's setup, bootstrap, automation registration, and lower-level runtime scripts currently depend on Node.js, so the target environment needs a working `node`.

### What is the most important step after installation?

The most important step is making sure bootstrap and automation are actually in place.

If you used the official remote install script, bootstrap is usually already handled.  
If you synced files manually, run:

```bash
node scripts/lx-bootstrap.mjs
```

That step also creates or merges the repo-local Codex hook config that enables automatic memory consumption for generic repository turns.

### How do I uninstall LingXi?

From the project root:

```bash
yarn lx:uninstall
# or
npm run lx:uninstall
```

For CI or other non-interactive environments:

```bash
yarn lx:uninstall --yes
```

## Workflow

### What is LingXi's current core workflow?

The current foreground workflow is:

```text
task → vet
```

`task` shapes a task document. `vet` challenges that task before implementation starts.

### Does LingXi inject a lot of context into every conversation?

LingXi is designed to keep the foreground workflow narrow.

Explicit workflows run only when you call them. Background memory continues to distill and retrieve, and generic meaningful repository turns receive only the smallest useful memory brief through the hook adapter.

### Why am I not seeing automatic memory injection in normal conversations?

Check these first:

1. whether bootstrap has already created `.codex/config.toml` and `.codex/hooks.json`
2. whether the repository is trusted and Codex hooks are actually active
3. whether the current prompt is meaningful repository work rather than casual conversation
4. whether you are on native Windows, where the current Codex runtime still does not execute hooks natively

## Memory System

### Will memory become noisy over time?

LingXi controls noise through three layers:

1. `taste adjudicate` filters for value
2. `governance` decides create / merge / skip
3. retrieval returns only the smallest useful high-signal set

Its goal is to preserve the engineering judgment that is actually worth reusing.

### How does memory affect task and vet?

`task` retrieves relevant memory while drafting and records memories that materially shaped the task in `memory_refs`.  
`vet` retrieves relevant memory again and checks whether the task already reflects those important judgments.

### Do I need to sync the memory index manually?

In the current mainline, `INDEX.md` is maintained automatically during memory writes, so no manual sync is needed.

## Quality and Validation

### How does LingXi avoid producing arbitrary output?

LingXi uses a hybrid model:

- LLMs handle semantic extraction, adjudication, governance, and ranking
- deterministic scripts handle schema, state safety, persistence, and indexing

So the goal is structured output, stable state, and auditable runtime behavior.

### How do I verify that the current install surface is intact?

You can use these tests and checks from the main repository:

- `npm test`
- `install-manifest-exists`
- `install-manifest-coverage`
- `install-manifest-version-sync`

## More

- [Commands and Workflow Reference](/en/guide/commands-reference)
- [Memory System](/en/guide/memory-system)
- [Quick Start](/en/guide/quick-start)
