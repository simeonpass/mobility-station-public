"use client";

import { useState } from "react";
import { MotabilityProductCard } from "@/components/product/motability-product-card";
import type { MotabilityCategory } from "@/lib/motability-catalogue";
import type { ProductListItem } from "@/lib/products";

const PAGE_SIZE = 12;

export function MotabilityCategorySection({ id, title, products, categories }: {
  id: "scooters" | "wheelchairs";
  title: string;
  products: ProductListItem[];
  categories: readonly MotabilityCategory[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const availableCategories = categories.map((category) => ({
    ...category,
    count: products.filter((product) => category.categories.includes(product.category || "")).length,
  })).filter((category) => category.count > 0);
  const activeCategory = availableCategories.find((category) => category.id === selectedCategory);
  const filteredProducts = activeCategory
    ? products.filter((product) => activeCategory.categories.includes(product.category || ""))
    : products;
  const shown = Math.min(visibleCount, filteredProducts.length);
  const resultsId = id + "-results";

  function selectCategory(category: string) {
    setSelectedCategory(category);
    setVisibleCount(PAGE_SIZE);
  }

  return <section id={id} className="ms-motability-category scroll-under-header" aria-labelledby={id + "-title"}>
    <div className="ms-motability-category-heading">
      <h3 id={id + "-title"}>{title}</h3>
      <span>{products.length} models</span>
    </div>
    <div className="ms-product-tabs" role="group" aria-label={title + " categories"}>
      <button type="button" aria-pressed={!selectedCategory} aria-controls={resultsId} onClick={() => selectCategory("")}>All {id === "scooters" ? "scooters" : "powerchairs"} ({products.length})</button>
      {availableCategories.map((category) => <button type="button" key={category.id}
        aria-pressed={selectedCategory === category.id} aria-controls={resultsId}
        onClick={() => selectCategory(category.id)}>{category.label} ({category.count})</button>)}
    </div>
    <p className="ms-motability-results-count" role="status" aria-live="polite" aria-atomic="true">
      Showing {shown} of {filteredProducts.length} {activeCategory ? activeCategory.label.toLowerCase() : title.toLowerCase()} · lowest weekly price first
    </p>
    <div id={resultsId} className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {filteredProducts.slice(0, visibleCount).map((product) => <MotabilityProductCard key={product.id} product={product} />)}
    </div>
    {shown < filteredProducts.length ? <div className="ms-motability-more">
      <button type="button" className="ms-button ms-button-secondary" aria-controls={resultsId}
        onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, filteredProducts.length - shown)} more {id === "scooters" ? "scooters" : "powerchairs"}</button>
    </div> : null}
  </section>;
}
