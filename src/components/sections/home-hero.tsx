import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import {
  ImageCollage,
  type CollageTile,
} from "@/components/sections/image-collage";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Jigsaw tiles: large service shot + four supporting scenes */
const HOME_TILES: CollageTile[] = [
  {
    src: "/images/hero-options/06-customer-handover.png",
    alt: "Mobility Station adviser with a customer in an adapted car",
    object: "object-[50%_35%]",
  },
  {
    src: "/images/hero-options/05-hand-controls.png",
    alt: "Steering knob and hand controls fitted in a car",
    object: "object-center",
  },
  {
    src: "/images/hero-options/03-scooter-handover.png",
    alt: "Home demonstration of a mobility scooter",
    object: "object-[55%_40%]",
  },
  {
    src: "/images/hero-options/02-wav-powerchair.png",
    alt: "Wheelchair accessible vehicle with ramp and powerchair",
    object: "object-[42%_45%]",
  },
  {
    src: "/images/hero-options/07-swivel-seat.png",
    alt: "Vehicle access adaptation with wheelchair transfer",
    object: "object-[45%_40%]",
  },
];

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
    <section className="relative overflow-hidden bg-gradient-to-br from-soft via-white to-primary-soft">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="container-site relative grid items-center gap-12 py-14 md:gap-14 md:py-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-24">
        <div className="animate-[fadeRise_700ms_ease-out]">
          <h1 className="max-w-xl text-balance text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            Keeping you{" "}
            <em className="font-extrabold italic text-accent">moving</em>,
            inside and outside the car.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Vehicle adaptations, scooters and wheelchairs — supplied and
            supported by specialists you can trust at Heathrow and Ferndown.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/vehicle-adaptations"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "rounded-xl shadow-sm",
              )}
            >
              Vehicle adaptations
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl border-primary/25 bg-white/80",
              )}
            >
              Scooters &amp; wheelchairs
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <a
              href={googleMapsUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90"
            >
              <span
                className="flex gap-0.5"
                aria-label={`${ratingLabel} out of 5 stars on Google`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#F4B400]"
                  >
                    <Star
                      className="h-3.5 w-3.5 fill-white text-white"
                      aria-hidden
                    />
                  </span>
                ))}
              </span>
              <span className="text-sm font-semibold text-primary group-hover:underline group-hover:underline-offset-2">
                Rated {ratingLabel}/5 on Google
                {totalReviews ? (
                  <span className="font-normal text-muted">
                    {" "}
                    · {totalReviews} reviews
                  </span>
                ) : null}
              </span>
            </a>
          </div>
          <p className="mt-2 text-sm text-muted">
            Trusted by customers across London, Dorset &amp; the South Coast
          </p>
        </div>

        <div className="animate-[fadeRise_900ms_ease-out]">
          <ImageCollage tiles={HOME_TILES} priority />
        </div>
      </div>
    </section>
  );
}
