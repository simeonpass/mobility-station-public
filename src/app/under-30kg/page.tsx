import { LightweightCollectionPage } from "@/components/lightweight/CollectionPage";
import { getLightweightProducts, underWeight } from "@/lib/lightweight-products";

export const metadata = { title: "Mobility Products Under 30kg", description: "Lightweight mobility scooters and electric wheelchairs weighing 30kg or less." };
export const revalidate = 300;

export default async function Page() {
  const products = (await getLightweightProducts()).filter((p) => underWeight(p, 30) && !p.is_discontinued);
  return <LightweightCollectionPage title="Mobility Products Under 30kg" intro="Our broader portable range up to 30kg, ideal for comparing car-boot-friendly scooters and folding powerchairs." products={products} />;
}
