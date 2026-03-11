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
