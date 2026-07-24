"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

export function ShopBrowser({
  products,
  categories,
  initialSub,
}: {
  products: ProductListItem[];
  categories: { category: string; count: number }[];
  initialSub?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [motabilityOnly, setMotabilityOnly] = useState(false);
  const [clearanceOnly, setClearanceOnly] = useState(false);
  const [sub, setSub] = useState(initialSub ?? "");

  const manufacturers = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.manufacturer) set.add(p.manufacturer);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [products]);

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
      // featured
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
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
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              sub === item.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-white text-primary"
            }`}
          >
            {item.label}
          </button>
        ))}
        <Link
          href="/clearance"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
        >
          Clearance
        </Link>
        <Link
          href="/motability"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
        >
          Motability
        </Link>
        <Link
          href="/find-my-scooter"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
        >
          Help me choose
        </Link>
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-2 lg:grid-cols-4">
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
            Category
          </label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.count})
              </option>
            ))}
          </Select>
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
        <div className="flex flex-wrap items-end gap-4 lg:col-span-3">
          <label className="flex items-center gap-2 text-sm font-medium text-primary">
            <input
              type="checkbox"
              checked={motabilityOnly}
              onChange={(e) => setMotabilityOnly(e.target.checked)}
            />
            Motability only
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-primary">
            <input
              type="checkbox"
              checked={clearanceOnly}
              onChange={(e) => setClearanceOnly(e.target.checked)}
            />
            Clearance / used only
          </label>
          {(query || category || manufacturer || motabilityOnly || clearanceOnly || sub) && (
            <button
              type="button"
              className="text-sm font-semibold text-muted underline"
              onClick={() => {
                setQuery("");
                setCategory("");
                setManufacturer("");
                setMotabilityOnly(false);
                setClearanceOnly(false);
                setSub("");
                setSort("featured");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted">
        Showing {filtered.length} of {products.length} products
      </p>

      {filtered.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-soft px-4 py-6 text-sm text-muted">
          No products match these filters.{" "}
          <Link href="/contact" className="font-semibold text-primary underline">
            Contact us
          </Link>{" "}
          and we&apos;ll help you find the right model.
        </p>
      )}

      {/* Keep category deep-links crawlable */}
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
