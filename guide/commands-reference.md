# 命令与工作流参考

本页用于快速查看 LingXi 当前对外支持的前台能力与底层运行命令。

## 前台能力

LingXi 当前显式工作流表层聚焦在两个能力上：

| 能力 | 作用 | 典型产出 |
| --- | --- | --- |
| `task` | 把粗糙请求整理成工程师可直接开工的任务文档 | `.lingxi/tasks/*.md` |
| `vet` | 在实现前挑战任务质量，输出结构化审查结果 | VetReport（结构化输出） |

这两个能力都只在你明确调用时运行。

## 后台能力

LingXi 还有一条后台持续运行的记忆链路：

| 能力 | 作用 | 典型产出 |
| --- | --- | --- |
| `session-distill` | 从历史会话中提炼 durable engineering taste | 写入 `.lingxi/memory/`，并更新 state 与 index |
| `memory-retrieve` | 为当前工作检索最小必要的高信号记忆 | memory brief / retrieval hits |
| `memory-write` | 对通过裁决的候选执行治理并落盘 | notes + `INDEX.md` 更新 |

## 常用脚本

LingXi 当前运行时最常用的脚本包括：

### `lx-bootstrap`

```bash
node scripts/lx-bootstrap.mjs
# 或
npm run lx:bootstrap
```

作用：

- 初始化 `.lingxi/`
- 生成 `.codex/agents/lingxi-session-distill.toml`
- 生成 `.lingxi/setup/automation.session-distill.toml`
- 注册 session-distill automation

### `lx-distill-sessions`

```bash
node scripts/lx-distill-sessions.mjs
```

作用：

- 扫描历史 session artifact
- 选择有效 session
- 调用单 session worker 提炼 durable engineering taste

### `lx-memory-brief`

```bash
node scripts/lx-memory-brief.mjs --prompt "当前请求"
```

作用：

- 针对当前请求检索相关记忆
- 返回最小必要的高信号 memory brief

### `lingxi-setup`

```bash
node scripts/lingxi-setup.mjs
```

作用：

- 初始化 LingXi runtime 基础目录
- 生成运行时骨架

### `lx-create-automation`

```bash
node scripts/lx-create-automation.mjs
```

作用：

- 根据 setup 产物注册或更新 LingXi 的 session-distill automation

## 卸载

```bash
yarn lx:uninstall
# 或
npm run lx:uninstall
```

非交互环境可使用：

```bash
yarn lx:uninstall --yes
```

## 测试与发布前检查

主仓当前用这些测试来保证安装面、工作流与 memory 主线的一致性：

- `npm test`
- `install-manifest-exists`
- `install-manifest-coverage`
- `install-manifest-version-sync`

## 下一步

- [核心工作流](/guide/core-workflow)
- [记忆系统](/guide/memory-system)
- [FAQ](/guide/faq)
