"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HeroContent() {
  const t = useTranslations("Home");
  const tNav = useTranslations("Nav");

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
        {t("heroTitle")}
      </h1>
      <p className="mt-4 text-lg text-[var(--text-muted)]">
        {t("heroSubtitle")}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/docs/usage/quickstart"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          {tNav("getStarted")}
        </Link>
        <Link
          href="/docs/usage"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
        >
          {tNav("viewDocs")}
        </Link>
      </div>
    </>
  );
}
