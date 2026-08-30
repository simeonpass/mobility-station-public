import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PATHS = [
  {
    eyebrow: "01",
    title: "Vehicle adaptations",
    description:
      "Hand controls, swivel seats, boot hoists, access and Motability solutions — supplied and fitted by our specialist team.",
    href: "/vehicle-adaptations",
    cta: "Explore adaptations",
  },
  {
    eyebrow: "02",
    title: "Scooters & wheelchairs",
    description:
      "Carefully selected mobility products with expert advice, demonstrations and ongoing support from Heathrow and Ferndown.",
    href: "/shop",
    cta: "Browse the shop",
  },
] as const;

export function HomePaths() {
  return (
    <section id="what-we-do" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              What we do
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-extrabold tracking-[-0.035em] text-primary md:text-5xl">
              Two specialisms. One standard of care.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-muted lg:justify-self-end">
            From adapting a vehicle to choosing the right mobility product, our
            aim is simple: clear advice, professional support and equipment that
            genuinely fits your life.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {PATHS.map((path) => (
            <li key={path.href}>
              <Link
                href={path.href}
                className="group flex min-h-[18rem] flex-col rounded-[1.75rem] border border-border bg-[#f7f7f7] p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_18px_50px_-32px_rgba(17,17,17,0.35)] md:p-9"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-sm font-semibold text-muted">
                    {path.eyebrow}
                  </span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>

                <div className="mt-auto pt-16">
                  <h3 className="text-3xl font-extrabold tracking-[-0.03em] text-primary md:text-[2.1rem]">
                    {path.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                    {path.description}
                  </p>
                  <span className="mt-7 inline-flex text-sm font-semibold text-primary">
                    {path.cta}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
