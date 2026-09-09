import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopBrowser } from "@/components/product/shop-browser";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getCategories, getPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { SHOP_PAGE_SIZE, filterShopProducts, parseShopFilters, shopManufacturers } from "@/lib/shop-catalogue";
export const revalidate = 300;
export const metadata = createMetadata({ title: "Shop scooters, wheelchairs & more", description: "Browse mobility scooters, powered wheelchairs and more. Home and branch demonstrations from Heathrow and Ferndown.", path: "/shop" });
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default async function ShopPage({ searchParams }: Props) {
  const filters = parseShopFilters(await searchParams);
  let catalogue: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let errorMessage: string | null = null;
  try { [catalogue, categories] = await Promise.all([getPublishedProducts({ limit: 500, shopOnly: true }), getCategories({ shopOnly: true })]); }
  catch (error) { console.error("Shop catalog error:", error); errorMessage = "We could not load the product catalogue right now. Please try again shortly or contact our team."; }
  const filtered = filterShopProducts(catalogue, filters);
  const page = filtered.slice(0, filters.page * SHOP_PAGE_SIZE);
  return <>
    <CatalogIntro tone="soft" breadcrumb="Scooters & wheelchairs" eyebrow="Your everyday, opened up." title={<>A little more<br />freedom to explore.</>} subtitle="Lightweight for your next getaway. Comfortable for the everyday. Find the scooter or wheelchair that fits your life, with a little help from our team." primary={{ href: "/book-a-demo", label: "Try it with a demonstration" }} image={{ src: "/images/redesign/scooter.webp", alt: "Mobility scooter demonstration" }} />
    <TrustStrip />
    <section id="catalogue" className="container-site ms-section scroll-under-header"><div className="ms-section-heading"><div><p className="ms-eyebrow">Let’s find your fit</p><h2>Explore our mobility range</h2></div><Link href="/clearance" className="ms-clearance-link">Shop clearance offers ↗</Link></div>
    {errorMessage ? <p>{errorMessage}</p> : <Suspense fallback={<p>Loading products…</p>}><ShopBrowser visibleCount={page.length} totalCount={filtered.length} catalogueSize={catalogue.length} categories={categories} manufacturers={shopManufacturers(catalogue)} filters={filters}>{page.map(product => <ProductCard key={product.id} product={product} compare />)}</ShopBrowser></Suspense>}
    </section><CtaFooter />
  </>;
}
