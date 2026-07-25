import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  CarFront,
  Home,
  MapPinned,
  Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    href: "/vehicle-adaptations",
    icon: CarFront,
    title: "Vehicle adaptations",
    description: "Hand controls, access fittings and safer, easier driving.",
  },
  {
    href: "/shop",
    icon: Accessibility,
    title: "Scooters & wheelchairs",
    description: "Powerchairs, scooters and daily living aids ready to try.",
  },
  {
    href: "/book-a-service",
    icon: Wrench,
    title: "Servicing & support",
    description: "Reliable aftercare from our Heathrow and Ferndown teams.",
  },
] as const;

const TRUST = [
  { icon: BadgeCheck, label: "Motability accredited" },
  { icon: Home, label: "Home visits available" },
  { icon: MapPinned, label: "Heathrow & Ferndown" },
  { icon: Wrench, label: "Expert support" },
] as const;

const TILES = [
  {
    src: "/images/hero-options/06-customer-handover.png",
    alt: "Mobility Station adviser with a customer in an adapted car",
    className: "col-span-7 row-span-2",
    object: "object-[50%_35%]",
  },
  {
    src: "/images/hero-options/03-scooter-handover.png",
    alt: "Home demonstration handover of a mobility scooter",
    className: "col-span-5 row-span-2",
    object: "object-[55%_40%]",
  },
  {
    src: "/images/hero-options/02-wav-powerchair.png",
    alt: "Wheelchair accessible vehicle with ramp and powerchair",
    className: "col-span-5 row-span-2",
    object: "object-[42%_45%]",
  },
  {
    src: "/images/hero-options/05-hand-controls.png",
    alt: "Steering knob and hand controls fitted in a car",
    className: "col-span-7 row-span-2",
    object: "object-center",
  },
  {
    src: "/images/hero-options/16-van-adaptations-mobility-v3.png",
    alt: "Mobility Station van with scooter, wheelchair and home visit",
    className: "col-span-12 row-span-2",
    object: "object-[50%_55%]",
  },
] as const;

function HeroTile({
  src,
  alt,
  className,
  object,
  delay,
}: {
  src: string;
  alt: string;
  className?: string;
  object: string;
  delay: string;
}) {
  return (
    <div
      className={cn(
        "hero-tile relative min-h-0 overflow-hidden rounded-2xl bg-soft shadow-[0_10px_28px_rgb(0_63_67_/_0.08)]",
        className,
      )}
      style={{ animationDelay: delay }}
    >
      <div className="hero-tile-media absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 50vw, 28vw"
          className={cn(
            "object-cover transition-transform duration-700 ease-out hover:scale-[1.05]",
            object,
          )}
          priority
        />
      </div>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f4faf7] via-white to-[#eef5f3]">
      <div
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="container-site relative grid items-center gap-10 py-12 md:gap-12 md:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:py-20">
        <div className="animate-[fadeRise_700ms_ease-out]">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Mobility solutions that{" "}
            <span className="text-accent">fit your life.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Expert advice, high-quality mobility products and professional
            vehicle adaptations — designed around you, from Heathrow &amp;
            Ferndown.
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ href, icon: Icon, title, description }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-start gap-3 rounded-xl p-1 transition-colors hover:bg-white/70"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-bold text-primary group-hover:text-primary-dark">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="#what-we-do"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "rounded-xl shadow-sm",
              )}
            >
              Explore our services
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {TRUST.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-xs font-semibold text-primary/85"
              >
                <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Collage — desktop / tablet */}
        <div className="relative hidden h-[28rem] animate-[fadeRise_900ms_ease-out] sm:block md:h-[34rem] lg:h-[38rem]">
          {/* Accent parallelograms */}
          <div
            className="absolute -right-2 top-6 z-0 h-24 w-16 -skew-x-12 rounded-xl bg-accent/90 md:h-28 md:w-20"
            aria-hidden
          />
          <div
            className="absolute bottom-10 left-2 z-0 h-20 w-14 -skew-x-12 rounded-xl bg-primary md:h-24 md:w-16"
            aria-hidden
          />
          <div
            className="absolute right-10 top-[42%] z-0 h-16 w-12 -skew-x-12 rounded-lg bg-primary/80"
            aria-hidden
          />

          <div className="relative z-10 grid h-full grid-cols-12 grid-rows-6 gap-3 md:gap-3.5">
            {TILES.map((tile, i) => (
              <HeroTile
                key={tile.src}
                {...tile}
                delay={`${120 + i * 90}ms`}
              />
            ))}
          </div>
        </div>

        {/* Collage — mobile strip */}
        <div className="grid grid-cols-2 gap-2.5 sm:hidden">
          {TILES.slice(0, 4).map((tile) => (
            <div
              key={tile.src}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-soft"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="50vw"
                className={cn("object-cover", tile.object)}
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
