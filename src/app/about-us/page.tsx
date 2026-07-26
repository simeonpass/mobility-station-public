import Link from "next/link";
import { BadgeCheck, Home, MapPinned, Wrench } from "lucide-react";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Mobility Station",
  description:
    "Mobility Station helps people stay independent with home demonstrations, Motability support and vehicle adaptations fitted at Heathrow & Ferndown.",
  path: "/about-us",
});

const FACTS = [
  {
    icon: Home,
    title: "We come to you",
    body: "Trying equipment where you live, park and shop tells you more than any showroom can.",
  },
  {
    icon: Wrench,
    title: "Our own workshops",
    body: "Adaptations are fitted and serviced by our own engineers at Heathrow and Ferndown.",
  },
  {
    icon: BadgeCheck,
    title: "Motability accredited",
    body: "We support scheme customers on scooters, wheelchairs and many vehicle adaptations.",
  },
  {
    icon: MapPinned,
    title: "Two bases, wide reach",
    body: "Heathrow covers the west of London and the Thames Valley; Ferndown covers Dorset and Hampshire.",
  },
] as const;

export default function AboutPage() {
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
      <Hero
        compact
        title="About Mobility Station"
        subtitle="We help people stay independent with honest advice, equipment you can try at home, and adaptations fitted by our own engineers."
        primaryHref="/contact"
        primaryLabel="Talk to the team"
        secondaryHref="/locations"
        secondaryLabel="Find your branch"
      />

      <section className="pb-12 md:pb-14">
        <div className="container-site max-w-3xl space-y-5 text-lg leading-relaxed text-foreground/85">
          <p>
            Mobility Station is built around a simple idea: the best mobility
            decisions happen where you live, not in an unfamiliar showroom. So we
            bring scooters, wheelchairs and adaptation options to you, and we
            explain the trade-offs in plain English.
          </p>
          <p>
            From our Heathrow and Ferndown workshops we look after private
            customers and Motability clients through assessment, fitting,
            servicing and long-term support. Vehicle adaptations are always
            quoted against your specific car before any work is booked, because
            compatibility matters more than a price list.
          </p>
          <p>
            Whether you need hand controls, a boot hoist, a folding travel chair
            or a full-size scooter, we will help you compare the realistic
            options without pressure.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-soft py-12 md:py-14">
        <div className="container-site">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            How we work
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-muted">
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

      <CtaFooter />
    </>
  );
}
