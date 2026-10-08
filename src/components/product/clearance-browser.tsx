"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import {
  CONDITION_GRADES,
  type ConditionGrade,
  type ProductListItem,
} from "@/lib/products";
import { cn } from "@/lib/utils";

type GradeFilter = "all" | ConditionGrade;

export function ClearanceBrowser({ products }: { products: ProductListItem[] }) {
  const [grade, setGrade] = useState<GradeFilter>("all");

  const counts = useMemo(() => {
    const next: Record<GradeFilter, number> = {
      all: products.length,
      A: 0,
      B: 0,
      C: 0,
    };
    for (const p of products) {
      if (p.condition_grade === "A") next.A += 1;
      else if (p.condition_grade === "B") next.B += 1;
      else if (p.condition_grade === "C") next.C += 1;
    }
    return next;
  }, [products]);

  const filtered = useMemo(() => {
    if (grade === "all") return products;
    return products.filter((p) => p.condition_grade === grade);
  }, [products, grade]);

  const filters: { id: GradeFilter; label: string }[] = [
    { id: "all", label: "All grades" },
    ...CONDITION_GRADES.map((g) => ({
      id: g.id as GradeFilter,
      label: `Grade ${g.id}`,
    })),
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setGrade(f.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
              grade === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-primary hover:border-primary/40",
            )}
          >
            {f.label}
            <span className="ml-1.5 tabular-nums opacity-70">
              ({counts[f.id]})
            </span>
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">
          No clearance items in this grade right now. Try another grade or check
          back soon.
        </p>
      )}
    </div>
  );
}
