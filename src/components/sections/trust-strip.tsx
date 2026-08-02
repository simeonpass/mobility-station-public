import Link from "next/link";
import { TRUST_ITEMS } from "@/data/content";

export function TrustStrip() {
  return (
    <section
      className="bg-primary py-6 text-primary-foreground"
      aria-label="Trust highlights"
    >
      <div className="container-site">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => {
            const isDemo = item === "Free Home Demonstrations";
            return (
              <li
                key={item}
                className="flex items-center gap-3 text-sm font-semibold md:text-base"
              >
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                {isDemo ? (
                  <Link
                    href="/book-a-demo#demo-terms"
                    className="hover:text-accent"
                  >
                    Free Home Demonstrations*
                  </Link>
                ) : (
                  item
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-white/65 sm:text-left">
          * Motability scooter &amp; wheelchair home demos are free. Private and
          vehicle adaptation home visits are £100 — deducted if you buy a
          scooter/wheelchair from us, or refunded if an adaptation order goes
          ahead.{" "}
          <Link
            href="/book-a-demo#demo-terms"
            className="underline underline-offset-2 hover:text-accent"
          >
            Full terms
          </Link>
        </p>
      </div>
    </section>
  );
}
