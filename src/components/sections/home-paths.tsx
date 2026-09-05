import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PATHS = [
  {
    title: "Vehicle adaptations",
    subtitle: "Expertly fitted. Built around you.",
    href: "/vehicle-adaptations",
    cta: "Explore adaptations",
    image: "/images/hero-options/07-swivel-seat.webp",
    alt: "Customer approaching an adapted vehicle in a wheelchair",
    imagePosition: "object-[50%_48%]",
    tone: "dark",
  },
  {
    title: "Scooters & wheelchairs",
    subtitle: "Find your freedom, every day.",
    href: "/shop",
    cta: "Explore mobility",
    image: "/images/hero-options/03-scooter-handover.webp",
    alt: "Mobility scooter demonstration and customer handover",
    imagePosition: "object-[55%_42%]",
    tone: "soft",
  },
] as const;

export function HomePaths() {
  return (
    <section id="what-we-do" className="scroll-mt-24 bg-white pb-4 pt-2 md:pb-6">
      <div className="container-site">
        <ul className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {PATHS.map((path) => {
            const dark = path.tone === "dark";
            return (
              <li key={path.href}>
                <Link
                  href={path.href}
                  className="group block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local editorial asset */}
                    <img
                      src={path.image}
                      alt={path.alt}
                      width={1200}
                      height={900}
                      className={cn(
                        "h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]",
                        path.imagePosition,
                      )}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div
                    className={cn(
                      "px-7 py-8 sm:px-8 sm:py-9",
                      dark ? "bg-primary text-white" : "bg-[#f4f1ec] text-primary",
                    )}
                  >
                    <h2 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-[1.7rem]">
                      {path.title}
                    </h2>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-relaxed sm:text-base",
                        dark ? "text-white/72" : "text-muted",
                      )}
                    >
                      {path.subtitle}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      {path.cta}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
