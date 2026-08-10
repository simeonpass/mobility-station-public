import Link from "next/link";

const PATHS = [
  {
    title: "Vehicle adaptations",
    description:
      "Hand controls, swivel seats, boot hoists, access and Motability solutions — supplied and fitted by our team.",
    href: "/vehicle-adaptations",
    cta: "Explore adaptations",
  },
  {
    title: "Scooters & wheelchairs",
    description:
      "New, Motability and clearance mobility products, with home demonstrations from Heathrow and Ferndown.",
    href: "/shop",
    cta: "Browse the shop",
  },
] as const;

export function HomePaths() {
  return (
    <section id="what-we-do" className="scroll-mt-24 py-16 md:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            Two specialisms. One team.
          </h2>
          <p className="mt-3 text-muted">
            We lead with vehicle adaptations, and we take scooters and
            wheelchairs just as seriously — choose the path that fits you.
          </p>
        </div>

        <ul className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
          {PATHS.map((path) => (
            <li key={path.href}>
              <Link
                href={path.href}
                className="group block border-t-2 border-border pt-6 transition-colors hover:border-tertiary"
              >
                <h3 className="text-2xl font-extrabold tracking-tight text-primary group-hover:text-primary-dark md:text-3xl">
                  {path.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
                  {path.description}
                </p>
                <span className="mt-5 inline-flex text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                  {path.cta} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
