import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { children: React.ReactNode };

export default async function DocsLayout({ children }: Props) {
  const t = await getTranslations("Docs");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex gap-8">
        <aside className="w-56 shrink-0">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {t("usage")}
            </p>
            <Link
              href="/docs/usage"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("usageHome")}
            </Link>
            <Link
              href="/docs/usage/install"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("install")}
            </Link>
            <Link
              href="/docs/usage/quickstart"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("quickstart")}
            </Link>
            <Link
              href="/docs/usage/commands"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("commands")}
            </Link>
            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {t("technical")}
            </p>
            <Link
              href="/docs/technical"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("technicalHome")}
            </Link>
            <Link
              href="/docs/technical/architecture"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("architecture")}
            </Link>
            <Link
              href="/docs/technical/memory"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("memory")}
            </Link>
            <Link
              href="/docs/technical/contributing"
              className="block rounded px-2 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {t("contributing")}
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
