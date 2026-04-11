---
layout: home

hero:
  name: 灵犀
  text: 面向 Codex 和 Claude Code 的工程工作流
  tagline: 把模糊需求整理成可执行任务，在开工前完成高质量审查，并把稳定的工程判断沉淀成可复用记忆。
  image:
    src: /assets/logo-primary.svg
    alt: 灵犀标识
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: GitHub
      link: https://github.com/tower1229/LingXi

features:
  - icon: 📝
    title: 更强的 Task
    details: 将粗糙请求整理为工程师可直接开工的任务文档，补齐边界、约束、验收标准与开发指导。
  - icon: 🔎
    title: 更锋利的 Vet
    details: 在实现前挑战任务质量，提前暴露模糊点、隐藏风险、薄弱验收与不稳妥的方案设定。
  - icon: 🧠
    title: 工程品味记忆
    details: 从历史会话中提炼可复用的工程判断，沉淀未来还能持续发挥作用的工程选择。
  - icon: ⚙️
    title: 窄表层，强底层
    details: 表层只保留 task 与 vet 两个显式工作流，底层由记忆系统持续积累判断并反向增强后续工作。
  - icon: 🧪
    title: 语义判断 + 确定性落盘
    details: 用 LLM 处理提炼、裁决、治理与检索，用确定性脚本保证合同、状态、安全与持久化一致。
  - icon: 🔁
    title: 后台持续提炼
    details: session-distill 在后台筛选有效会话，完成 taste extract、taste adjudicate、governance 与写入；而普通有意义的仓库对话会通过 repo-local hook（Codex 或 Claude Code）自动注入最小必要记忆。
---
