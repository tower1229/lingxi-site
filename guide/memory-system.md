# 记忆系统

记忆系统是灵犀的核心能力——让 AI **在项目中学习你的判断力、品味和责任感**，并在每轮新对话中自然复用。

## 工作原理

```
对话开始
  ↓
自动检索记忆（memory-retrieve）
  ↓
注入 0-3 条最相关记忆
  ↓
AI 带着你的"经验"回答
  ↓
识别可沉淀的新经验（taste-recognition）
  ↓
写入记忆库（lingxi-memory）
```

整个过程**静默执行**，不打断你的工作流。

## 记忆检索

每轮对话前，灵犀自动执行 `memory-retrieve`，从记忆库中检索最相关的笔记：

- **双路径检索**：语义搜索 + 关键词匹配，并集加权合并
- **最小注入**：只取 top 0–3 条，避免上下文污染
- **优雅降级**：语义搜索不可用时降级为纯关键词，仍无匹配则静默跳过

## 记忆写入

### 自动沉淀

灵犀在每轮对话结束时，自动判断是否存在可沉淀的经验。如果识别到值得记录的判断、决策或经验教训，会自动写入记忆库。

**触发条件：**
- 仅在 confidence 为 high 且为全新记忆时自动写入
- 合并或替换已有记忆需要你确认

### 主动记忆 — /remember

你可以随时使用 `/remember` 命令主动写入记忆：

```
/remember <记忆描述>
```

**示例：**
```
/remember 吸取刚才这个 bug 的经验
/remember 始终使用 pnpm 而不是 npm
/remember 这个项目的 API 返回格式必须遵循 RESTful 规范
```

**使用场景：**

| 场景 | 示例 |
|------|------|
| 直接陈述原则 | `/remember 组件命名使用 PascalCase` |
| 提取对话经验 | `/remember 吸取刚才这个 bug 的经验` |
| 关键词定位 | `/remember 关于数据库索引的最佳实践` |

### 记忆的结构

每条记忆包含 7 个字段：

| 字段 | 含义 |
|------|------|
| scene | 适用场景 |
| principles | 核心原则 |
| choice | 具体选择 |
| evidence | 支撑证据 |
| source | 来源 |
| confidence | 置信度 |
| apply | 应用方式 |

## 记忆治理

灵犀对记忆库进行自动治理，防止记忆无限膨胀：

- **评分卡系统**：5 个维度评估每条记忆的价值
- **TopK 策略**：保留最有价值的记忆
- **冲突解决**：新记忆与旧记忆冲突时，通过门控机制决定合并或替换

## 跨项目共享

团队可以通过 **git submodule** 共享记忆库，让最佳实践在所有项目中流转。

### 设置共享仓库

```bash
# 1. 添加共享记忆仓库
git submodule add <shareRepoUrl> .cursor/.lingxi/memory/notes/share

# 2. 更新共享记忆
git submodule update --remote --merge

# 3. 同步记忆索引
npm run memory-sync
# 或
yarn memory-sync
```

### 共享规则

- **共享目录**：`.cursor/.lingxi/memory/notes/share/`
- **识别标准**：通过 `Audience`（team/personal）和 `Portability`（cross-project/project-only）字段标识
- **优先级**：项目记忆覆盖共享记忆（相同主题时）

## 下一步

- 回顾 [核心工作流](/guide/core-workflow) 了解记忆如何融入开发流程
- 访问 [GitHub 仓库](https://github.com/tower1229/LingXi) 查看完整源码
