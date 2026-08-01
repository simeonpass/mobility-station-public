import { BranchMap } from "@/components/sections/branch-map";
import { CtaFooter } from "@/components/sections/cta-footer";
import { HomeHero } from "@/components/sections/home-hero";
import { RecentWorkStrip } from "@/components/sections/recent-work-strip";
import { Testimonials } from "@/components/sections/testimonials";
import { getBranches, getPublicPortfolio, getReviews } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Mobility Station | Adaptations & Mobility — Greater London & the South",
  description:
    "Vehicle adaptations or scooters & wheelchairs — choose your path. Motability & private from Heathrow and Ferndown across Greater London and the South.",
  path: "/",
  absoluteTitle: true,
});

export const revalidate = 300;

export default async function HomePage() {
  const [branches, reviews] = await Promise.all([
    getBranches(),
    getReviews(),
  ]);

  let portfolio: Awaited<ReturnType<typeof getPublicPortfolio>> = [];
  try {
    portfolio = await getPublicPortfolio(6);
  } catch (error) {
    console.error("Homepage portfolio error:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    areaServed: "GB",
    address: branches.map((b) => ({
      "@type": "PostalAddress",
      streetAddress: [b.addressLine1, b.addressLine2].filter(Boolean).join(", "),
      addressLocality: b.addressLocality,
      postalCode: b.postalCode,
      addressCountry: "GB",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <HomeHero />

      <RecentWorkStrip items={portfolio} />

      <BranchMap branches={branches} />
      <Testimonials reviews={reviews} />
      <CtaFooter
        title="Not sure which side you need?"
        subtitle="Request a callback — we’ll point you to vehicle adaptations or scooters & wheelchairs."
      />
    </>
  );
}
