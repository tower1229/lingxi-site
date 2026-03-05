# Understanding Taste Recognition

LingXi’s memory system has one hard rule: **everything that gets written to memory must first go through taste-recognition.**  
This page explains what problem taste-recognition solves, why it uses the shape “scene + principle candidates + actual choice,” and how it works with memory writes so that AI can truly “work your way.”

---

## 1. Why Taste Recognition Exists

What often determines long-term quality in AI-assisted work isn’t whether the model can code, but **your judgment**: which option to pick among many, what to stick to in which context, what not to do.  
Those judgments usually live in the conversation—a “don’t do it that way,” a design choice, a correction. Without extraction, they either vanish with the session or get stored as raw text and become noise.

LingXi’s approach:

- **Never write raw conversation or drafts into memory.** The downstream lingxi-memory subagent accepts only the **payloads array** produced by taste-recognition; it is forbidden to use user messages or dialogue snippets as input.
- **Gate by value at the recognition stage.** Capturable content goes through “pattern alignment + elevation.” Only entries that pass this gate are turned into payloads and sent to lingxi-memory. **Entries that fail the gate never enter the memory bank.**

So: **whether something is allowed into memory is decided by taste-recognition before any payload is produced.**  
The result is that the memory bank is, from the start, “retrievable, reusable decisions and principles,” not chat logs or low-value fragments.

---

## 2. The Operational Definition of “Taste”

In LingXi, **taste** is not a vague word; it has a precise, operational shape:

- In **some scenario** (when / what kind of situation),
- Facing a set of **principle candidates** that may conflict,
- The **actual choice** the user made and the trade-off (optionally with reason or evidence).

In short: **scene + principle candidates + actual choice.**

Why these three?

- **Scene** determines “when this memory should be loaded.” Without it, retrieval can’t reliably match.
- **Principle candidates + actual choice** express “what was chosen among what options,” not a lone conclusion. That keeps the contrast explicit (for future analogy) and makes merge/replace decisions downstream tractable.

So taste-recognition’s job is to **pull out “scene + principle candidates + actual choice”** from user input, add evidence (user quote) when useful, then run pattern alignment and elevation. The output is the **only valid** extended payload.  
If there is no capturable taste → stay silent: no payload, no call to lingxi-memory.

---

## 3. What taste-recognition Does: One Pipeline, Three Gates

This skill **does not write to memory** and does not handle conflict resolution (merge/replace lives in lingxi-memory).  
It does one thing: **decide whether the current input contains capturable taste; if yes, output payloads that satisfy the contract; if no or “don’t write,” stay silent.**

Internally it’s a fixed pipeline:

1. **Recognition**  
   From the current trigger input (and, when needed, the last 1–2 turns) decide if there is capturable signal: preferences, constraints, trade-offs, decisions, user rejections or corrections, named choices among principles, etc.  
   **No capturable signal → return silently**, no payload, no call to lingxi-memory.

2. **Pattern alignment**  
   For capturable items, extract scene, principles, choice, evidence; then try to map to the design-pattern catalog (e.g. Strategy, Convention over Configuration, Layered Architecture).  
   If a match is found, rewrite principles/choice with the pattern name or “pattern + constraint,” and set `patternHint` and `patternConfidence`.  
   Effect: the user may have said something concrete; **aligning to a pattern** makes the note easier to retrieve later (“when to load” is clearer) and guarantees D2 (reusability/triggerability) ≥ 1 in elevation.

3. **Value gate (elevation)**  
   Score the content in the elevation step (D1 decision gain, D2 reusability/triggerability, D3 verifiability, D4 stability), get total T and layer (L0/L1/L0+L1).  
   **T ≤ 3 or an exception → do not write this entry**: do not output this payload, do not add it to the payloads array; the main agent does not call lingxi-memory for it.  
   Only entries with T ≥ 4 and no exception proceed.

4. **Output**  
   For entries that pass, set layer and optional l0OneLiner/l1OneLiner, emit JSON that matches the extended payload spec; multiple entries in one turn form the payloads array.  
   **Only when payloads is non-empty** does the main agent pass it to lingxi-memory.

In one line: **recognize → pattern align → elevate → output payload only for “worth writing”; otherwise the whole pipeline stays silent and the memory bank is untouched.**

---

## 4. Trigger Points: Multiple Entries, One Contract

taste-recognition is not only used for `/remember`. Every path that can write to memory goes through it:

| Trigger | Input | payload.source |
|--------|--------|----------------|
| **/remember** | Current user input or user-specified “what to remember” | `remember` |
| **/extract** | Current conversation or a given time range (aggregated text) | `extract` |
| **/init** write | User-confirmed init drafts (typed collection results) | `init` |
| **Workflow taste sniffing** | Choices collected via ask-questions in task / plan / build / review | `choice` |

Whatever the entry point, **the same recognition and elevation logic** runs, and the **same extended payload contract** is produced.  
That way every note in memory has a consistent shape, and governance (TopK, merge/replace/veto) and retrieval can work reliably.

---

## 5. Output Shape: Extended Payload (7 Fields + layer)

Downstream lingxi-memory **accepts only the payloads array** (elements are extended payloads); it does not produce candidates and does not accept raw conversation.  
Required and optional fields are in the main repo [taste-recognition SKILL](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/taste-recognition/SKILL.md); here we only highlight what ties directly to “taste”:

- **scene / principles / choice**: “scene + principle candidates + actual choice”; principles and choice together express “what was chosen among what options.”
- **evidence**: optional user quote for verifiability and L0 fact layer.
- **layer**: set by this skill during elevation (L0 / L1 / L0+L1), i.e. whether this should be stored as fact layer, principle layer, or both.
- **l0OneLiner / l1OneLiner**: optional one-liners for the note, used by downstream for retrieval and injection.

Elevation (write or not, L0/L1) **is entirely done inside taste-recognition**; lingxi-memory does not score or elevate—it only maps payload to note, governs, gates, and writes.

---

## 6. Boundary with lingxi-memory

- **taste-recognition**: Answers “is there capturable taste, what does it look like, is it worth writing, and at which layer.”  
  Output is either silence (no payload) or a payloads array containing only elevation-approved entries.
- **lingxi-memory**: Accepts only the payloads array; validates, maps payload to note, runs semantic-neighbor TopK governance (merge/replace/veto/new), gates, and writes to notes and INDEX.  
  **It does not recognize, score, or elevate.**

So: **whether something enters memory and in what shape is decided by taste-recognition; which note it lands in, whether to merge/replace, and whether to prompt the user is decided by lingxi-memory.**

---

## 7. Full Example

User says:  
“Don’t write full Skill paths in docs; too heavy. Keep short references.”

After recognition and elevation, a payload like this can be produced (illustrative):

- **scene**: when referencing skills in docs  
- **principles**: short reference / full path  
- **choice**: short reference  
- **evidence**: don’t write full path  
- **source**: remember  
- **confidence**: high  
- **apply**: team  
- **layer**: L1  
- **l1OneLiner**: Prefer natural-language short references when citing capabilities; avoid exposing implementation paths  

This passes elevation because: clear scene, comparable principles and choice, user quote as evidence, and cross-scenario reuse (D2 ≥ 1), so it fits as a principle-layer (L1) memory.  
Next time in a “referencing skills in docs” situation, retrieval can hit this note and suggest acting on “short reference.”

---

## 8. Summary

The value of taste-recognition can be summarized in three points:

1. **Turn implicit judgment into a retrievable decision structure.** Only content in the shape “scene + principle candidates + actual choice” is stored, so the memory bank can be reliably matched in future conversations and reused your way.  
2. **Filter by value at the door.** Via pattern alignment and elevation, low-value or one-off content never becomes a payload and never enters memory—noise is controlled at the source.  
3. **Multiple entry points, one contract.** /remember, /extract, /init, and workflow taste sniffing all use the same pipeline and the same payload spec, so the memory system stays consistently governable.

So “taste recognition” is not about labeling conversation; it’s **providing the only valid input shape for the memory system and letting through only judgments and principles that are worth reusing long term.**  
That’s how LingXi can be “in tune with you” and work your way.

## Related Links

- [Memory System](/en/guide/memory-system) — End-to-end flow of memory write, retrieval, and governance
- [Memory Governance and Write](/en/guide/memory-governance-and-write) — lingxi-memory responsibilities and governance logic
- Main repo [taste-recognition SKILL](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/taste-recognition/SKILL.md) — Full payload spec and references
