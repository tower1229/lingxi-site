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

- `.agents/plugins/marketplace.json`
- `.codex-plugin/plugin.json`
- `skills/`
- `scripts/`
- `templates/`

同时会生成项目本地运行时：

- `.lingxi/`（公共运行时根）
- `.codex/config.toml`、`.codex/hooks.json`、`.codex/agents/`（Codex adapter）
- `.claude/settings.json`、`.claude/agents/`、`.claude/skills/`（Claude Code adapter）
- `AGENTS.md`、`CLAUDE.md`（仅在缺失时创建）

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
    memory-ops.jsonl   # 按需生成
  setup/
    automation.session-distill.toml
.codex/
  config.toml
  hooks.json
  agents/
    lingxi-session-distill.toml
.claude/
  settings.json
  agents/
    lingxi-session-distill.md
  skills/
AGENTS.md
CLAUDE.md
```

这些目录分别负责：

- `tasks/`：保存任务文档
- `memory/`：保存项目级与共享记忆
- `INDEX.md`：保存 memory index
- `state/`：保存 session 去重、distill journal，以及按需生成的 memory ops logs
- `.codex/config.toml`：启用仓库级 Codex hooks
- `.codex/hooks.json`：定义 LingXi 的 repo-local `UserPromptSubmit` hook（Codex）
- `.claude/settings.json`：定义 LingXi 的 repo-local `UserPromptSubmit` hook（Claude Code）
- `.claude/agents/`：保存 Claude Code 本地 agent 配置
- `.claude/skills/`：为 Claude Code 复制的 LingXi skills
- `setup/`：保存 automation 配置产物
- `.codex/agents/`：保存 Codex 本地 agent 配置

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
2. 生成 `AGENTS.md`（仅在缺失时）
3. 生成或合并 `.codex/config.toml`、`.codex/hooks.json`（Codex adapter）
4. 生成 `.codex/agents/lingxi-session-distill.toml`
5. 生成或合并 `.claude/settings.json`（Claude Code adapter）
6. 生成 `.claude/agents/lingxi-session-distill.md`，复制 skills 到 `.claude/skills/`
7. 生成 `CLAUDE.md`（仅在缺失时）
8. 生成 `.lingxi/setup/automation.session-distill.toml`
9. 注册 session-distill automation（仅 Codex）

可以通过 `--host` 参数只生成特定 host 的 artifacts：

```bash
node scripts/lingxi-setup.mjs --host codex   # 仅 Codex
node scripts/lingxi-setup.mjs --host claude  # 仅 Claude Code
node scripts/lingxi-setup.mjs --host all     # 两者都生成（默认）
```

补充说明：

- 对有意义的仓库请求，LingXi 会通过仓库级 `UserPromptSubmit` hook（Codex 或 Claude Code）自动注入最小必要的相关 memory。
- 在 Windows 原生环境里，setup 仍会生成 hooks 配置，但当前 Codex runtime 还不会原生执行这些 hooks。

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
```

这里不再提供 `lx-memory-brief` 这类手动命令。当前主线里，普通仓库对话的 memory 消费由 repo-local Codex hook 自动完成；`task` 和 `vet` 则继续直接走底层 retrieval。

或者直接执行：

```bash
npm run lx:bootstrap
```

## 下一步

- [什么是灵犀](/guide/what-is-lingxi)
- [核心工作流](/guide/core-workflow)
- [记忆系统](/guide/memory-system)
