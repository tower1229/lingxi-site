# Five-Dimension Scorecard Reference

> Writing style: concise, direct, executable (aligned with `[MEM-002]`).

## Five-Dimension Scorecard: Make Memory Serve Future Decisions

In knowledge-capture systems, the biggest problem is usually not “we forget,” but “we store a lot and still can’t use it.”
The scorecard answers three questions before writing:

- Should this content enter long-term memory?
- Should it stay as a fact (L0) or be elevated to a principle (L1)?
- When should we reject writing to avoid noise?

It is not a “taste-identification” tool. It is a value gate for already-identified content.

---

## 1) What Problem It Solves

Teams often accumulate low-value memory such as:

- One-off facts that cannot be reused
- Over-detailed notes that are hard to hit during retrieval
- Subjective opinions with weak evidence
- Highly time-sensitive conclusions that expire quickly

The scorecard applies one standard to keep “correct but useless” content out of the memory bank.

---

## 2) Scoring Model: 5 Dimensions × 0~2

Total score is `T = D1 + D2 + D3 + D4 + D5` (max 10).

### D1 Decision Gain

Can this content change future choices?

- `0`: Almost no decision impact
- `1`: Some reference value, limited impact
- `2`: Clearly affects downstream strategy

### D2 Transferability

Can it transfer to similar scenarios instead of one-off context?

- `0`: Only for a single task/file
- `1`: Reusable in part of the same project
- `2`: Stable reuse across tasks and scenarios

### D3 Triggerability

Will it be easy to trigger in future retrieval?

- `0`: Trigger signals are vague
- `1`: Triggerable by some keywords
- `2`: Clear scenario signals, easy to hit

### D4 Verifiability

Can it be verified, reviewed, and audited?

- `0`: Pure subjective claim, no evidence
- `1`: Weak evidence or indirect verification
- `2`: Clear evidence chain, easy to review

### D5 Stability

Will it stay valid in a foreseeable time window?

- `0`: One-off, short-lived
- `1`: Mid-term usable, many boundaries
- `2`: Long-term stable, low change risk

---

## 3) From Total Score to Write Shape

The scorecard decides both “whether to write” and “how to write.”

- `T ≤ 3`: **Do not write**
- `T ∈ [4, 5]` and `D4 ≥ 1`: write **L0 (fact layer)**
- `T ∈ [6, 7]` and `D1 + D2 ≥ 3`: write **L1 (principle layer)**
- `T ≥ 8` and `D2 ≥ 1` and `D4 ≥ 1`: write **L0 + L1 (both layers)**

### Exception Rules (hard constraints)

- If `D4 = 0` (not verifiable), do not write directly to L1 even with high total score
- If `D5 = 0` and the case is one-off, default to not writing
- If conclusions conflict, govern first (`merge/replace/veto`) instead of silent direct write

---

## 4) L0 and L1 Responsibilities

### L0 (Fact layer)

Answers: “What happened, and what is the evidence?”

Template:
Under `[specific scenario]`, `[verifiable fact/action]` happened, leading to `[outcome]`.

### L1 (Principle layer)

Answers: “What should we do next time, and why?”

Template:
In `[scenario family]`, prefer `[strategy]`, avoid `[anti-strategy]`, because `[goal/risk]`.

> Simple view: L0 is evidence; L1 is methodology.

---

## 5) Quick Example

Candidate:
“A special fix order used once on a temporary branch.”

Possible score:

- D1=1 (some reference value)
- D2=0 (barely transferable)
- D3=0 (weak trigger conditions)
- D4=1 (reviewable)
- D5=0 (highly time-sensitive)

`T=2` → **Do not write**.
Reason: It is true, but adds little future decision value.

---

## 6) Implementation Tips (for teams/system designers)

- Align scoring anchors first, then let multiple executors score to reduce subjectivity drift
- Put five-dimension scoring before write, not after governance
- Run governance only for high-quality candidates to reduce maintenance cost
- Record score + final shape (no write/L0/L1/both) for review and optimization

---

## Closing

The scorecard’s value is not “one more process,” but “less wrong accumulation.”
When memory keeps only content that is decision-relevant, transferable, verifiable, triggerable, and stable, the system becomes a decision engine, not just an archive.

## Related Links

- [Memory System](/en/guide/memory-system)
