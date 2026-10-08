import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Phone, Wrench, HeartHandshake, Accessibility, Store } from "lucide-react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { MobilityBadge } from "@/components/autoros/mobility-badge";
import { SITE } from "@/lib/seo";
import type { Branch } from "@/lib/types";

type Category = { title: string; description: string; image: string; alt: string; href: string; cta: string };

const adaptations: Category[] = [
  { title: "Driving controls", description: "Make driving work for you, with controls fitted to suit your needs.", image: "ms-controls.webp", alt: "Hand controls inside a vehicle", href: "/vehicle-adaptations/driving-controls", cta: "Explore driving controls" },
  { title: "Getting in & out", description: "Explore swivel seats and other ways to make vehicle access easier.", image: "ms-seat.webp", alt: "A wheelchair user approaching a vehicle with an accessible seat", href: "/vehicle-adaptations/vehicle-access", cta: "Explore vehicle access" },
  { title: "Boot hoists & stowage", description: "Take your scooter or wheelchair with you, with less lifting.", image: "ms-hoist.webp", alt: "A demonstration of a boot hoist", href: "/vehicle-adaptations/hoists-stowage", cta: "Explore hoists & stowage" },
];
const mobility: Category[] = [
  { title: "Mobility scooters", description: "Find a scooter for your routine, your journeys and your space.", image: "ms-mobility.webp", alt: "An older adult using a mobility scooter in a park", href: "/shop?sub=scooters", cta: "Explore mobility scooters" },
  { title: "Powered wheelchairs", description: "Discover powered mobility options for everyday independence.", image: "ms-powerchair.webp", alt: "A person using a powered wheelchair outdoors", href: "/shop?sub=wheelchairs", cta: "Explore powered mobility" },
  { title: "Manual wheelchairs", description: "Explore practical options for comfort, travel and everyday use.", image: "ms-wheelchair.webp", alt: "A person using a manual wheelchair outdoors", href: "/shop?sub=wheelchairs&q=manual", cta: "Explore manual wheelchairs" },
];
const steps = [
  { title: "Start with a conversation", description: "Tell us about your vehicle, your routine and what you want to make easier." },
  { title: "Find the right fit", description: "Explore suitable adaptations or try mobility equipment with our team’s guidance." },
  { title: "Keep moving with support", description: "Get help with fitting, getting started, servicing and aftercare." },
];

function Categories({ id, eyebrow, title, description, href, linkLabel, items, soft = false }: {
  id: string; eyebrow: string; title: string; description: string; href: string; linkLabel: string; items: Category[]; soft?: boolean;
}) {
  return (
    <section className={`ms-section ms-categories${soft ? " ms-surface-soft" : ""}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="ms-wrap">
        <div className="ms-section-heading">
          <div className="ms-intro"><p className="ms-eyebrow">{eyebrow}</p><h2 id={`${id}-title`}>{title}</h2><p>{description}</p></div>
          <Link href={href} className="ms-link">{linkLabel}<ArrowUpRight size={20} aria-hidden /></Link>
        </div>
        <div className="ms-category-grid">
          {items.map((item, index) => (
            <Link href={item.href} key={item.href} className="ms-category-card">
              <div className="ms-category-image"><Image src={`/images/autoros/${item.image}`} alt={item.alt} width={1200} height={800} unoptimized /></div>
              <div className="ms-category-body"><span className="ms-category-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p><span className="ms-card-link">{item.cta}<ArrowUpRight size={21} aria-hidden /></span></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MobilityHome({ branches }: { branches: Branch[] }) {
  return (
    <div className="ms-home">
      <section className="ms-section ms-hero" aria-labelledby="ms-home-title">
        <div className="ms-wrap ms-hero-grid">
          <div className="ms-hero-copy">
            <p className="ms-eyebrow">Vehicle adaptations &amp; mobility products</p>
            <h1 id="ms-home-title">More freedom.<br /><span>Every journey.</span></h1>
            <p className="ms-hero-description">Vehicle adaptations fitted around you. Scooters and wheelchairs chosen for your life. Friendly advice to help you move with confidence.</p>
            <div className="ms-actions"><Link href="/vehicle-adaptations" className="ms-button ms-button-light">Vehicle adaptations<ArrowUpRight size={22} aria-hidden /></Link><Link href="/shop" className="ms-button ms-button-hero-outline">Scooters &amp; wheelchairs<ArrowUpRight size={22} aria-hidden /></Link></div>
            <p className="ms-hero-assurance"><span><Check size={15} aria-hidden /></span>Advice, fitting and aftercare. With you at every step.</p>
          </div>
          <div className="ms-hero-visual">
            <Image src="/images/autoros/ms-hoist-hero-approved.webp" alt="A demonstration of lifting a mobility scooter into a vehicle with a boot hoist" width={1536} height={1024} loading="eager" fetchPriority="high" unoptimized />
            <p>The right adaptation.<br /><strong>More possibilities.</strong></p>
          </div>
        </div>
      </section>
      <div className="ms-service-strip"><div className="ms-wrap">
        <span><Wrench aria-hidden />Specialist adaptation fitting</span><span><Accessibility aria-hidden />Scooters &amp; wheelchairs to explore</span><span><Store aria-hidden />Two local branches</span><span><HeartHandshake aria-hidden />Support beyond your purchase</span>
      </div></div>
      <Categories id="adaptations" eyebrow="Vehicle adaptations" title="Your vehicle. Adapted to you." description="Explore ways to make driving, getting in and out, and taking your mobility equipment with you easier." href="/vehicle-adaptations" linkLabel="Explore all adaptations" items={adaptations} />
      <Categories id="mobility" eyebrow="Scooters & wheelchairs" title="More of the life you love." description="From everyday errands to getting out and about. Explore mobility equipment, with friendly advice and the chance to arrange a demonstration." href="/shop" linkLabel="Shop all mobility products" items={mobility} soft />
      <section className="ms-section ms-about" aria-labelledby="ms-about-title">
        <div className="ms-wrap ms-about-grid">
          <div className="ms-about-visual"><Image src="/images/autoros/ms-scooter.webp" alt="A mobility scooter handover" width={1200} height={800} unoptimized /><MobilityBadge /></div>
          <div className="ms-about-copy"><p className="ms-eyebrow">People first. Always.</p><h2 id="ms-about-title">A little help.<br />A world of difference.</h2><p>The right solution starts with understanding you. Our teams bring together vehicle adaptation fitting and everyday mobility advice, so you can take your next step with confidence.</p>
            <ol className="ms-steps">{steps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
            <Link href="/about-us" className="ms-link">Get to know Mobility Station<ArrowUpRight size={21} aria-hidden /></Link>
          </div>
        </div>
      </section>
      <section className="ms-section ms-branches ms-surface-soft" id="ms-branches" aria-labelledby="ms-branches-title">
        <div className="ms-wrap"><div className="ms-section-heading"><div className="ms-intro"><p className="ms-eyebrow">Local advice. Specialist know-how.</p><h2 id="ms-branches-title">Come and meet us.</h2><p>Visit our team for advice, fitting and help finding the right mobility solution.</p></div><Link className="ms-link" href="/locations">Opening times &amp; directions<ArrowUpRight size={20} aria-hidden /></Link></div>
          <div className="ms-branch-grid">{branches.map((branch) => <article className="ms-branch" key={branch.id}><p className="ms-eyebrow"><MapPin size={16} aria-hidden />{branch.slug === "heathrow" ? "West London" : "Dorset"}</p><h3>{branch.slug === "heathrow" ? "Heathrow / West Drayton" : "Ferndown / Dorset"}</h3><address>{branch.addressLine1}<br />{branch.addressLine2 ? <>{branch.addressLine2}<br /></> : null}{branch.addressLocality}, {branch.postalCode}</address><p>{branch.slug === "heathrow" ? "Vehicle adaptation advice, specialist fitting and workshop support." : "Vehicle adaptation advice and fitting, plus scooters and wheelchairs to view and try."}</p><div className="ms-branch-actions"><a href={`tel:${branch.phone.replace(/\s/g, "")}`}><Phone size={18} aria-hidden />{branch.phone}</a><Link href={`/contact#branch-${branch.slug}`} className="ms-link">Arrange a visit<ArrowUpRight size={18} aria-hidden /></Link></div></article>)}</div>
          <div className="ms-motability"><div><p className="ms-eyebrow">The Motability Scheme</p><h3>Guidance for your next journey.</h3></div><div className="ms-actions"><Link href="/motability/vehicle-adaptations" className="ms-link">Vehicle adaptations<ArrowUpRight size={20} aria-hidden /></Link><Link href="/motability" className="ms-link">Scooters &amp; powered wheelchairs<ArrowUpRight size={20} aria-hidden /></Link></div></div>
        </div>
      </section>
      <section className="ms-section ms-contact" id="ms-enquiry" aria-labelledby="ms-contact-title">
        <div className="ms-wrap ms-contact-grid"><div className="ms-contact-copy"><p className="ms-eyebrow">Let’s find your way forward</p><h2 id="ms-contact-title">Not sure where<br />to start?</h2><p>Tell us what you have in mind. We can help with vehicle adaptations, mobility equipment and arranging a visit.</p><a className="ms-contact-phone" href={SITE.phoneHref}>{SITE.phone}</a><a className="ms-contact-email" href={`mailto:${SITE.email}`}>{SITE.email}</a><p className="ms-contact-note">Prefer to try something first? <Link href="/book-a-demo">Arrange a demonstration<ArrowUpRight size={16} aria-hidden /></Link></p></div><div className="ms-contact-form"><EnquiryForm enquiryType="contact" showDate={false} inline /><p className="ms-privacy">We’ll use these details to respond to your enquiry. <Link href="/privacy-policy">Privacy policy</Link></p></div></div>
      </section>
    </div>
  );
}
