# 记忆治理与写入

记忆写入由 **lingxi-memory** 子代理在**独立上下文中**执行：它只接收 taste-recognition 产出的 payloads 数组，完成校验、映射、治理与门控后，直接写入 `memory/notes/` 与 `memory/INDEX.md`，并向主对话返回**简报**。本文介绍 lingxi-memory 的职责边界、执行链路与治理逻辑，便于开发者理解“写入”在记忆系统中的位置。

## 在记忆系统中的位置

- **上游**：主 Agent 先调用 [taste-recognition](/guide/how-to-recognize-developer-taste) 产出扩展 payload（7 字段 + layer）；仅当 payloads 非空时，才将 **payloads 数组**（及可选的 conversation_id、generation_id）传给 lingxi-memory。
- **下游**：lingxi-memory 不产候选、不做升维，只做「校验 → 按 payload 映射生成 note → 治理（TopK）→ 门控 → 直接文件写入」；全部处理结束后统一返回简报（新建/合并/跳过条数及 Id 列表）。
- **检索**：写入后的笔记由 [memory-retrieve](/guide/memory-system#记忆检索) 在每轮对话前做双路径检索与最小注入，与写入流程解耦。

因此，**谁可以进记忆库、以什么形态进**由 taste-recognition 决定；**进到哪条 note、是否合并/替换、是否弹门控**由 lingxi-memory 决定。详见 [记忆系统](/guide/memory-system) 与 [开发者品味](/guide/how-to-recognize-developer-taste)。

## 职责边界

- **仅接受** taste-recognition 产出的 **payloads 数组**（扩展结构：必填 7 字段 + layer；可选 l0OneLiner、l1OneLiner、patternHint、patternConfidence）。禁止将原始用户消息、对话片段或草稿传入。
- **不做升维**：不执行价值判定、评分或模式靠拢；升维已在 taste-recognition 完成，本子代理只接收「已判定为写」的 payload。
- **执行链路**：校验 → 按 payload 映射生成 note 字段 → 治理（语义近邻 TopK）→ 门控 → 直接文件写入（notes + INDEX）。

## 执行步骤（6 步）

在收到 payloads 数组及可选的 conversation_id、generation_id 后，按顺序执行：

1. **输入校验**：校验 payloads 为非空数组，逐条校验必填字段（7 字段 + layer）及可选字段类型/枚举；非法则拒收并返回错误与建议。
2. **映射与补全**：按 payload 字段与映射规则生成每条 note 的 Meta、When to load、One-liner、Context/Decision、L0/L1 等；不对 note 做额外加工或升维。
3. **治理**：对 `memory/notes/` 做语义近邻 TopK，判断与已有笔记的关系，得到 **merge / replace / veto / new** 之一。
4. **门控**：merge 或 replace 时**必须**通过 ask-questions 征得用户确认；new 时按 `payload.confidence` 分流：high 可静默写入，medium/low 须确认。
5. **写入**：直接读写文件——按治理结果新建/更新/删除 note 文件，同步更新 INDEX；每条写入后追加记忆审计到 `audit.log`。
6. **回传主对话**：全部处理结束后返回**简报**（新建 n 条、合并 m 条、跳过 k 条及 Id 列表）；不输出过程性描述或实现细节。

## 治理逻辑（语义近邻 TopK）

- 对 `memory/notes/` 做语义近邻检索（Top 5），对每个近邻评估：same_scenario、same_conclusion、conflict、completeness。
- **merge**：同场景且同结论 → 合并到更完整版本，旧 note 删除、INDEX 更新，新 note 的 Supersedes 填被取代的 MEM-xxx。
- **replace**：冲突且用户明确选新结论 → 覆盖或先删旧再建新，维护 Supersedes。
- **veto**：冲突但无法判断更优且用户未给决定性变量 → 不写入，提示补齐或让用户选择保留哪一个。
- **new**：与 TopK 均不构成 merge/replace → 新建 note 与 INDEX 行。

治理范围须**包含本批在本轮已写入的 note**，以便同批内不重复建语义相同的笔记。

## 用户门控

- **merge / replace**：必须通过 ask-questions 发起确认（如「治理方案：MERGE/REPLACE，是否执行？」），仅在用户确认执行时才写入或删除。
- **new 且 confidence=high**：可静默写入；写入后仍追加 `memory_note_created` 审计。
- **new 且 confidence=medium 或 low**：必须通过 ask-questions 确认后再写入。
- 删除、合并、替换**一律**需用户在本对话内明确选择；不静默执行高风险动作。

## 写入路径与审计

- **项目级**（apply 非 team 或未填）：note 写入 `.cursor/.lingxi/memory/notes/MEM-<id>.md`，INDEX 的 File 列为 `memory/notes/MEM-<id>.md`。
- **团队级**（apply=team）：note 写入 `.cursor/.lingxi/memory/notes/share/MEM-<id>.md`，便于跨项目复用（如 git submodule）。
- **审计**：每次新建/更新/删除 note 或更新 INDEX 后，在同一流程内调用 `append-memory-audit.mjs` 向 `.cursor/.lingxi/workspace/audit.log` 追加 NDJSON 事件（如 `memory_note_created`、`memory_note_updated`、`memory_note_deleted`、`memory_index_updated`），便于追溯与合规。

## 主动治理：/memory-govern

除 lingxi-memory 在**写入时**执行的治理（TopK、merge/replace/veto/new）外，灵犀提供 **/memory-govern** 用于**索引同步与整库主动治理**：

1. **同步**：由 memory-govern Skill 下的脚本扫描 `notes/` 与 INDEX，**删除孤儿索引行**（INDEX 中有但对应 note 文件不存在），并上报**未索引 note**；再由模型为每条未索引 note 生成 INDEX 行，保证检索准确。
2. **主动治理（可选）**：模型可对整库提出合并/改写/归档等建议；仅在你通过 ask-questions 确认后才写回。

在添加或更新共享记忆后（例如执行 `git submodule update` 后），或希望整理索引并获取治理建议时，在 Cursor 中运行 **/memory-govern** 即可。无需单独执行 Node.js 脚本。详见 [记忆系统 — /memory-govern](/guide/memory-system#memory-govern--同步索引与主动治理) 与 [命令参考](/guide/commands-reference#memory-govern)。

## 相关链接

- [记忆系统](/guide/memory-system) — 记忆检索、写入入口与治理闭环概览
- [开发者品味](/guide/how-to-recognize-developer-taste) — taste-recognition 与 payload 契约
- 主仓 [lingxi-memory](https://github.com/tower1229/LingXi/blob/main/.cursor/agents/lingxi-memory.md) — 完整输入约定、映射规则与门控格式
