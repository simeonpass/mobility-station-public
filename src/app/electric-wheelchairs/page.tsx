import { LightweightCollectionPage } from "@/components/lightweight/CollectionPage";
import { getLightweightProducts, isPoweredWheelchair } from "@/lib/lightweight-products";

export const metadata = { title: "Lightweight Electric Wheelchairs", description: "Lightweight and folding electric wheelchairs and powerchairs for travel and everyday independence." };
export const revalidate = 300;

export default async function Page() {
  const products = (await getLightweightProducts()).filter((p) => isPoweredWheelchair(p) && !p.is_discontinued);
  return <LightweightCollectionPage title="Lightweight Electric Wheelchairs" intro="Browse folding electric wheelchairs and powerchairs selected for portability, practical transport and everyday use." products={products} />;
}
