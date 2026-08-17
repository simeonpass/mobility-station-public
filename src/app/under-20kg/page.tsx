import { LightweightCollectionPage } from "@/components/lightweight/CollectionPage";
import { getLightweightProducts, underWeight } from "@/lib/lightweight-products";

export const metadata = { title: "Mobility Products Under 20kg", description: "Ultra-lightweight mobility scooters and electric wheelchairs weighing 20kg or less." };
export const revalidate = 300;

export default async function Page() {
  const products = (await getLightweightProducts()).filter((p) => underWeight(p, 20) && !p.is_discontinued);
  return <LightweightCollectionPage title="Mobility Products Under 20kg" intro="Our lightest published scooters and powerchairs, using the product weight recorded in our live catalogue." products={products} />;
}
