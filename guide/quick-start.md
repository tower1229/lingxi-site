# 快速开始

## 安装

请在目标仓库根目录执行安装脚本。

**Linux / macOS / Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/tower1229/LingXi/main/install/bash.sh | bash
```

**Windows PowerShell**

```powershell
irm https://raw.githubusercontent.com/tower1229/LingXi/main/install/powershell.ps1 | iex
```

## 安装后会得到什么

LingXi 安装后会把当前受支持的产品表面分发到你的仓库中，包括：

- `.codex-plugin/plugin.json`
- `skills/`
- `scripts/`
- `templates/`

同时会生成项目本地运行时：

- `.lingxi/`
- `.codex/agents/`
- `AGENTS.md`（仅在缺失时创建）

## Runtime 结构

LingXi 当前运行时的核心结构大致如下：

```text
.lingxi/
  tasks/
  memory/
    INDEX.md
    project/
    share/
  state/
    processed-sessions.json
    distill-journal.jsonl
    memory-ops.jsonl
  setup/
    automation.session-distill.toml
.codex/
  agents/
    lingxi-session-distill.toml
AGENTS.md
```

这些目录分别负责：

- `tasks/`：保存任务文档
- `memory/`：保存项目级与共享记忆
- `INDEX.md`：保存 memory index
- `state/`：保存 session 去重、distill journal 与 memory ops logs
- `setup/`：保存 automation 配置产物
- `.codex/agents/`：保存 LingXi 的本地 agent 配置

## Bootstrap

如果你使用的是远程安装脚本，安装过程中通常已经自动完成 bootstrap。

如果你是手动同步 LingXi 文件，或者只想补跑 runtime / automation 注册，可以执行：

```bash
npm run lx:bootstrap
# 或
node scripts/lx-bootstrap.mjs
```

这一步会同时：

1. 初始化 `.lingxi/`
2. 生成 `.codex/agents/lingxi-session-distill.toml`
3. 生成 `.lingxi/setup/automation.session-distill.toml`
4. 注册 session-distill automation

## 第一次使用

LingXi 当前最核心的前台能力是 `task` 和 `vet`。

建议从 `task` 开始：

1. 让 LingXi 使用 `task`，把一个粗糙请求整理成任务文档
2. 再让 LingXi 使用 `vet`，在实现前挑战任务质量

一个典型流程是：

```text
task → vet
```

后台 `session-distill` 会持续提炼历史会话中的工程判断，并在后续任务和审查中按需应用这些记忆。

## 调试与常用命令

如果你需要检查运行时状态或调试 memory，可以使用这些底层命令：

```bash
npm run lx:setup
npm run lx:create-automation
npm run lx:distill-sessions
npm run lx:memory-brief -- --prompt "当前请求"
```

或者直接执行：

```bash
npm run lx:bootstrap
```

## 下一步

- [什么是灵犀](/guide/what-is-lingxi)
- [核心工作流](/guide/core-workflow)
- [记忆系统](/guide/memory-system)
