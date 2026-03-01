# 命令参考

本文档集中列出灵犀提供的所有命令的语法与用途。流程说明与示例见 [核心工作流](/guide/core-workflow)，记忆相关命令详见 [记忆系统](/guide/memory-system)。

## 工作流命令

### /task

```
/task <需求描述>
```

创建任务文档，是工作流的唯一必选步骤。灵犀会自动生成任务编号（001, 002...）和标题，并创建 `.cursor/.lingxi/tasks/001.task.<标题>.md`，引导需求提纯与确认。

**参数**：`<需求描述>` 为必填，描述你要做的任务。

**产出**：任务文档 `.cursor/.lingxi/tasks/001.task.<标题>.md`。

---

### /vet

```
/vet [taskId]
```

对 task 文档进行多维度审查（完整性、一致性、可行性、边界条件等），不产出文件，仅在对话中给出审查结果与建议。可多次执行以迭代优化。

**参数**：`taskId` 可选，省略时使用最新任务。

**产出**：无。

---

### /plan

```
/plan [taskId]
```

基于 task 文档生成任务规划与测试用例，适用于复杂任务或需要明确执行步骤时。

**参数**：`taskId` 可选，省略时使用最新任务。

**产出**：`.cursor/.lingxi/tasks/001.plan.<标题>.md`、测试用例文档。

---

### /build

```
/build [taskId]
```

根据 task 文档与（可选的）plan 文档执行代码实现。存在 plan 文档时为 Plan-driven，否则为 Task-driven。

**参数**：`taskId` 可选，省略时使用最新任务。

**产出**：代码变更。

---

### /review

```
/review [taskId]
```

对已完成代码进行多维度审查并生成审查报告（功能、测试、架构、可维护性、回归风险等；按需含文档一致性、安全、性能、E2E）。

**参数**：`taskId` 可选，省略时使用最新任务。

**产出**：审查报告（如 `.cursor/.lingxi/tasks/001.review.<标题>.md`，以实际为准）。

---

## 记忆与初始化

### /remember

```
/remember <记忆描述>
```

随时主动写入记忆，无需任务编号。灵犀会将描述转为结构化记忆并写入记忆库，门控下可合并或替换已有记忆。

**参数**：`<记忆描述>` 为必填。

**产出**：记忆笔记（写入 `.cursor/.lingxi/memory/notes/` 并更新 INDEX）。

详见 [记忆系统](/guide/memory-system)。

---

### /init

```
/init
```

初始化项目：若 `.cursor/.lingxi/` 不存在则创建目录骨架，并引导收集项目信息、可选写入初始记忆。

**参数**：无。

**产出**：`.cursor/.lingxi/` 下 tasks、memory、workspace 等目录及初始文件（若尚未存在）。

---

### /refine-memory

```
/refine-memory
/refine-memory <时间范围>
```

对当前会话或指定时间范围内的对话做可沉淀内容提炼并写入记忆库。无参数时提炼**当前会话**（适合一轮对话结束后执行）；带参数时接受自然语言时间范围（如「提炼今天的会话」「提炼最近2天的会话」「1d」「24h」），解析不到有效时间范围则提示错误并终止。灵犀会汇总对应会话、经 taste-recognition 提取 payload、单次传入 lingxi-memory，最后呈现简报。

**参数**：可选。不传则当前会话；传则时间范围的自然语言描述。

**产出**：记忆笔记（写入 `.cursor/.lingxi/memory/notes/` 并更新 INDEX）+ lingxi-memory 返回的简报（新建/合并/跳过条数及 Id 列表）。

详见 [记忆系统](/guide/memory-system)。

---

## 下一步

- [核心工作流](/guide/core-workflow) — 流程总览与示例
- [记忆系统](/guide/memory-system) — 记忆检索、写入与共享
- [FAQ](/guide/faq) — 常见问题
