"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Input, Label, Select } from "@/components/ui/input";
import type { Product } from "@/lib/types";

type Category = { slug: string; name: string };

export function ShopBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: readonly Category[] | Category[];
}) {
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [sort, setSort] = useState("featured");

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.categorySlug === category);
    }
    if (brand !== "all") {
      list = list.filter((p) => p.brand === brand);
    }
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      list = list.filter((p) => p.price != null && p.price <= max);
    }
    if (maxWeight) {
      const max = Number(maxWeight);
      list = list.filter((p) => p.weightKg != null && p.weightKg <= max);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, category, brand, inStockOnly, maxPrice, maxWeight, sort]);

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Select id="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="maxPrice">Max price (£)</Label>
          <Input
            id="maxPrice"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any"
          />
        </div>
        <div>
          <Label htmlFor="maxWeight">Max weight (kg)</Label>
          <Input
            id="maxWeight"
            type="number"
            min={0}
            value={maxWeight}
            onChange={(e) => setMaxWeight(e.target.value)}
            placeholder="Any"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          In stock only
        </label>
        <div>
          <Label htmlFor="sort">Sort</Label>
          <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest</option>
          </Select>
        </div>
      </aside>

      <div>
        <p className="mb-6 text-sm text-muted">
          Showing {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </p>
        {filtered.length ? (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No products match your filters.</p>
        )}
      </div>
    </div>
  );
}
