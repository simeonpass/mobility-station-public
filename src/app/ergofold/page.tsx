import type { Metadata } from "next";
import { ErgoFoldStore, type ErgoPackage } from "@/components/ergofold/ergofold-store";
import { getProductBySlug, priceWithVariants } from "@/lib/products";
import "./ergofold.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "ErgoFold Elite | Premium Folding Electric Wheelchair from £995" },
  description: "Meet ErgoFold Elite. Three driving modes, compact folding and a choice of one, two or three batteries. From £995 with VAT relief. Free UK delivery and Mobility Station support.",
  alternates: {canonical:"https://ergofold.co.uk"},
  icons: {icon:"/ergofold/favicon.svg"},
  openGraph: {title:"ErgoFold Elite — Life’s out there. Go get it.",description:"Premium folding electric wheelchair from £995 with VAT relief.",siteName:"ErgoFold Elite",images:[]},
  twitter: {card:"summary",images:[]},
};
const offers: ErgoPackage[] = [
  {batteries:1,price:995,was:1995,variantId:"0369d1b4-c082-466b-aa62-6de1473acb76"},
  {batteries:2,price:1249,was:2249,variantId:"48c7dc5c-4150-419b-8fc5-976fd25257ca"},
  {batteries:3,price:1495,was:2495,variantId:"ac5b48e2-2b7d-481b-bea7-34d45bcabb49"},
];
export default async function ErgoFoldPage() {
  const product = await getProductBySlug("ergofold-folding-power-chair").catch(()=>null);
  const available = !!product && !product.is_discontinued && (!product.track_stock || Number(product.quantity)>0) && offers.every(o=>{
    const variant = product.variants.find(v=>v.id===o.variantId);
    return variant && priceWithVariants(product,[variant]).current === o.price;
  });
  return <ErgoFoldStore productId={product?.id || "bcabc0e5-eba0-4c7f-9b75-19d78010be9b"} packages={offers} available={available}/>;
}
