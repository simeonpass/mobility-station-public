import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HireEnquiryForm } from "@/components/hire/hire-enquiry-form";
import { HireFaq } from "@/components/hire/hire-faq";
import { HirePricingTable } from "@/components/hire/hire-pricing-table";
import { HireSelfServeForm } from "@/components/hire/hire-self-serve-form";
import { buttonVariants } from "@/components/ui/button";
import { getHireCategoryImages } from "@/lib/hire-images";
import {
  LOCAL_DELIVERY_FEE_GBP,
  LOCAL_DELIVERY_MILES,
  SHORT_TERM_FAQS,
  WIDER_DELIVERY_FROM_GBP,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Short-Term Mobility Scooter & Wheelchair Hire | Mobility Station",
  description:
    "Hire a mobility scooter or wheelchair for 3 to 28 days. Book and pay online. Free collection from Heathrow or Ferndown, or delivery available.",
  path: "/hire/short-term",
  absoluteTitle: true,
});

export default async function ShortTermHirePage() {
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
        name: "Short-term hire",
        item: `${SITE.url}/hire/short-term`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SHORT_TERM_FAQS.map((faq) => ({
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
              { label: "Short-term" },
            ]}
          />
          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-muted">
            Short-term hire
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Hire for a few days or weeks
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
            From 3 days up to 28 days. Book online, pay by card, and we deliver
            — or collect free from our Heathrow or Ferndown branch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#book"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md text-base",
              )}
            >
              Book short-term hire
            </Link>
            <Link
              href="#prices"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md bg-white text-base",
              )}
            >
              See prices
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
            Need it longer than 28 days?{" "}
            <Link
              href="/hire/flex"
              className="font-bold text-primary underline underline-offset-2"
            >
              See Flex monthly hire
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            How it works
          </h2>
          <ol className="mt-6 space-y-5">
            {[
              {
                t: "Choose your dates and equipment",
                d: "Tell us how long you need it and the user’s height and weight so we pick a safe machine.",
              },
              {
                t: "Pay online today",
                d: "Pay the hire and a refundable deposit by card. Tick VAT relief if the hire is for a disabled person’s own use.",
              },
              {
                t: "We deliver — or you collect free",
                d: "We bring it to you, or you collect from Heathrow or Ferndown by appointment. That’s it.",
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
          <HirePricingTable images={images} lockedMode="short" />
        </div>
      </section>

      <section className="border-b border-border bg-soft/50 py-10 md:py-14">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            Delivery or free collection
          </h2>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-foreground/85">
            <li>
              <strong className="text-primary">Collect free</strong> from
              Heathrow (West Drayton) or Ferndown (Wimborne), by appointment.
            </li>
            <li>
              <strong className="text-primary">Local delivery</strong>{" "}
              {formatGBP(LOCAL_DELIVERY_FEE_GBP)} within {LOCAL_DELIVERY_MILES}{" "}
              miles — we drop it off and show you the basics.
            </li>
            <li>
              <strong className="text-primary">Further away</strong>{" "}
              {formatGBP(WIDER_DELIVERY_FROM_GBP)} for about 15–40 miles. Outside
              that, please collect or call us.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site">
          <HireFaq title="Short-term hire questions" faqs={SHORT_TERM_FAQS} />
        </div>
      </section>

      <section
        id="book"
        className="scroll-mt-24 border-b border-border py-10 md:py-14"
      >
        <div className="container-site grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
              Book short-term hire
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Fill in the form and pay securely. We will match a suitable
              machine and arrange delivery or collection.
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
            <HireSelfServeForm defaultHireType="short" lockHireType />
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
              Send a short message if your dates are flexible or you would
              rather not pay until we have spoken.
            </p>
          </div>
          <div className="border border-border bg-white p-6 md:p-8">
            <HireEnquiryForm defaultHireType="short" />
          </div>
        </div>
      </section>
    </>
  );
}
