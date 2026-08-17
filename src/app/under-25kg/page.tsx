import { LightweightCollectionPage } from "@/components/lightweight/CollectionPage";
import { getLightweightProducts, underWeight } from "@/lib/lightweight-products";

export const metadata = { title: "Mobility Products Under 25kg", description: "Lightweight mobility scooters and electric wheelchairs weighing 25kg or less." };
export const revalidate = 300;

export default async function Page() {
  const products = (await getLightweightProducts()).filter((p) => underWeight(p, 25) && !p.is_discontinued);
  return <LightweightCollectionPage title="Mobility Products Under 25kg" intro="Portable scooters and powerchairs up to 25kg, using the product weights stored in our live catalogue." products={products} />;
}
