import { ExternalLink, Star } from "lucide-react";
import type { GoogleBusinessLink, Review } from "@/lib/types";

function StarRow({ rating }: { rating: number }) {
  return (
    <span
      className="flex gap-0.5 text-tertiary"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
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

export function Testimonials({
  reviews,
  averageRating,
  totalReviews,
  googleMapsUrl,
  profiles = [],
}: {
  reviews: Review[];
  averageRating?: number | null;
  totalReviews?: number;
  googleMapsUrl?: string | null;
  profiles?: GoogleBusinessLink[];
}) {
  if (!reviews.length) return null;

  const primaryUrl =
    googleMapsUrl ??
    profiles[0]?.googleMapsUrl ??
    "https://www.google.com/maps/search/?api=1&query=Mobility+Station+UK";

  return (
    <section className="border-b border-border bg-soft/40 py-16 md:py-20">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Google reviews
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
              What our customers say
            </h2>
            <p className="mt-3 text-muted">
              Real Google reviews from people we&apos;ve helped at Heathrow and
              Ferndown.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {averageRating != null && totalReviews ? (
              <p className="text-sm text-muted">
                <span className="font-semibold text-primary">
                  {averageRating.toFixed(1)}★
                </span>{" "}
                · {totalReviews} Google reviews
              </p>
            ) : null}
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              See all on Google
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>

        {profiles.length > 1 ? (
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {profiles.map((profile) => (
              <li key={profile.googleMapsUrl}>
                <a
                  href={profile.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {profile.name}
                  {profile.rating != null ? (
                    <span className="text-muted">
                      {" "}
                      · {profile.rating.toFixed(1)}★
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            const cardHref = review.googleMapsUrl ?? primaryUrl;
            return (
              <li key={review.id}>
                <a
                  href={cardHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <StarRow rating={review.rating} />
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
                        <p className="text-xs text-muted">
                          {review.relativeTime}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
