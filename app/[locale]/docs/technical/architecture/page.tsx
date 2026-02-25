import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function ArchitecturePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Docs");

  return (
    <article>
      <h1 className="text-3xl font-bold text-[var(--text)]">{t("architecture")}</h1>
      <p className="mt-4 text-[var(--text-muted)]">{t("comingSoon")}</p>
    </article>
  );
}
