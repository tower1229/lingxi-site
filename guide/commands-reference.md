# 命令参考

本文档集中列出灵犀提供的所有命令的语法与用途。流程说明与示例见 [核心工作流](/guide/core-workflow)，记忆相关命令详见 [记忆系统](/guide/memory-system)。

## 工作流命令

### /task

```
/task <需求描述>
```

创建任务文档，用于锁定目标、边界与验收标准。灵犀会自动生成任务编号（001, 002...）和标题，并创建 `.cursor/.lingxi/tasks/001.task.<标题>.md`，引导需求提纯与确认。

**参数**：`<需求描述>` 为必填，描述你要做的任务。

**产出**：任务文档 `.cursor/.lingxi/tasks/001.task.<标题>.md`。

---

### /vet

```
/vet [taskId]
```

对 task 文档进行多维度审查（完整性、一致性、可行性、边界条件等），不产出文件，仅在对话中给出审查结果与建议。可多次执行以迭代优化。

**参数**：`taskId` 可选，省略时可回退到最新任务编号。

**产出**：无。

---

### /plan

```
/plan [taskId]
```

基于 task 文档生成实施级方案与测试用例，建立 `F→T→TC` 映射；适用于复杂任务或需要明确执行路径时（简单任务可跳过）。

**参数**：`taskId` 可选，省略时可回退到最新任务编号。

**产出**：`.cursor/.lingxi/tasks/001.plan.<标题>.md`、`.cursor/.lingxi/tasks/001.testcase.<标题>.md`。

---

### /build

```
/build [taskId]
```

根据 task 文档与（可选的）plan 文档执行实现。存在 plan 文档时为 Plan-driven；无 plan 时为 Task-driven（skip-plan），需先补齐 testcase 与覆盖校验，再进入编码。对 `unit/integration` 执行先测后实现闭环。

**参数**：`taskId` 可选，省略时可回退到最新任务编号。

**产出**：代码变更。

---

### /review

```
/review [taskId]
```

按需求编号（F）做独立验收审计并生成审查报告：逐条判定 Pass/Fail，附证据引用；证据缺失或不可验证时该 F 必须 Fail，整体结论不得判通过。

**参数**：`taskId` 可选，省略时可回退到最新任务编号。

**产出**：审查报告（如 `.cursor/.lingxi/tasks/001.review.<标题>.md`，以实际为准）。

---

## 记忆命令

### /remember

```
/remember <记忆描述>
```

随时主动写入记忆，灵犀会将描述转为结构化记忆并写入记忆库。

**参数**：`<记忆描述>` 为必填。

**产出**：记忆笔记（写入 `.cursor/.lingxi/memory/notes/` 并更新 INDEX）。

详见 [记忆系统](/guide/memory-system)。

---

### /extract

```
/extract
/extract <时间范围>
```

对当前会话或指定时间范围内的会话做可沉淀内容提取并写入记忆库。

**参数**：可选。

无参数时提取**当前会话**（适合一轮对话结束后执行）；

带参数时接受自然语言时间范围（如「提炼今天的会话」「提炼最近2天的会话」「1d」「24h」），解析不到有效时间范围则提示错误并终止。

**产出**：记忆笔记（写入 `.cursor/.lingxi/memory/notes/` 并更新 INDEX）+ lingxi-memory 返回的简报（新建/合并/跳过条数及 Id 列表）。

详见 [记忆系统](/guide/memory-system)。

---

## 初始化命令

### /init

```
/init
```

面向已有开发进度的项目做引导式初始化：优先基于现有文档与仓库结构静默理解项目，必要时仅补问缺失项（选择环节统一走 ask-questions 协议），先生成可选记忆候选清单；默认不写入，只有你明确选择后才写入记忆。

**参数**：无。

**产出**：初始化校对摘要与记忆候选清单；若你明确选择写入，再写入 `.cursor/.lingxi/memory/notes/` 并更新 INDEX。若 `.cursor/.lingxi/` 缺失，会先补齐所需目录骨架。

---

## 下一步

- [核心工作流](/guide/core-workflow) — 流程总览与示例
- [记忆系统](/guide/memory-system) — 记忆检索、写入与共享
- [FAQ](/guide/faq) — 常见问题
