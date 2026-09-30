import { HomeEvidence } from "@/components/sections/home-evidence";
import { HomeBranches } from "@/components/sections/home-community";
import { GatewayHero, HomeRoutes, SplitCta } from "@/components/sections/home-gateway";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getBranches, getReviewsSummary } from "@/lib/data";
import { listRecentWork } from "@/lib/recent-work";
import { createMetadata, jsonLdScript, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
export const metadata = createMetadata({ title: "Mobility Station | Vehicle Adaptations & Mobility", description: "Vehicle adaptations and mobility scooters & wheelchairs. Heathrow & Ferndown. Motability accredited. Home and branch demonstrations available.", path: "/", absoluteTitle: true });
export const revalidate = 300;
export default async function HomePage() {
  const [branches, reviews, recentWork] = await Promise.all([getBranches(), getReviewsSummary(), listRecentWork({ limit: 12 })]);
  const installation = recentWork.projects.find(project => ["vehicle-adaptations", "boot-hoists", "driving-controls", "vehicle-access", "wheelchair-stowage"].includes(project.category));
  const jsonLd = [localBusinessJsonLd({ branches, averageRating: reviews.averageRating, totalReviews: reviews.totalReviews }), websiteJsonLd()];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <GatewayHero />
    <HomeRoutes />
    <TrustStrip reviews={reviews} />
    <HomeEvidence project={installation} reviews={reviews} />
    <HomeBranches branches={branches} />
    <SplitCta />
  </>;
}
