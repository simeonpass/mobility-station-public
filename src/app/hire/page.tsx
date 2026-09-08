import { CatalogIntro } from "@/components/sections/catalog-intro";
import { TrustStrip } from "@/components/sections/trust-strip";
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
      <CatalogIntro breadcrumb="Hire" eyebrow="Hire, on your terms" title={<>Freedom for now.<br />Support for the journey.</>} subtitle="A few days away or a longer stretch at home. Hire a scooter or wheelchair with the help you need from our Heathrow and Ferndown teams." primary={{ href: "#hire-options", label: "Find your hire option" }} image={{ src: "/images/redesign/scooter.webp", alt: "Mobility scooter customer demonstration" }} /><TrustStrip />

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

      <section id="hire-options" className="py-14 md:py-20 scroll-under-header">
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
                  index === 1 ? "text-accent-on-dark" : "text-muted",
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
