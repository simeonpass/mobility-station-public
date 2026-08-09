import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HireEnquiryForm } from "@/components/hire/hire-enquiry-form";
import { HireFaq } from "@/components/hire/hire-faq";
import { HirePricingTable } from "@/components/hire/hire-pricing-table";
import { buttonVariants } from "@/components/ui/button";
import { getHireCategoryImages } from "@/lib/hire-images";
import {
  FLEX_SETUP_FEE_GBP,
  HIRE_COMPARISON_ROWS,
  HIRE_FAQS,
  LOCAL_DELIVERY_FEE_GBP,
  LOCAL_DELIVERY_MILES,
  WIDER_DELIVERY_FROM_GBP,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Mobility Scooter & Wheelchair Hire | Short-Term & Flex | Mobility Station",
  description:
    "Hire a mobility scooter or wheelchair from 3 days, or take Flex monthly hire with servicing, batteries and breakdown cover included. Heathrow & Ferndown.",
  path: "/hire",
  absoluteTitle: true,
});

export default async function HirePage() {
  const imagesList = await getHireCategoryImages();
  const images = Object.fromEntries(
    imagesList.map((img) => [img.id, { src: img.src, alt: img.alt }]),
  ) as Record<HirePricingCategoryId, { src: string | null; alt: string }>;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hire",
        item: `${SITE.url}/hire`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HIRE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqLd)}
      />

      <section className="border-b border-border bg-soft/40">
        <div className="container-site py-10 md:py-14">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Hire" }]}
          />
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Mobility scooter &amp; wheelchair hire
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Short-term hire from 3 to 28 days, or Flex monthly hire with
            servicing, batteries and breakdown cover included. From our Heathrow
            and Ferndown branches.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#enquiry"
              className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
            >
              Request a hire quote
            </Link>
            <Link
              href="#pricing"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md bg-white",
              )}
            >
              View prices
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site grid gap-10 md:grid-cols-2">
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-extrabold text-primary md:text-2xl">
              Short-term hire
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              Minimum 3 days. Maximum 28 days — after that the only option is
              Flex. Paid up front, with a refundable damage deposit of £100–£250
              by equipment type.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/85">
              <li>Fully charged and safety-checked machine</li>
              <li>Charger, keys and basket where fitted</li>
              <li>Breakdown repair-or-swap</li>
              <li>Free collection from Heathrow or Ferndown</li>
            </ul>
          </div>
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-extrabold text-primary md:text-2xl">
              Flex hire (long term)
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              Minimum term 3 months, then rolling with 30 days&apos; notice. One
              month paid up front as a deposit, then monthly in advance — always
              a month ahead. Deposit returned at the end less damage beyond fair
              wear and tear. One-off {formatGBP(FLEX_SETUP_FEE_GBP)} set-up fee
              includes delivery, set-up and handover.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/85">
              <li>Annual servicing and routine maintenance</li>
              <li>Battery replacement when capacity drops</li>
              <li>Breakdown repairs with a loan machine</li>
              <li>No repair bills for fair wear and tear</li>
              <li>Model swap allowed after 3 months</li>
            </ul>
          </div>
        </div>
        <div className="container-site mt-8 max-w-3xl border-t border-border pt-6">
          <h3 className="text-base font-extrabold text-primary">
            Why short-term stops at 28 days
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Beyond a month the machine needs servicing, battery care and cover a
            daily rate cannot fund — and Flex is much cheaper per week.
          </p>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-b border-border py-10 md:py-14">
        <div className="container-site">
          <HirePricingTable images={images} />
        </div>
      </section>

      <section className="border-b border-border bg-soft/50 py-10 md:py-14">
        <div className="container-site">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            Delivery, collection and set-up
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            <li className="border-t border-border pt-4">
              <h3 className="font-extrabold text-primary">Collect from us — free</h3>
              <p className="mt-2 text-sm text-muted">
                Heathrow (West Drayton) or Ferndown (Wimborne), by appointment.
              </p>
            </li>
            <li className="border-t border-border pt-4">
              <h3 className="font-extrabold text-primary">Local delivery</h3>
              <p className="mt-2 text-sm text-muted">
                {formatGBP(LOCAL_DELIVERY_FEE_GBP)} round trip within{" "}
                {LOCAL_DELIVERY_MILES} miles of either branch, including handover
                and a run-through.
              </p>
            </li>
            <li className="border-t border-border pt-4">
              <h3 className="font-extrabold text-primary">Wider delivery</h3>
              <p className="mt-2 text-sm text-muted">
                From {formatGBP(WIDER_DELIVERY_FROM_GBP)} for 15–40 miles. London
                quoted on postcode because of traffic, parking and the Congestion
                Charge.
              </p>
            </li>
            <li className="border-t border-border pt-4">
              <h3 className="font-extrabold text-primary">Flex hire</h3>
              <p className="mt-2 text-sm text-muted">
                Delivery and handover included in the{" "}
                {formatGBP(FLEX_SETUP_FEE_GBP)} set-up fee.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            Short-term vs Flex
          </h2>
          <div className="mt-6 overflow-x-auto border-y border-border">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-soft/60 text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-3 py-3"> </th>
                  <th className="px-3 py-3">Short-term</th>
                  <th className="px-3 py-3">Flex</th>
                </tr>
              </thead>
              <tbody>
                {HIRE_COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border/80">
                    <th className="px-3 py-3 text-left font-semibold text-primary">
                      {row.label}
                    </th>
                    <td className="px-3 py-3 text-foreground/85">{row.short}</td>
                    <td className="px-3 py-3 text-foreground/85">{row.flex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-soft/40 py-10 md:py-14">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            How hiring works
          </h2>
          <ol className="mt-6 space-y-5">
            {[
              {
                t: "Tell us what you need",
                d: "Dates, the user’s height and weight, and the address.",
              },
              {
                t: "We match the equipment",
                d: "Right category, availability and price confirmed.",
              },
              {
                t: "Pay and sign",
                d: "Hire charge and deposit up front, short hire agreement, plus a VAT relief declaration if it applies.",
              },
              {
                t: "Delivery and handover",
                d: "Our own engineer delivers, sets it up for the user and shows them how to use and charge it.",
              },
            ].map((step, i) => (
              <li
                key={step.t}
                className="flex gap-4 border-t border-border pt-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary text-sm font-extrabold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-extrabold text-primary">{step.t}</h3>
                  <p className="mt-1 text-sm text-muted">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">
            Full agreement:{" "}
            <Link
              href="/hire/terms"
              className="font-semibold text-primary underline underline-offset-2"
            >
              hire terms &amp; conditions
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site">
          <HireFaq />
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-24 py-10 md:py-14">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">
              Ready when you are
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Send the form and we&apos;ll confirm what&apos;s available. Or call{" "}
              <a
                href={SITE.phoneHref}
                className="font-semibold text-primary underline underline-offset-2"
              >
                {SITE.phone}
              </a>
              .
            </p>
          </div>
          <div className="border border-border bg-white p-6 md:p-8">
            <HireEnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
