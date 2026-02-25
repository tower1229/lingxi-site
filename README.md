# LingXi 官方站点

灵犀（LingXi）官方站点，基于 Next.js 搭建，为落地页与文档子站做准备。

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

当前为空白占位站点，首页仅展示「LingXi · 官网即将上线」。下一步将实现：

- 中英双语（next-intl、proxy.ts、`[locale]` 路由）
- 落地页与文档子站
- 静态导出与 Vercel 部署

## 许可

与灵犀主仓一致。
