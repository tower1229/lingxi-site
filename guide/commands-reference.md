# 命令与工作流参考

本页用于快速查“入口是什么、做什么、输出什么”。

## 工作流 Skills

灵犀核心工作流由 Skills 驱动：`task -> vet -> plan -> build -> review`。  
这些 Skills 只在你显式触发时运行（命令或自然语言），不会按语义自动加载。

| Skill | 作用 | 典型产出 |
| --- | --- | --- |
| `task` | 定义目标、边界、验收 | `*.task.*.md` |
| `vet` | 审查 task 质量 | 对话内审查结论 |
| `plan` | 形成实施方案与测试映射 | `*.plan.*.md` + `*.testcase.*.md` |
| `build` | 实施与测试 | 代码与测试变更 |
| `review` | 按需求验收与证据审计 | `*.review.*.md` |

## 记忆相关命令

### `/remember`

```bash
/remember <记忆描述>
```

- 用途：即时沉淀一条经验或规则
- 输出：写入 `memory/project/` 或 `memory/share/`，并更新 `INDEX`

### `/memory-govern`

```bash
/memory-govern [--dry-run] [--skip-govern] [--root <memoryRoot>]
```

- 用途：索引同步与可选主动治理
- 作用：修复 INDEX 与 notes 一致性，并在确认后执行治理建议

### `/init`

```bash
/init
```

- 用途：初始化项目上下文并生成记忆候选
- 默认行为：先给候选，不自动写入；仅在你确认后写入

## 调试与调优辅助

### `about-lingxi`（Skill）

- 定位：灵犀的人机共读技术手册（知识底座），并以 Skill 形式提供给模型按需自动加载
- 你可以把它理解为两层一体：
  - **文档层（Human + AI Readable）**：包含背景、架构、机制、设计原则、评估标准等可持续维护的知识系统
  - **调用层（Skill）**：在需要时快速加载上述知识，帮助模型基于灵犀语境做判断
- 适用场景：
  - 快速对齐“灵犀是什么、为什么这样设计、关键机制如何协作”
  - 在功能设计/机制调整时评估长期收益、代价与边界
  - 讨论 Command / Skill / Hook / Subagent 的选型取舍
- 加载方式：
  - 首选模型按需自动加载（当任务需要灵犀背景信息时）
  - 也可手动触发（在 Cursor 中输入 `/about-lingxi` 选择同名 skill）
- 边界：它只提供背景知识与评估依据，不直接执行具体动作

### `/start-tuning`

```bash
/start-tuning
```

- 定位：`about-lingxi` 的上层应用（调试/调优快捷入口）
- 目的：让模型快速进入“调优灵犀”的工作模式，便于开发者调试灵犀
- 会发生什么：自动加载 `about-lingxi` 作为背景上下文，再围绕调优目标展开分析
- 适用场景：调试灵犀、讨论优化目标、梳理约束、设计演进路径
- 边界：它是调优会话启动器，不承担底层知识内容本身（该部分由 `about-lingxi` 提供）

## 自动任务（无需手动命令）

系统在新会话开始时自动检查并按约定触发后台子代理：

- **会话提炼**：触发后由 `lingxi-session-distill` 后台执行
- **自我迭代**：触发后由 `lingxi-self-iterate` 后台执行

两者都不阻塞主会话，主会话继续正常响应。

## 卸载

```bash
yarn lx:uninstall
# 或
npm run lx:uninstall
```

非交互环境可用：

```bash
yarn lx:uninstall --yes
```

## 安装清单自动化校验

建议在 CI 固定执行三类测试：

- `install-manifest-exists`：清单路径有效性（manifest -> repo）
- `install-manifest-coverage`：结构覆盖率（repo -> manifest）
- `install-manifest-version-sync`：版本一致性（manifest = package）

## 下一步

- [核心工作流](/guide/core-workflow)
- [记忆系统](/guide/memory-system)
- [FAQ](/guide/faq)
