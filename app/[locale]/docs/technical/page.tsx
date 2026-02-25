import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function TechnicalHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Docs");

  return (
    <article>
      <h1 className="text-3xl font-bold text-[var(--text)]">{t("technicalHome")}</h1>
      <p className="mt-4 text-[var(--text-muted)]">{t("comingSoon")}</p>
      <ul className="mt-6 space-y-2">
        <li>
          <Link href="/docs/technical/architecture" className="text-[var(--accent)] hover:underline">
            {t("architecture")}
          </Link>
        </li>
        <li>
          <Link href="/docs/technical/memory" className="text-[var(--accent)] hover:underline">
            {t("memory")}
          </Link>
        </li>
        <li>
          <Link href="/docs/technical/contributing" className="text-[var(--accent)] hover:underline">
            {t("contributing")}
          </Link>
        </li>
      </ul>
    </article>
  );
}
