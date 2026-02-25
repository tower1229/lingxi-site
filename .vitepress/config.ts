import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '灵犀 LingXi',
  description: '灵犀（LingXi）项目的官方网站',
  lang: 'zh-CN',

  appearance: true,
  lastUpdated: true,

  // 中英双语：root = 简体中文，en = English
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '灵犀 LingXi',
      description: '灵犀（LingXi）项目的官方网站',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '介绍',
              items: [
                { text: '什么是灵犀', link: '/guide/what-is-lingxi' },
              ],
            },
          ],
        },
        footer: {
          message: '基于 MIT 许可发布',
          copyright: 'Copyright © 灵犀 LingXi',
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
      description: 'Smart workflow & memory for Cursor',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Introduction',
              items: [
                { text: 'What is LingXi', link: '/en/guide/what-is-lingxi' },
              ],
            },
          ],
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © LingXi',
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
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
