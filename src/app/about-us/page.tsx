import Link from "next/link";
import {
  BadgeCheck,
  HandHeart,
  MapPinned,
  Store,
  Truck,
  Wrench,
} from "lucide-react";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Testimonials } from "@/components/sections/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { getReviewsSummary } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "About Mobility Station",
  description:
    "Independent mobility specialists at Heathrow and Ferndown — try scooters and wheelchairs at a branch for free, or book a home demonstration. Motability, adaptations, hire and honest advice.",
  path: "/about-us",
});

const PILLARS = [
  {
    icon: Store,
    title: "Come to us — free",
    body: "Visit Heathrow or Ferndown and try scooters and wheelchairs with no visit fee. A good starting point if you prefer not to pay anything up front.",
  },
  {
    icon: Truck,
    title: "Or we come to you",
    body: "Happy to demonstrate at home where it helps. Branch demos are free; home demonstrations are £195 (deducted if you buy; waived for Motability PWSS) — see how it works below.",
  },
  {
    icon: Wrench,
    title: "Our own workshops",
    body: "Adaptations are assessed, fitted and serviced by our engineers — not subcontracted out and forgotten.",
  },
  {
    icon: BadgeCheck,
    title: "Motability accredited",
    body: "Scheme customers get clear weekly figures, the right paperwork, and help choosing equipment that fits real life.",
  },
] as const;

const PATHS = [
  {
    href: "/shop",
    label: "Scooters & wheelchairs",
    blurb: "New stock from leading brands — try at a branch or book a demo.",
  },
  {
    href: "/clearance",
    label: "Clearance",
    blurb: "Ex-demo and pre-owned, graded A–C so you know the condition.",
  },
  {
    href: "/hire",
    label: "Hire & Flex",
    blurb: "Short-term or monthly hire when you need it for a while.",
  },
  {
    href: "/vehicle-adaptations",
    label: "Vehicle adaptations",
    blurb: "Quoted against your car — hand controls, hoists and more.",
  },
  {
    href: "/motability",
    label: "Motability",
    blurb: "Weekly allowance prices on scooters and powerchairs.",
  },
  {
    href: "/locations",
    label: "Heathrow & Ferndown",
    blurb: "Two workshops with parking and step-free access.",
  },
] as const;

export default async function AboutPage() {
  const reviewSummary = await getReviewsSummary();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    description:
      "Mobility Station supplies and fits mobility scooters, wheelchairs and vehicle adaptations from Heathrow and Ferndown.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <CatalogIntro
        title="About Mobility Station"
        subtitle="Independent specialists helping people stay mobile — try equipment at our branches for free, or ask us to come out. Honest advice, and adaptations fitted by our own engineers."
        primary={{ href: "/book-a-demo", label: "Book a demonstration" }}
        secondary={{ href: "/locations", label: "Find your branch" }}
      />

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-foreground/85 md:text-lg">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              Built around real life, not pressure
            </h2>
            <p>
              Mobility Station is built on a simple idea: you should be able to
              try equipment properly before you decide. You’re welcome to visit
              Heathrow or Ferndown at no charge, or we can come to you when a
              home visit makes more sense — we’ll explain which option applies
              before we book anything.
            </p>
            <p>
              From both workshops we look after private customers and Motability
              clients through assessment, fitting, servicing and long-term
              support — whether that’s a folding travel chair, a full-size
              scooter, hand controls or a boot hoist.
            </p>
            <p>
              Vehicle adaptations are always quoted against your specific car
              before any work is booked. Compatibility matters more than a
              generic price list.
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-soft/70 p-6 md:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Two bases
            </p>
            <ul className="mt-4 space-y-5">
              <li>
                <h3 className="font-extrabold text-primary">Heathrow</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  West of London and the Thames Valley — workshop, demos and
                  local delivery.
                </p>
              </li>
              <li>
                <h3 className="font-extrabold text-primary">Ferndown</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Dorset and Hampshire — same service, same standards, closer to
                  home for the South West.
                </p>
              </li>
            </ul>
            <Link
              href="/locations"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-6 rounded-full bg-white",
              )}
            >
              <MapPinned className="h-4 w-4" aria-hidden />
              Opening hours &amp; maps
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-b border-border bg-soft py-10 md:py-14">
        <div className="container-site">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            How we work
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
            We want you to try before you decide — either at a branch with no
            visit fee, or at home when that suits you better.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-primary">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 max-w-3xl rounded-2xl border border-border bg-white p-6 md:p-7">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-primary">
                <HandHeart className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-primary">
                  Demonstrations — kept simple
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Branch visits are always free at Heathrow and Ferndown. Home
                  demonstrations are{" "}
                  <strong className="font-semibold text-foreground">
                    £195
                  </strong>{" "}
                  flat — non-refundable, but deducted in full from your price if
                  you go ahead. Waived for the Motability Powered Wheelchair
                  &amp; Scooter Scheme (PWSS).
                </p>
                <p className="mt-3 text-sm text-muted">
                  <Link
                    href="/book-a-demo#demo-terms"
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    Full demonstration terms
                  </Link>
                  {" · "}
                  <Link
                    href="/book-a-demo"
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    Book a demonstration
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-14">
        <div className="container-site">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            What we can help with
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
            One team across purchase, hire, Motability and vehicle adaptations.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PATHS.map(({ href, label, blurb }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex h-full flex-col rounded-2xl border border-border bg-white px-5 py-4 transition-colors hover:border-primary/35 hover:bg-soft/40"
                >
                  <span className="font-extrabold text-primary">{label}</span>
                  <span className="mt-1 text-sm leading-relaxed text-muted">
                    {blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            See{" "}
            <Link
              href="/blog"
              className="font-semibold text-primary underline underline-offset-2"
            >
              recent work from our workshops
            </Link>
            , or read the{" "}
            <Link
              href="/faq"
              className="font-semibold text-primary underline underline-offset-2"
            >
              common questions
            </Link>
            .
          </p>
        </div>
      </section>

      <Testimonials
        reviews={reviewSummary.reviews}
        averageRating={reviewSummary.averageRating}
        totalReviews={reviewSummary.totalReviews}
        googleMapsUrl={reviewSummary.googleMapsUrl}
        profiles={reviewSummary.profiles}
      />

      <CtaFooter
        title="Ready when you are"
        subtitle="Pop into Heathrow or Ferndown free of charge, or book a demonstration — we’ll confirm the right option before we visit."
        primary={{ href: "/book-a-demo", label: "Book a demonstration" }}
        secondary={{ href: "/locations", label: "Visit a branch" }}
      />
    </>
  );
}
