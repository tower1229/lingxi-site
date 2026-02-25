import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("Nav");
  const tHome = await getTranslations("Home");

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold text-[var(--text)]">{tHome("footerLingxi")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/docs/usage" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">
                  {t("guide")}
                </Link>
              </li>
              <li>
                <Link href="/docs/technical" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">
                  {t("docs")}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/tower1229/LingXi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  {t("contribute")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text)]">{tHome("footerResources")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-[var(--text-muted)]">{t("roadmap")}</span>
              </li>
              <li>
                <span className="text-sm text-[var(--text-muted)]">{t("team")}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text)]">{tHome("footerSocial")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://github.com/tower1229/LingXi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  {t("github")}
                </a>
              </li>
              <li>
                <span className="text-sm text-[var(--text-muted)]">{t("discord")}</span>
              </li>
              <li>
                <span className="text-sm text-[var(--text-muted)]">{t("x")}</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--text-muted)]">
          {tHome("copyright")}
        </p>
      </div>
    </footer>
  );
}
