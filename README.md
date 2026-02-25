# LingXi 官方站点

灵犀（LingXi）项目的官方网站，基于 Next.js 搭建。

## 定位与范围

- **产品宣传**：面向 Cursor 用户的落地页，突出灵犀的价值、工作流与「心有灵犀」的记忆能力。
- **设计感**：视觉与交互强调品牌与产品调性，符合技术产品官网的审美与体验预期。
- **文档**：包含技术项目应有的内容：
  - **使用文档**：安装、快速开始、命令说明（/req、/plan、/build、/review、/remember、/init 等）、典型工作流。
  - **技术文档**：架构概览、核心机制（记忆系统、Skills/Commands）、目录结构、扩展与贡献指引等。
- **中英双语**：全站支持中文与英文，URL 与内容按语言切换（如 `/zh`、`/en`）。

## 技术栈

- **Next.js 16** — App Router、Turbopack 默认、TypeScript
- **Tailwind CSS v4** — 样式（CSS-first、自动 content 检测）
- **React 19** — 运行时
- **ESLint 9** — 代码检查

## 开发

```bash
# 安装依赖
yarn install

# 本地开发（Turbopack）
yarn dev

# 构建
yarn build

# 预览生产构建
yarn start
```

## 当前状态

当前为空白占位站点，首页仅展示「LingXi · 官网即将上线」。待实现：

- 中英双语（next-intl、proxy.ts、`[locale]` 路由）
- 产品落地页与文档子站（使用文档 + 技术文档）
- 统一的设计语言与组件
- 静态导出与 Vercel 部署

## 许可

与灵犀主仓一致。
