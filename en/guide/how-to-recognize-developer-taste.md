# How to Effectively Recognize Developer Taste

In AI-assisted development, what really determines long-term output quality is not only the model's "coding ability", but more importantly the developer's "taste":
when facing multiple possible solutions, how the developer chooses, why they choose that way, and in which contexts they stick to that choice.

`taste-recognition` turns this implicit judgment into structured input that can be stored, reused, and governed.

---

## 1) What “Developer Taste” Means

In LingXi, taste is not abstract preference. It is operational:

- in a **specific scenario**,
- across potentially conflicting **principle candidates**,
- with the developer's **actual choice** and trade-off (optionally with reason).

In short: **scenario + candidate principles + actual choice**.

This definition helps:

- avoid empty “style preference” statements,
- make retrieval, judgment, and reuse stable downstream.

---

## 2) What `taste-recognition` Solves

It does not write to memory, and does not govern conflicts.
It does one job: **detect whether reusable taste exists and output a standard payload**.

So it solves:

- extracting reusable decisions from natural conversation,
- standardizing upstream input to reduce downstream drift,
- turning wording into an executable contract.

---

## 3) Single Output Contract: 7-Field Payload

`taste-recognition` has one output shape:

- `scene`: scenario (when/what kind of context)
- `principles`: candidate principles (typically 1-2)
- `choice`: actual choice (aligned with or equivalent to principles)
- `evidence`: optional one-line evidence quote
- `source`: origin (`remember` / `extract` / `choice` / `init`)
- `confidence`: confidence (`low` / `medium` / `high`)
- `apply`: scope (`personal` / `project` / `team`)

One line summary: **structure taste first, then do persistence and governance**.

---

## 4) Key to Effective Recognition: 4 Triggers

`taste-recognition` is not only for `/remember`. It covers multiple real entry points:

- explicit **/remember**,
- explicit **/extract**,
- confirmed drafts in **/init** (`source=init`),
- **workflow built-in taste sniffing**: in task / plan / build / review, when context calls for it, ask-questions collects your choices and produces payloads (`source=choice`) that are written to memory.

Effective recognition is not “capture more”; it is “capture right”:

- output only when a storable signal exists,
- stay silent when no signal exists,
- use recent 1-2 turns when context is needed.

---

## 5) What “Effective” Actually Means

Not “recognize as much as possible,” but “usable after recognition.”

Usable results usually have:

- **clear scenario**: answers “when does this apply,”
- **clear comparison**: answers “what choice was made among what candidates,”
- **traceable evidence**: at least weak evidence, not pure opinion,
- **expressible boundary**: indicates when it does not apply,
- **downstream compatibility**: matches the 7-field contract.

---

## 6) Responsibility Boundaries with Downstream

Common confusion to avoid:

- `taste-recognition`: detect and structure taste,
- `lingxi-memory`: validate, score, govern, gate, and write,
- five-dimension scorecard: decide write value and target shape (L0/L1/both).

So: **recognition is the entry, scoring is the gate, governance is quality assurance**.

---

## 7) Minimal Example

User says:
“Do not include full Skill paths in docs; too heavy. Keep short references.”

Recognized output (example):

- scene: when referencing skills in docs
- principles: short reference / full path
- choice: short reference
- evidence: do not include full path
- source: remember
- confidence: high
- apply: team

This is effective because it has scenario, comparable options, and guidance for future similar decisions.

---

## 8) Common Pitfalls

- treating command templates as taste,
- choice without scenario (hard to reuse),
- opinion without evidence (hard to verify),
- writing directly after recognition without the contract,
- mixing recognition and scoring into one stage.

---

## 9) Closing

Effective recognition of developer taste turns implicit judgment into explicit decision assets.
`taste-recognition` provides the first-principles step: **standardize recognition first, then let downstream score and govern**.
When recognition is stable and input is uniform, the memory system can reliably “work the way you work.”

## Related Links

- [Memory System](/en/guide/memory-system)
- [Five-Dimension Scorecard Reference](/en/guide/five-dimension-scorecard)
