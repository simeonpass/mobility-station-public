import Link from "next/link";
import { SOLUTIONS } from "@/data/content";

export function SolutionsGrid() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Solutions we bring to you
          </h2>
          <p className="mt-3 text-muted">
            From vehicle adaptations to scooters and wheelchairs — assessed at home
            or at our Heathrow and Ferndown branches.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block h-full border-b border-border pb-5 transition-colors hover:border-accent"
              >
                <h3 className="text-lg font-bold text-primary group-hover:text-primary-dark">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
