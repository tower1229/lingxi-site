# 常见问题

## 环境与安装

### 灵犀需要什么 Cursor 版本？

使用灵犀需要 **最新正式版 Cursor**。安装前请确认 Cursor 已安装并可正常使用，具体版本以主仓 [README](https://github.com/tower1229/LingXi) 为准。

### 是否必须安装 Node.js？

**基础工作流不必须**。仅使用 `/task`、`/vet`、`/plan`、`/build`、`/review`、`/remember`、`/init`、`/extract` 等命令时，无需本机安装 Node.js。

在以下情况需要 Node.js：

- 使用 **`memory-sync`** 同步记忆索引（例如跨项目共享后更新 INDEX）
- 通过脚本直接运行 **workspace-bootstrap**（如 `.cursor/skills/workspace-bootstrap/scripts/workspace-bootstrap.mjs`）

### memory-sync 从哪来、在哪执行？

`memory-sync` 由**灵犀安装脚本**在安装时写入项目的 `package.json` 的 `scripts` 中。请在**项目根目录**执行 `yarn memory-sync` 或 `npm run memory-sync`，用于在添加或更新共享记忆后同步 `.cursor/.lingxi/memory/INDEX.md`。需要本机已安装 Node.js。详见 [记忆系统 - 跨项目共享](/guide/memory-system#跨项目共享)。若项目未安装灵犀或未注入该脚本，请先完成 [快速开始](/guide/quick-start) 中的安装步骤。

---

## 工作流与 Cursor 集成

### 灵犀的 /plan、/build 与 Cursor 自带的 Plan/Build 有何关系？

**可互补**。灵犀的 `/plan` 和 `/build` 围绕 **task 文档**（`.cursor/.lingxi/tasks/`），并与 vet、review 等命令组成可解耦、按需推进的工作流。Cursor 自带的 Plan 模式与 Build 功能可在合适场景下替代或配合使用，例如在 Cursor Plan 模式下直接使用其内置 build，跳过灵犀的 `/build`。详见 [核心工作流](/guide/core-workflow)。

---

## 记忆系统

### 记忆太多或噪音太多怎么办？

灵犀对记忆库有**自动治理**：taste-recognition 在产出 payload 前会做**升维判定**（写/不写、L0/L1），仅通过判定的条目才会写入；lingxi-memory 再做语义近邻 TopK 与门控，新老记忆冲突时由你决定合并或替换。若仍感噪音较多，可依赖这些机制逐步精简；详见 [记忆系统](/guide/memory-system) 的治理闭环与 [开发者品味](/guide/how-to-recognize-developer-taste)。

---

## 更多

- [命令参考](/guide/commands-reference) — 所有命令语法与参数
- [快速开始](/guide/quick-start) — 安装与第一个任务
- [GitHub 仓库](https://github.com/tower1229/LingXi) — 源码与 Issues
