"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/types";

const INITIAL_COUNT = 3;

function StarRow({ rating }: { rating: number }) {
  return (
    <span
      className="flex gap-0.5 text-tertiary"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-tertiary text-tertiary"
              : "fill-transparent text-border"
          }`}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!reviews.length) return null;

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const visible = expanded ? reviews : reviews.slice(0, INITIAL_COUNT);
  const remaining = reviews.length - INITIAL_COUNT;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-primary md:text-2xl">
          Customer reviews
        </h2>
        <p className="text-sm text-muted">
          <span className="font-semibold text-primary">
            {average.toFixed(1)}★
          </span>{" "}
          · {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </p>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((review) => (
          <li
            key={review.id}
            className="rounded-xl border border-border/80 bg-soft/30 p-4"
          >
            <StarRow rating={review.rating} />
            <blockquote className="mt-2 line-clamp-4 text-sm leading-relaxed text-foreground/90">
              “{review.quote}”
            </blockquote>
            <p className="mt-3 truncate text-sm font-semibold text-primary">
              {review.author}
            </p>
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {expanded
              ? "Show fewer reviews"
              : `Show ${remaining} more review${remaining === 1 ? "" : "s"}`}
          </button>
        </div>
      ) : null}
    </section>
  );
}
