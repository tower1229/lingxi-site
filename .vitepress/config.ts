import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/', // Vercel 或子域名下为根路径；若用 xxx.github.io/lingxi-site 则改为 '/lingxi-site/'
  title: '灵犀 LingXi',
  description: '面向 Codex 和 Claude Code 的工程工作流产品',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo-mono.svg' }],
    ['link', { rel: 'shortcut icon', href: '/assets/logo-mono.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/assets/logo-mono.svg' }],
  ],

  appearance: true,
  lastUpdated: true,
  ignoreDeadLinks: [
    /localhost/,
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '灵犀 LingXi',
      description: '面向 Codex 和 Claude Code 的工程工作流产品',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '命令参考', link: '/guide/commands-reference' },
          { text: 'FAQ', link: '/guide/faq' },
          { text: '反馈', link: 'https://github.com/tower1229/LingXi/issues', target: '_blank' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '介绍',
              items: [
                { text: '什么是灵犀', link: '/guide/what-is-lingxi' },
                { text: '快速开始', link: '/guide/quick-start' },
              ],
            },
            {
              text: '深入了解',
              items: [
                { text: '核心工作流', link: '/guide/core-workflow' },
                { text: '记忆系统', link: '/guide/memory-system' },
              ],
            },
            {
              text: '参考',
              items: [
                { text: '工程品味提炼与裁决', link: '/guide/taste-extraction-and-adjudication' },
                { text: '记忆治理与写入', link: '/guide/memory-governance-and-write' },
                { text: '命令参考', link: '/guide/commands-reference' },
                { text: 'FAQ', link: '/guide/faq' },
              ],
            },
          ],
        },
        footer: {
          message: 'MIT 许可证 · 版本与反馈见 GitHub',
          copyright: '© 2025–2026 taozang (灵犀 LingXi)',
        },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: {
          text: '更新时间',
          formatOptions: { dateStyle: 'short', timeStyle: 'short' },
        },
        darkModeSwitchLabel: '外观',
        sidebarMenuLabel: '目录',
        returnToTopLabel: '回到顶部',
        outline: { label: '本页目录', level: 'deep' as const },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'LingXi',
      description: 'Engineering workflow for Codex and Claude Code with durable memory',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Quick Start', link: '/en/guide/quick-start' },
          { text: 'Commands Reference', link: '/en/guide/commands-reference' },
          { text: 'FAQ', link: '/en/guide/faq' },
          { text: 'Feedback', link: 'https://github.com/tower1229/LingXi/issues', target: '_blank' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Introduction',
              items: [
                { text: 'What is LingXi', link: '/en/guide/what-is-lingxi' },
                { text: 'Quick Start', link: '/en/guide/quick-start' },
              ],
            },
            {
              text: 'Deep Dive',
              items: [
                { text: 'Core Workflow', link: '/en/guide/core-workflow' },
                { text: 'Memory System', link: '/en/guide/memory-system' },
              ],
            },
            {
              text: 'Reference',
              items: [
                { text: 'Engineering Taste Extraction and Adjudication', link: '/en/guide/taste-extraction-and-adjudication' },
                { text: 'Memory Governance and Write', link: '/en/guide/memory-governance-and-write' },
                { text: 'Commands Reference', link: '/en/guide/commands-reference' },
                { text: 'FAQ', link: '/en/guide/faq' },
              ],
            },
          ],
        },
        footer: {
          message: 'MIT License · Releases & feedback on GitHub',
          copyright: '© 2025–2026 taozang (LingXi)',
        },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdated: {
          text: 'Updated',
          formatOptions: { dateStyle: 'short', timeStyle: 'short' },
        },
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Back to top',
        outline: { label: 'On this page', level: 'deep' as const },
      },
    },
  },

  themeConfig: {
    logo: {
      light: '/assets/logo-primary.svg',
      dark: '/assets/logo-primary.svg',
      alt: 'LingXi',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tower1229/LingXi' },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '输入',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
          en: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results',
                footer: {
                  selectText: 'to select',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'to navigate',
                  navigateUpKeyAriaLabel: 'up arrow',
                  navigateDownKeyAriaLabel: 'down arrow',
                  closeText: 'to close',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
        },
      },
    },
  },
})
