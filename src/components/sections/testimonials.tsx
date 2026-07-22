import type { Review } from "@/lib/types";

export function Testimonials({ reviews }: { reviews: Review[] }) {
  return (
    <section className="py-16 md:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            What our customers say
          </h2>
          <p className="mt-3 text-muted">
            Real feedback from people we have helped at home and at our branches.
          </p>
        </div>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="border-t border-border pt-6">
              <p className="text-tertiary" aria-label={`${review.rating} out of 5 stars`}>
                {"★".repeat(review.rating)}
              </p>
              <blockquote className="mt-3 text-base leading-relaxed text-foreground/90">
                “{review.quote}”
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-primary">
                {review.author}
                {review.location ? (
                  <span className="font-normal text-muted"> · {review.location}</span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
