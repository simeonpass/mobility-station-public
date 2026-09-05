import { AdaptationCard } from "@/components/product/adaptation-card";
import { ProductCard } from "@/components/ProductCard";
import { BranchMap } from "@/components/sections/branch-map";
import { CtaFooter } from "@/components/sections/cta-footer";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeNeeds } from "@/components/sections/home-needs";
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
import { createMetadata, jsonLdScript, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";

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
      getPopularAdaptations(6),
      getFeaturedProducts(6),
      listRecentWork({ limit: 6 }),
    ]);
    adaptations = adaptationRows;
    scooters = scooterRows;
    recentWork = work.projects;
  } catch (error) {
    console.error("Homepage catalogue error:", error);
  }

  const jsonLd = [
    localBusinessJsonLd({
      branches,
      averageRating: reviewSummary.averageRating,
      totalReviews: reviewSummary.totalReviews,
    }),
    websiteJsonLd(),
  ];

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/hero-options/06-customer-handover.webp"
        type="image/webp"
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
      <HomeNeeds />

      <ProductScroller
        title="Popular vehicle adaptations"
        subtitle="A few of the solutions we fit most often. If you are unsure what you need, start with the problem above."
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
        subtitle="A smaller selection of popular models, with the full range available in the shop."
        viewAllHref="/shop"
        viewAllLabel="Shop all mobility"
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
        title="Not sure what you need? Talk to someone who does."
        subtitle="Our teams at Heathrow and Ferndown can help with vehicle adaptations, scooters, wheelchairs, demonstrations, servicing and repairs."
      />
    </>
  );
}
