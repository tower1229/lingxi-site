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

## 3) Single Output Contract: Extended Payload (7 Fields + layer)

`taste-recognition` has one output shape:

- `scene`: scenario (when/what kind of context)
- `principles`: candidate principles (typically 1-2)
- `choice`: actual choice (aligned with or equivalent to principles)
- `evidence`: optional one-line evidence quote
- `source`: origin (`remember` / `extract` / `choice` / `init`)
- `confidence`: confidence (`low` / `medium` / `high`)
- `apply`: `project` | `team` — whether the memory goes into `notes/share` (`team` = in share, cross-project; `project` = current project only)
- `layer`: layer (`L0` | `L1` | `L0+L1`), set by taste-recognition during **elevation** (four-dimension scoring)

Elevation (write or not, L0/L1) is done inside taste-recognition via **four-dimension scoring** (D1 decision gain, D2 reusability/triggerability, D3 verifiability, D4 stability). Only elevation-approved entries are output as payloads and sent to lingxi-memory. In short: **structure taste and decide value first, then let downstream map and govern**.

---

## 4) Taste Extraction Triggers

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
- **downstream compatibility**: matches the extended payload contract (7 fields + layer).

---

## 6) Responsibility Boundaries with Downstream

Common confusion to avoid:

- **taste-recognition**: detects capturable taste, does pattern alignment, and runs **four-dimension elevation** (write or not, L0/L1); only elevation-approved entries are output as extended payloads (7 fields + layer).
- **lingxi-memory**: validates payloads, maps payload to note, governs (TopK), gates, and writes; **does not score or elevate** — it only accepts payloads that already passed elevation.

So: **recognition and value judgment live in taste-recognition; mapping and governance live in lingxi-memory**.

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

## 8) Closing

Effective recognition of developer taste turns implicit judgment into explicit decision assets.
`taste-recognition` provides the first-principles step: **standardize recognition and elevation first, then let downstream map and govern**.
When recognition is stable and input is uniform, the memory system can reliably “work the way you work.”

## Related Links

- [Memory System](/en/guide/memory-system)
