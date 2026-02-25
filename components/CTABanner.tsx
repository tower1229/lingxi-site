"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function CTABanner() {
  const t = useTranslations("Home");
  const tNav = useTranslations("Nav");

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/90 via-[var(--accent)] to-[var(--accent)]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("ctaTitle")}</h2>
        <p className="mt-2 text-white/90">{t("ctaSubtitle")}</p>
        <Link
          href="/docs/usage"
          className="mt-6 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-[var(--bg)] hover:bg-white/90"
        >
          {tNav("learnMore")}
        </Link>
      </div>
    </section>
  );
}
