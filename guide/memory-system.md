# 记忆系统

记忆系统是 LingXi 的长期能力层。

它负责把历史会话中的稳定工程判断提炼成可复用记忆，并在后续 `task`、`vet` 和其他有意义的仓库工作中按需应用。

## 记忆系统在做什么

LingXi 的 memory 聚焦可复用的工程判断与经验。

它关注的是未来还能继续起作用的工程判断，例如：

- 某类任务下稳定偏好的实现方式
- 反复出现的项目约束
- 常见反模式与失败信号
- 评审时反复关注的风险点
- 可迁移的工程启发式经验

LingXi 把这类内容称为 durable engineering taste。

## 核心链路

当前 memory 主链路可以理解为六步：

1. 选择有效 session
2. `taste extract`
3. `taste adjudicate`
4. `governance`
5. `write + index rebuild`
6. `retrieve for task / vet intent`

### 1. 选择有效 session

后台 distill runner 会先从历史会话中筛选有效输入。

它会优先处理对当前仓库有工程信号的会话，并排除不适合进入记忆系统的来源，例如纯 bookkeeping 或缺少仓库工程信号的内容。这样可以保证后续提炼建立在有意义的会话材料上。

### 2. Taste Extract

`taste extract` 是高召回的判断候选提取阶段。

这一阶段不会直接把会话改写成 memory note，而是先尽量识别出可能值得沉淀的工程判断候选。当前候选会带上这类结构信息：

- `scene`
- `content_type`
- `alternatives`
- `choice`
- `rationale`
- `evidence`
- `pattern_hint`
- `confidence`

这一步的目标是先把“判断结构”提出来，为后续 durable memory 做准备。

### 3. Taste Adjudicate

`taste adjudicate` 是精度优先的裁决阶段。

LingXi 会在这一阶段判断哪些候选真的值得进入长期记忆，并补全 note-ready 的字段。裁决时会重点看几个价值维度：

- `decision_gain`
- `reusability`
- `trigger_clarity`
- `verifiability`
- `stability`

通过裁决的候选会得到更完整的 durable memory 结构，例如：

- `title`
- `kind`
- `one_liner`
- `decision`
- `when_to_load`
- `durability_reason`
- `value_scores`
- `suggested_storage_kind`

## 4. Governance

通过裁决的候选不会直接落盘，还会进入治理阶段。

治理负责回答三个问题：

1. 应该新建 note 吗
2. 应该合并到已有 note 吗
3. 还是应该跳过，避免污染记忆库

当前治理动作以 `create / merge_into_existing / skip_as_not_durable` 为主，并结合 `content_type`、`value_scores` 和 `suggested_storage_kind` 做判断。这样可以保证 memory 的目标是高价值、低噪音、可持续演进。

## 5. Write And Index

治理通过后，LingXi 会把 note 写入项目 runtime：

- `.lingxi/memory/project/`
- `.lingxi/memory/share/`

同时重建：

- `.lingxi/memory/INDEX.md`

note 正文之外，系统还会保存与记忆运行有关的状态：

- `.lingxi/state/processed-sessions.json`
- `.lingxi/state/distill-journal.jsonl`
- `.lingxi/state/memory-ops.jsonl`

这些状态共同保证记忆系统具备：

- 可追踪的 session 去重
- 可重复的 distill 版本控制
- 可审计的 retrieval / distill / governance 运行记录

## 6. Retrieval

记忆写进去以后，真正的价值来自检索与应用。

LingXi 的 retrieval 会结合当前 query 和 caller context 进行语义排序，并只返回最小必要的高信号记忆。

当前 retrieval 会区分两类意图：

### Task Intent

当 LingXi 在写 `task` 时，会更偏向检索这些内容：

- 实施边界
- 契约约束
- 回滚与交付指导
- 稳定工程偏好

### Vet Intent

当 LingXi 在做 `vet` 时，会更偏向检索这些内容：

- 反模式
- 评审倾向
- 隐藏风险
- 历史踩坑
- 被任务忽略的关键约束

这让同一个 memory store 在不同工作阶段有不同作用方式。

## 记忆如何反馈到 task 和 vet

`task` 会在起草任务时主动检索相关记忆，并把真正影响了任务内容的结果写进 `memory_refs`。

`vet` 会再次检索相关记忆，并检查当前任务是否遗漏了这些关键判断。如果任务忽略了本该应用的记忆，LingXi 会把它当作一个明确的质量问题指出来。

所以 memory 在 LingXi 里承担着持续增强 `task` 和 `vet` 的底层判断层角色。

## 为什么这样设计

LingXi 的 memory 采用“语义判断 + 确定性约束”的混合设计。

LLM 负责：

- 提取判断候选
- 做价值裁决
- 做治理判断
- 做检索排序

确定性脚本负责：

- schema 校验
- 状态安全
- note 持久化
- id 分配
- index 重建
- session 去重

这样做的原因很直接：

1. 语义提炼和相关性判断需要 LLM 的理解能力
2. 状态、合同和持久化必须保持稳定、可测和可审计

## 下一步

- [核心工作流](/guide/core-workflow)
- [快速开始](/guide/quick-start)
