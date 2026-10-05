import type { Metadata } from "next";
import SharedCheckout from "@/app/checkout/start/page";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ErgoFold secure checkout", robots: { index: false, follow: false }, referrer: "no-referrer", icons: { icon: "/ergofold/favicon.svg" } };
export default async function ErgoFoldCheckout({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return SharedCheckout({ searchParams: Promise.resolve({ ...params, brand: "ergofold" }) });
}
