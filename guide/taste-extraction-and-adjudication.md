# 工程品味提炼与裁决

本页说明 LingXi 如何把历史会话中的工程判断提炼成可写入 memory 的结构化候选。

当前新版 LingXi 的提炼主线由两步组成：

1. `taste extract`
2. `taste adjudicate`

它们共同组成当前 memory 系统中的“工程品味提炼”阶段。

## LingXi 在提炼什么

LingXi 提炼的是 durable engineering taste，也就是未来还能继续起作用的工程判断。

典型包括：

- 稳定偏好
- 决策经验
- 领域知识
- 产品或业务知识
- 组织经验
- 可复用启发式
- 可识别模式
- 反模式信号
- 排障与根因经验

这些内容会先被还原成“判断结构”，再进入后续 memory 主线。

## 提炼的第一步：Taste Extract

`taste extract` 是高召回提取阶段。

这一阶段的目标是尽量从历史会话中恢复出可能值得沉淀的工程判断候选。

当前候选会被整理成这类结构：

- `scene`
- `content_type`
- `alternatives`
- `choice`
- `rationale`
- `evidence`
- `pattern_hint`
- `confidence`

这种结构的关键意义在于：LingXi 会尽量恢复“在什么场景下、在什么候选之间、为什么做了这个选择”。

## 提炼的第二步：Taste Adjudicate

`taste adjudicate` 是精度优先的裁决阶段。

这一步要回答的是“这条判断值不值得变成长期记忆”。

LingXi 当前会重点从这些维度判断：

- `decision_gain`
- `reusability`
- `trigger_clarity`
- `verifiability`
- `stability`

只有真正通过裁决的候选，才会补全 note-ready 字段，例如：

- `title`
- `kind`
- `one_liner`
- `decision`
- `when_to_load`
- `durability_reason`
- `value_scores`
- `suggested_storage_kind`

## 为什么要拆成两步

LingXi 把提炼拆成 `extract + adjudicate`，是因为这两件事目标不同：

### Extract 追求召回

这一阶段更关心“有没有可能是值得沉淀的判断”，所以允许候选还不够成熟。

### Adjudicate 追求精度

这一阶段更关心“这条内容是否真的值得长期复用”，所以会主动过滤低价值、一次性、触发条件不清晰或证据不足的候选。

这让 memory 系统既不会因为过早裁决而漏掉重要判断，也不会因为召回太宽而把大量噪音写入记忆库。

## Content Type 的作用

LingXi 当前会先识别候选的 `content_type`，再在裁决阶段映射到更稳定的 `kind`。

这样做的原因是：

1. 识别阶段关注“这是哪类工程判断”
2. 存储阶段关注“它应该以什么 kind 进入 memory”

所以系统中会同时存在两套概念：

- 更细的 `content_type`
- 更稳定的 `kind`

这让提炼精度和存储稳定性可以同时保留。

## 提炼与治理的边界

提炼阶段负责为后续治理提供高质量 durable candidates。

它的职责是：

1. 从会话中抽出判断候选
2. 对候选做价值裁决
3. 产出可供写入治理使用的 durable candidate set

之后才进入 memory governance，由治理层决定：

- 新建 note
- 合并到已有 note
- 跳过，避免污染记忆库

所以 LingXi 当前的 memory 主线是：

```text
session selection
→ taste extract
→ taste adjudicate
→ governance
→ write
→ retrieval
```

## 为什么这种方法更适合 LingXi

LingXi 的目标是做一个长期提升工程质量的判断系统。

如果不先做提炼与裁决：

- 记忆会更容易退化成会话摘要
- 治理层会被迫处理大量低质量候选
- retrieval 很难稳定命中真正有用的工程判断

先提炼、再裁决、再治理，可以让 memory 更接近“工程判断库”。

## 下一步

- [记忆系统](/guide/memory-system)
- [记忆治理与写入](/guide/memory-governance-and-write)
