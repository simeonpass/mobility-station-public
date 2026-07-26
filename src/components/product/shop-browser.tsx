"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Input, Select } from "@/components/ui/input";
import { categoryToSlug, displayPrice, type ProductListItem } from "@/lib/products";

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

function chipClass(active: boolean) {
  return active
    ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
    : "rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary";
}

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

  useEffect(() => {
    const q = searchParams.get("q");
    if (q != null) setQuery(q);
  }, [searchParams]);

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
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.manufacturer || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q),
      );
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
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { id: "", label: "All" },
          { id: "scooters", label: "Scooters" },
          { id: "wheelchairs", label: "Wheelchairs" },
        ].map((item) => (
          <button
            key={item.id || "all"}
            type="button"
            onClick={() => {
              setSub(item.id);
              setCategory("");
            }}
            className={chipClass(sub === item.id)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMotabilityOnly((v) => !v)}
          className={chipClass(motabilityOnly)}
        >
          Motability
        </button>
        <button
          type="button"
          onClick={() => setClearanceOnly((v) => !v)}
          className={chipClass(clearanceOnly)}
        >
          Clearance
        </button>
        <Link
          href="/contact?interest=callback#callback"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
        >
          Help me choose
        </Link>
      </div>

      {visibleCategories.length > 1 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              !category
                ? "bg-primary-soft text-primary"
                : "border border-border bg-white text-muted hover:text-primary"
            }`}
          >
            All types
          </button>
          {visibleCategories.map((c) => (
            <button
              key={c.category}
              type="button"
              onClick={() =>
                setCategory((prev) => (prev === c.category ? "" : c.category))
              }
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                category === c.category
                  ? "bg-primary-soft text-primary"
                  : "border border-border bg-white text-muted hover:text-primary"
              }`}
            >
              {c.category} ({c.count})
            </button>
          ))}
        </div>
      ) : null}

      <div className="mb-5 grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Search
          </label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scooters, wheelchairs, brands…"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Brand
          </label>
          <Select
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          >
            <option value="">All brands</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Sort
          </label>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="featured">Featured</option>
            <option value="name">Name A–Z</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="motability">Motability first</option>
          </Select>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-primary">{filtered.length}</span>{" "}
          of {products.length} products
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-soft px-5 py-8 text-center">
          <p className="font-semibold text-primary">No products match these filters</p>
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
          <p className="mt-2 text-sm text-muted">
            Or{" "}
            <Link href="/contact" className="font-semibold text-primary underline">
              contact us
            </Link>{" "}
            and we&apos;ll help you find the right model.
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

      <nav className="mt-10 flex flex-wrap gap-2" aria-label="Category links">
        {categories.slice(0, 16).map((c) => (
          <Link
            key={c.category}
            href={`/shop/${categoryToSlug(c.category)}`}
            className="text-xs text-muted underline hover:text-primary"
          >
            {c.category}
          </Link>
        ))}
      </nav>
    </div>
  );
}
