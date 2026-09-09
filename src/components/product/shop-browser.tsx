"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { categoryToSlug } from "@/lib/products";
import {
  SCOOTER_CATS,
  SHOP_SUBS,
  WHEELCHAIR_CATS,
  shopFiltersToSearchParams,
  type ShopFilters,
  type ShopSortKey,
  type ShopSub,
  type PortabilityFilter,
} from "@/lib/shop-catalogue";
import { cn } from "@/lib/utils";

export function ShopBrowser({
  children,
  visibleCount,
  totalCount,
  catalogueSize,
  categories,
  manufacturers,
  filters,
}: {
  children: ReactNode;
  visibleCount: number;
  totalCount: number;
  catalogueSize: number;
  categories: { category: string; count: number }[];
  manufacturers: string[];
  filters: ShopFilters;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [queryInput, setQueryInput] = useState(filters.query);
  const [committedQuery, setCommittedQuery] = useState(filters.query);
  const resultsRef = useRef<HTMLDivElement>(null);
  const shouldScrollToResults = useRef(false);

  if (committedQuery !== filters.query) {
    setCommittedQuery(filters.query);
    setQueryInput(filters.query);
  }

  useEffect(() => {
    if (queryInput === filters.query) return;
    const timer = window.setTimeout(() => {
      replaceFilters({ query: queryInput });
    }, 400);
    return () => window.clearTimeout(timer);
    // filters.query is the committed URL value; queryInput is the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput, filters.query]);

  useEffect(() => {
    if (!shouldScrollToResults.current) return;
    shouldScrollToResults.current = false;
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [filters.category, filters.manufacturer, filters.sub, filters.motabilityOnly, filters.clearanceOnly, filters.sort, filters.page, filters.maxPrice, filters.portability]);

  function replaceFilters(next: Partial<ShopFilters>) {
    const resetPage = next.page == null;
    const params = shopFiltersToSearchParams({
      ...filters,
      ...next,
      query: (next.query ?? filters.query).trim(),
      page: next.page ?? (resetPage ? 1 : filters.page),
    });
    const href = params.toString() ? `/shop?${params.toString()}` : "/shop";
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  function markScrollToResults() {
    shouldScrollToResults.current = true;
  }

  const visibleCategories = useMemo(() => {
    if (filters.sub === "scooters") {
      return categories.filter((c) => SCOOTER_CATS.includes(c.category));
    }
    if (filters.sub === "wheelchairs") {
      return categories.filter((c) => WHEELCHAIR_CATS.includes(c.category));
    }
    return categories;
  }, [categories, filters.sub]);

  const hasMore = visibleCount < totalCount;

  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (filters.sub === "scooters") {
    activeFilters.push({
      key: "sub",
      label: "Scooters",
      clear: () => {
        markScrollToResults();
        replaceFilters({ sub: "", category: "" });
      },
    });
  }
  if (filters.sub === "wheelchairs") {
    activeFilters.push({
      key: "sub",
      label: "Wheelchairs",
      clear: () => {
        markScrollToResults();
        replaceFilters({ sub: "", category: "" });
      },
    });
  }
  if (filters.category) {
    activeFilters.push({
      key: "category",
      label: filters.category,
      clear: () => {
        markScrollToResults();
        replaceFilters({ category: "" });
      },
    });
  }
  if (filters.manufacturer) {
    activeFilters.push({
      key: "brand",
      label: filters.manufacturer,
      clear: () => {
        markScrollToResults();
        replaceFilters({ manufacturer: "" });
      },
    });
  }
  if (filters.query) {
    activeFilters.push({
      key: "query",
      label: `“${filters.query}”`,
      clear: () => {
        setQueryInput("");
        replaceFilters({ query: "" });
      },
    });
  }
  if (filters.motabilityOnly) {
    activeFilters.push({
      key: "motability",
      label: "Motability",
      clear: () => {
        markScrollToResults();
        replaceFilters({ motabilityOnly: false });
      },
    });
  }
  if (filters.clearanceOnly) {
    activeFilters.push({
      key: "clearance",
      label: "Clearance",
      clear: () => {
        markScrollToResults();
        replaceFilters({ clearanceOnly: false });
      },
    });
  }
  if (filters.maxPrice != null) activeFilters.push({
    key: "maxPrice", label: `Up to £${filters.maxPrice.toLocaleString("en-GB")}`,
    clear: () => replaceFilters({ maxPrice: null }),
  });
  if (filters.portability) activeFilters.push({
    key: "portability", label: filters.portability === "folding" ? "Folding models" : "Listed weight under 20 kg",
    clear: () => replaceFilters({ portability: "" }),
  });

  function clearAll() {
    setQueryInput("");
    markScrollToResults();
    replaceFilters({
      query: "",
      category: "",
      manufacturer: "",
      motabilityOnly: false,
      clearanceOnly: false,
      sub: "",
      sort: "featured",
      maxPrice: null,
      portability: "",
    });
  }

  function loadMore() {
    replaceFilters({ page: filters.page + 1 });
  }

  return (
    <div>
      <div
        className="ms-shop-types"
        role="tablist"
        aria-label="Product type"
      >
        {SHOP_SUBS.map((item) => {
          const active = filters.sub === item.id;
          return (
            <button
              key={item.id || "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                markScrollToResults();
                replaceFilters({ sub: item.id as ShopSub, category: "" });
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-primary hover:bg-soft",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <details className="ms-shop-refinements" open>
        <summary>Search, filter &amp; sort products <span aria-hidden>＋</span></summary>
        <div className="grid gap-3 pb-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-3">
        <div className="min-w-0 lg:col-span-3">
          <label htmlFor="shop-search" className="mb-1.5 block text-sm font-semibold text-muted">
            Search
          </label>
          <div className="relative">
            <Input
              id="shop-search"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Name or brand…"
              aria-label="Search by name or brand"
              className="bg-white pr-11"
            />
            <span
              className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center text-primary/45"
              aria-hidden
            >
              <Search className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="shop-type" className="mb-1.5 block text-sm font-semibold text-muted">
            Type
          </label>
          <Select
            id="shop-type"
            value={filters.category}
            onChange={(e) => {
              markScrollToResults();
              replaceFilters({ category: e.target.value });
            }}
            className="bg-white"
          >
            <option value="">All types</option>
            {visibleCategories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.count})
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="shop-brand" className="mb-1.5 block text-sm font-semibold text-muted">
            Brand
          </label>
          <Select
            id="shop-brand"
            value={filters.manufacturer}
            onChange={(e) => {
              markScrollToResults();
              replaceFilters({ manufacturer: e.target.value });
            }}
            className="bg-white"
          >
            <option value="">All brands</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="shop-sort" className="mb-1.5 block text-sm font-semibold text-muted">
            Sort
          </label>
          <Select
            id="shop-sort"
            value={filters.sort}
            onChange={(e) => {
              markScrollToResults();
              replaceFilters({ sort: e.target.value as ShopSortKey });
            }}
            className="bg-white"
          >
            <option value="featured">Featured</option>
            <option value="name">Name A–Z</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="motability">Motability first</option>
          </Select>
        </div>
        <div className="flex min-w-0 flex-col gap-2 pb-1 lg:col-span-3 lg:items-stretch">
          <span className="mb-1.5 hidden text-xs font-semibold uppercase tracking-wide text-muted lg:block">
            Filters
          </span>
          <div className="flex flex-col gap-2 rounded-md border border-border bg-white px-3 py-2 sm:flex-row sm:items-center sm:gap-4 lg:h-11 lg:gap-5">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium whitespace-nowrap text-primary">
              <input
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-accent"
                checked={filters.motabilityOnly}
                onChange={(e) => {
                  markScrollToResults();
                  replaceFilters({ motabilityOnly: e.target.checked });
                }}
              />
              Motability
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium whitespace-nowrap text-primary">
              <input
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-accent"
                checked={filters.clearanceOnly}
                onChange={(e) => {
                  markScrollToResults();
                  replaceFilters({ clearanceOnly: e.target.checked });
                }}
              />
              Clearance
            </label>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-3">
          <label htmlFor="shop-budget" className="mb-1.5 block text-sm font-semibold text-muted">Maximum price</label>
          <Select id="shop-budget" value={filters.maxPrice ?? ""} onChange={(event) => {
            markScrollToResults();
            replaceFilters({ maxPrice: event.target.value ? Number(event.target.value) : null });
          }} aria-describedby="shop-budget-note">
            <option value="">Any budget</option>
            {[500, 1000, 1500, 2500, 5000].map((amount) => <option key={amount} value={amount}>Up to £{amount.toLocaleString("en-GB")}</option>)}
            {filters.maxPrice != null && ![500, 1000, 1500, 2500, 5000].includes(filters.maxPrice) ? <option value={filters.maxPrice}>Up to £{filters.maxPrice.toLocaleString("en-GB")}</option> : null}
          </Select>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <label htmlFor="shop-portability" className="mb-1.5 block text-sm font-semibold text-muted">Portability</label>
          <Select id="shop-portability" value={filters.portability} onChange={(event) => {
            markScrollToResults();
            replaceFilters({ portability: event.target.value as PortabilityFilter });
          }} aria-describedby="shop-portability-note">
            <option value="">All models</option>
            <option value="folding">Folding models</option>
            <option value="under-20kg">Listed weight under 20 kg</option>
          </Select>
        </div>
        <div className="space-y-1 text-sm text-muted lg:col-span-5">
          <p id="shop-budget-note">Budget uses the price shown. VAT relief applies where eligible.</p>
          <p id="shop-portability-note">Listed weight can differ from lifting weight. Compare models or ask our team.</p>
        </div>
        </div>
      </details>

      <div
        ref={resultsRef}
        id="catalogue-results"
        className="scroll-under-header"
        aria-busy={isPending}
      >
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" role="status" aria-live="polite">
            {isPending ? "Updating… " : ""}
            <span className="font-semibold text-primary">{totalCount}</span>{" "}
            product{totalCount === 1 ? "" : "s"}
            {totalCount !== catalogueSize ? (
              <span> matching your filters</span>
            ) : null}
          </p>
          {activeFilters.length ? (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map((f) => (
                <button
                  key={f.key + f.label}
                  type="button"
                  onClick={f.clear}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
                  aria-label={`Remove ${f.label} filter`}
                >
                  {f.label}
                  <span aria-hidden>×</span>
                </button>
              ))}
              <button
                type="button"
                className="text-xs font-semibold text-muted underline underline-offset-2"
                onClick={clearAll}
              >
                Clear all
              </button>
            </div>
          ) : null}
        </div>

        {totalCount ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {children}
            </div>
            {hasMore ? (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={loadMore}
                  className="rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Show more products
                </button>
                <p className="text-xs text-muted">
                  Showing {visibleCount} of {totalCount}
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-8 border border-border bg-soft px-5 py-10 text-center">
            <p className="font-semibold text-primary">
              No products match these filters
            </p>
            <p className="mt-2 text-sm text-muted">
              This page only covers scooters and wheelchairs.
              {filters.query ? (
                <>
                  {" "}
                  <Link
                    href={`/search?q=${encodeURIComponent(filters.query)}`}
                    className="font-semibold text-primary underline"
                  >
                    Search all products &amp; vehicle adaptations for “
                    {filters.query}”
                  </Link>
                </>
              ) : (
                <>
                  {" "}
                  Looking for hand controls or hoists? Browse{" "}
                  <Link
                    href="/vehicle-adaptations"
                    className="font-semibold text-primary underline"
                  >
                    vehicle adaptations
                  </Link>
                  .
                </>
              )}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 text-sm font-semibold text-primary underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <nav
        className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-sm text-muted"
        aria-label="Category links"
      >
        {categories.slice(0, 16).map((c) => (
          <Link
            key={c.category}
            href={`/shop/${categoryToSlug(c.category)}`}
            className="hover:text-primary hover:underline"
          >
            {c.category}
          </Link>
        ))}
      </nav>
    </div>
  );
}
