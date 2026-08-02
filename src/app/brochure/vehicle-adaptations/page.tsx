import {
  BrochureShell,
  groupProductsByCategory,
} from "@/components/brochure/brochure-shell";
import { getAdaptationProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Vehicle adaptations brochure",
  description:
    "Downloadable brochure of Mobility Station vehicle adaptations — supplied & fitted prices and Motability advance payments where available.",
  path: "/brochure/vehicle-adaptations",
});

export default async function AdaptationsBrochurePage() {
  let products: Awaited<ReturnType<typeof getAdaptationProducts>> = [];
  try {
    products = await getAdaptationProducts({ limit: 500 });
  } catch (error) {
    console.error("Adaptations brochure error:", error);
  }

  const generatedLabel = `Updated ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date())}`;

  return (
    <BrochureShell
      title="Vehicle adaptations"
      subtitle="Supplied & fitted catalogue brochure. Every adaptation is quoted against your specific vehicle before work is booked."
      generatedLabel={generatedLabel}
      groups={groupProductsByCategory(products)}
      mode="adaptation"
    />
  );
}
