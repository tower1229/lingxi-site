# 常见问题

## 环境与安装

### LingXi 运行在什么环境里？

LingXi 当前是面向 Codex 的工程工作流产品。安装后，它会把运行时落在目标仓库中，核心目录是：

- `.lingxi/`
- `.codex/config.toml`
- `.codex/hooks.json`
- `.codex/agents/`

### 需要本机安装 Node.js 吗？

需要。

当前 LingXi 的 setup、bootstrap、automation 注册和底层运行脚本都基于 Node.js，因此目标环境需要可用的 `node`。

### 安装后最关键的一步是什么？

最关键的是让 bootstrap 和 automation 真正闭环。

如果使用官方远程安装脚本，安装过程中通常已经自动执行了 bootstrap。  
如果是手动同步文件，则需要自己执行：

```bash
node scripts/lx-bootstrap.mjs
```

这一步除了 runtime 和 automation，还会生成或合并仓库级 Codex hooks 配置，让普通仓库对话可以自动消费 LingXi memory。

### 如何卸载 LingXi？

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

## 工作方式

### LingXi 当前最核心的工作流是什么？

当前最核心的前台工作流是：

```text
task → vet
```

`task` 用来整理任务，`vet` 用来在开工前挑战任务质量。

### LingXi 会不会自动在每轮对话里插很多东西？

LingXi 的设计目标是把前台工作流保持得很克制。

显式工作流只在你明确调用时运行。后台 memory 会持续提炼和检索，而普通的有意义仓库对话只会通过 hook 注入最小必要的 memory brief，不会默认塞入一大段上下文。

### 为什么我装好了，但普通对话没有自动带上 memory？

先检查这几项：

1. 是否已经跑过 bootstrap，并生成了 `.codex/config.toml` 与 `.codex/hooks.json`
2. 当前仓库在 Codex 里是否处于 trusted / 启用 hooks 的状态
3. 当前请求是否属于有意义的仓库工作，而不是简单寒暄
4. 如果你在 Windows 原生环境里运行 Codex，需要注意当前 hooks 还不会原生执行

## 记忆系统

### 记忆系统会不会越来越吵？

LingXi 通过三层控制噪音：

1. `taste adjudicate` 先做价值裁决
2. `governance` 再决定 create / merge / skip
3. retrieval 只返回最小必要的高信号记忆

所以它的目标是沉淀真正值得复用的工程判断。

### 记忆是怎么影响 task 和 vet 的？

`task` 会在起草任务时主动检索相关记忆，并把真正影响任务内容的结果写进 `memory_refs`。  
`vet` 会再次检索相关记忆，并检查任务是否遗漏了这些关键判断。

### 记忆索引需要手动同步吗？

当前主线里，memory 写入时会自动维护 `INDEX.md`，不需要手动同步。

## 质量与验证

### LingXi 怎么保证输出质量？

LingXi 使用混合设计：

- LLM 负责语义提炼、裁决、治理和检索排序
- 确定性脚本负责 schema、状态、安全、持久化和索引

所以它追求的是输出结构稳定、状态可控、运行可审计。

### 如何验证当前安装面是否完整？

可以使用主仓里的这些测试与检查：

- `npm test`
- `install-manifest-exists`
- `install-manifest-coverage`
- `install-manifest-version-sync`

## 更多

- [命令与工作流参考](/guide/commands-reference)
- [记忆系统](/guide/memory-system)
- [快速开始](/guide/quick-start)
