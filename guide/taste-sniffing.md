# 品味嗅探

**品味嗅探**是灵犀在工作流环节中**情境驱动**地收集你的选择与原则、并写入记忆的机制。在 task / plan / build / review 等 Skill 执行时，当出现「方案取舍」「规范例外」「验收边界」等决策点，灵犀会通过 **ask-questions** 向你提问（或从对话中静默抽取）；你的选择经 **taste-recognition** 产出 payload（`source=choice`）后由 **lingxi-memory** 写入记忆库，无需你额外执行 `/remember`。本文详细列举各环节的品味嗅探内容，并在文末给出与 [记忆系统](/guide/memory-system)、[开发者品味](/guide/how-to-recognize-developer-taste) 的对应关系。

## 概述

- **何时发生**：仅在 **task**、**plan**、**build**、**review** 等工作流 Skill 执行过程中，且**情境满足**各环节规则时触发；不根据语义自动加载，由 Agent 在情境驱动下按规则发起。
- **通用流程**：拟提问前先调用 **memory-retrieve**（传入 Agent 构建的决策点描述）；若检索到相关记忆且能覆盖当前选择，则**不再问**，直接按该记忆行为。需要提问时用 **ask-questions** 收集选项；用户选择或表述经 taste-recognition 映射为 principles/choice 等，产出 payload（`source=choice`），主 Agent 将 payloads 数组交 lingxi-memory 写入。
- **与记忆的关系**：品味嗅探是记忆写入的**三种途径之一**（另两种为自动会话提炼、手动 /remember 与 /init）；写入的笔记形态与门控逻辑与其它途径一致，仅 `source` 为 `choice`。

## 需求环节（task）

在创建或细化任务文档时，当出现下列情境且拟提问前会先做 memory-retrieve；若记忆可覆盖则不再问。

| 规则 | 情境描述 | 原则/策略 | 是否提问 | 问什么 / 如何提取 |
|------|----------|-----------|----------|--------------------|
| **体验优先 vs 成本可控** | 需求或约束中出现「体验优先」「可多花成本」或「先控制成本」「实现简单即可」等信号。 | principles：`体验优先` / `成本可控`；choice 取其一或由用户表述映射。 | 可静默抽取；表述模糊时用 ask-questions 确认倾向。 | 「您更倾向于优先保证体验，还是优先控制实现成本？」选项与 principles 对齐，选后映射到 payload；source=choice。 |
| **复用优先 vs 先实现再抽象** | 需求中出现「抽公共」「避免重复」「组件化」「先跑通再抽象」等。 | principles：`复用优先` / `先实现再抽象`；choice 取其一。 | 可静默抽取；必要时 ask-questions 确认。 | 「您更倾向于优先抽象复用，还是先实现再视情况抽象？」选后映射到 principles/choice；source=choice。 |
| **需求/验收/边界固化** | 用户明确固化验收标准、业务规则、边界条件或与竞品差异（如「我们产品里 X 一律按 Y 算」「验收必须包含 Z」）。 | 由用户表述归纳为 principles/choice；Kind 倾向 business/reference。 | 可静默抽取；若表述模糊可问「是否希望将这条规则沉淀为记忆，以便后续需求/验收时自动参考？」 | 映射到 principles/choice、evidence；scene 偏需求/验收/边界；source=choice；沉淀类型为产品/业务知识。 |

**本环节主要可沉淀类型**：偏好、决策经验、产品/业务知识。类型定义与信号见 [开发者品味](/guide/how-to-recognize-developer-taste)。

## 规划环节（plan）

在方案讨论与实施细化时，当下列情境出现且拟提问前会先 memory-retrieve；若记忆可覆盖则不再问。

| 规则 | 情境描述 | 原则/策略 | 是否提问 | 问什么 / 如何提取 |
|------|----------|-----------|----------|--------------------|
| **用户选非推荐方案时问理由** | Agent 给出推荐方案 A，用户明确选择 B 或其它非推荐项。 | 由用户理由归纳为 principles 与 choice；可预定义常见维度：可维护性/性能/工期/风险偏好等。 | 主动用 questions 问选择理由。 | 「请简短说明您选择该方案的主要考虑。」选项可与常见原则维度对齐；从理由或 option id 映射到 principles/choice、evidence；source=choice。 |
| **先简单实现 vs 预留扩展点** | 方案讨论中出现「先简单」「预留扩展」「一步到位」等。 | principles：`先简单实现` / `预留扩展点`；choice 取其一。 | 可静默从对话抽取或 ask-questions 确认。 | 「您更倾向于先简单实现再迭代，还是预留扩展点？」选后映射到 principles/choice；source=choice。 |
| **产品/业务规则固化** | 用户明确将验收标准、边界条件、业务语义固化为记忆。 | 按产品/业务知识沉淀；必要时问是否沉淀并指向 content-types。 | 必要时问是否沉淀。 | 归纳为 principles/choice，填 payload；source=choice。 |

**本环节主要可沉淀类型**：决策经验、偏好、启发式。类型定义与信号见 [开发者品味](/guide/how-to-recognize-developer-taste)。

## 实现环节（build）

在编码与实现过程中，当下列情境出现且拟提问前会先 memory-retrieve；若记忆可覆盖则不再问。

| 规则 | 情境描述 | 原则/策略 | 是否提问 | 问什么 / 如何提取 |
|------|----------|-----------|----------|--------------------|
| **复用/组件化** | 用户要求抽组件、提公共逻辑、避免重复实现等。 | principles：`复用优先` / `先实现再抽象`；与 task 环节复用情境对齐。 | 可静默从对话抽取。 | 需要时可问「优先抽象复用还是先实现再视情况抽象？」映射到 principles/choice；source=choice。 |
| **规范与例外** | 用户坚持某种与常规规范不一致的写法，或绕过某条规范。 | principles：`遵守规范` / `例外有据`；choice + 例外条件（counter-signals）。 | 可问原因或例外适用边界。 | 「这样写是出于哪方面考虑？在什么情况下可以接受例外？」映射到 principles/choice，evidence 为用户理由；可选 counter-signals；source=choice。 |

**本环节主要可沉淀类型**：偏好、反例与约束、启发式。类型定义与信号见 [开发者品味](/guide/how-to-recognize-developer-taste)。

## 审查环节（review）

在交付审查与验收时，当下列情境出现且拟提问前会先 memory-retrieve；若记忆可覆盖则不再问。

| 规则 | 情境描述 | 原则/策略 | 是否提问 | 问什么 / 如何提取 |
|------|----------|-----------|----------|--------------------|
| **例外处理** | 用户对某条审查问题选择不修、接受风险或特殊处理（例外）。 | principles：`必须修复` / `接受风险或例外`；choice + 适用边界。 | 主动问例外理由与边界。 | 「接受该风险或例外的考虑是？在什么范围内适用？」从理由与边界映射到 principles/choice、evidence；source=choice。 |
| **设计品味/风格建议** | 用户给出明确的风格、规则类建议（如「这类情况都建议…」「布局应…」）。 | 由用户表述归纳为可命名原则（如「布局先考虑可访问性」）；可预列常见设计维度。 | 可静默归纳；必要时确认适用范围。 | 「这条建议是否希望作为团队级约定沉淀？」归纳为 principles/choice；source=choice。 |
| **验收标准/业务规则固化** | 用户明确固化「这类问题一律视为必须修复」等验收或业务规则。 | 可问是否沉淀为产品/业务知识或原则，并指向 content-types。 | 必要时问是否沉淀。 | 归纳为 principles/choice；source=choice。 |

**本环节主要可沉淀类型**：反例与约束、偏好、产品/业务知识（验收相关）。类型定义与信号见 [开发者品味](/guide/how-to-recognize-developer-taste)。

## 与记忆系统、开发者品味的关系

- **记忆写入**：品味嗅探产出的 payload 与 `/remember`、会话提炼产出的 payload 使用**同一套扩展 payload 契约**（scene、principles、choice、evidence、source、confidence、apply、layer 等）；仅 `source=choice` 表示来自工作流环节的选择。写入与门控由 [记忆系统](/guide/memory-system) 与 lingxi-memory 统一处理。
- **识别与升维**：从用户选择或表述到 payload 的映射、升维判定（T≥4 才写）由 **taste-recognition** 完成；九类可沉淀内容与识别边界见 [开发者品味](/guide/how-to-recognize-developer-taste)。
- **vet 环节**：vet 仅审查 task 文档质量，不产出实施级方案，当前设计下**不单独定义品味嗅探规则**；若在 vet 对话中出现可沉淀的取舍或原则，可由 Agent 按通用识别逻辑处理，或留待 task/plan/build/review 中按环节规则触发。

## 下一步

- [记忆系统](/guide/memory-system) — 三种写入途径与检索、门控
- [开发者品味](/guide/how-to-recognize-developer-taste) — 可沉淀类型与 taste-recognition 管道
- [命令参考](/guide/commands-reference) — 工作流 Skills 与 /remember
- [GitHub 仓库](https://github.com/tower1229/LingXi) — 各环节 `references/taste-sniff-rules.md` 实现
