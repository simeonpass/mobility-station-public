import { CtaFooter } from "@/components/sections/cta-footer";
import { HomeHero } from "@/components/sections/home-hero";
import { HomePaths } from "@/components/sections/home-paths";
import { HomeFeatured } from "@/components/sections/home-featured";
import { HomeEvidence } from "@/components/sections/home-evidence";
import { HomeProductCard } from "@/components/sections/home-product-card";
import { HomeBranches, HomeMotability } from "@/components/sections/home-community";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getBranches, getReviewsSummary } from "@/lib/data";
import { getFeaturedProducts, getPopularAdaptations } from "@/lib/products";
import { listRecentWork } from "@/lib/recent-work";
import { createMetadata, jsonLdScript, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
export const metadata = createMetadata({ title: "Mobility Station | Vehicle Adaptations & Mobility", description: "Vehicle adaptations and mobility scooters & wheelchairs. Heathrow & Ferndown. Motability accredited. Home and branch demonstrations available.", path: "/", absoluteTitle: true });
export const revalidate = 300;
export default async function HomePage() {
  const evidencePromise = Promise.all([getBranches(), getReviewsSummary(), listRecentWork({ limit: 12 })]);
  let adaptations: Awaited<ReturnType<typeof getPopularAdaptations>> = [];
  let mobility: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  try { [adaptations, mobility] = await Promise.all([getPopularAdaptations(4), getFeaturedProducts(4)]); }
  catch (error) { console.error("Homepage catalogue error:", error); }
  const [branches, reviews, recentWork] = await evidencePromise;
  const installation = recentWork.projects.find(project => ["vehicle-adaptations", "boot-hoists", "driving-controls", "vehicle-access", "wheelchair-stowage"].includes(project.category));
  const jsonLd = [localBusinessJsonLd({ branches, averageRating: reviews.averageRating, totalReviews: reviews.totalReviews }), websiteJsonLd()];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <HomeHero /><TrustStrip reviews={reviews} /><HomePaths />
    <HomeFeatured mobility={mobility.map(product => <HomeProductCard key={product.id} product={product} />)} adaptations={adaptations.map(product => <HomeProductCard key={product.id} product={product} adaptation />)} />
    <HomeEvidence project={installation} reviews={reviews} />
    <HomeMotability /><HomeBranches branches={branches} /><CtaFooter />
  </>;
}
