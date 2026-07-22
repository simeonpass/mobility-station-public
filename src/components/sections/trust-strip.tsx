import { TRUST_ITEMS } from "@/data/content";

export function TrustStrip() {
  return (
    <section className="bg-primary py-6 text-primary-foreground" aria-label="Trust highlights">
      <div className="container-site">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-sm font-semibold md:text-base"
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
