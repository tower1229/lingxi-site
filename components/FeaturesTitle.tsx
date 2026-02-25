"use client";

import { useTranslations } from "next-intl";

export default function FeaturesTitle() {
  const t = useTranslations("Home");
  return (
    <h2 className="text-center text-2xl font-bold text-[var(--text)] sm:text-3xl">
      {t("featuresTitle")}
    </h2>
  );
}
