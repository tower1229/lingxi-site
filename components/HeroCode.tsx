"use client";

import { useTranslations } from "next-intl";

export default function HeroCode() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[#1a1a1a] p-4 shadow-xl ring-1 ring-[var(--accent)]/20 sm:p-5">
      <div className="mb-3 flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-muted)]/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-muted)]/50" />
      </div>
      <pre className="overflow-x-auto text-sm text-[var(--text-muted)]">
        <code>
          <span className="text-[var(--accent)]">/req</span>
          <span className="text-[var(--text)]"> 添加用户登录与权限校验</span>
          {"\n"}
          <span className="text-[var(--text-muted)]"># 灵犀 · 需求 → 规划 → 构建 → 审查</span>
        </code>
      </pre>
    </div>
  );
}
