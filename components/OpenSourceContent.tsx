"use client";

import { useTranslations } from "next-intl";

export default function OpenSourceContent() {
  const t = useTranslations("Home");
  const tNav = useTranslations("Nav");

  return (
    <>
      <h2 className="text-2xl font-bold text-[var(--text)]">{t("openSourceTitle")}</h2>
      <p className="mt-3 text-[var(--text-muted)]">{t("openSourceDesc")}</p>
      <a
        href="https://github.com/tower1229/LingXi"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-lg border border-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
      >
        {tNav("contribute")}
      </a>
    </>
  );
}
