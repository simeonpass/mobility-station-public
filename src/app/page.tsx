import { HomeCta } from "@/components/sections/home-cta";
import { HomeHero } from "@/components/sections/home-hero";
import { HomePaths } from "@/components/sections/home-paths";
import { TrustStrip } from "@/components/sections/trust-strip";
import { HomeRecentWork } from "@/components/sections/home-recent-work";
import { getBranches, getReviewsSummary } from "@/lib/data";
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
  const [branches, reviewSummary, work] = await Promise.all([
    getBranches(),
    getReviewsSummary(),
    listRecentWork({ limit: 3 }).catch(() => ({ projects: [] })),
  ]);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <HomeHero />
      <HomePaths />
      <TrustStrip />
      <HomeRecentWork items={work.projects} />
      <HomeCta />
    </>
  );
}
