import "./search.css";
import Link from "next/link";
import Form from "next/form";
import { Search } from "lucide-react";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { ProductCard } from "@/components/ProductCard";
import { isAdaptationProduct } from "@/lib/adaptations";
import { searchProducts } from "@/lib/products";
import { cleanSearchQuery, MAX_SEARCH_LENGTH } from "@/lib/product-search";
import { createMetadata, SITE } from "@/lib/seo";

export const revalidate = 300;
const PAGE_SIZE = 24;
const SUGGESTIONS = ["folding scooter", "electric wheelchair", "boot hoist", "hand controls", "Robooter", "XSTO M4"];
type Props = { searchParams: Promise<{ q?: string | string[]; type?: string | string[]; page?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props) {
  const query = cleanSearchQuery((await searchParams).q);
  return createMetadata({ title: query ? `Search results for “${query}”` : "Search", description: "Find mobility scooters, wheelchairs, accessories and vehicle adaptations by name, brand or model.", path: "/search", noIndex: true });
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = cleanSearchQuery(params.q);
  const filter = params.type === "shop" || params.type === "adaptations" ? params.type : "all";
  let results: Awaited<ReturnType<typeof searchProducts>> | null = null;
  let failed = false;
  if (query) {
    try { results = await searchProducts(query); }
    catch { console.error("Catalogue search could not load published products"); failed = true; }
  }
  const items = filter === "shop" ? results?.shop ?? [] : filter === "adaptations" ? results?.adaptations ?? [] : results?.items ?? [];
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const requestedPage = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  const page = Number.isFinite(requestedPage) ? Math.min(pages, Math.max(1, Math.floor(requestedPage))) : 1;
  const visible = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tabs = [
    { id: "all", label: "All products", count: results?.total ?? 0 },
    { id: "shop", label: "Mobility & accessories", count: results?.shop.length ?? 0 },
    { id: "adaptations", label: "Vehicle adaptations", count: results?.adaptations.length ?? 0 },
  ];
  function href(type = filter, targetPage = 1) {
    const values = new URLSearchParams({ q: query });
    if (type !== "all") values.set("type", type);
    if (targetPage > 1) values.set("page", String(targetPage));
    return `/search?${values}`;
  }

  return <>
    <section className={`ms-page-intro ms-search-intro${query ? " ms-search-intro-results" : ""}`}>
      <div className="container-site">
        {!query ? <p className="ms-eyebrow">Search our products</p> : null}
        <h1>{query ? "Search results." : "What are you looking for?"}</h1>
        {!query ? <p>Scooters, wheelchairs, accessories and vehicle adaptations — all in one place.</p> : null}
        <Form action="/search" key={query} role="search" aria-label="Catalogue search" className="ms-search-form">
          <label htmlFor="catalogue-query">Product name, brand or model</label>
          <div className="ms-search-controls">
            <input id="catalogue-query" name="q" type="search" defaultValue={query} placeholder="Try Robooter E60, folding scooter or boot hoist" maxLength={MAX_SEARCH_LENGTH} autoComplete="off" />
            <button type="submit" className="ms-button"><Search size={20} aria-hidden />Search</button>
          </div>
        </Form>
        {!query ? <div className="ms-search-suggestions"><span>Try:</span>{SUGGESTIONS.map(term => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div> : null}
      </div>
    </section>
    <div className="container-site ms-search-body">
      {failed ? <div className="ms-search-message" role="alert">
        <h2>Search is temporarily unavailable.</h2><p>Please try again, or call <a href={SITE.phoneHref}>{SITE.phone}</a> and we’ll help you find the right product.</p>
        <a href={href()}>Try this search again →</a>
      </div> : !query ? <div className="ms-search-browse">
        <Link href="/shop"><h2>Scooters, wheelchairs &amp; accessories <span aria-hidden>↗</span></h2><p>Browse products for everyday mobility.</p></Link>
        <Link href="/vehicle-adaptations"><h2>Vehicle adaptations <span aria-hidden>↗</span></h2><p>Driving controls, hoists, seating and more.</p></Link>
      </div> : <>
        <div className="ms-search-summary"><p><strong>{results?.total ?? 0}</strong> {(results?.total ?? 0) === 1 ? "product" : "products"} {results?.approximate ? "with a close match to" : "found for"} <strong>“{query}”</strong></p><Link href="/search">Clear search</Link></div>
        {results?.approximate ? <p className="ms-search-match-note">No exact matches. These are close spelling matches — check the product name and model before choosing.</p> : null}
        {(results?.total ?? 0) > 0 ? <nav className="ms-search-tabs" aria-label="Filter search results">{tabs.map(tab => <Link key={tab.id} href={href(tab.id)} aria-current={filter === tab.id ? "page" : undefined}>{tab.label} <span>({tab.count})</span></Link>)}</nav> : null}
        {visible.length ? <>
          <div className="ms-search-result-heading"><h2>{filter === "adaptations" ? "Vehicle adaptations" : filter === "shop" ? "Mobility & accessories" : "Matching products"}</h2><p>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, items.length)} of {items.length} · Best matches first</p></div>
          <div className="ms-search-grid">{visible.map(product => isAdaptationProduct(product) ? <AdaptationCard key={product.id} product={product} /> : <ProductCard key={product.id} product={product} />)}</div>
          {pages > 1 ? <nav className="ms-search-pagination" aria-label="Search result pages">{page > 1 ? <Link href={href(filter, page - 1)} rel="prev">← Previous</Link> : <span />}<span>Page {page} of {pages}</span>{page < pages ? <Link href={href(filter, page + 1)} rel="next">Next →</Link> : <span />}</nav> : null}
        </> : <div className="ms-search-message">
          <h2>{(results?.total ?? 0) > 0 ? "No matches in this category." : "We couldn’t find a matching product."}</h2>
          <p>{(results?.total ?? 0) > 0 ? "Your search has matches in another category. Choose All products to see them." : "Try the brand or model on its own, or a product type such as scooter, wheelchair or hoist."}</p>
          <div className="ms-search-empty-links">{(results?.total ?? 0) > 0 ? <Link href={href("all")}>View all matches →</Link> : <><Link href="/shop">Browse mobility products →</Link><Link href="/vehicle-adaptations">Browse adaptations →</Link></>}</div>
          <p>Still looking? Call <a href={SITE.phoneHref}>{SITE.phone}</a> — we can help.</p>
        </div>}
      </>}
    </div>
  </>;
}
