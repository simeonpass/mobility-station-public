import { LightweightCollectionPage } from "@/components/lightweight/CollectionPage";
import { getLightweightProducts } from "@/lib/lightweight-products";

export const metadata = { title: "Folding Mobility Scooters", description: "Folding mobility scooters designed for easier car-boot transport and travel." };
export const revalidate = 300;

export default async function Page() {
  const products = (await getLightweightProducts()).filter((p) => p.category === "Folding Mobility Scooters" && !p.is_discontinued);
  return <LightweightCollectionPage title="Folding Mobility Scooters" intro="Folding and travel scooters chosen for simple transport, with real weights and prices from our live catalogue." products={products} />;
}
