import type { Review } from "@/lib/types";

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-xl font-extrabold tracking-tight text-primary md:text-2xl">
        Customer reviews
      </h2>
      <ul className="mt-5 space-y-5">
        {reviews.map((review) => (
          <li key={review.id} className="border-b border-border pb-5 last:border-0">
            <p
              className="text-sm text-tertiary"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {"★".repeat(review.rating)}
            </p>
            <blockquote className="mt-2 text-sm leading-relaxed text-foreground/90">
              “{review.quote}”
            </blockquote>
            <p className="mt-2 text-sm font-semibold text-primary">
              {review.author}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
