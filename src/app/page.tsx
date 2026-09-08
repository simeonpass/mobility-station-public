import { CtaFooter } from "@/components/sections/cta-footer";
import { HomeHero } from "@/components/sections/home-hero";
import { HomePaths } from "@/components/sections/home-paths";
import { HomeFeatured } from "@/components/sections/home-featured";
import { HomeProductCard } from "@/components/sections/home-product-card";
import { HomeBranches, HomeMotability } from "@/components/sections/home-community";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getBranches, getReviewsSummary } from "@/lib/data";
import { getFeaturedProducts, getPopularAdaptations } from "@/lib/products";
import { createMetadata, jsonLdScript, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
export const metadata = createMetadata({ title: "Mobility Station | Vehicle Adaptations & Mobility", description: "Vehicle adaptations and mobility scooters & wheelchairs. Heathrow & Ferndown. Motability accredited. Home and branch demonstrations available.", path: "/", absoluteTitle: true });
export const revalidate = 300;
export default async function HomePage() {
  const [branches, reviews] = await Promise.all([getBranches(), getReviewsSummary()]);
  let adaptations: Awaited<ReturnType<typeof getPopularAdaptations>> = [];
  let mobility: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  try { [adaptations, mobility] = await Promise.all([getPopularAdaptations(4), getFeaturedProducts(4)]); }
  catch (error) { console.error("Homepage catalogue error:", error); }
  const jsonLd = [localBusinessJsonLd({ branches, averageRating: reviews.averageRating, totalReviews: reviews.totalReviews }), websiteJsonLd()];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <HomeHero /><TrustStrip /><HomePaths />
    <HomeFeatured mobility={mobility.map(product => <HomeProductCard key={product.id} product={product} />)} adaptations={adaptations.map(product => <HomeProductCard key={product.id} product={product} adaptation />)} />
    <HomeMotability /><HomeBranches branches={branches} /><CtaFooter />
  </>;
}
