import Link from "next/link";
import { MapPin, Users, Wrench } from "lucide-react";

const ITEMS = [
  {
    icon: Wrench,
    label: "Specialist fitting & support",
  },
  {
    icon: MapPin,
    label: "Two dedicated branches",
  },
  {
    icon: Users,
    label: "Personal demonstrations",
  },
] as const;

export function TrustStrip() {
  return (
    <section
      className="border-y border-border bg-[#f7f7f7] py-6 md:py-7"
      aria-label="Trust highlights"
    >
      <div className="container-site">
        <ul className="grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-border">
          {ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 sm:justify-center sm:px-6"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/35 text-accent"
                aria-hidden
              >
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-semibold text-primary md:text-[0.95rem]">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
          Branch demonstrations at Heathrow and Ferndown are free. Home
          demonstrations are £195 — deducted in full if you go ahead, and waived
          for the Motability Powered Wheelchair &amp; Scooter Scheme.{" "}
          <Link
            href="/book-a-demo#demo-terms"
            className="font-medium text-primary underline underline-offset-2"
          >
            Full terms
          </Link>
        </p>
      </div>
    </section>
  );
}
