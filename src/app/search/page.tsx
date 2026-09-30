import Link from "next/link";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { ProductCard } from "@/components/ProductCard";
import { SearchForm } from "@/components/layout/search-form";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { searchProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
export const revalidate = 300;
type Props = { searchParams: Promise<{ q?: string; type?: string }> };
export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  return createMetadata({ title: query ? `Search results for "${query}"` : "Search", description: "Search mobility scooters, wheelchairs and vehicle adaptations from Mobility Station.", path: "/search", noIndex: true });
}
export default async function SearchPage({ searchParams }: Props) {
  const { q, type } = await searchParams;
  const query = (q ?? "").trim();
  const filter = type === "shop" || type === "adaptations" ? type : "all";
  let results: Awaited<ReturnType<typeof searchProducts>> | null = null;
  let errorMessage: string | null = null;
  if (query) {
    try { results = await searchProducts(query); }
    catch (error) { console.error("Search error:", error); errorMessage = "We could not run that search right now. Please try again shortly or request a callback."; }
  }
  const shop = results?.shop ?? [];
  const adaptations = results?.adaptations ?? [];
  const showShop = filter === "all" || filter === "shop";
  const showAdaptations = filter === "all" || filter === "adaptations";
  const compact = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const queryCompact = compact(query);
  const shopHitsPhrase = Boolean(shop[0] && queryCompact && compact(shop[0].name).includes(queryCompact));
  const adaptationsHitPhrase = Boolean(adaptations[0] && queryCompact && compact(adaptations[0].name).includes(queryCompact));
  const adaptationsFirst = filter === "adaptations" || (filter === "all" && adaptations.length > 0 && (adaptationsHitPhrase || !shopHitsPhrase));
  const tabs = [{ id: "all", label: "All results", count: shop.length + adaptations.length }, { id: "shop", label: "Scooters & wheelchairs", count: shop.length }, { id: "adaptations", label: "Vehicle adaptations", count: adaptations.length }];
  const shopSection = showShop && shop.length > 0 ? <section data-division="shop" key="shop" className="mb-12"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl md:text-3xl">Scooters &amp; wheelchairs</h2><Link href="/shop" className="ms-text-link">Browse all</Link></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">{shop.map(product => <ProductCard key={product.id} product={product} />)}</div></section> : null;
  const adaptationSection = showAdaptations && adaptations.length > 0 ? <section data-division="adapt" key="adaptations" className="mb-12"><div className="mb-6"><div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl md:text-3xl">Vehicle adaptations</h2><Link href="/vehicle-adaptations" className="ms-text-link">Browse all</Link></div><p className="mt-2 max-w-2xl text-sm text-muted">Supplied and fitted at Heathrow or Ferndown. Compatibility and a firm quotation are confirmed against your vehicle.</p></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">{adaptations.map(product => <AdaptationCard key={product.id} product={product} />)}</div></section> : null;
  return <>
    <CatalogIntro breadcrumb="Search" eyebrow={filter === "adaptations" ? "Vehicle adaptations" : filter === "shop" ? "Scooters & wheelchairs" : "Find your next step"} title={query ? <>Results for &ldquo;{query}&rdquo;</> : "Find what you need."} subtitle="Search by product, brand or category. You can switch between the two catalogues below." primaryAction={<div className="w-full max-w-2xl"><SearchForm key={`${filter}:${query}`} defaultValue={query} type={filter} autoFocus={!query} /></div>} />
    <div className="container-site py-7 md:py-10">
      {errorMessage ? <p role="status" className="msx-form-panel">{errorMessage}</p> : !query ? <div className="msx-form-panel"><h2 className="text-xl">Popular searches</h2><ul className="mt-5 flex flex-wrap gap-3">{["Jeff Gosling", "hand controls", "boot hoist", "folding scooter", "swivel seat", "powered wheelchair"].map(suggestion => <li key={suggestion}><Link href={`/search?q=${encodeURIComponent(suggestion)}`} className="ms-button ms-button-secondary">{suggestion}</Link></li>)}</ul></div> : results && results.total === 0 ? <div className="msx-form-panel"><h2 className="text-xl">No matches for &ldquo;{query}&rdquo;</h2><p className="mt-3 text-muted">Check the spelling, try a shorter term, or browse our catalogues.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/shop" className="ms-button">Browse mobility</Link><Link href="/vehicle-adaptations" className="ms-button ms-button-secondary">Vehicle adaptations</Link></div></div> : <>
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Filter results by catalogue">{tabs.map(tab => <Link key={tab.id} href={`/search?q=${encodeURIComponent(query)}${tab.id === "all" ? "" : `&type=${tab.id}`}`} aria-current={filter === tab.id ? "page" : undefined} className={`ms-button ${filter === tab.id ? "" : "ms-button-secondary"}`}>{tab.label} ({tab.count})</Link>)}</nav>
        {adaptationsFirst ? [adaptationSection, shopSection] : [shopSection, adaptationSection]}
        {filter === "shop" && shop.length === 0 ? <p role="status" className="msx-form-panel">No scooters or wheelchairs matched &ldquo;{query}&rdquo;. Try All results or another search.</p> : null}
        {filter === "adaptations" && adaptations.length === 0 ? <p role="status" className="msx-form-panel">No vehicle adaptations matched &ldquo;{query}&rdquo;. Try All results or another search.</p> : null}
      </>}
    </div>
    <CtaFooter title="Need a hand finding something?" subtitle="Tell us what you are looking for and our team will point you in the right direction." />
  </>;
}
