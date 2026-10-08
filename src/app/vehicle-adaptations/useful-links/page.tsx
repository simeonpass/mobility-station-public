import Image from "next/image";
import { ArrowDown, ArrowUpRight, BookOpen, HeartHandshake, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Useful Links & Support for Vehicle Adaptations",
  description: "Helpful driving guidance, disability charities, accessible activities and contact details for Motability, grants and driving assessments.",
  path: "/vehicle-adaptations/useful-links",
});

type Resource = { logo: string; darkLogo?: boolean; name: string; topic: string; description: string; href: string; action: string };

const GUIDANCE: Resource[] = [
  {
    logo: "stroke-association.png", name: "Stroke Association", topic: "Driving after a stroke",
    description: "Information about returning to driving after a stroke or TIA, with a guide available to download from the Stroke Association.",
    href: "https://shop.stroke.org.uk/product/driving-after-stroke/", action: "Driving after stroke guide",
  },
  {
    logo: "mnd-association.png", name: "MND Association", topic: "Getting around",
    description: "A practical guide to driving, transport and mobility for people living with motor neurone disease or Kennedy’s disease.",
    href: "https://www.mndassociation.org/media/136", action: "Getting around guide (PDF)",
  },
  {
    logo: "british-heart-foundation.png", name: "British Heart Foundation", topic: "Heart conditions & driving",
    description: "Guidance on driving with a heart or circulatory condition, including where to find information about licences and insurance.",
    href: "https://www.bhf.org.uk/informationsupport/support/practical-support/driving", action: "Heart conditions and driving",
  },
  {
    logo: "arthritis-uk.svg", darkLogo: true, name: "Arthritis UK", topic: "Formerly Versus Arthritis",
    description: "Advice about driving with arthritis, including adaptations, managing discomfort and finding support to stay mobile.",
    href: "https://www.arthritis-uk.org/information-and-support/living-with-arthritis/work-benefits-and-finances/driving/", action: "Driving with arthritis",
  },
  {
    logo: "spinal-injuries-association.png", name: "Spinal Injuries Association", topic: "Accessible travel",
    description: "The Travel Hub brings together advice on accessible journeys, including driving and getting around after a spinal cord injury.",
    href: "https://www.spinal.co.uk/travel-hub/", action: "Explore the Travel Hub",
  },
  {
    logo: "fish-insurance.png", name: "Fish Insurance", topic: "Specialist insurance",
    description: "Information on specialist cover for adapted cars, mobility scooters, powered wheelchairs and manual wheelchairs.",
    href: "https://www.fishinsurance.co.uk/", action: "Explore Fish Insurance",
  },
];

const CHARITIES: Resource[] = [
  {
    logo: "speed-of-sight.png", name: "Speed of Sight", topic: "Inclusive driving experiences",
    description: "Supported driving experiences in specially adapted, dual-controlled cars for people with disabilities, including sight loss.",
    href: "https://speedofsight.org/", action: "Visit Speed of Sight",
  },
  {
    logo: "spinal-track.png", name: "Spinal Track", topic: "Track & car control experiences",
    description: "A charity offering disabled drivers the opportunity to try track days and car control experiences in adapted cars.",
    href: "https://spinaltrack.org/", action: "Visit Spinal Track",
  },
  {
    logo: "little-people-uk.png", name: "Little People UK", topic: "Support & community",
    description: "Friendship, information and support for people with dwarfism, their families and the people around them.",
    href: "https://littlepeopleuk.org/", action: "Visit Little People UK",
  },
  {
    logo: "euans-guide.png", name: "Euan’s Guide", topic: "Disabled access reviews",
    description: "Find accessibility information and reviews of places to visit, shared by disabled people, families and friends.",
    href: "https://www.euansguide.com/", action: "Explore Euan’s Guide",
  },
  {
    logo: "bwaa.png", name: "British Wheelchair Archery Association", topic: "Para-archery",
    description: "Support for disabled archers, from getting started in the sport to developing skills through coaching and training.",
    href: "https://british-wheelchair-archery.org.uk/", action: "Visit the BWAA",
  },
  {
    logo: "mission-motorsport.png", name: "Mission Motorsport", topic: "The Armed Forces community",
    description: "Recovery, rehabilitation and opportunities through motorsport and the automotive industry for people affected by military service.",
    href: "https://www.missionmotorsport.org/", action: "Visit Mission Motorsport",
  },
];

const CONTACTS = [
  {
    logo: "motability-scheme.jpg", name: "Motability Scheme", topic: "Scheme enquiries",
    description: "Help with joining the Scheme, an existing lease and general customer enquiries.",
    phone: "0300 456 4566", href: "https://www.motability.co.uk/get-support/contact", action: "Motability Scheme support",
  },
  {
    logo: "motability-foundation.jpg", name: "Motability Foundation", topic: "Grants & financial support",
    description: "Information about individual grants, including help with eligible vehicle and adaptation costs.",
    phone: "0800 500 3186", href: "https://www.motabilityfoundation.org.uk/individual-grants/cars-and-vehicle-adaptations", action: "Explore adaptation grants",
  },
  {
    logo: "driving-mobility.jpg", name: "Driving Mobility", topic: "Driving & mobility assessments",
    description: "Find an assessment centre for advice about driving, vehicle adaptations and your mobility needs.",
    phone: "0800 559 3636", href: "https://www.drivingmobility.org.uk/find-a-centre/", action: "Find an assessment centre",
  },
];

const SECTIONS = [
  { id: "driving-guidance", label: "Driving guidance", icon: BookOpen },
  { id: "charities", label: "Charities & organisations", icon: HeartHandshake },
  { id: "useful-contacts", label: "Useful contacts", icon: Phone },
];

function OrganisationLogo({ src, dark = false }: { src: string; dark?: boolean }) {
  return (
    <div className={`mb-6 flex h-28 items-center justify-center rounded-md px-5 ${dark ? "bg-primary" : "bg-white"}`}>
      <Image src={`/images/support-organisations/${src}`} alt="" width={280} height={140} className="max-h-24 w-full max-w-[280px] object-contain" />
    </div>
  );
}

function ResourceCards({ resources }: { resources: Resource[] }) {
  return (
    <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <li key={resource.name} className="flex flex-col rounded-lg border border-border bg-white p-6 sm:p-7">
          <OrganisationLogo src={resource.logo} dark={resource.darkLogo} />
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{resource.topic}</p>
          <h3 className="mt-3 text-xl font-bold leading-snug text-primary">{resource.name}</h3>
          <p className="mt-3 flex-1 text-base leading-relaxed text-muted">{resource.description}</p>
          <a href={resource.href} className="mt-5 inline-flex min-h-11 items-center justify-between gap-3 border-t border-border pt-4 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
            {resource.action}<ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function UsefulLinksPage() {
  return (
    <>
      <CatalogIntro
        eyebrow="Vehicle adaptations · Advice & support"
        title="Useful links & support."
        subtitle="A helping hand for life on the move. Find driving guidance, supportive communities and the right people to speak to about your next step."
        primary={{ href: "#driving-guidance", label: "Explore the links" }}
        secondary={{ href: "#useful-contacts", label: "Useful contact numbers" }}
      />
      <div className="border-b border-border bg-white">
        <div className="container-site py-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vehicle adaptations", href: "/vehicle-adaptations" }, { label: "Useful links & support" }]} />
          <nav aria-label="On this page" className="flex flex-wrap gap-3">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <a key={id} href={`#${id}`} className="inline-flex min-h-12 items-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-semibold text-primary hover:bg-soft">
                <Icon className="h-4 w-4" aria-hidden />{label}<ArrowDown className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </nav>
        </div>
      </div>
      <section id="driving-guidance" aria-labelledby="guidance-heading" className="scroll-under-header bg-soft/40 py-12 md:py-16">
        <div className="container-site">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">01 / Helpful information</p>
          <h2 id="guidance-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Driving with confidence.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">Explore information about driving with a health condition, accessible travel and specialist insurance.</p>
          <aside className="mt-6 max-w-3xl rounded-md border-l-4 border-accent bg-white p-5 text-sm leading-relaxed text-primary">
            If you are unsure whether a health condition affects your driving, speak to your doctor and check the <a href="https://www.gov.uk/driving-medical-conditions" className="font-semibold underline underline-offset-4">DVLA’s medical conditions guidance</a>.
          </aside>
          <ResourceCards resources={GUIDANCE} />
        </div>
      </section>
      <section id="charities" aria-labelledby="charities-heading" className="scroll-under-header border-t border-border py-12 md:py-16">
        <div className="container-site">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">02 / Charities & organisations</p>
          <h2 id="charities-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">More ways to get involved.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">Discover supportive communities, accessible places and opportunities to try something new.</p>
          <ResourceCards resources={CHARITIES} />
        </div>
      </section>
      <section id="useful-contacts" aria-labelledby="contacts-heading" className="scroll-under-header border-y border-border bg-soft/60 py-12 md:py-16">
        <div className="container-site">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">03 / Useful contacts</p>
          <h2 id="contacts-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">The right people to call.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">Speak directly to the teams who can help with the Motability Scheme, financial support or a driving assessment.</p>
          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {CONTACTS.map((contact) => (
              <li key={contact.name} className="flex flex-col rounded-lg border border-border bg-white p-6 sm:p-7">
                <OrganisationLogo src={contact.logo} />
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{contact.topic}</p>
                <h3 className="mt-3 text-xl font-bold text-primary">{contact.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{contact.description}</p>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} aria-label={`Call ${contact.name} on ${contact.phone}`} className="mt-5 inline-flex min-h-12 items-center gap-3 text-2xl font-bold tracking-tight text-primary hover:underline">
                  <Phone className="h-5 w-5 shrink-0" aria-hidden />{contact.phone}
                </a>
                <a href={contact.href} className="mt-3 inline-flex min-h-11 items-center justify-between gap-3 border-t border-border pt-4 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
                  {contact.action}<ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">Links take you directly to each organisation’s own website. Contact details checked in October 2026.</p>
        </div>
      </section>
      <CtaFooter
        title="Let’s find the right adaptation for you."
        subtitle="Our team can talk you through the options and check what will work with your vehicle. Visit us in Heathrow or Ferndown, or get in touch for friendly advice."
        primary={{ href: "/contact?interest=vehicle-adaptations", label: "Talk to our team" }}
        secondary={{ href: "/vehicle-adaptations", label: "Explore vehicle adaptations" }}
      />
    </>
  );
}
