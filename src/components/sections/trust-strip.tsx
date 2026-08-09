import Link from "next/link";
import { TRUST_ITEMS } from "@/data/content";
import { cn } from "@/lib/utils";

export function TrustStrip() {
  return (
    <section
      className="bg-primary py-6 text-primary-foreground"
      aria-label="Trust highlights"
    >
      <div className="container-site">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, index) => {
            const isDemo = item === "Free Home Demonstrations";
            return (
              <li
                key={item}
                className="flex items-center gap-3 text-sm font-semibold md:text-base"
              >
                <span
                  className={cn(
                    "inline-block h-2.5 w-2.5 shrink-0 rounded-full",
                    index % 2 === 1 ? "bg-tertiary" : "bg-accent",
                  )}
                  aria-hidden
                />
                {isDemo ? (
                  <Link
                    href="/book-a-demo#demo-terms"
                    className="hover:text-tertiary"
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
          * Free demonstrations at our Heathrow and Ferndown branches. Home
          demonstrations are £195 — deducted in full from your price if you go
          ahead. Waived for the{" "}
          <Link
            href="/motability"
            className="font-semibold text-tertiary underline underline-offset-2 hover:text-tertiary/90"
          >
            Motability
          </Link>{" "}
          Powered Wheelchair &amp; Scooter Scheme.{" "}
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
