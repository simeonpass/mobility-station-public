import Link from "next/link";
import { Check } from "lucide-react";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import { FLEX_SETUP_FEE_GBP } from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;
export const metadata = createMetadata({
  title: "Mobility Scooter & Wheelchair Hire | Mobility Station",
  description:
    "Hire a mobility scooter or wheelchair. Choose short-term hire (3–28 days) or Flex monthly hire. Heathrow and Ferndown. Book online or call us.",
  path: "/hire",
  absoluteTitle: true,
});

const OPTIONS = [
  {
    eyebrow: "3–28 days",
    title: "Short-term hire",
    body: "For holidays, recovery, hospital visits or when you only need equipment for a few days or weeks.",
    points: [
      "3 to 28 days",
      "Hire plus refundable deposit",
      "Free collection from Heathrow or Ferndown",
    ],
    href: "/hire/short-term",
    book: "/hire/short-term#book",
    cta: "Explore short-term hire",
  },
  {
    eyebrow: "3+ months",
    title: "Flex monthly hire",
    body: "For longer use without buying outright. Servicing, batteries and breakdown cover are included.",
    points: [
      "3 months minimum, then monthly",
      `First month + ${formatGBP(FLEX_SETUP_FEE_GBP)} set-up`,
      "Delivery and handover included",
    ],
    href: "/hire/flex",
    book: "/hire/flex#book",
    cta: "Explore Flex hire",
  },
] as const;

function HireVisual() {
  return (
    <div className="grid h-[390px] grid-cols-5 grid-rows-2 gap-3 sm:h-[470px] sm:gap-4 lg:h-[500px]">
      <div className="relative col-span-3 row-span-2 overflow-hidden rounded-[2rem] bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- static editorial asset */}
        <img
          src="/images/hero-options/03-scooter-handover.webp"
          alt="Mobility scooter demonstration"
          className="h-full w-full object-cover object-center"
          width={900}
          height={1100}
        />
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/82 p-4 text-white sm:inset-x-5 sm:bottom-5 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            Short-term or Flex
          </p>
          <p className="mt-1 text-sm font-semibold">
            Scooters and wheelchairs from Heathrow &amp; Ferndown
          </p>
        </div>
      </div>
      <div className="relative col-span-2 overflow-hidden rounded-[1.6rem] bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- static editorial asset */}
        <img
          src="/images/hero-options/02-wav-powerchair.webp"
          alt="Powered wheelchair"
          className="h-full w-full object-cover"
          width={700}
          height={500}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold text-primary">
          Wheelchairs
        </span>
      </div>
      <div className="relative col-span-2 overflow-hidden rounded-[1.6rem] bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- static editorial asset */}
        <img
          src="/images/hero-options/06-customer-handover.webp"
          alt="Mobility Station customer support"
          className="h-full w-full object-cover"
          width={700}
          height={500}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1.5 text-[11px] font-bold text-white">
          Handover included
        </span>
      </div>
    </div>
  );
}

export default function HirePage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Hire", item: `${SITE.url}/hire` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbLd)}
      />
      <section className="border-b border-border bg-white">
        <div className="container-site grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Mobility Station · Hire
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">
              Mobility when you need it.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Choose short-term hire for days or weeks, or Flex for longer-term
              monthly use with ongoing support included.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/hire/short-term#book"
                className="rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Book short-term
              </Link>
              <Link
                href="/hire/flex#book"
                className="rounded-full border border-primary px-7 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Book Flex
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">
              Not sure? Call{" "}
              <a href={SITE.phoneHref} className="font-bold text-primary">
                {SITE.phone}
              </a>{" "}
              and we’ll help you choose.
            </p>
          </div>
          <HireVisual />
        </div>
      </section>

      <section className="border-b border-border py-14 md:py-20">
        <div className="container-site max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Simple booking
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            How hire works.
          </h2>
          <ol className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              [
                "01",
                "Choose the term",
                "Under a month is short-term. Three months or more is Flex, with servicing included.",
              ],
              [
                "02",
                "Book and pay online",
                "Pick dates or a start month, then pay the hire and any deposit securely.",
              ],
              [
                "03",
                "Collect or we deliver",
                "Free collection from Heathrow or Ferndown, or delivery and handover where available.",
              ],
            ].map(([step, title, body]) => (
              <li key={step} className="rounded-2xl border border-border p-6">
                <p className="text-xs font-bold text-muted">{step}</p>
                <h3 className="mt-5 text-lg font-extrabold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site grid gap-5 lg:grid-cols-2">
          {OPTIONS.map((option, index) => (
            <article
              key={option.title}
              className={cn(
                "flex flex-col rounded-[2rem] border p-7 md:p-9",
                index === 1
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white",
              )}
            >
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.16em]",
                  index === 1 ? "text-accent" : "text-muted",
                )}
              >
                {option.eyebrow}
              </p>
              <h2
                className={cn(
                  "mt-3 text-3xl font-extrabold tracking-tight md:text-4xl",
                  index === 1 ? "text-white" : "text-primary",
                )}
              >
                {option.title}
              </h2>
              <p
                className={cn(
                  "mt-4 text-base leading-relaxed md:text-lg",
                  index === 1 ? "text-white/70" : "text-muted",
                )}
              >
                {option.body}
              </p>
              <ul className="mt-7 space-y-3">
                {option.points.map((point) => (
                  <li
                    key={point}
                    className={cn(
                      "flex items-center gap-3 text-sm",
                      index === 1 ? "text-white/85" : "text-foreground/85",
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={option.href}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full px-6",
                    index === 1 &&
                      "bg-accent text-accent-foreground hover:bg-accent-hover",
                  )}
                >
                  {option.cta}
                </Link>
                <Link
                  href={option.book}
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold",
                    index === 1
                      ? "border-white/30 text-white hover:bg-white hover:text-primary"
                      : "border-primary text-primary hover:bg-primary hover:text-white",
                  )}
                >
                  Book now
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="container-site mt-10">
          <div className="max-w-3xl border-t border-border pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Quick guide
            </p>
            <p className="mt-3 text-lg leading-relaxed text-muted">
              Under a month? <strong className="text-primary">Short-term</strong>{" "}
              is usually the right fit. Need it for longer?{" "}
              <strong className="text-primary">Flex</strong> is designed for
              ongoing use and includes servicing support.
            </p>
          </div>
        </div>
      </section>

      <CtaFooter
        title="Ready to book hire?"
        subtitle="Short-term for days or weeks, or Flex for monthly use with servicing included. Call if you’d rather talk it through."
        primary={{ href: "/hire/short-term#book", label: "Book short-term hire" }}
        secondary={{ href: "/hire/flex#book", label: "Book Flex hire" }}
      />
    </>
  );
}
