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
import {
  ImageCollage,
  type CollageTile,
} from "@/components/sections/image-collage";
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

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-soft via-white to-primary-soft">
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
            Move Freely.{" "}
            <span className="text-accent">Live Fully.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Experts in vehicle adaptations and mobility products, supplied and
            supported by a team you can trust.
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

        <div className="animate-[fadeRise_900ms_ease-out]">
          <ImageCollage tiles={HOME_TILES} priority />
        </div>
      </div>
    </section>
  );
}
