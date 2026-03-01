<script setup>
import { useData } from "vitepress";

const { lang } = useData();

const isZh = () => lang.value === "zh-CN";
</script>

<template>
  <div class="home-extra">
    <!-- Section: CTA -->
    <section class="home-section cta-section">
      <div class="cta-container">
        <img
          src="/assets/logo-mark.svg"
          alt=""
          class="cta-mono-mark"
          aria-hidden="true"
        />
        <h2>
          {{ isZh() ? "让 AI 按你的方式做事" : "Make AI Work the Way You Do" }}
        </h2>
        <p>
          {{
            isZh()
              ? "安装后可按需使用 /init、/task 等命令，在你的项目中逐步启用灵犀工作流。"
              : "After installation, use /init, /task, or other commands as needed to adopt the LingXi workflow in your project."
          }}
        </p>
        <div class="cta-buttons">
          <a
            :href="isZh() ? '/guide/quick-start' : '/en/guide/quick-start'"
            class="cta-primary"
          >
            <img
              src="/assets/logo-mark.svg"
              alt=""
              class="cta-primary-badge"
              aria-hidden="true"
            />
            {{ isZh() ? "快速开始" : "Get Started" }}
          </a>
          <a
            href="https://github.com/tower1229/LingXi"
            class="cta-secondary"
            target="_blank"
          >
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

.home-section {
  padding: 4rem 0;
  border-top: 1px solid var(--vp-c-divider);
}

/* ---- CTA Section ---- */
.cta-section {
  text-align: center;
  margin-top: 5rem;
}

.cta-mono-mark {
  width: 7rem;
  height: auto;
  color: var(--vp-c-text-2);
  margin: 0 auto;
  opacity: 0.9;
}

.cta-container h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 2;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: 1px solid var(--vp-button-brand-border);
}

.cta-primary-badge {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
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

@media (max-width: 768px) {
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
