import Link from "next/link";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { ProductCard } from "@/components/ProductCard";
import { SearchForm } from "@/components/layout/search-form";
import { searchProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  return createMetadata({
    title: query ? `Search results for “${query}”` : "Search",
    description:
      "Search mobility scooters, wheelchairs and vehicle adaptations from Mobility Station.",
    path: "/search",
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type } = await searchParams;
  const query = (q ?? "").trim();
  const filter = type === "shop" || type === "adaptations" ? type : "all";

  let results: Awaited<ReturnType<typeof searchProducts>> | null = null;
  let errorMessage: string | null = null;

  if (query) {
    try {
      results = await searchProducts(query);
    } catch (error) {
      console.error("Search error:", error);
      errorMessage =
        "We could not run that search right now. Please try again shortly or request a callback.";
    }
  }

  const shop = results?.shop ?? [];
  const adaptations = results?.adaptations ?? [];
  const showShop = filter === "all" || filter === "shop";
  const showAdaptations = filter === "all" || filter === "adaptations";

  const tabs = [
    { id: "all", label: "All results", count: shop.length + adaptations.length },
    { id: "shop", label: "Scooters & Wheelchairs", count: shop.length },
    { id: "adaptations", label: "Vehicle Adaptations", count: adaptations.length },
  ];

  return (
    <div className="container-site py-12 md:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
          {query ? <>Results for “{query}”</> : "Search"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Search across scooters, wheelchairs and vehicle adaptations — by
          product, brand or category.
        </p>
        <div className="mt-5 max-w-xl">
          <SearchForm defaultValue={query} autoFocus={!query} />
        </div>
      </header>

      {errorMessage ? (
        <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
          {errorMessage}
        </p>
      ) : !query ? (
        <div className="rounded-2xl border border-border bg-soft/60 p-8">
          <p className="font-semibold text-primary">
            Try a brand, product or category
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[
              "Jeff Gosling",
              "hand controls",
              "boot hoist",
              "folding scooter",
              "swivel seat",
              "powered wheelchair",
            ].map((suggestion) => (
              <li key={suggestion}>
                <Link
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-primary hover:border-primary"
                >
                  {suggestion}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : results && results.total === 0 ? (
        <div className="rounded-2xl border border-border bg-soft/60 p-8">
          <p className="text-lg font-semibold text-primary">
            No matches for “{query}”
          </p>
          <p className="mt-2 text-sm text-muted">
            Check the spelling, try a shorter term, or browse our catalogues.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Browse scooters &amp; wheelchairs
            </Link>
            <Link
              href="/vehicle-adaptations"
              className="rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Browse vehicle adaptations
            </Link>
            <Link
              href="/contact?interest=callback#callback"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-primary hover:border-primary"
            >
              Request a callback
            </Link>
          </div>
        </div>
      ) : (
        <>
          <nav
            className="mb-8 flex flex-wrap gap-2"
            aria-label="Filter results by catalogue"
          >
            {tabs.map((tab) => {
              const active = filter === tab.id;
              const href =
                tab.id === "all"
                  ? `/search?q=${encodeURIComponent(query)}`
                  : `/search?q=${encodeURIComponent(query)}&type=${tab.id}`;
              return (
                <Link
                  key={tab.id}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      : "rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
                  }
                >
                  {tab.label} ({tab.count})
                </Link>
              );
            })}
          </nav>

          {showShop && shop.length > 0 ? (
            <section className="mb-14">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-primary">
                  Scooters &amp; Wheelchairs
                </h2>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-primary underline"
                >
                  Browse all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {shop.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ) : null}

          {showAdaptations && adaptations.length > 0 ? (
            <section>
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-primary">
                  Vehicle Adaptations
                </h2>
                <Link
                  href="/vehicle-adaptations"
                  className="text-sm font-semibold text-primary underline"
                >
                  Browse all
                </Link>
              </div>
              <p className="mb-5 max-w-2xl text-sm text-muted">
                Supplied and fitted at our Heathrow or Ferndown workshops. Prices
                are indicative — we confirm compatibility and a firm quote for
                your vehicle.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {adaptations.map((product) => (
                  <AdaptationCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ) : null}

          {showShop && shop.length === 0 && filter === "shop" ? (
            <p className="rounded-xl border border-border bg-soft/60 p-6 text-sm text-muted">
              No scooters or wheelchairs matched “{query}”.{" "}
              {adaptations.length > 0 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&type=adaptations`}
                  className="font-semibold text-primary underline"
                >
                  See {adaptations.length} matching vehicle adaptation
                  {adaptations.length === 1 ? "" : "s"}
                </Link>
              ) : null}
            </p>
          ) : null}

          {showAdaptations &&
          adaptations.length === 0 &&
          filter === "adaptations" ? (
            <p className="rounded-xl border border-border bg-soft/60 p-6 text-sm text-muted">
              No vehicle adaptations matched “{query}”.{" "}
              {shop.length > 0 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&type=shop`}
                  className="font-semibold text-primary underline"
                >
                  See {shop.length} matching scooter
                  {shop.length === 1 ? "" : "s"} &amp; wheelchair
                  {shop.length === 1 ? "" : "s"}
                </Link>
              ) : null}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
