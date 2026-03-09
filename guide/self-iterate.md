# 自我迭代

自我迭代是灵犀的**全局特性**：运行期间持续收集系统运行状态，按心跳间隔进行审计，并基于审计结果对低风险问题执行自动改进。设计上将覆盖记忆、工作流、门控等全系统；当前已实现的部分以记忆相关改进为主（如改进提案与应用）。本文从架构设计到实施细节完整介绍自我迭代机制，并涵盖作为其重要依据的**审计系统**。

## 概述

- **定位**：灵犀在运行过程中会持续将关键行为与结果写入审计日志（`audit.log`），形成可追溯的「运行状态」。自我迭代在达到设定时间间隔（默认 24 小时）时，由会话层触发一次「诊断 + 自动改进」周期：读取近期审计与记忆库状态，生成改进提案，仅对**低风险**项自动应用，主会话不等待、仅消费简报。
- **价值**：让灵犀在长期使用中越用越稳、越用越懂你；审计提供依据，自我迭代消费审计并反哺系统（如记忆合并建议、索引补全等）。

## 架构设计

### 整体数据流

```
运行中 → 各类事件写入 audit.log（运行状态）
         ↓
sessionStart 心跳检查：距上次自我迭代是否超过设定间隔（默认 24h）
         ↓ 是
主 Agent 步骤 A 发起 lingxi-self-iterate（后台，run_in_background=true）
         ↓
子代理：读取 audit.log + 记忆库 → 诊断提案 → 仅 low risk 自动应用 → 写回审计
         ↓
主会话不等待，仅收简报；last_improvement_cycle_at 更新，下一周期再触发
```

### 角色与职责

| 角色 | 职责 |
|------|------|
| **session-init（sessionStart）** | 读 `heartbeat-control.json`，若 `last_improvement_cycle_at` 距当前超过设定间隔则注入「自我迭代」约定。 |
| **主 Agent** | 步骤 A 根据约定调用 mcp_task，发起 **lingxi-self-iterate** 子代理（run_in_background=true），不等待即进入步骤 B/C。 |
| **lingxi-self-iterate 子代理** | 在独立上下文中执行：提案生成脚本（读 audit + 记忆）→ 自动改进脚本（仅批准 low risk）→ 写 `memory.improvement.*` 等审计事件并更新 `last_improvement_cycle_at`。 |
| **审计系统** | 持续写入运行状态到 `audit.log`，供自我迭代读取与分析，是自我迭代的**重要依据**。 |

## 审计系统（自我迭代的重要依据）

自我迭代的「诊断」依赖系统运行状态，这些状态由**审计系统**统一落盘。理解审计有助于理解自我迭代在「读什么、改什么」。

### 审计日志位置与格式

- **路径**：`.cursor/.lingxi/workspace/audit.log`
- **格式**：NDJSON（每行一条 JSON），便于按行追加与按时间窗口读取。

### 写入来源

| 来源 | 说明 |
|------|------|
| **lingxi-audit.mjs** | 由 Cursor 的 9 类 Hook（beforeSubmitPrompt、afterAgentResponse、preToolUse、postToolUse、postToolUseFailure、subagentStart、subagentStop、sessionEnd、stop）触发；**默认**仅写入 `session_end`、`stop`，以控制体积。 |
| **append-memory-audit.mjs** | 由主 Agent、lingxi-memory、lingxi-self-iterate 等调用，写入记忆与自我迭代相关业务事件，始终写入。 |
| **子代理/脚本** | 如 lingxi-session-distill 写入 `heartbeat.*`；lingxi-self-iterate 相关脚本写入 `memory.improvement.*` 等。 |

### 核心事件（默认写入，与自我迭代相关）

以下事件会稳定写入，自我迭代可据此做诊断与改进：

- **记忆与索引**：`memory_note_created`、`memory_note_updated`、`memory_note_deleted`、`memory_index_updated`
- **记忆检索**：`memory.retrieve.performed`、`memory.retrieve.skipped`、`memory.retrieve.missing`、`memory.retrieve.invalid`
- **会话提炼**：`heartbeat.triggered`、`heartbeat.distillation_completed`、`heartbeat.distillation_failed`
- **治理与改进**：`memory.merge.diagnosed`、`memory.merge.invalid`；`memory.improvement.proposed`、`memory.improvement.approved`、`memory.improvement.rejected`、`memory.improvement.applied`、`memory.improvement.failed`
- **会话生命周期**：`session_end`、`stop`（由 lingxi-audit 默认写入）

### Debug 事件（可选）

设置环境变量 `LINGXI_AUDIT_DEBUG=1` 时，会额外写入全部 9 类 Hook 事件（如 `pre_tool_use`、`post_tool_use`）以及记忆检索完整性审计（如 `memory.retrieve.missing`），便于排查与健康度指标计算；自我迭代在实现上也可在 Debug 开启时利用更细粒度的事件做分析。

### 审计与自我迭代的关系

- **审计**：持续、被动地记录「谁在何时做了什么、结果如何」，形成运行状态快照。
- **自我迭代**：按心跳间隔**主动**读取一段时间内的审计（及记忆库状态），做诊断与仅 low risk 的自动改进，并再次写回审计（如 `memory.improvement.applied`），形成闭环。

因此审计系统是自我迭代的**重要依据**；没有审计，自我迭代无法基于运行状态做有依据的改进。

## 实施细节

### 触发条件

- **何时检查**：每次会话开始时，由 **session-init.mjs**（sessionStart）执行心跳检查。
- **判断逻辑**：读取 `.cursor/.lingxi/workspace/heartbeat-control.json` 中的 `last_improvement_cycle_at`（上次自我迭代完成时间）；若该字段不存在或距当前时间超过**设定间隔**（默认 24 小时），则在本轮注入「自我迭代」约定。
- **谁执行**：主 Agent 在步骤 A 通过 mcp_task 发起 **lingxi-self-iterate** 子代理，并设置 `run_in_background=true`，不等待子代理结束即进入步骤 B（记忆提取）与步骤 C（作答）。

### 控制文件：heartbeat-control.json

路径：`.cursor/.lingxi/workspace/heartbeat-control.json`。

与自我迭代相关的字段：

| 字段 | 含义 |
|------|------|
| `last_improvement_cycle_at` | 上次自我迭代周期完成时间（ISO 8601）。自我迭代子代理在完成一轮后会更新此字段，用于下次触发判断。 |

该文件还包含会话提炼相关字段（如 `last_distillation_completed_at`、`heartbeat`、`pending_distillation`、`processed_conversation_ids`），与自我迭代共用同一控制文件，由不同子代理更新各自相关字段。

### 子代理执行流程（当前实现）

**lingxi-self-iterate** 在独立上下文中按固定顺序执行：

1. **提案生成**  
   运行 `memory-improvement-proposal.mjs`（默认窗口 24 小时）：读取近期 `audit.log` 与记忆库（如 `memory.merge.diagnosed`、记忆笔记状态等），生成改进提案（findings + actions），并写入审计事件 `memory.improvement.proposed`。

2. **自动改进**  
   运行 `memory-improvement-apply.mjs --approve-all`：仅对**低风险**动作自动执行（如合并建议、索引补全等）；中高风险在脚本内降级为不执行并记入审计（如 `memory.improvement.rejected`、`memory.improvement.failed`）。执行结果写入 `memory.improvement.applied` 等。

3. **更新控制文件**  
   将 `heartbeat-control.json` 的 `last_improvement_cycle_at` 更新为当前时间，以便下一周期在间隔到达后再触发。

4. **返回简报**  
   向主会话返回简短报告（proposal_id、findings、applied/failed/skipped 等），不发起任何确认交互。

### 当前实现范围与事件

- **已实现**：以记忆相关改进为主（基于 audit 中的 merge 诊断、未索引 note 等生成提案并自动应用）。
- **事件**：自我迭代全流程会产生 `memory.improvement.proposed`、`memory.improvement.approved`、`memory.improvement.rejected`、`memory.improvement.applied`、`memory.improvement.failed` 等，均落在 `audit.log`，便于追溯与后续扩展诊断逻辑。

### 间隔与可配置性

- **默认间隔**：24 小时（由实现中的常量决定，如 `IMPROVEMENT_THRESHOLD_HOURS = 24`）。
- 设计上间隔可配置；当前官网与主仓文档以「设定间隔（默认 24 小时）」表述，便于未来在不改文案的前提下调整默认值或提供配置项。

## 与命令参考的对应关系

触发与调用方式在 [命令参考 - 自动任务与后台子代理](/guide/commands-reference#自动任务与后台子代理) 中有简要表格；本文从架构与审计视角做了展开。若只需「何时触发、谁执行、主会话是否等待」的速查，可看命令参考；若需理解「运行状态从何而来、自我迭代如何依据审计做改进」，以本文为准。

## 下一步

- [记忆系统](/guide/memory-system) — 记忆写入、检索与治理
- [命令参考](/guide/commands-reference) — 自动任务与后台子代理表格
- [GitHub 仓库](https://github.com/tower1229/LingXi) — 主仓 `.cursor/agents/lingxi-self-iterate.md`、`heartbeat-check.mjs`、`memory-improvement-proposal.mjs` 等实现
