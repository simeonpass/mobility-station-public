import Link from "next/link";
import {
  BadgeCheck,
  CarFront,
  Clock,
  PackageCheck,
  Wrench,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MultimacFittingForm } from "@/components/forms/multimac-fitting-form";
import { CtaFooter } from "@/components/sections/cta-footer";
import { CatalogImage } from "@/components/product/catalog-image";
import {
  MULTIMAC_FITTING_KIT_URL,
  MULTIMAC_FITTING_PATH,
  MULTIMAC_FITTING_PRICE_GBP,
  MULTIMAC_QUOTE_URL,
  MULTIMAC_SITE_URL,
} from "@/lib/multimac-fitting";
import { formatGBP } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Multimac Fitting | £225 inc VAT",
  description:
    "Professional Multimac child car seat fitting at Heathrow and Ferndown. £225 including VAT. Book a date online if you have the seat and vehicle-specific fitting kit.",
  path: MULTIMAC_FITTING_PATH,
});

const STEPS = [
  {
    step: "01",
    title: "Order from Multimac",
    body: "Buy the Multimac and the vehicle-specific fitting kit from Multimac. One kit is usually included with a new seat.",
  },
  {
    step: "02",
    title: "Send it to us, or bring it",
    body: "Ask Multimac to deliver the seat to Heathrow or Ferndown, or bring the Multimac and kit with you on the day.",
  },
  {
    step: "03",
    title: "Book and pay",
    body: `Request a weekday, confirm the checks, and pay ${formatGBP(MULTIMAC_FITTING_PRICE_GBP)} including VAT at checkout.`,
  },
  {
    step: "04",
    title: "We fit it",
    body: "Our technicians install the tether straps to Multimac’s specification. Once fitted, the seat can be removed or refitted in a couple of minutes.",
  },
] as const;

const FAQS = [
  {
    q: "Do you sell the Multimac?",
    a: "No. You order the seat and fitting kit from Multimac. We are a professional fitting agent — the £225 fee is for installation only.",
  },
  {
    q: "What do I need to bring?",
    a: "Your car, the Multimac (unless Multimac is delivering it to us), and the correct vehicle-specific fitting kit. Kits are unique to make, model and year — a kit from a previous car cannot be reused.",
  },
  {
    q: "Can you do a special fitting?",
    a: "Yes. Some cars need two small floor mounts instead of using existing seat-belt buckle points. Tell us in the notes if Multimac has specified a special fitting kit.",
  },
  {
    q: "Is ISOFIX used?",
    a: "No. ISOFIX points are not strong enough for a Multimac and must not be used. We fit two tether straps to the correct chassis mounting points.",
  },
  {
    q: "Is the date I pick guaranteed?",
    a: "It is a request. After payment we confirm the appointment for Heathrow or Ferndown. Fittings need at least five days’ notice and are Monday to Friday.",
  },
] as const;

function HeroVisual() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-soft p-6 sm:p-8">
      <CatalogImage
        src="/images/multimac/1320-4seater.png"
        alt="Multimac four-seat child car seat system"
        width={761}
        height={428}
        className="mx-auto h-auto w-full max-w-lg object-contain"
        priority
      />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <img
          src="/images/multimac/logo.jpg"
          alt="Multimac"
          width={2048}
          height={769}
          className="h-8 w-auto object-contain"
        />
        <p className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">
          {formatGBP(MULTIMAC_FITTING_PRICE_GBP)} inc VAT
        </p>
      </div>
    </div>
  );
}

export default function MultimacFittingPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Multimac professional fitting",
      provider: {
        "@type": "LocalBusiness",
        name: SITE.name,
        telephone: SITE.phone,
      },
      areaServed: "GB",
      description:
        "Professional Multimac child car seat installation at Mobility Station workshops in Heathrow and Ferndown.",
      offers: {
        "@type": "Offer",
        price: MULTIMAC_FITTING_PRICE_GBP,
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <div className="container-site pt-7 md:pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Vehicle Adaptations", href: "/vehicle-adaptations" },
            { label: "Multimac fitting" },
          ]}
        />
      </div>

      <section className="ms-page-intro border-b border-border bg-white">
        <div className="container-site grid items-center gap-12 pb-14 md:pb-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:pb-24">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Mobility Station · Nominated fitting agent
            </p>
            <h1 className="text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">
              Multimac fitting.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Professional installation of your Multimac at Heathrow or
              Ferndown for {formatGBP(MULTIMAC_FITTING_PRICE_GBP)} including
              VAT. You order the seat and kit from Multimac — we fit it
              correctly to your car.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#book"
                className="inline-flex h-12 min-h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Book a fitting
              </a>
              <a
                href={MULTIMAC_QUOTE_URL}
                className="inline-flex h-12 min-h-12 items-center rounded-full border border-primary bg-white px-7 text-base font-semibold text-primary hover:bg-soft"
                target="_blank"
                rel="noopener noreferrer"
              >
                Order a Multimac
              </a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="border-b border-border bg-soft/45">
        <div className="container-site grid gap-4 py-5 text-sm sm:grid-cols-3 sm:gap-6">
          <p>
            <strong className="text-primary">
              {formatGBP(MULTIMAC_FITTING_PRICE_GBP)} inc VAT
            </strong>
            <br />
            <span className="text-muted">Fitting only — seat sold by Multimac</span>
          </p>
          <p>
            <strong className="text-primary">Heathrow &amp; Ferndown</strong>
            <br />
            <span className="text-muted">Workshop installation, weekday slots</span>
          </p>
          <p>
            <strong className="text-primary">Standard or special kits</strong>
            <br />
            <span className="text-muted">Including floor-mount special fittings</span>
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              From order to installation
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              How Multimac fitting works.
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((item) => (
              <li
                key={item.step}
                className="rounded-lg border border-border bg-white p-5 sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  {item.step}
                </p>
                <h3 className="mt-5 text-lg font-bold text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-soft/55 py-14 md:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              What we need
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Before you book.
            </h2>
            <p className="mt-4 text-muted">
              Multimac is a safety-critical product. We will only take a
              booking once these are in place.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                {
                  icon: PackageCheck,
                  title: "You have the Multimac",
                  body: "Either you already have the seat, or Multimac is delivering it to our Heathrow or Ferndown workshop.",
                },
                {
                  icon: Wrench,
                  title: "You have the fitting kit",
                  body: (
                    <>
                      Vehicle-specific tether straps, bolts and hardware from
                      Multimac — not off-the-shelf parts.{" "}
                      <a
                        href={MULTIMAC_FITTING_KIT_URL}
                        className="font-semibold text-primary underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Order a kit
                      </a>{" "}
                      if you are moving a used Multimac into a different car.
                    </>
                  ),
                },
                {
                  icon: BadgeCheck,
                  title: "The fitting is ordered from us",
                  body: "This page books the installation. The seat itself is purchased from Multimac; we charge the fitting fee only.",
                },
                {
                  icon: CarFront,
                  title: "Your car on the day",
                  body: "Bring the vehicle the kit was specified for. Allow around 60–90 minutes at the workshop.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold text-primary">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm md:p-8">
            <CatalogImage
              src="/images/multimac/superclub-3seater.png"
              alt="Multimac Superclub three-seat child car seat"
              width={761}
              height={428}
              className="h-auto w-full object-contain"
            />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Once the tether straps are in, the Multimac lifts in and out in
              a couple of minutes so you can recover the back seat or boot
              space. Images © Multimac, used with permission.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <Clock className="h-4 w-4" aria-hidden />
              Typical workshop time 60–90 minutes
            </p>
          </div>
        </div>
      </section>

      <section id="book" className="scroll-under-header py-14 md:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Book online
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Request a date and pay.
            </h2>
            <p className="mt-4 text-muted">
              Complete the checks, pick a weekday at Heathrow or Ferndown, then
              pay {formatGBP(MULTIMAC_FITTING_PRICE_GBP)} including VAT at
              checkout. We’ll email to confirm the appointment.
            </p>
            <p className="mt-6 text-sm text-muted">
              Still ordering the seat?{" "}
              <a
                href={MULTIMAC_SITE_URL}
                className="font-semibold text-primary underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get a quote from Multimac
              </a>
              , then come back to book the fit. Questions?{" "}
              <Link
                href="/contact"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Contact the team
              </Link>
              .
            </p>
          </div>
          <div className="rounded-lg border border-border bg-soft/55 p-6 md:p-8">
            <MultimacFittingForm />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-soft/55 py-14 md:py-20">
        <div className="container-site max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Common questions
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            Multimac fitting FAQs
          </h2>
          <dl className="mt-9 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {FAQS.map((item) => (
              <div key={item.q} className="border-t border-border pt-5">
                <dt className="font-bold text-primary">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaFooter
        title="Need help with a Multimac order?"
        subtitle="If you are unsure about the kit, a special fitting, or which branch to use, we’ll talk it through before you pay."
        primary={{ href: "/contact?interest=multimac-fitting", label: "Contact us" }}
        secondary={{ href: "/vehicle-adaptations", label: "All adaptations" }}
      />
    </>
  );
}
