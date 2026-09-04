import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PATHS = [
  {
    eyebrow: "Vehicle independence",
    title: "Vehicle adaptations",
    href: "/vehicle-adaptations",
    cta: "Explore adaptations",
    image: "/images/hero-options/07-swivel-seat.webp",
    alt: "Swivel seat vehicle adaptation fitted by Mobility Station",
    imagePosition: "object-[50%_48%]",
  },
  {
    eyebrow: "Mobility products",
    title: "Scooters & wheelchairs",
    href: "/shop",
    cta: "Browse the shop",
    image: "/images/hero-options/03-scooter-handover.webp",
    alt: "Mobility scooter demonstration and customer handover",
    imagePosition: "object-[55%_42%]",
  },
] as const;

export function HomePaths() {
  return (
    <section id="what-we-do" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            What we do
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">
            Two specialisms. One standard of care.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Specialist support for your car and your everyday mobility, backed by experienced teams at Heathrow and Ferndown.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:gap-6">
          {PATHS.map((path) => (
            <li key={path.href}>
              <Link
                href={path.href}
                className="group relative block overflow-hidden rounded-[2rem] bg-[#111111] shadow-[0_18px_50px_-36px_rgba(17,17,17,0.45)]"
              >
                <div className="relative h-[22rem] overflow-hidden sm:h-[25rem] lg:h-[29rem]">
                  <img
                    src={path.image}
                    alt={path.alt}
                    width={1200}
                    height={900}
                    className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] ${path.imagePosition}`}
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-9">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                          {path.eyebrow}
                        </p>
                        <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">
                          {path.title}
                        </h3>
                        <span className="mt-4 inline-flex text-sm font-semibold text-white/88">
                          {path.cta}
                        </span>
                      </div>

                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white backdrop-blur-sm transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#111111]">
                        <ArrowUpRight className="h-5 w-5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
