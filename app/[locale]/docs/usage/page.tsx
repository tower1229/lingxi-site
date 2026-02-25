import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function UsageHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Docs");

  return (
    <article>
      <h1 className="text-3xl font-bold text-[var(--text)]">{t("usageHome")}</h1>
      <p className="mt-4 text-[var(--text-muted)]">{t("comingSoon")}</p>
      <ul className="mt-6 space-y-2">
        <li>
          <Link href="/docs/usage/install" className="text-[var(--accent)] hover:underline">
            {t("install")}
          </Link>
        </li>
        <li>
          <Link href="/docs/usage/quickstart" className="text-[var(--accent)] hover:underline">
            {t("quickstart")}
          </Link>
        </li>
        <li>
          <Link href="/docs/usage/commands" className="text-[var(--accent)] hover:underline">
            {t("commands")}
          </Link>
        </li>
      </ul>
    </article>
  );
}
