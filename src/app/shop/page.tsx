import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopBrowser } from "@/components/product/shop-browser";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { JourneyCards } from "@/components/sections/journey-cards";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getCategories, getPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { SHOP_PAGE_SIZE, filterShopProducts, parseShopFilters, shopManufacturers } from "@/lib/shop-catalogue";
export const revalidate = 300;
export const metadata = createMetadata({ title: "Shop scooters, wheelchairs & more", description: "Browse mobility scooters, powered wheelchairs and more. Talk to our team about choosing the right equipment and demonstration options.", path: "/shop" });
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
    <CatalogIntro tone="soft" breadcrumb="Scooters & wheelchairs" eyebrow="Everyday freedom, your way" title={<>Mobility scooters<br />&amp; wheelchairs.</>} subtitle="Find the right equipment for your life, with clear product information and personal advice. Browse the range or talk to us about trying before you buy." primary={{ href: "#catalogue", label: "Browse the range" }} secondary={{ href: "/book-a-demo", label: "Arrange a demonstration" }} image={{ src: "/images/redesign/scooter.webp", alt: "Mobility scooter demonstration" }} />
    <JourneyCards division="shop" />
    <TrustStrip />
    <section id="catalogue" className="container-site ms-section scroll-under-header"><div className="ms-section-heading"><div><p className="ms-eyebrow">Let us find your fit</p><h2>Explore our mobility range</h2></div><Link href="/clearance" className="ms-clearance-link">Shop clearance offers &rarr;</Link></div>
      {errorMessage ? <p role="status">{errorMessage}</p> : <Suspense fallback={<p role="status">Loading products...</p>}><ShopBrowser visibleCount={page.length} totalCount={filtered.length} catalogueSize={catalogue.length} categories={categories} manufacturers={shopManufacturers(catalogue)} filters={filters}>{page.map(product => <ProductCard key={product.id} product={product} compare />)}</ShopBrowser></Suspense>}
    </section>
    <CtaFooter title="Find the right fit for your everyday." subtitle="Our team can help you compare the options and arrange a demonstration." />
  </>;
}
