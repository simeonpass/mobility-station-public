import { LightweightCollectionPage } from "@/components/lightweight/CollectionPage";
import { getLightweightProducts, isScooter } from "@/lib/lightweight-products";

export const metadata = { title: "Lightweight Mobility Scooters", description: "Lightweight and folding mobility scooters for easier lifting, car-boot transport and travel." };
export const revalidate = 300;

export default async function Page() {
  const products = (await getLightweightProducts()).filter((p) => isScooter(p) && !p.is_discontinued);
  return <LightweightCollectionPage title="Lightweight Mobility Scooters" intro="Compare folding, boot and travel-friendly mobility scooters with real product weights, prices and published delivery information." products={products} />;
}
