# 如何理解“品味识别”

灵犀的记忆系统有一个核心约束：**所有写入记忆库的内容，必须先经过 taste-recognition**。
这篇文档说明 taste-recognition 在解决什么问题、为什么采用「场景 + 原则候选 + 实际选择」这一形态，以及它如何与记忆写入配合，让 AI 真正「按你的方式做事」。

---

## 一、为什么要单独做“品味识别”

在 AI 协作里，真正影响长期质量的往往不是模型会不会写代码，而是模型是否能贯彻**你的品味**：在多种方案里选哪个、在什么场景下坚持什么原则、哪些事不要做。
这些判断通常散落在对话里——一句“别那样写”、一次方案选择、一次纠正——若不做提炼，要么随会话消失，要么被笼统地“记下来”变成噪音。

灵犀的选择是：

- **不把原始对话或草稿直接写入记忆**。下游 lingxi-memory 只接受 taste-recognition 产出的 **payloads 数组**，禁止把用户消息或对话片段当输入。
- **在“识别”阶段就做价值判定**。可沉淀内容会先经过「模式靠拢 + 升维判定」；只有通过判定的条目才会产出 payload 并交给 lingxi-memory。**判定不写的，不会进入记忆库**。

也就是说：**谁可以进入记忆库，由 taste-recognition 在产出 payload 之前就决定**。
这样做的价值是：记忆库从源头就是「可检索、可复用的决策与原则」，而不是聊天记录或低价值片段。

---

## 二、“品味”的可操作定义

在灵犀里，**品味**不是一个抽象词，而是有明确结构的可操作定义：

- 在**某个场景**下（何时、何类情境）
- 面对一组可能适用甚至冲突的**原则候选**
- 用户**实际采用的选择**与权衡（可含理由或证据）

简化为：**场景 + 原则候选 + 实际选择**。

为什么是这三个要素？

- **场景**：决定“什么时候这条记忆该被加载”。没有场景，检索就难以命中。
- **原则候选 + 实际选择**：表达“在哪些选项里选了啥”，而不是孤立的结论。这样既保留对比（未来可类比），又便于治理时判断 merge/replace。

因此，taste-recognition 的识别目标就是：从用户输入中**抽出「场景 + 原则候选 + 实际选择」**，必要时补上证据（用户原文），再经过模式靠拢与升维判定，产出**唯一合法**的扩展 payload。
没有可沉淀的品味 → 静默，不产出 payload，不调用 lingxi-memory。

---

## 三、taste-recognition 在做什么：一条管道，三道关卡

本 Skill **不写入记忆库**，也不做冲突治理（merge/replace 在下游 lingxi-memory）。
它只做一件事：**判断当前输入里有没有可沉淀的品味，若有，则产出符合契约的 payload；若无或判定不写，则静默**。

内部是一条固定管道：

1. #### 识别

   从当前触发点的输入（含必要时最近 1～2 轮上下文）判断是否存在可沉淀信号：偏好、约束、取舍、决策、用户拒绝或纠正、在若干原则间做出的可命名选择等。
   **无可沉淀 → 静默返回**，不产出 payload，不调用 lingxi-memory。

2. #### 模式靠拢

   对可沉淀条目标抽 scene、principles、choice、evidence，再对照设计模式目录（如策略模式、约定优于配置、分层架构等）尝试映射。
   若匹配，则用模式名或「模式名 + 约束」改写 principles/choice，并填写 `patternHint`、`patternConfidence`。
   这样做的效果：用户说的可能是具体表述，**收敛到模式后更容易被检索**（“何时加载”更清晰），且升维时 D2（可复用/可触发）至少为 1。

3. #### 价值判定（升维）

   对内容做升维判定（D1 决策增益、D2 可复用/可触发、D3 可验证性、D4 稳定性），得到总分 T 与 layer（L0/L1/L0+L1）。
   **T ≤ 3 或触犯例外 → 不写该条**：不产出该条 payload，不加入 payloads 数组，主 Agent 不因此条调用 lingxi-memory。
   只有 T ≥ 4 且未触犯例外的条目才会进入下一步。

4. #### 产出

   对判定为写的条目标注 layer、可选 l0OneLiner/l1OneLiner，产出符合扩展 payload 规范的 JSON；同一轮多条组成 payloads 数组。
   **仅当 payloads 非空时**，主 Agent 才会把 payloads 数组传给 lingxi-memory。

一句话：**识别 → 模式靠拢 → 升维判定 → 仅对“值得写”的产出 payload；不写则整条管道静默，记忆库不受影响**。

---

## 四、触发点：多入口，同一契约

taste-recognition 并不只在 `/remember` 时工作，所有“可能写入记忆”的路径都会经过它：

| 触发点             | 输入来源                                                         | payload.source |
| ------------------ | ---------------------------------------------------------------- | -------------- |
| **/remember**      | 当前轮用户输入或用户指定的「要记住的内容」                       | `remember`     |
| **/extract**       | 当前会话或指定时间范围内的对话（汇总文本）                       | `extract`      |
| **/init 写入**     | 用户确认后的初始化草稿（类型化收集结果）                         | `init`         |
| **工作流品味嗅探** | task / plan / build / review 等环节经 ask-questions 收集到的选择 | `choice`       |

无论从哪个入口进来，**都走同一套识别与升维逻辑**，输出同一套扩展 payload 契约。
这样记忆库里的每条笔记形态一致，治理（TopK、merge/replace/veto）和检索才能稳定生效。

---

## 五、输出形态：扩展 payload（7 字段 + layer）

下游 lingxi-memory **只接受 payloads 数组**（元素为扩展 payload）；不产候选，也不接受原始对话。
单条 payload 的必填与可选字段见主仓 [taste-recognition SKILL](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/taste-recognition/SKILL.md)，这里只强调和“品味”直接相关的部分：

- **scene / principles / choice**：对应「场景 + 原则候选 + 实际选择」；principles 与 choice 共同表达“在哪些候选中选了啥”。
- **evidence**：可选的一句用户原文，用于可验证性与 L0 事实层。
- **layer**：由本 Skill 在升维判定中填写（L0 / L1 / L0+L1），表示这条该写成事实层、原则层还是双层。
- **l0OneLiner / l1OneLiner**：可选，供下游直接写入 note 的 L0/L1 句，便于检索与注入时使用。

升维（写/不写、L0/L1）**全部在 taste-recognition 内完成**；lingxi-memory 不执行评分或升维，只按 payload 映射、治理与门控后写入。

---

## 六、与 lingxi-memory 的边界

- **taste-recognition**：负责“有没有可沉淀的品味、长什么样、值不值得写、写成哪一层”。
  输出只有两种：静默（无 payload），或 payloads 数组（仅含通过升维判定的条目）。
- **lingxi-memory**：只接收 payloads 数组；负责校验、按 payload 映射生成 note、语义近邻 TopK 治理（merge/replace/veto/new）、门控、写入 notes 与 INDEX。
  **不执行识别、不执行评分或升维**。

因此：**能不能进记忆库、以什么形态进，由 taste-recognition 决定；进到哪条 note、是否合并/替换、是否弹门控，由 lingxi-memory 决定**。

---

## 七、一个完整示例

用户说：
「文档里别写 Skill 完整路径，读起来太重，保持短引用。」

经过识别与升维后，可产出类似如下的 payload（示意）：

- **scene**：文档中引用 Skill 时
- **principles**：短引用 / 完整路径
- **choice**：短引用
- **evidence**：别写完整路径
- **source**：remember
- **confidence**：high
- **apply**：team
- **layer**：L1
- **l1OneLiner**：引用能力时优先自然语言短引用，避免暴露实现路径

这条之所以能通过升维并写入，是因为：有明确场景、有可对比的原则与选择、有用户原文作证据，且可跨场景复用（D2≥1），适合作为原则层（L1）沉淀。
下次在“文档中引用 Skill”这类场景下，记忆检索可以命中，并提示按“短引用”行事。

---

## 八、小结

taste-recognition 的价值可以概括为三点：

1. **把隐性判断变成可检索的决策结构**：只沉淀「场景 + 原则候选 + 实际选择」形态的内容，记忆库才能在未来对话里被稳定命中、按你的方式复用。
2. **在入口就做价值过滤**：通过模式靠拢与升维判定，低价值或一次性内容不会产出 payload，也就不会进入记忆库，从源头控制噪音。
3. **多入口、一契约**：/remember、/extract、/init、工作流品味嗅探都走同一管道、产出同一 payload 规范，保证记忆系统一致可治理。

因此，“品味识别”不是给对话打标签，而是**为记忆系统提供唯一合法的输入形态，并只放行值得长期复用的判断与原则**。
这样灵犀才能做到：心有灵犀，按你的方式做事。

## 相关链接

- [记忆系统](/guide/memory-system) — 记忆写入、检索与治理的整体流程
- [记忆治理与写入](/guide/memory-governance-and-write) — lingxi-memory 的职责与治理逻辑
- 主仓 [taste-recognition SKILL](https://github.com/tower1229/LingXi/blob/main/.cursor/skills/taste-recognition/SKILL.md) — 完整 payload 规范与 References
