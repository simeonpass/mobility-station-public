"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Input, Select } from "@/components/ui/input";
import { categoryToSlug, displayPrice, type ProductListItem } from "@/lib/products";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "name" | "price-low" | "price-high" | "motability";

const SCOOTER_CATS = [
  "Small Scooters",
  "Mid Size Scooters",
  "Large Mobility Scooters",
  "Folding Mobility Scooters",
  "Mobility Scooters",
];
const WHEELCHAIR_CATS = [
  "Manual Wheelchairs",
  "Powered Wheelchairs",
  "Folding Powered Wheelchairs",
  "Wheelchairs",
];

const SUBS = [
  { id: "", label: "All" },
  { id: "scooters", label: "Scooters" },
  { id: "wheelchairs", label: "Wheelchairs" },
] as const;

export function ShopBrowser({
  products,
  categories,
  initialSub,
  initialQuery = "",
}: {
  products: ProductListItem[];
  categories: { category: string; count: number }[];
  initialSub?: string;
  initialQuery?: string;
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [motabilityOnly, setMotabilityOnly] = useState(false);
  const [clearanceOnly, setClearanceOnly] = useState(false);
  const [sub, setSub] = useState(initialSub ?? "");
  const [visibleCount, setVisibleCount] = useState(48);
  const resultsRef = useRef<HTMLDivElement>(null);
  const shouldScrollToResults = useRef(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q != null) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    if (!shouldScrollToResults.current) return;
    shouldScrollToResults.current = false;
    // Let the filtered grid paint, then bring results up under the sticky header.
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [category, manufacturer, sub, motabilityOnly, clearanceOnly, sort]);

  // Reset pagination whenever the filtered set changes.
  useEffect(() => {
    setVisibleCount(48);
  }, [query, category, manufacturer, sub, motabilityOnly, clearanceOnly, sort]);

  function markScrollToResults() {
    shouldScrollToResults.current = true;
  }

  const manufacturers = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.manufacturer) set.add(p.manufacturer);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const visibleCategories = useMemo(() => {
    if (sub === "scooters") {
      return categories.filter((c) => SCOOTER_CATS.includes(c.category));
    }
    if (sub === "wheelchairs") {
      return categories.filter((c) => WHEELCHAIR_CATS.includes(c.category));
    }
    return categories;
  }, [categories, sub]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (sub === "scooters") {
      list = list.filter((p) => SCOOTER_CATS.includes(p.category || ""));
    } else if (sub === "wheelchairs") {
      list = list.filter((p) => WHEELCHAIR_CATS.includes(p.category || ""));
    }

    if (category) list = list.filter((p) => p.category === category);

    if (manufacturer) {
      list = list.filter((p) => p.manufacturer === manufacturer);
    }

    if (query.trim()) {
      const raw = query.trim().toLowerCase();
      const words = raw.split(/\s+/).filter(Boolean);
      const tokens = words.filter((t) => t.length >= 2);
      const compounds: string[] = [];
      for (let i = 0; i < words.length - 1; i++) {
        const a = words[i];
        const b = words[i + 1];
        if (a.length <= 2 || a.includes("-") || b.includes("-")) {
          compounds.push(`${a}-${b}`, `${a}${b}`);
        }
      }
      for (const word of words) {
        if (word.includes("-")) compounds.push(word.replace(/-/g, ""));
      }
      const compact = (value: string) => value.replace(/[^a-z0-9]+/g, "");
      const phraseCompact = compact(raw);
      list = list.filter((p) => {
        const haystack = [p.name, p.manufacturer || "", p.category || ""]
          .join(" ")
          .toLowerCase();
        const haystackCompact = compact(haystack);
        if (phraseCompact && haystackCompact.includes(phraseCompact)) {
          return true;
        }
        if (compounds.some((c) => haystack.includes(c) || haystackCompact.includes(compact(c)))) {
          return true;
        }
        if (!tokens.length) return false;
        return tokens.every((t) => haystack.includes(t));
      });
    }

    if (motabilityOnly) {
      list = list.filter(
        (p) =>
          (p.motability_weekly_price != null && p.motability_weekly_price > 0) ||
          p.motability_price != null,
      );
    }

    if (clearanceOnly) {
      list = list.filter(
        (p) =>
          p.condition === "ex-demo" ||
          p.condition === "refurbished" ||
          p.condition === "pre-owned",
      );
    }

    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-low" || sort === "price-high") {
        const pa = displayPrice(a).current ?? Number.POSITIVE_INFINITY;
        const pb = displayPrice(b).current ?? Number.POSITIVE_INFINITY;
        return sort === "price-low" ? pa - pb : pb - pa;
      }
      if (sort === "motability") {
        const ma = a.motability_weekly_price ?? a.motability_price ?? 99999;
        const mb = b.motability_weekly_price ?? b.motability_price ?? 99999;
        return ma - mb;
      }
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [
    products,
    query,
    category,
    manufacturer,
    sort,
    motabilityOnly,
    clearanceOnly,
    sub,
  ]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (sub === "scooters") {
    activeFilters.push({
      key: "sub",
      label: "Scooters",
      clear: () => {
        setSub("");
        setCategory("");
      },
    });
  }
  if (sub === "wheelchairs") {
    activeFilters.push({
      key: "sub",
      label: "Wheelchairs",
      clear: () => {
        setSub("");
        setCategory("");
      },
    });
  }
  if (category) {
    activeFilters.push({
      key: "category",
      label: category,
      clear: () => setCategory(""),
    });
  }
  if (manufacturer) {
    activeFilters.push({
      key: "brand",
      label: manufacturer,
      clear: () => setManufacturer(""),
    });
  }
  if (query.trim()) {
    activeFilters.push({
      key: "query",
      label: `“${query.trim()}”`,
      clear: () => setQuery(""),
    });
  }
  if (motabilityOnly) {
    activeFilters.push({
      key: "motability",
      label: "Motability",
      clear: () => setMotabilityOnly(false),
    });
  }
  if (clearanceOnly) {
    activeFilters.push({
      key: "clearance",
      label: "Clearance",
      clear: () => setClearanceOnly(false),
    });
  }

  function clearAll() {
    setQuery("");
    setCategory("");
    setManufacturer("");
    setMotabilityOnly(false);
    setClearanceOnly(false);
    setSub("");
    setSort("featured");
  }

  return (
    <div>
      <div
        className="inline-flex rounded-full border border-border bg-white p-1 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
        role="tablist"
        aria-label="Product type"
      >
        {SUBS.map((item) => {
          const active = sub === item.id;
          return (
            <button
              key={item.id || "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                markScrollToResults();
                setSub(item.id);
                setCategory("");
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

      <div className="mt-5 grid gap-3 border-y border-border bg-soft/40 px-3 py-4 sm:grid-cols-2 sm:px-4 lg:grid-cols-12 lg:items-end lg:gap-3 lg:px-5 lg:py-5">
        <div className="min-w-0 lg:col-span-3">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Search
          </label>
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Type
          </label>
          <Select
            value={category}
            onChange={(e) => {
              markScrollToResults();
              setCategory(e.target.value);
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
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Brand
          </label>
          <Select
            value={manufacturer}
            onChange={(e) => {
              markScrollToResults();
              setManufacturer(e.target.value);
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
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Sort
          </label>
          <Select
            value={sort}
            onChange={(e) => {
              markScrollToResults();
              setSort(e.target.value as SortKey);
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
                checked={motabilityOnly}
                onChange={(e) => {
                  markScrollToResults();
                  setMotabilityOnly(e.target.checked);
                }}
              />
              Motability
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium whitespace-nowrap text-primary">
              <input
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-accent"
                checked={clearanceOnly}
                onChange={(e) => {
                  markScrollToResults();
                  setClearanceOnly(e.target.checked);
                }}
              />
              Clearance
            </label>
          </div>
        </div>
      </div>

      <div
        ref={resultsRef}
        id="catalogue-results"
        className="scroll-under-header"
      >
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-primary">{filtered.length}</span>{" "}
          product{filtered.length === 1 ? "" : "s"}
          {filtered.length !== products.length ? (
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

      {filtered.length ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + 48)}
                className="rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Show more products
              </button>
              <p className="text-xs text-muted">
                Showing {visibleProducts.length} of {filtered.length}
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
            {query.trim() ? (
              <>
                {" "}
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  className="font-semibold text-primary underline"
                >
                  Search all products &amp; vehicle adaptations for “
                  {query.trim()}”
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
