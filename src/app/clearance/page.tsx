import { LightweightCollectionPage } from "@/components/lightweight/CollectionPage";
import { getLightweightProducts } from "@/lib/lightweight-products";

export const metadata = { title: "Lightweight Mobility Clearance", description: "Reduced lightweight scooters and electric wheelchairs from our current published catalogue." };
export const revalidate = 300;

export default async function Page() {
  const products = (await getLightweightProducts()).filter((p) => p.sale_price != null && !p.is_discontinued);
  return <LightweightCollectionPage title="Clearance" intro="Current reductions across our lightweight mobility range. Availability and prices come directly from the live catalogue." products={products} />;
}
