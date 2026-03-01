# 快速开始

只需两步即可在现有项目中启用灵犀。`/init` 为推荐步骤，但不是必选。

## 前置条件

- **Cursor IDE**：使用灵犀前请确保已安装 **最新正式版 Cursor**。具体版本要求以主仓 [README](https://github.com/tower1229/LingXi) 为准。
- **Node.js**：仅在使用 `memory-sync` 同步记忆索引、或通过脚本运行 workspace-bootstrap 等时才需要；仅用命令与基础工作流（如 `/task`、`/plan`、`/build`、`/review`、`/remember`、`/init`）可不安装 Node.js。
- 更多环境说明见 [FAQ](/guide/faq)。

## 安装

在项目根目录执行以下命令：

**Linux / macOS / Git Bash：**

```bash
curl -fsSL https://raw.githubusercontent.com/tower1229/LingXi/main/install/bash.sh | bash
```

**Windows PowerShell：**

```powershell
irm https://raw.githubusercontent.com/tower1229/LingXi/main/install/powershell.ps1 | iex
```

## 初始化项目（推荐，可选）

在 Cursor 的 Chat 中输入：

```
/init
```

灵犀会引导你完成：

1. **收集项目信息** — 技术栈、常用模式、开发规则等
2. **生成初始记忆** — 将项目背景写入 `memory/notes/`（可选）

如果你希望先直接推进具体需求，也可以先使用 `/task` 创建任务，再按需补做 `/init`。

## 第一个任务（推荐）

试试用灵犀创建你的第一个任务：

```
/task 添加用户登录功能，支持邮箱和手机号登录
```

灵犀会：

- 自动生成任务编号（如 `001`）
- 创建结构化的任务文档 `.cursor/.lingxi/tasks/001.task.用户登录.md`
- 引导你提纯需求、确认技术方案

接下来你可以选择：

| 下一步         | 命令     | 适用场景                         |
| -------------- | -------- | -------------------------------- |
| 审查 task 文档 | `/vet`   | 希望多角度审查需求文档质量       |
| 规划任务       | `/plan`  | 复杂任务，需要拆分步骤和测试用例 |
| 直接构建       | `/build` | 简单任务，直接开始写代码         |

以上命令**默认作用于当前最新任务**，无需输入任务编号。多任务时的编号用法与特性见 [核心工作流 - 多任务支持](/guide/core-workflow#多任务支持)。

## 目录结构

执行 `/init` 或首次使用相关命令后，项目内会创建 `.cursor/.lingxi/`，其下结构为：

```
.cursor/.lingxi/
├── tasks/              # 任务文档
│   └── 001.task.用户登录.md
├── memory/             # 记忆系统
│   ├── INDEX.md        # 统一索引（SSoT）
│   ├── notes/          # 记忆笔记（扁平存放）
│   │   └── share/      # 共享记忆（可作为 git submodule）
│   └── references/     # 模板与规范
└── workspace/          # 工作空间
    └── audit.log       # 审计日志（若启用）
```

## 下一步

- 了解 [核心工作流](/guide/core-workflow) 的完整生命周期
- 深入理解 [记忆系统](/guide/memory-system) 的工作原理
