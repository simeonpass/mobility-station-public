import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
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

export default function HirePage() {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbLd)}
      />

      <section className="border-b border-border bg-soft/40">
        <div className="container-site py-10 md:py-14">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Hire" }]}
          />
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Hire a scooter or wheelchair
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
            Please choose the type of hire that fits you. We keep it simple —
            one choice, then clear prices and booking.
          </p>
          <p className="mt-4 text-base text-muted md:text-lg">
            Not sure which one? Call us and we will help:{" "}
            <a
              href={SITE.phoneHref}
              className="font-bold text-primary underline underline-offset-2"
            >
              {SITE.phone}
            </a>
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-site grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="flex flex-col border border-border bg-white p-6 transition-colors hover:border-tertiary/60 md:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-muted">
              Option 1
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-primary">
              Short-term hire
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/85">
              For a few days or a few weeks. Holidays, hospital visits, or
              trying a scooter before you buy.
            </p>
            <ul className="mt-5 space-y-3 text-base text-foreground/85">
              <li>
                <strong className="text-primary">How long:</strong> 3 to 28 days
              </li>
              <li>
                <strong className="text-primary">You pay:</strong> hire + a
                refundable deposit
              </li>
              <li>
                <strong className="text-primary">Collect free</strong> from
                Heathrow or Ferndown, or we can deliver
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/hire/short-term"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-md text-base",
                )}
              >
                See short-term hire
              </Link>
              <Link
                href="/hire/short-term#book"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-md bg-white text-base",
                )}
              >
                Book short-term
              </Link>
            </div>
          </article>

          <article className="flex flex-col border border-border bg-white p-6 transition-colors hover:border-tertiary/60 md:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-muted">
              Option 2
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-primary">
              Flex monthly hire
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/85">
              For longer use. Pay each month. Servicing, batteries and
              breakdown cover are included.
            </p>
            <ul className="mt-5 space-y-3 text-base text-foreground/85">
              <li>
                <strong className="text-primary">How long:</strong> 3 months
                minimum, then month by month
              </li>
              <li>
                <strong className="text-primary">You pay today:</strong> first
                month + {formatGBP(FLEX_SETUP_FEE_GBP)} set-up
              </li>
              <li>
                <strong className="text-primary">We deliver</strong> and show you
                how to use it
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/hire/flex"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-md text-base",
                )}
              >
                See Flex hire
              </Link>
              <Link
                href="/hire/flex#book"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-md bg-white text-base",
                )}
              >
                Book Flex
              </Link>
            </div>
          </article>
        </div>

        <div className="container-site mt-10 max-w-3xl border-t border-border pt-8">
          <h2 className="text-xl font-extrabold text-primary md:text-2xl">
            Quick tip
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-foreground/85">
            If you only need it for under a month, choose{" "}
            <strong>short-term</strong>. If you need it for longer,{" "}
            <strong>Flex</strong> is usually simpler and better value — and we
            look after servicing for you.
          </p>
        </div>
      </section>
    </>
  );
}
