# Taste Sniffing

**Taste sniffing** is how LingXi **contextually** collects your choices and principles during workflow steps and writes them to memory. While running task / plan / build / review Skills, when decision points like “trade-off between options,” “exception to a rule,” or “acceptance boundary” appear, LingXi uses **ask-questions** to ask you (or silently infers from the conversation); your choices are turned into payloads (`source=choice`) by **taste-recognition** and then written by **lingxi-memory**, without you running `/remember`. This page lists taste-sniffing content **per phase** and links to [Memory System](/en/guide/memory-system) and [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

## Overview

- **When it runs**: Only during **task**, **plan**, **build**, **review** workflow Skills, when the **context** matches the rules for that phase; it is not auto-loaded by semantics—the agent follows the rules when the situation calls for it.
- **Common flow**: Before asking, the agent runs **memory-retrieve** with a short decision-point description; if relevant memory is found and covers the current choice, it **does not ask** and follows that memory. When a question is needed, **ask-questions** collects options; the user’s choice or wording is mapped to principles/choice etc. by taste-recognition into a payload (`source=choice`), and the main agent passes the payloads array to lingxi-memory for write.
- **Relation to memory**: Taste sniffing is **one of three** memory write paths (the others are automatic session distillation and manual /remember and /init); note shape and gating are the same, only `source` is `choice`.

## Task phase

When creating or refining task docs, the following situations trigger taste sniffing; before asking, memory-retrieve is run—if memory covers the choice, no question is asked.

| Rule | Context | Principles / strategy | Ask? | What to ask / how to extract |
|------|---------|------------------------|------|------------------------------|
| **Experience first vs cost control** | Requirements or constraints mention “experience first,” “ok to spend more,” or “control cost,” “keep implementation simple,” etc. | principles: `Experience first` / `Cost control`; choice one or mapped from user wording. | Can infer silently; use ask-questions if wording is ambiguous. | “Do you prefer prioritizing experience or controlling implementation cost?” Options aligned with principles; map selection to payload; source=choice. |
| **Reuse first vs implement then abstract** | Requirements mention “shared logic,” “avoid duplication,” “componentize,” “get it working then abstract,” etc. | principles: `Reuse first` / `Implement then abstract`; choice one. | Can infer silently; ask-questions if needed. | “Do you prefer abstracting for reuse first or implementing then abstracting when needed?” Map to principles/choice; source=choice. |
| **Requirements / acceptance / boundary (codify)** | User explicitly fixes acceptance criteria, business rules, boundaries, or differentiators (e.g. “in our product X is always Y,” “acceptance must include Z”). | Infer principles/choice from wording; Kind tends to business/reference. | Can infer; if unclear, ask “Do you want this rule stored so it’s used automatically in future requirements/acceptance?” | Map to principles/choice, evidence; scene leans requirements/acceptance/boundary; source=choice; type product/business knowledge. |

**Main content types in this phase**: Preference, decision experience, product/business knowledge. See [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

## Plan phase

During solution discussion and implementation refinement, the following situations apply; memory-retrieve runs before asking when relevant.

| Rule | Context | Principles / strategy | Ask? | What to ask / how to extract |
|------|---------|------------------------|------|------------------------------|
| **Ask reason when user picks non-recommended option** | Agent recommends A, user explicitly picks B or another non-recommended option. | Infer principles and choice from user’s reason; common dimensions: maintainability, performance, timeline, risk tolerance. | Actively ask for the reason behind the choice. | “Briefly, what drove your choice?” Options can align with principle dimensions; map reason or option id to principles/choice, evidence; source=choice. |
| **Simple first vs reserve extension points** | Discussion mentions “keep it simple,” “reserve extension points,” “do it right once,” etc. | principles: `Simple first` / `Reserve extension points`; choice one. | Can infer from conversation or ask-questions to confirm. | “Do you prefer a simple implementation then iterate, or reserve extension points?” Map to principles/choice; source=choice. |
| **Product/business rule (codify)** | User explicitly turns acceptance criteria, boundaries, or business semantics into memory. | Treat as product/business knowledge; ask whether to store if needed; point to content-types. | Ask to store when needed. | Infer principles/choice, fill payload; source=choice. |

**Main content types in this phase**: Decision experience, preference, heuristics. See [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

## Build phase

During coding and implementation, the following situations apply; memory-retrieve runs before asking when relevant.

| Rule | Context | Principles / strategy | Ask? | What to ask / how to extract |
|------|---------|------------------------|------|------------------------------|
| **Reuse / componentize** | User asks to extract components, shared logic, avoid duplicate implementation, etc. | principles: `Reuse first` / `Implement then abstract`; aligned with task-phase reuse context. | Can infer from conversation. | If needed: “Prefer abstracting for reuse or implementing then abstracting when needed?” Map to principles/choice; source=choice. |
| **Convention and exception** | User insists on a style that diverges from usual conventions or bypasses a rule. | principles: `Follow convention` / `Exception with reason`; choice + exception conditions (counter-signals). | Can ask for reason or scope of exception. | “What’s the reason for this? When is this exception acceptable?” Map to principles/choice, evidence = user reason; optional counter-signals; source=choice. |

**Main content types in this phase**: Preference, counter-examples and constraints, heuristics. See [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

## Review phase

During delivery review and acceptance, the following situations apply; memory-retrieve runs before asking when relevant.

| Rule | Context | Principles / strategy | Ask? | What to ask / how to extract |
|------|---------|------------------------|------|------------------------------|
| **Exception handling** | User chooses not to fix an item, to accept risk, or to handle it as an exception. | principles: `Must fix` / `Accept risk or exception`; choice + applicable scope. | Actively ask for reason and scope of exception. | “What’s the reasoning for accepting this risk/exception? In what scope does it apply?” Map reason and scope to principles/choice, evidence; source=choice. |
| **Design taste / style suggestion** | User gives clear style or rule suggestions (e.g. “in these cases we usually…,” “layout should…”). | Infer named principles from wording (e.g. “accessibility first for layout”); can prelist common design dimensions. | Can infer; confirm scope if needed. | “Do you want this suggestion stored as a team-level convention?” Infer principles/choice; source=choice. |
| **Acceptance / business rule (codify)** | User explicitly fixes rules like “this type of issue must always be fixed.” | Ask whether to store as product/business knowledge or principle; point to content-types. | Ask to store when needed. | Infer principles/choice; source=choice. |

**Main content types in this phase**: Counter-examples and constraints, preference, product/business knowledge (acceptance-related). See [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).

## Relation to Memory System and Developer Taste

- **Memory write**: Payloads from taste sniffing use the **same extended payload contract** as `/remember` and session distillation (scene, principles, choice, evidence, source, confidence, apply, layer, etc.); only `source=choice` marks workflow-origin. Write and gating are handled by [Memory System](/en/guide/memory-system) and lingxi-memory.
- **Recognition and elevation**: Mapping from user choice/wording to payload and elevation (T≥4 to write) is done by **taste-recognition**; the nine content types and boundaries are in [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste).
- **Vet phase**: Vet only reviews task document quality and does not produce implementation-level plans; **no separate taste-sniff rules** are defined for vet. If a vet conversation yields trade-offs or principles worth storing, the agent can handle them with general recognition or leave them to task/plan/build/review rules.

## Next steps

- [Memory System](/en/guide/memory-system) — Three write paths, retrieval, gating
- [How to Recognize Developer Taste](/en/guide/how-to-recognize-developer-taste) — Content types and taste-recognition pipeline
- [Commands Reference](/en/guide/commands-reference) — Workflow Skills and /remember
- [GitHub repository](https://github.com/tower1229/LingXi) — Per-phase `references/taste-sniff-rules.md`
