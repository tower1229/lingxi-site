# 常见问题

## 环境与安装

### 需要什么 Cursor 版本？

建议使用最新稳定版 Cursor，具体兼容性以主仓 README 为准。

### 需要本机安装 Node.js 吗？

日常使用 workflow skills 与 `/remember`、`/init` 通常不依赖本机 Node.js。  
直接运行脚本（例如卸载脚本）时需要 Node.js。

### 如何同步记忆索引？

在 Cursor 中运行 `/memory-govern`。它会处理 INDEX 与 notes 的一致性，并可选执行治理建议。

### 如何卸载灵犀？

在项目根目录执行：

```bash
yarn lx:uninstall
# 或
npm run lx:uninstall
```

CI 等非交互场景可用：

```bash
yarn lx:uninstall --yes
```

### 如何自动校验安装清单完整性？

在 CI 执行三类测试：

- `install-manifest-exists`
- `install-manifest-coverage`
- `install-manifest-version-sync`

## 工作流

### 灵犀的 `/plan`、`/build` 与 Cursor 内置 Plan/Build 是什么关系？

两者可互补。灵犀 workflow 以 task 文档为核心做分层推进；Cursor 内置能力可按场景替代或配合。

## 记忆系统

### 记忆多了会不会噪音很大？

记忆系统通过写入治理、检索最小注入和用户门控共同控制噪音。  
如果仍偏高，可结合 `/memory-govern` 做定期收敛。

## 更多

- [命令与工作流参考](/guide/commands-reference)
- [记忆系统](/guide/memory-system)
- [快速开始](/guide/quick-start)
