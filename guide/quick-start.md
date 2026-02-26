# 快速开始

只需两步即可在现有项目中启用灵犀。

## 安装

### 方式一：Cursor 插件市场（推荐）

在 Cursor 中打开**插件市场**，搜索 **"LingXi"** 或 **"灵犀"**，点击安装。

安装后，灵犀的 Commands、Skills、Agents 和 Hooks 将随插件加载，在任意打开的工作区中可用。

### 方式二：脚本安装

若插件尚未上架，可在项目根目录执行以下命令：

**Linux / macOS / Git Bash：**

```bash
curl -fsSL https://raw.githubusercontent.com/tower1229/LingXi/main/install/bash.sh | bash
```

**Windows PowerShell：**

```powershell
irm https://raw.githubusercontent.com/tower1229/LingXi/main/install/powershell.ps1 | iex
```

## 初始化项目

在 Cursor 的 Chat 中输入：

```
/init
```

灵犀会引导你完成：

1. **收集项目信息** — 技术栈、常用模式、开发规则等
2. **创建工作区目录** — `.cursor/.lingxi/` 骨架与模板
3. **生成初始记忆** — 将项目背景写入 `memory/notes/`（可选）

初始化完成后，灵犀就准备好了！

## 第一个任务

试试用灵犀创建你的第一个任务：

```
/req 添加用户登录功能，支持邮箱和手机号登录
```

灵犀会：
- 自动生成任务编号（如 `001`）
- 创建结构化的任务文档 `.cursor/.lingxi/tasks/001.req.用户登录.md`
- 引导你提纯需求、确认技术方案

接下来你可以选择：

| 下一步 | 命令 | 适用场景 |
|--------|------|----------|
| 审查需求 | `/review-req 001` | 希望多角度审查需求文档质量 |
| 规划任务 | `/plan 001` | 复杂任务，需要拆分步骤和测试用例 |
| 直接构建 | `/build 001` | 简单任务，直接开始写代码 |

## 目录结构

初始化后，你的项目会多出以下目录：

```
.cursor/.lingxi/
├── tasks/              # 任务文档
│   └── 001.req.用户登录.md
├── memory/             # 记忆系统
│   ├── INDEX.md        # 统一索引
│   ├── notes/          # 记忆笔记
│   │   └── share/      # 共享记忆（可作为 git submodule）
│   └── references/     # 模板与规范
└── workspace/          # 工作空间元数据
```

## 下一步

- 了解 [核心工作流](/guide/core-workflow) 的完整生命周期
- 深入理解 [记忆系统](/guide/memory-system) 的工作原理
