import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Car,
  Home,
  MapPinned,
  Wrench,
} from "lucide-react";
import { CtaFooter } from "@/components/sections/cta-footer";
import {
  ImageCollage,
  type CollageTile,
} from "@/components/sections/image-collage";
import { Testimonials } from "@/components/sections/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { getBranches, getReviews } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "About us",
  description:
    "Mobility Station — Motability-accredited specialists in vehicle adaptations, scooters and wheelchairs across Greater London and the South from Heathrow and Ferndown.",
  path: "/about-us",
  image: "/images/hero-options/04-workshop-service.png",
});

export const revalidate = 300;

const ABOUT_TILES: CollageTile[] = [
  {
    src: "/images/hero-options/04-workshop-service.png",
    alt: "Engineer servicing mobility equipment in our workshop",
    object: "object-center",
  },
  {
    src: "/images/hero-options/06-customer-handover.png",
    alt: "Customer handover after a home demonstration",
    object: "object-[50%_20%]",
  },
  {
    src: "/images/hero-options/05-hand-controls.png",
    alt: "Hand controls fitted in a customer vehicle",
    object: "object-center",
  },
  {
    src: "/images/hero-options/03-scooter-handover.png",
    alt: "Mobility scooter demonstration with a customer",
    object: "object-center",
  },
  {
    src: "/images/hero-options/10-workshop-overview.png",
    alt: "Overview of our workshop and stock",
    object: "object-center",
  },
];

const PILLARS = [
  {
    icon: Home,
    title: "We come to you",
    body: "A demonstration on your driveway or at your front door shows how something will really work — kerbs, parking, thresholds and all.",
  },
  {
    icon: Wrench,
    title: "Our own engineers",
    body: "Vehicle adaptations are assessed, quoted and fitted by our own team at Heathrow and Ferndown. We stand behind the work.",
  },
  {
    icon: BadgeCheck,
    title: "Motability accredited",
    body: "Scooters, wheelchairs and many vehicle adaptations are available through the Motability Scheme, with guidance in plain English.",
  },
  {
    icon: MapPinned,
    title: "Two workshops",
    body: "Heathrow covers west London and the Thames Valley. Ferndown covers Dorset, Hampshire and the surrounding south coast.",
  },
] as const;

const SPECIALISMS = [
  {
    icon: Car,
    title: "Vehicle adaptations",
    body: "Hand controls, swivel seats, boot hoists, steering aids and access solutions — quoted against your specific car.",
    href: "/vehicle-adaptations",
    cta: "Explore adaptations",
  },
  {
    icon: Home,
    title: "Scooters & wheelchairs",
    body: "New, Motability and clearance stock you can try at home before you commit — plus hire when buying isn’t right yet.",
    href: "/shop",
    cta: "Browse the shop",
  },
] as const;

export default async function AboutPage() {
  const [branches, reviews] = await Promise.all([
    getBranches(),
    getReviews(),
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE.url,
      telephone: SITE.phone,
      email: SITE.email,
      description:
        "Mobility Station supplies and fits mobility scooters, wheelchairs and vehicle adaptations from Heathrow and Ferndown.",
      sameAs: [],
      areaServed: "GB",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "About us",
          item: `${SITE.url}/about-us`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      {/* Hero — brand + story + real workshop imagery */}
      <section className="overflow-hidden bg-hero-mesh">
        <div className="container-site grid items-center gap-10 py-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:py-16 lg:gap-14 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/55">
              About us
            </p>
            <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Independence, fitted{" "}
              <span className="text-accent">around your life.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Mobility Station helps people stay mobile with honest advice,
              equipment you can try at home, and vehicle adaptations fitted by
              our own engineers at Heathrow and Ferndown.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book-a-demo"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
              >
                Book a Demo
              </Link>
              <Link
                href="/contact?interest=callback#callback"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full bg-white/70",
                )}
              >
                Request a callback
              </Link>
            </div>
          </div>
          <ImageCollage tiles={ABOUT_TILES} priority />
        </div>
      </section>

      {/* Story */}
      <section className="py-14 md:py-16">
        <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Who we are
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/85 md:text-lg">
              <p>
                Mobility Station is the trading name of Adaptation Station Ltd.
                We are a Motability-accredited team with two workshops — one
                near Heathrow, one in Ferndown — built around a simple idea: the
                best mobility decisions happen where you live, not in an
                unfamiliar showroom.
              </p>
              <p>
                So we bring scooters, wheelchairs and adaptation options to you.
                We explain the trade-offs in plain English. And when something
                needs fitting or servicing, it is our own engineers who do the
                work and answer the phone afterwards.
              </p>
              <p>
                Whether you need hand controls, a boot hoist, a folding travel
                chair or a full-size scooter, we help you compare the realistic
                options — private purchase, Motability or hire — without
                pressure.
              </p>
            </div>
          </div>

          <aside className="border-t-2 border-accent pt-6 lg:border-t-0 lg:border-l-2 lg:pl-8 lg:pt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/50">
              At a glance
            </p>
            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-sm text-muted">Legal name</dt>
                <dd className="mt-0.5 font-semibold text-primary">
                  {SITE.legalName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Trading as</dt>
                <dd className="mt-0.5 font-semibold text-primary">
                  {SITE.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Workshops</dt>
                <dd className="mt-0.5 font-semibold text-primary">
                  Heathrow &amp; Ferndown
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Accreditation</dt>
                <dd className="mt-0.5 font-semibold text-primary">
                  Motability Scheme dealer
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Contact</dt>
                <dd className="mt-0.5">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* How we work */}
      <section className="border-y border-border bg-soft py-14 md:py-16">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              How we work
            </h2>
            <p className="mt-3 text-muted">
              Practical support from first conversation through fitting,
              servicing and long-term aftercare.
            </p>
          </div>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="border-t border-border pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Two specialisms */}
      <section className="py-14 md:py-16">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Two specialisms. One team.
            </h2>
            <p className="mt-3 text-muted">
              We lead with vehicle adaptations, and we take scooters and
              wheelchairs just as seriously.
            </p>
          </div>
          <ul className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
            {SPECIALISMS.map(({ icon: Icon, title, body, href, cta }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group block border-t-2 border-border pt-6 transition-colors hover:border-accent"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-primary group-hover:text-primary-dark">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
                    {body}
                  </p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                    {cta} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-muted">
            Also explore{" "}
            <Link
              href="/motability"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Motability
            </Link>
            ,{" "}
            <Link
              href="/hire"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Hire &amp; Flex Hire
            </Link>
            , and{" "}
            <Link
              href="/blog"
              className="font-semibold text-primary underline underline-offset-2"
            >
              recent work from our workshops
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Branches */}
      <section className="border-y border-border bg-soft py-14 md:py-16">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Heathrow &amp; Ferndown
            </h2>
            <p className="mt-3 text-muted">
              Visit us with parking and step-free access — or we come to you for
              a home demonstration.
            </p>
          </div>
          <ul className="mt-10 grid gap-8 md:grid-cols-2">
            {branches.map((branch) => (
              <li key={branch.id} className="border-t border-border pt-6">
                <h3 className="text-xl font-extrabold text-primary">
                  {branch.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                  {branch.addressLine1}
                  {branch.addressLine2 ? <>, {branch.addressLine2}</> : null}
                  <br />
                  {branch.addressLocality}, {branch.postalCode}
                </p>
                <ul className="mt-4 space-y-1 text-sm text-muted">
                  {branch.openingHours.slice(0, 3).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <Link
            href="/locations"
            className="mt-8 inline-flex text-sm font-semibold text-primary underline underline-offset-2"
          >
            Full opening hours, map &amp; coverage →
          </Link>
        </div>
      </section>

      {/* Proof */}
      {reviews.length > 0 ? <Testimonials reviews={reviews} /> : null}

      {/* Quiet visual break with one workshop image */}
      <section className="pb-4">
        <div className="container-site">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-soft md:aspect-[24/9]">
            <Image
              src="/images/hero-options/14-van-adaptations-mobility.png"
              alt="Mobility Station van and workshop team supporting customers"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          </div>
        </div>
      </section>

      <CtaFooter
        title="Ready to talk it through?"
        subtitle="Book a home demonstration, visit a branch, or request a callback — we’ll help you find what fits."
      />
    </>
  );
}
