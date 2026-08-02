import {
  BrochureShell,
  groupProductsByCategory,
} from "@/components/brochure/brochure-shell";
import { getPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Scooters & wheelchairs brochure",
  description:
    "Downloadable product brochure of Mobility Station scooters and wheelchairs — grouped by category with indicative prices.",
  path: "/brochure/scooters-wheelchairs",
});

export default async function ScootersBrochurePage() {
  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  try {
    products = await getPublishedProducts({ limit: 500, shopOnly: true });
  } catch (error) {
    console.error("Scooters brochure error:", error);
  }

  const generatedLabel = `Updated ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date())}`;

  return (
    <BrochureShell
      title="Scooters & wheelchairs"
      subtitle="Complete catalogue brochure with indicative prices. Book a home or branch demonstration from Heathrow or Ferndown."
      generatedLabel={generatedLabel}
      groups={groupProductsByCategory(products)}
      mode="shop"
    />
  );
}
