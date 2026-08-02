import type { Review } from "@/lib/types";

export function Testimonials({
  reviews,
  averageRating,
  totalReviews,
}: {
  reviews: Review[];
  averageRating?: number | null;
  totalReviews?: number;
}) {
  if (!reviews.length) return null;

  return (
    <section className="border-b border-border bg-soft/40 py-16 md:py-20">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Customer reviews
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
              What our customers say
            </h2>
            <p className="mt-3 text-muted">
              Real Google reviews from people we&apos;ve helped at Heathrow and
              Ferndown.
            </p>
          </div>
          {averageRating != null && totalReviews ? (
            <p className="text-sm text-muted">
              <span className="font-semibold text-primary">
                {averageRating.toFixed(1)}★
              </span>{" "}
              · {totalReviews} Google reviews
            </p>
          ) : null}
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col rounded-2xl border border-border bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className="text-tertiary"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {"★".repeat(review.rating)}
                </p>
                {review.location ? (
                  <span className="truncate text-xs text-muted">
                    {review.location}
                  </span>
                ) : null}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90 md:text-base">
                “{review.quote}”
              </blockquote>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                {review.authorPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.authorPhotoUrl}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary"
                    aria-hidden
                  >
                    {review.author.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {review.author}
                  </p>
                  {review.relativeTime ? (
                    <p className="text-xs text-muted">{review.relativeTime}</p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
