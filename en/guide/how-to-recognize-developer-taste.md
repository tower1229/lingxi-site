# Developer Taste: From Abstract to Capturable

LingXi’s memory system has one hard rule: **everything written to memory must first go through taste-recognition.**

This page explains three things: **how we define “taste,”** **why we break it into concrete, actionable types,** and **how that breakdown lets the AI truly “work your way.”** You will get the operational definition of taste, the design rationale for the nine capturable content types, and taste-recognition’s role in recognition, elevation, and the payload contract.

---

## 1. Why Taste Matters—and Why It’s Hard to “Just Remember”

In AI-assisted work, long-term quality often depends not on whether the model can code, but on whether it follows **your judgment**: which option to pick among many, what to stick to in which context, what not to do.

Those judgments rarely appear as full specifications; they are scattered in the conversation—a “don’t do it that way,” a design choice, a correction. If we dump them into memory without extraction, they either vanish with the session or become hard-to-retrieve noise.

So we don’t treat “taste” as a vague tag. We ask: **What kinds of judgment are worth remembering and can be reliably recognized and reused?** The answer can’t be “whatever you find important”—that leads to noisy recognition, arbitrary writes, and broken retrieval. We need an **enumerable, recognizable scope of what gets captured**, so “taste” goes from abstract feeling to actionable memory types. The next section gives the unified shape; section 3 unpacks the type breakdown.

---

## 2. The Operational Definition of Taste: Scene + Principle Candidates + Actual Choice

In LingXi, **taste** has a single structure, no matter which content type it belongs to:

- **Scene**: In some situation (when, what kind)
- **Principle candidates**: A set of options that may apply or even conflict
- **Actual choice**: The choice and trade-off the user made (optionally with reason or evidence)

In short: **scene + principle candidates + actual choice.**

Why this shape:

- **Scene** determines “when this memory should be loaded”; without it, retrieval can’t reliably match.
- **Principle candidates + actual choice** express “what was chosen among what options,” not an isolated conclusion—keeping the contrast (for future analogy) and making merge/replace tractable in governance.

So taste-recognition’s job is always to **extract “scene + principle candidates + actual choice”** from user input, add evidence (user quote) when needed, then run pattern alignment and elevation to produce the **only valid** extended payload.  
But “capturable” covers a wide range. To improve recognition accuracy and give retrieval and governance a clear basis, we must break down **what we capture** by type. The next section does that.

---

## 3. Concretizing Taste: What We Capture (Nine Types)

“Taste” in everyday language is broad: preferences, experience, knowledge, taboos…. Without a breakdown, the recognition step can’t tell “one-off venting” from “a reusable principle.”

LingXi narrows **capturable content** to nine types. Each has a clear boundary, a corresponding memory shape (Note Kind), and typical user signals. The goal is not to burden the user with taxonomy, but to let the system (and the Agent doing recognition) know **what to map an utterance to, and how different types can get different treatment in write and retrieval.**

### 3.1 Nine Capturable Content Types

| Type | Meaning | Why a separate type |
|------|---------|---------------------|
| **Preference** | Stable “do/don’t” choices in a situation (style, tools, wording, process), possibly without deep rationale. | High frequency, often no explicit alternatives; must be distinguished from “decision” so casual preference isn’t treated as a major trade-off. |
| **Decision experience** | A choice among options, with context, rationale, alternatives, and outcome (or expectation). | Has alternatives and rationale; high value for future similar decisions; elevation gives separate guidance on D1/D2. |
| **Domain knowledge** | Terms, concepts, conventions, best practices, common pitfalls, and troubleshooting paths in a domain (verifiable, reusable). | Fact- and rule-oriented; emphasizes verifiability (D3); keyword path should carry weight in retrieval. |
| **Product/business knowledge** | Product semantics, business rules, acceptance criteria, boundary conditions. | Tightly bound to requirements, acceptance, and boundary discussion; often aligned with task/review acceptance. |
| **Industry/organization experience** | Conventions, compliance, org-wide agreements, collaboration style. | Often reused across projects, suitable for share; signals often include “our company/team.” |
| **Heuristic** | Reusable rules like “in X usually Y” or “when A, check B first,” not necessarily proven. | Sits between preference and pattern; can be aligned via pattern-catalog “Heuristic” and boost D2. |
| **Pattern** | Named design/engineering/collaboration patterns and when they apply. | Covered by pattern-catalog; after match, set patternHint; When to load can follow catalog wording. |
| **Counter-signals and constraints** | Explicit “don’t,” “not here,” “exception”—prohibitions and boundaries. | Expressed via Counter-signals and One-liner; retrieval needs high situational match to avoid misuse. |
| **Troubleshooting and root cause** | Typical symptoms, investigation order, root cause, and reproducible steps for a class of issues. | Must be reproducible and transferable to similar issues; high D4 stability favors capture. |

### 3.2 How Types Map to Implementation

The nine types **do not add new payload fields**. They are distinguished by conventions such as **Kind**, **When to load**, **One-liner**, and **Context/Decision**. Recognition matches user signals by type (e.g. “chose X because,” “don’t…,” “when X do Y first”); elevation uses type-based scoring guidance (e.g. decision experience with alternatives → D1/D2 at least 1; domain/troubleshooting → emphasize D3/D4).

So “taste” is no longer a fuzzy set but **enumerable types plus a unified structure (scene + principle candidates + actual choice)**—keeping conceptual openness while making recognition and retrieval well-defined. With this type breakdown, taste-recognition’s pipeline can do type-aware recognition and elevation. The next section describes how that pipeline works.

---

## 4. The taste-recognition Pipeline: Recognize, Elevate, Contract

taste-recognition **does not write to memory** and does not handle conflict resolution (merge/replace is done by lingxi-memory). It does one thing: **decide whether the current input contains capturable taste; if yes, output payloads that satisfy the contract; if no or “don’t write,” stay silent.**

Internally it’s a fixed pipeline in four steps:

**1. Recognize**

Using the user message (and, when needed, the last 1–2 turns), judge by **content type** whether there is capturable signal. Each of the nine types has typical phrasings—e.g. preference (“like / usually / don’t”), decision experience (“chose X because”), industry/org (“we always…”).  
**No capturable signal → return silently**, no payload, no call to lingxi-memory.

**2. Pattern alignment**

For capturable items, extract scene, principles, choice, evidence; then try to map to the design-pattern catalog (Strategy, Convention over Configuration, Layered Architecture, Heuristic, etc.). If there’s a match, rewrite principles/choice with the pattern name or “pattern + constraint,” and set `patternHint` and `patternConfidence`. Aligning to a pattern makes the note easier to retrieve and ensures D2 ≥ 1 in elevation.

**3. Value gate (elevation)**

Score the content (D1 decision gain, D2 reusability/triggerability, D3 verifiability, D4 stability) and apply **type-based scoring guidance** (e.g. decision experience with alternatives → D1/D2 at least 1; domain/troubleshooting → emphasize D3/D4).  
**T ≤ 3 or an exception → do not write this entry**: do not output this payload, do not add it to the payloads array. Only entries with T ≥ 4 and no exception proceed.

**4. Output**

For entries that pass, set layer (L0/L1/L0+L1) and optional l0OneLiner/l1OneLiner, emit JSON that matches the extended payload spec; multiple entries in one turn form the payloads array. **Only when payloads is non-empty** does the main agent pass it to lingxi-memory.

**Summary**: **Recognize (by type) → pattern align → elevate (with type guidance) → output payload only for “worth writing.”** Otherwise the whole pipeline stays silent and the memory bank is unchanged.

---

## 5. Multiple Entry Points, One Contract

taste-recognition is not only used for `/remember`. Every path that can write to memory goes through it:

| Trigger | Input | payload.source |
|--------|--------|----------------|
| `/remember` | Current user input or user-specified “what to remember” | `remember` |
| Automatic session distillation | Full dialogue of finished sessions (enqueued when a new conversation starts and >30 min since last run; fetched by background subagent) | `heartbeat` |
| `/init` write | User-confirmed init drafts | `init` |
| Workflow taste sniffing | Choices collected via ask-questions in task / plan / build / review (see [Taste Sniffing](/en/guide/taste-sniffing)) | `choice` |

From any entry point, **the same type-aware recognition and elevation logic** runs, and the **same extended payload contract** is produced. That keeps every note in memory in a consistent shape, so governance (TopK, merge/replace/veto) and retrieval work reliably. Different types can get different retrieval strategies later (e.g. preference/counter-signals for precision, domain/troubleshooting for recall); the current implementation still uses a single dual-path strategy. See [Memory System](/en/guide/memory-system) and the main-repo memory-retrieve docs for strategy details.

---

## 6. Output Shape and Downstream Boundary

Downstream lingxi-memory **accepts only the payloads array** (elements are extended payloads). It does not produce candidates and does not accept raw conversation.

Required and optional payload fields are in the main repo [taste-recognition SKILL](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/taste-recognition/SKILL.md). The ones that map directly to “taste” are:

| Field | Meaning |
|-------|---------|
| scene / principles / choice | “Scene + principle candidates + actual choice”; principles and choice together express “what was chosen among what options.” |
| evidence | Optional user quote for verifiability and L0 fact layer. |
| layer | Set by this skill during elevation (L0 / L1 / L0+L1)—whether to store as fact layer, principle layer, or both. |
| l0OneLiner / l1OneLiner | Optional one-liners for the note, used downstream for retrieval and injection. |

Elevation (write or not, L0/L1) **is entirely done inside taste-recognition**. lingxi-memory does not recognize, score, or elevate; it only maps payload to note, governs, gates, and writes.

**Responsibility boundary**: **Whether something enters memory and in what shape** is decided by taste-recognition; **which note it lands in, whether to merge/replace, and whether to prompt the user** is decided by lingxi-memory.

---

## 7. Summary: Taste as Reusable Judgment Structure

Concretizing “taste” into nine capturable types is not about limiting what you can remember. It’s about three things, in line with the opening:

1. **Turn implicit judgment into a retrievable decision structure.** Only content in the shape “scene + principle candidates + actual choice” is stored, with a clear Kind and writing convention per type, so the memory bank can be reliably matched in future conversations and reused your way.

2. **Filter by value at the door.** Through type-aware recognition and elevation, low-value or one-off content never becomes a payload and never enters memory—noise is controlled at the source.

3. **One shared “map” for recognition and retrieval.** The type table is both the signal guide for recognition and the convention for Kind/When to load at write time; it can also support type-specific retrieval strategies later. **The same type system runs through recognition, write, and retrieval.**

So “taste recognition” is not labeling conversation; it’s **providing the only valid input shape for the memory system and letting through only judgments and principles worth reusing long term.** The “type breakdown of taste” turns that input shape from vague “important stuff” into nine enumerable, recognizable types—making “in tune with you” actually operable.

---

## Related Links

- [Memory System](/en/guide/memory-system) — End-to-end flow of memory write, retrieval, and governance
- [Memory Governance and Write](/en/guide/memory-governance-and-write) — lingxi-memory responsibilities and governance logic
- Main repo [taste-recognition SKILL](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/taste-recognition/SKILL.md) — Full payload spec and references
- Main repo [content-types](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/taste-recognition/references/content-types.md) — Nine types, Kind mapping, and format conventions
