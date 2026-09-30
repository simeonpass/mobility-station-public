import { ClearChoiceHome } from "@/components/sections/clear-choice-home";
import { getBranches, getReviewsSummary } from "@/lib/data";
import { createMetadata, jsonLdScript, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
export const metadata = createMetadata({ title: "Mobility Station | Vehicle Adaptations & Mobility", description: "Expert vehicle adaptations, mobility scooters and wheelchairs. Choose your next step with our Heathrow and Ferndown teams.", path: "/", absoluteTitle: true });
export const revalidate = 300;
export default async function HomePage() {
  const [branches, reviews] = await Promise.all([getBranches(), getReviewsSummary()]);
  const jsonLd = [localBusinessJsonLd({ branches, averageRating: reviews.averageRating, totalReviews: reviews.totalReviews }), websiteJsonLd()];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} /><ClearChoiceHome branches={branches} reviews={reviews} /></>;
}
