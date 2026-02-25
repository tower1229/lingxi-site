import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-[var(--text)]">404</h1>
      <p className="mt-2 text-[var(--text-muted)]">Page not found</p>
      <Link
        href="/"
        className="mt-6 text-[var(--accent)] hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
