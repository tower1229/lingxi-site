# 品味嗅探

品味嗅探是 workflow 里的“决策采样模块”：在关键取舍点收集你的偏好与原则，并把它们沉淀为记忆。

## 在系统中的位置

- **触发层**：task / plan / build / review 等环节出现决策点
- **采集层**：通过问询或上下文理解获得你的选择
- **识别层**：`taste-recognition` 产出结构化 payload
- **写入层**：`lingxi-memory-write` 统一治理并入库
- **复用层**：后续由 `memory-retrieve` 在 pre/post 时机复用

## 触发原则

嗅探不是“每步都问”，而是“在需要决策时问”：

- 方案取舍（例如体验优先还是成本优先）
- 规范例外（何时允许偏离默认规范）
- 验收边界（什么算必须修复、什么可接受风险）

在提问前，系统会优先检索已有记忆；若已有记忆可覆盖当前情境，可直接复用，不再重复提问。

## 输出契约

嗅探产出的内容与 `/remember` 使用同一记忆契约：

- 使用同一扩展 payload 结构
- 统一进入写入治理与门控
- 区别只在来源标记（workflow 场景通常为 `source=choice`）

## 与其他模块的分工

- **taste-recognition**：判断是否值得沉淀、输出什么结构
- **lingxi-memory-write**：决定如何治理与写入
- **memory-retrieve**：决定何时把记忆用于当前执行

## 文档边界

本页只描述模块职责与触发原则，不固定：

- 各环节的具体问法模板
- 内部规则表与评分细节
- 具体字段映射实现

这些细节以主仓实现和内部规则为准。

## 下一步

- [记忆系统](/guide/memory-system)
- [开发者品味](/guide/how-to-recognize-developer-taste)
- [命令与工作流参考](/guide/commands-reference)
