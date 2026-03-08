# 命令与工作流参考

本文档集中列出灵犀提供的**工作流 Skills** 与**辅助命令**的用法。流程说明与示例见 [核心工作流](/guide/core-workflow)，记忆相关命令详见 [记忆系统](/guide/memory-system)。

## 工作流 Skills

工作流（task → vet → plan → build → review）由 **Skills** 驱动。通过输入 `/task`、`/plan`、`/build`、`/review`、`/vet`（Cursor 会列出同名 Skill）或自然语言（如「执行 task」「做任务规划」）显式触发对应 Skill。**工作流 Skills 仅支持手动或显式调用**，不会根据语义自动加载，以节省上下文。

### task

**触发**：`/task <需求描述>` 或自然语言「创建任务…」

创建任务文档，用于锁定目标、边界与验收标准。灵犀会自动生成任务编号（001, 002...）和标题，并创建 `.cursor/.lingxi/tasks/001.task.<标题>.md`，引导需求提纯与确认。

**参数**：`<需求描述>` 为必填，描述你要做的任务。

**产出**：任务文档 `.cursor/.lingxi/tasks/001.task.<标题>.md`。

---

### vet

**触发**：`/vet [taskId]` 或「审查 task 文档」

对 task 文档进行多维度审查（完整性、一致性、可行性、边界条件等），不产出文件，仅在对话中给出审查结果与建议。可多次执行以迭代优化。

**参数**：`taskId` 可选，省略时可回退到最新任务编号。

**产出**：无。

---

### plan

**触发**：`/plan [taskId]` 或「规划任务…」

基于 task 文档生成实施级方案与测试用例，建立 `F→T→TC` 映射；适用于复杂任务或需要明确执行路径时（简单任务可跳过）。

**参数**：`taskId` 可选，省略时可回退到最新任务编号。

**产出**：`.cursor/.lingxi/tasks/001.plan.<标题>.md`、`.cursor/.lingxi/tasks/001.testcase.<标题>.md`。

---

### build

**触发**：`/build [taskId]` 或「实现任务…」

根据 task 文档与（可选的）plan 文档执行实现。存在 plan 文档时为 Plan-driven；无 plan 时为 Task-driven（skip-plan），需先补齐 testcase 与覆盖校验，再进入编码。对 `unit/integration` 执行先测后实现闭环。

**参数**：`taskId` 可选，省略时可回退到最新任务编号。

**产出**：代码变更。

---

### review

**触发**：`/review [taskId]` 或「审查交付」

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

**产出**：记忆笔记（写入 `memory/project/` 或 `memory/share/` 并更新 INDEX）。

详见 [记忆系统](/guide/memory-system)。记忆写入有三种途径：**自动捕获**（心跳会话提炼）、**手动捕获**（本命令与 /init）、**品味嗅探**（工作流 Skills 情境驱动）；会话提炼说明见记忆系统「自动捕获」一节。

---

### memory-govern（索引同步与主动治理）

由 **memory-govern** Skill 提供，通过输入 `/memory-govern` 或自然语言（如「同步记忆索引」）触发。

```
/memory-govern [--dry-run] [--skip-govern] [--root <memoryRoot>]
```

同步记忆 INDEX 与 `memory/project/`、`memory/share/`，并可选择执行主动治理。灵犀会先运行脚本删除孤儿索引行（INDEX 中有但对应 note 文件不存在），并检测未索引的 note；再由模型为未索引 note 生成 INDEX 行。可选地，模型可对整库提出治理建议（合并/改写/归档），仅在你确认后写回。

**参数**：均可选。`--dry-run`：仅执行脚本并输出结果，不写回 INDEX、不调用模型。`--skip-govern`：只做同步与补全未索引条目，跳过全库治理。`--root <path>`：指定 memory 根目录（默认 `.cursor/.lingxi/memory`）。

**产出**：简报（删除孤儿数、补全未索引数、可选重复 Id 提示）；若执行阶段 2 则包含采纳的治理建议说明。

详见 [记忆系统](/guide/memory-system) 与 [记忆治理与写入](/guide/memory-governance-and-write)。

---

## 初始化命令

### /init

```
/init
```

面向已有开发进度的项目做引导式初始化：优先基于现有文档与仓库结构静默理解项目，必要时仅补问缺失项（选择环节统一走 ask-questions 协议），先生成可选记忆候选清单；默认不写入，只有你明确选择后才写入记忆。

**参数**：无。

**产出**：初始化校对摘要与记忆候选清单；若你明确选择写入，再写入 `memory/project/` 或 `memory/share/` 并更新 INDEX。若 `.cursor/.lingxi/` 缺失，会先补齐所需目录骨架。

---

## 卸载

安装时灵犀会在项目 `package.json` 的 `scripts` 中注入 **`lx:uninstall`**。在**项目根目录**执行：

```bash
yarn lx:uninstall
# 或
npm run lx:uninstall
```

会按安装清单删除 `.cursor/.lingxi/` 运行数据以及灵犀安装的 commands、skills、hooks、agents、references 等，确保卸载后不留灵犀相关文件。交互式环境下会提示确认；非交互式（如 CI）可传 `--yes` 跳过确认：

```bash
yarn lx:uninstall --yes
```

---

## 下一步

- [核心工作流](/guide/core-workflow) — 流程总览与示例
- [记忆系统](/guide/memory-system) — 记忆检索、写入与共享
- [FAQ](/guide/faq) — 常见问题
