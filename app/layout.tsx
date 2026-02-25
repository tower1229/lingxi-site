import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LingXi",
  description: "灵犀官方站点 — 心有灵犀的 Cursor 工作流",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
