import { AdaptationCard } from "@/components/product/adaptation-card";
import { ProductCard } from "@/components/ProductCard";
import { BranchMap } from "@/components/sections/branch-map";
import { CtaFooter } from "@/components/sections/cta-footer";
import { HomeHero } from "@/components/sections/home-hero";
import { HomePaths } from "@/components/sections/home-paths";
import { ProductScroller } from "@/components/sections/product-scroller";
import { RecentWorkStrip } from "@/components/sections/recent-work-strip";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getBranches, getReviewsSummary } from "@/lib/data";
import {
  getFeaturedProducts,
  getPopularAdaptations,
} from "@/lib/products";
import { listRecentWork } from "@/lib/recent-work";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Mobility Station | Vehicle Adaptations & Mobility",
  description:
    "Vehicle adaptations and mobility scooters & wheelchairs. Heathrow & Ferndown. Motability accredited. Home demos available.",
  path: "/",
  absoluteTitle: true,
});

export const revalidate = 300;

export default async function HomePage() {
  const [branches, reviewSummary] = await Promise.all([
    getBranches(),
    getReviewsSummary(),
  ]);

  let adaptations: Awaited<ReturnType<typeof getPopularAdaptations>> = [];
  let scooters: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  let recentWork: Awaited<ReturnType<typeof listRecentWork>>["projects"] = [];
  try {
    const [adaptationRows, scooterRows, work] = await Promise.all([
      getPopularAdaptations(14),
      getFeaturedProducts(14),
      listRecentWork({ limit: 6 }),
    ]);
    adaptations = adaptationRows;
    scooters = scooterRows;
    recentWork = work.projects;
  } catch (error) {
    console.error("Homepage catalogue error:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    image: `${SITE.url}/brand/logo-header-v6.png`,
    logo: `${SITE.url}/brand/logo-header-v6.png`,
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
      {/* LCP: first collage tile — static hero, not Vercel-optimised */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-options/06-customer-handover.png"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <HomeHero
        averageRating={reviewSummary.averageRating}
        totalReviews={reviewSummary.totalReviews}
        googleMapsUrl={reviewSummary.googleMapsUrl}
      />
      <TrustStrip />
      <HomePaths />

      <ProductScroller
        title="Popular vehicle adaptations"
        subtitle="Hand controls, hoists and access solutions we fit most often."
        viewAllHref="/vehicle-adaptations"
        viewAllLabel="See all adaptations"
        tone="white"
      >
        {adaptations.map((p) => (
          <AdaptationCard key={p.id} product={p} />
        ))}
      </ProductScroller>

      <ProductScroller
        title="Popular scooters & wheelchairs"
        subtitle="Featured models ready for a home demonstration."
        viewAllHref="/shop"
        viewAllLabel="See all"
        tone="soft"
      >
        {scooters.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ProductScroller>

      <RecentWorkStrip items={recentWork} />

      <BranchMap branches={branches} />
      <Testimonials
        reviews={reviewSummary.reviews}
        averageRating={reviewSummary.averageRating}
        totalReviews={reviewSummary.totalReviews}
        googleMapsUrl={reviewSummary.googleMapsUrl}
        profiles={reviewSummary.profiles}
      />
      <CtaFooter
        title="Book a home demonstration"
        subtitle="Whether you need a vehicle adaptation or a scooter or wheelchair — we come to you from Heathrow or Ferndown."
      />
    </>
  );
}
