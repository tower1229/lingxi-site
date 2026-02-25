import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import HeroCode from "@/components/HeroCode";
import HeroContent from "@/components/HeroContent";
import FeaturesTitle from "@/components/FeaturesTitle";
import OpenSourceContent from "@/components/OpenSourceContent";
import CTABanner from "@/components/CTABanner";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <OpenSourceSection />
      <CTABanner />
      <Footer />
    </>
  );
}

function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div>
          <HeroContent />
        </div>
        <div className="relative">
          <HeroCode />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)]/50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FeaturesTitle />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard slug="feature1" />
          <FeatureCard slug="feature2" />
          <FeatureCard slug="feature3" />
          <FeatureCard slug="feature4" />
        </div>
      </div>
    </section>
  );
}

async function FeatureCard({ slug }: { slug: "feature1" | "feature2" | "feature3" | "feature4" }) {
  const t = await getTranslations("Home");
  const titleKey = `${slug}Title` as const;
  const descKey = `${slug}Desc` as const;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/20">
        <span className="font-bold text-[var(--accent)]">L</span>
      </div>
      <h3 className="font-semibold text-[var(--text)]">{t(titleKey)}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{t(descKey)}</p>
    </div>
  );
}

function OpenSourceSection() {
  return (
    <section className="border-t border-[var(--border)] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <OpenSourceContent />
          </div>
          <div className="flex justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10">
              <span className="text-4xl font-bold text-[var(--accent)]">L</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
