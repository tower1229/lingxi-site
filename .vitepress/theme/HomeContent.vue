<script setup>
import { useData } from 'vitepress'

const { lang } = useData()

const isZh = () => lang.value === 'zh-CN'
</script>

<template>
  <div class="home-extra">
    <!-- Section: Workflow Visualization -->
    <section class="home-section workflow-section">
      <div class="section-container">
        <div class="section-text">
          <span class="section-badge">{{ isZh() ? '核心能力' : 'Core' }}</span>
          <h2>{{ isZh() ? '可伸缩的开发工作流' : 'Flexible Development Workflow' }}</h2>
          <p>{{ isZh()
            ? '从需求到交付，5 个命令覆盖完整生命周期。每个环节可选可跳，简单任务走快捷通道，复杂任务走完整流程——选型权在你。'
            : 'From requirements to delivery, 5 commands cover the full lifecycle. Every step is optional — simple tasks take the fast track, complex tasks follow the full flow. You decide.'
          }}</p>
          <div class="section-highlights">
            <div class="highlight-item">
              <code>/req</code>
              <span>{{ isZh() ? '创建任务' : 'Create task' }}</span>
            </div>
            <div class="highlight-item">
              <code>/plan</code>
              <span>{{ isZh() ? '规划方案' : 'Plan approach' }}</span>
            </div>
            <div class="highlight-item">
              <code>/build</code>
              <span>{{ isZh() ? '执行构建' : 'Build code' }}</span>
            </div>
            <div class="highlight-item">
              <code>/review</code>
              <span>{{ isZh() ? '审查交付' : 'Review delivery' }}</span>
            </div>
          </div>
        </div>
        <div class="section-image">
          <img src="/images/workflow-diagram.svg" :alt="isZh() ? '灵犀工作流示意图' : 'LingXi workflow diagram'" />
        </div>
      </div>
    </section>

    <!-- Section: Memory System -->
    <section class="home-section memory-section">
      <div class="section-container reverse">
        <div class="section-text">
          <span class="section-badge memory">{{ isZh() ? '核心能力' : 'Core' }}</span>
          <h2>{{ isZh() ? '持久化记忆，让 AI 懂你' : 'Persistent Memory That Gets You' }}</h2>
          <p>{{ isZh()
            ? '灵犀自动捕获你的判断、偏好和经验教训，沉淀为结构化记忆笔记。每轮新对话前自动检索注入最相关的 0–3 条记忆，让 AI 真正按你的方式做事。'
            : 'LingXi automatically captures your judgments, preferences, and lessons learned as structured memory notes. Before each new conversation, it retrieves and injects the 0–3 most relevant memories, so AI truly works the way you do.'
          }}</p>
          <div class="memory-stats">
            <div class="stat-item">
              <span class="stat-icon">🔍</span>
              <div>
                <strong>{{ isZh() ? '双路径检索' : 'Dual-path retrieval' }}</strong>
                <span>{{ isZh() ? '语义 + 关键词' : 'Semantic + keyword' }}</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🎯</span>
              <div>
                <strong>{{ isZh() ? '最小注入' : 'Minimal injection' }}</strong>
                <span>{{ isZh() ? 'Top 0–3 条' : 'Top 0–3 results' }}</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🛡️</span>
              <div>
                <strong>{{ isZh() ? '人工门控' : 'Human gating' }}</strong>
                <span>{{ isZh() ? '关键写入需确认' : 'Key writes need approval' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-image">
          <img src="/images/memory-illustration.svg" :alt="isZh() ? '记忆系统示意图' : 'Memory system illustration'" />
        </div>
      </div>
    </section>

    <!-- Section: Getting Started -->
    <section class="home-section getting-started-section">
      <div class="section-container">
        <div class="section-text">
          <span class="section-badge started">{{ isZh() ? '快速上手' : 'Get Started' }}</span>
          <h2>{{ isZh() ? '两步开始，零配置' : 'Two Steps, Zero Config' }}</h2>
          <p>{{ isZh()
            ? '从 Cursor 插件市场安装灵犀，在项目中运行 /init 即可开始使用。无需复杂配置，无需学习新语言——用自然语言描述需求，灵犀帮你搞定。'
            : 'Install LingXi from the Cursor plugin marketplace, run /init in your project, and start using it. No complex setup, no new language to learn — describe your requirements in natural language and LingXi handles the rest.'
          }}</p>
          <div class="steps-list">
            <div class="step-item">
              <span class="step-number">1</span>
              <div>
                <strong>{{ isZh() ? '安装插件' : 'Install plugin' }}</strong>
                <span>{{ isZh() ? '在 Cursor 插件市场搜索 "LingXi"' : 'Search "LingXi" in Cursor marketplace' }}</span>
              </div>
            </div>
            <div class="step-item">
              <span class="step-number">2</span>
              <div>
                <strong>{{ isZh() ? '初始化项目' : 'Initialize project' }}</strong>
                <span>{{ isZh() ? '运行 /init，灵犀自动完成配置' : 'Run /init, LingXi auto-configures' }}</span>
              </div>
            </div>
            <div class="step-item">
              <span class="step-number">3</span>
              <div>
                <strong>{{ isZh() ? '开始创建' : 'Start creating' }}</strong>
                <span>{{ isZh() ? '用 /req 描述你的第一个任务' : 'Use /req to describe your first task' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-image">
          <img src="/images/getting-started.svg" :alt="isZh() ? '快速开始终端截图' : 'Quick start terminal screenshot'" />
        </div>
      </div>
    </section>

    <!-- Section: CTA -->
    <section class="home-section cta-section">
      <div class="cta-container">
        <h2>{{ isZh() ? '让 AI 按你的方式做事' : 'Make AI Work the Way You Do' }}</h2>
        <p>{{ isZh()
          ? '安装灵犀，在你的项目中体验持久记忆工作流。'
          : 'Install LingXi and experience persistent memory workflows in your project.'
        }}</p>
        <div class="cta-buttons">
          <a :href="isZh() ? '/guide/quick-start' : '/en/guide/quick-start'" class="cta-primary">
            {{ isZh() ? '快速开始' : 'Get Started' }}
          </a>
          <a href="https://github.com/tower1229/LingXi" class="cta-secondary" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-extra {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ---- Section base ---- */
.home-section {
  padding: 4rem 0;
  border-top: 1px solid var(--vp-c-divider);
}

.section-container {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.section-container.reverse {
  flex-direction: row-reverse;
}

.section-text {
  flex: 1;
  min-width: 0;
}

.section-image {
  flex: 1;
  min-width: 0;
}

.section-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--vp-c-divider);
}

.dark .section-image img {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  border-color: var(--vp-c-border);
}

/* ---- Badge ---- */
.section-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  margin-bottom: 1rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.section-badge.memory {
  background: rgba(40, 200, 64, 0.1);
  color: #28c840;
}

.section-badge.started {
  background: rgba(97, 175, 239, 0.1);
  color: #4a90d0;
}

/* ---- Typography ---- */
.section-text h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.section-text p {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

/* ---- Highlights (workflow) ---- */
.section-highlights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.highlight-item code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.highlight-item span {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* ---- Memory stats ---- */
.memory-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.stat-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-item div {
  display: flex;
  flex-direction: column;
}

.stat-item strong {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stat-item > div > span {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

/* ---- Steps list ---- */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.step-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-item div {
  display: flex;
  flex-direction: column;
}

.step-item strong {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.step-item > div > span {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

/* ---- CTA Section ---- */
.cta-section {
  text-align: center;
  padding: 5rem 0;
}

.cta-container h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.cta-container p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cta-primary,
.cta-secondary {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.cta-primary {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: 1px solid var(--vp-button-brand-border);
}

.cta-primary:hover {
  background: var(--vp-button-brand-hover-bg);
}

.cta-secondary {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.cta-secondary:hover {
  border-color: var(--vp-c-text-2);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .section-container,
  .section-container.reverse {
    flex-direction: column;
    gap: 2rem;
  }

  .section-highlights {
    grid-template-columns: 1fr;
  }

  .home-section {
    padding: 3rem 0;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
