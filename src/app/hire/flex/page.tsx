import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HireEnquiryForm } from "@/components/hire/hire-enquiry-form";
import { HireFaq } from "@/components/hire/hire-faq";
import { HirePricingTable } from "@/components/hire/hire-pricing-table";
import { HireSelfServeForm } from "@/components/hire/hire-self-serve-form";
import { buttonVariants } from "@/components/ui/button";
import { getHireCategoryImages } from "@/lib/hire-images";
import {
  FLEX_FAQS,
  FLEX_SETUP_FEE_GBP,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Flex Monthly Mobility Scooter & Wheelchair Hire | Mobility Station",
  description:
    "Flex monthly hire for scooters and wheelchairs. Servicing, batteries and breakdown cover included. Book online from Heathrow and Ferndown.",
  path: "/hire/flex",
  absoluteTitle: true,
});

export default async function FlexHirePage() {
  const imagesList = await getHireCategoryImages();
  const images = Object.fromEntries(
    imagesList.map((img) => [img.id, { src: img.src, alt: img.alt }]),
  ) as Record<HirePricingCategoryId, { src: string | null; alt: string }>;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hire",
        item: `${SITE.url}/hire`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Flex hire",
        item: `${SITE.url}/hire/flex`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FLEX_FAQS.map((faq) => ({
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
            items={[
              { label: "Home", href: "/" },
              { label: "Hire", href: "/hire" },
              { label: "Flex" },
            ]}
          />
          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-muted">
            Flex monthly hire
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Hire month by month — we look after it
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
            Ideal if you need a scooter or wheelchair for longer than a few
            weeks. Servicing, batteries and breakdown cover are included.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#book"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md text-base",
              )}
            >
              Book Flex hire
            </Link>
            <Link
              href="#prices"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md bg-white text-base",
              )}
            >
              See monthly prices
            </Link>
            <a
              href={SITE.phoneHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md bg-white text-base",
              )}
            >
              Call {SITE.phone}
            </a>
          </div>
          <p className="mt-6 text-base text-muted">
            Only need it for under a month?{" "}
            <Link
              href="/hire/short-term"
              className="font-bold text-primary underline underline-offset-2"
            >
              See short-term hire
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            What you get with Flex
          </h2>
          <ul className="mt-6 space-y-3 text-lg leading-relaxed text-foreground/85">
            <li>Annual servicing and day-to-day care</li>
            <li>New batteries when the old ones wear out</li>
            <li>Breakdown repairs — and a loan machine if needed</li>
            <li>No repair bills for fair wear and tear</li>
            <li>Change to a different model after 3 months if you need to</li>
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-soft/50 py-10 md:py-14">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            How Flex payment works
          </h2>
          <ol className="mt-6 space-y-5">
            {[
              {
                t: "Pay today",
                d: `First month + ${formatGBP(FLEX_SETUP_FEE_GBP)} set-up. The set-up covers delivery, set-up and a clear handover.`,
              },
              {
                t: "Then pay each month",
                d: "Always one month in advance. Your first month is held as a rolling deposit.",
              },
              {
                t: "Cancel when you are ready",
                d: "No tie-in after the first 3 months. Just tell us when you no longer need it — no long notice period.",
              },
            ].map((step, i) => (
              <li
                key={step.t}
                className="flex gap-4 border-t border-border pt-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary text-lg font-extrabold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-primary">
                    {step.t}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-muted">
                    {step.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="prices"
        className="scroll-mt-24 border-b border-border py-10 md:py-14"
      >
        <div className="container-site">
          <HirePricingTable images={images} lockedMode="flex" />
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site">
          <HireFaq title="Flex hire questions" faqs={FLEX_FAQS} />
        </div>
      </section>

      <section
        id="book"
        className="scroll-mt-24 border-b border-border py-10 md:py-14"
      >
        <div className="container-site grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
              Book Flex hire
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Pay your first month and set-up online. We deliver, set up, and
              show you how to use the machine.
            </p>
            <p className="mt-4 text-base text-muted">
              Prefer to talk first? Call{" "}
              <a
                href={SITE.phoneHref}
                className="font-bold text-primary underline underline-offset-2"
              >
                {SITE.phone}
              </a>
              .
            </p>
            <p className="mt-6 text-base text-muted">
              <Link
                href="/hire/terms"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Hire terms &amp; conditions
              </Link>
            </p>
          </div>
          <div className="border border-border bg-white p-6 md:p-8">
            <HireSelfServeForm defaultHireType="flex" lockHireType />
          </div>
        </div>
      </section>

      <section
        id="enquiry-fallback"
        className="scroll-mt-24 bg-soft/40 py-10 md:py-14"
      >
        <div className="container-site grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-xl font-extrabold text-primary md:text-2xl">
              Want us to call you first?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Send a short message if you would rather talk before paying.
            </p>
          </div>
          <div className="border border-border bg-white p-6 md:p-8">
            <HireEnquiryForm defaultHireType="flex" />
          </div>
        </div>
      </section>
    </>
  );
}
