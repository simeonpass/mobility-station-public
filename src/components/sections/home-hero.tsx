import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HomeHeroProps = {
  averageRating?: number | null;
  totalReviews?: number;
  googleMapsUrl?: string | null;
};

export function HomeHero({
  averageRating = 4.9,
  totalReviews,
  googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Mobility+Station+UK",
}: HomeHeroProps) {
  const ratingLabel =
    averageRating != null ? averageRating.toFixed(1) : "4.9";

  return (
    <section className="overflow-hidden bg-white">
      <div className="container-site grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 lg:py-28">
        <div className="animate-[fadeRise_650ms_ease-out]">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Vehicle adaptations · Mobility · Motability
          </p>

          <h1 className="max-w-2xl text-balance text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.045em] text-primary sm:text-6xl lg:text-[4.45rem]">
            Keeping you moving.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Specialist vehicle adaptations, mobility scooters and wheelchairs —
            supplied, fitted and supported by experienced teams at Heathrow and
            Ferndown.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/vehicle-adaptations"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "h-12 min-h-12 rounded-full px-7 text-base",
              )}
            >
              Explore adaptations
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 min-h-12 rounded-full px-7 text-base",
              )}
            >
              Shop mobility
            </Link>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <a
              href={googleMapsUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-wrap items-center gap-3"
            >
              <span
                className="flex gap-1"
                aria-label={`${ratingLabel} out of 5 stars on Google`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                    aria-hidden
                  />
                ))}
              </span>
              <span className="text-sm font-semibold text-primary group-hover:underline group-hover:underline-offset-4">
                {ratingLabel}/5 on Google
                {totalReviews ? (
                  <span className="font-normal text-muted">
                    {" "}
                    · {totalReviews} reviews
                  </span>
                ) : null}
              </span>
            </a>
            <p className="mt-2 text-sm text-muted">
              Trusted across London, Dorset and the South Coast.
            </p>
          </div>
        </div>

        <div className="animate-[fadeRise_850ms_ease-out]">
          <div className="relative overflow-hidden rounded-[2rem] bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element -- local hero asset; intentionally unoptimised for LCP */}
            <img
              src="/images/hero-options/06-customer-handover.png"
              alt="Mobility Station adviser with a customer in an adapted car"
              width={1200}
              height={900}
              className="aspect-[4/3] h-full w-full object-cover object-[50%_35%]"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-black/82 px-5 py-4 text-white backdrop-blur-sm sm:inset-x-7 sm:bottom-7 sm:px-6 sm:py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">
                Two specialist branches
              </p>
              <p className="mt-1 text-base font-semibold sm:text-lg">
                Heathrow &amp; Ferndown · Home demonstrations available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
