# 记忆治理与写入

本页描述 LingXi 当前 memory 中游的稳定职责，也就是候选判断如何进入治理、如何落盘，以及为什么这样设计。

## 模块定位

LingXi 的 memory 主线可以理解为三段：

1. 上游：提炼与裁决
2. 中游：治理与写入
3. 下游：检索与应用

其中，治理与写入层负责把已经通过裁决的 durable candidates 变成稳定的 memory notes。

## 这层在做什么

当前写入层主要负责：

1. 接收结构化 candidate
2. 判断是 create、merge 还是 skip
3. 分配 note id
4. 写入 note 文件
5. 重建 `INDEX.md`
6. 更新运行时状态与操作日志

它不直接消费原始对话，也不重新做上游已经完成的提炼工作。

## 当前治理动作

新版 LingXi 当前主线中的治理动作以这三类为主：

- `create`
- `merge_into_existing`
- `skip_as_not_durable`

这代表治理层当前最核心的职责是：

- 把新的高价值判断写入 memory
- 把语义等价或更强的判断合并到已有 note
- 主动跳过不值得长期沉淀的内容

## 写入层依据什么做治理

治理层会综合使用这些信号：

- candidate 的语义内容
- `content_type`
- `value_scores`
- `suggested_storage_kind`
- 当前 memory store 中已有的 notes

它关注的是语义关系。例如：

- 是否表达了同一条工程判断
- 是否只是已有判断的更强表达
- 是否仍然过于一次性或噪音化

## 为什么治理层和提炼层要分开

LingXi 把上游提炼和中游治理分开，是为了让系统职责更清楚：

### 上游回答

- 识别值得长期沉淀的工程判断
- 明确它属于什么类型
- 标定它在什么场景下有用

### 中游回答

- 它应该新建 note 吗
- 它应该并入已有 note 吗
- 还是应该跳过，避免污染 memory

如果把这两层混在一起，系统就很容易退化成“一步生成 note”，既不利于质量控制，也不利于长期治理。

## 写入后的稳定产物

治理通过后，LingXi 会把 note 写入：

- `.lingxi/memory/project/`
- `.lingxi/memory/share/`

并同步维护：

- `.lingxi/memory/INDEX.md`

写入后还会更新这些运行时状态：

- `.lingxi/state/processed-sessions.json`
- `.lingxi/state/distill-journal.jsonl`
- `.lingxi/state/memory-ops.jsonl`（按需生成）

所以写入层不仅在“写 note”，也在维护整个 memory runtime 的一致性。

## 为什么要用确定性写入层

LingXi 把提炼、裁决、治理判断交给 LLM，但把持久化交给确定性脚本。

原因是：

1. 语义判断需要模型理解
2. id、文件、索引、状态这些内容必须稳定
3. repeated runs 不能默默污染 memory
4. memory runtime 必须可审计、可测试、可恢复

所以写入层的重点是保持稳定。

## 与 retrieval 的关系

写入层的目标是把真正值得复用的判断写好。

这些 note 最终会服务于 retrieval：

- `task` 在起草任务时使用它们
- `vet` 在任务审查时使用它们
- 其他有意义的仓库工作也可以通过 memory brief 使用它们

也就是说，write governance 的目标始终是为下游更高质量的应用服务。

## 下一步

- [记忆系统](/guide/memory-system)
- [工程品味提炼与裁决](/guide/taste-extraction-and-adjudication)
