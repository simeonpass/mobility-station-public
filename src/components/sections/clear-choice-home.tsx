import Image from "next/image";
import Link from "next/link";
import { Accessibility, ArrowRight, CalendarDays, Car, Check, CircleGauge, Handshake, Mail, MapPin, Phone, ShieldCheck, Star, Users } from "lucide-react";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { HomeEvidence } from "@/components/sections/home-evidence";
import type { RecentWorkProject } from "@/lib/recent-work";
import { adaptationHref } from "@/lib/adaptations";
import { SITE } from "@/lib/seo";
import type { Branch, ReviewsSummary } from "@/lib/types";

type Props = { branches: Branch[]; reviews: { averageRating: number; totalReviews: number }; evidence: { reviews: ReviewsSummary; project?: RecentWorkProject } };

function MobilityIcon({ kind }: { kind: "scooter" | "chair" | "hoist" | "seat" }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "scooter" ? <><circle cx="12" cy="37" r="5" /><circle cx="37" cy="37" r="5" /><path d="M12 32h25l-5-20h-7M32 12V8h-7M18 30V20h-8v-9M10 20h13M16 30l-4 7" /></> : kind === "hoist" ? <><path d="M7 41h34M14 41V23l20-14h7M14 23h20M34 9v22M29 31h10v10H29zM10 23h8" /><circle cx="14" cy="23" r="3" /></> : kind === "seat" ? <><path d="M16 6h10l3 20H16zM16 26h20v7H16zM22 33v7M13 42h20M10 23v11h7" /></> : <><circle cx="20" cy="7" r="3" /><path d="M19 13v14h15l6 12M19 20h12M14 23a11 11 0 1 0 13 15" /></>}
  </svg>;
}

const categories = [
  { title: "Driving controls", copy: "Confidence behind the wheel", href: adaptationHref("Mechanical Hand Controls"), image: "/images/redesign/controls.webp", alt: "Hand controls inside a vehicle", side: "adapt" },
  { title: "Vehicle access", copy: "Getting in and out, made easier", href: adaptationHref("Swivel Seats"), image: "/images/redesign/seat.webp", alt: "A swivel seat at a vehicle doorway", side: "adapt" },
  { title: "Boot hoists", copy: "Take your mobility equipment with you", href: adaptationHref("Boot Hoists"), image: "/images/hero-options/hoist-demonstration.webp", alt: "A boot hoist demonstration", side: "adapt" },
  { title: "Mobility scooters", copy: "For everyday and further afield", href: "/shop?sub=scooters", image: "/images/redesign/mobility-scooter-lifestyle.webp", alt: "An older adult riding a four-wheel mobility scooter in a leafy park", side: "shop" },
  { title: "Powerchairs", copy: "Comfort and control, your way", href: "/shop?sub=wheelchairs", image: "/images/redesign/powerchair-lifestyle.webp", alt: "An older adult using a joystick-controlled powerchair on a park path", side: "shop" },
  { title: "Wheelchairs", copy: "Explore our wheelchair range", href: "/shop?sub=wheelchairs", image: "/images/redesign/manual-wheelchair-lifestyle.webp", alt: "An older adult using a manual wheelchair on a leafy park path", side: "shop" },
];

export function ClearChoiceHome({ branches, reviews, evidence }: Props) {
  return <div className="msx-home">
    <section className="msx-container msx-hero" aria-labelledby="home-title">
      <div className="msx-hero-heading">
        <div><p className="msx-eyebrow">Vehicle adaptations. Everyday mobility.</p><h1 id="home-title">Keeping you moving<span>.</span></h1><p className="msx-intro">Expert vehicle adaptations, mobility scooters and wheelchairs.<br className="msx-desktop-break" /> What can we help you with?</p></div>
      </div>
      <div className="msx-portals">
        <Link href="/vehicle-adaptations" className="msx-portal msx-portal-adapt">
          <div className="msx-portal-photo"><Image src="/images/redesign/seat.webp" alt="" fill sizes="(max-width: 700px) 36vw, 28vw" priority fetchPriority="high" /></div>
          <div className="msx-portal-content">
            <div className="msx-portal-heading"><span className="msx-portal-icon"><Car size={27} aria-hidden /></span><h2>Vehicle<br className="msx-mobile-break" /> adaptations</h2></div>
            <p className="msx-portal-title">Make your vehicle <br />work for you.</p>
            <p className="msx-portal-description">Help with driving, getting in and out, and lifting your scooter or wheelchair into your vehicle.</p>
            <div className="msx-portal-features" aria-hidden="true"><span><CircleGauge /><span>Hand<br />controls</span></span><span><MobilityIcon kind="seat" /><span>Swivel<br />seats</span></span><span><MobilityIcon kind="hoist" /><span>Boot<br />hoists</span></span></div>
            <span className="msx-mobile-summary">Hand controls, boot hoists &amp; swivel seats</span>
            <span className="msx-button msx-portal-button"><span>Explore vehicle adaptations</span><ArrowRight size={20} aria-hidden /></span>
          </div>
        </Link>
        <Link href="/shop" className="msx-portal msx-portal-shop">
          <div className="msx-portal-photo"><Image src="/images/redesign/scooter.webp" alt="" fill sizes="(max-width: 700px) 36vw, 28vw" priority fetchPriority="high" /></div>
          <div className="msx-portal-content">
            <div className="msx-portal-heading"><span className="msx-portal-icon"><Accessibility size={29} aria-hidden /></span><h2>Scooters &amp;<br className="msx-mobile-break" /> wheelchairs</h2></div>
            <p className="msx-portal-title">Everyday freedom, <br />your way.</p>
            <p className="msx-portal-description">Find the right scooter or wheelchair for your life, with friendly advice and a chance to try before you buy.</p>
            <div className="msx-portal-features" aria-hidden="true"><span><MobilityIcon kind="scooter" /><span>Mobility<br />scooters</span></span><span><MobilityIcon kind="seat" /><span>Powered<br />wheelchairs</span></span><span><MobilityIcon kind="chair" /><span>Manual<br />wheelchairs</span></span></div>
            <span className="msx-mobile-summary">Mobility scooters, powerchairs &amp; wheelchairs</span>
            <span className="msx-button msx-portal-button"><span>Shop scooters &amp; wheelchairs</span><ArrowRight size={20} aria-hidden /></span>
          </div>
        </Link>
      </div>
      <div className="msx-trust" aria-label="Why choose Mobility Station">
        <span><ShieldCheck aria-hidden /><span><strong>Specialist advice</strong>Fitting &amp; aftercare</span></span>
        {reviews.totalReviews > 0 && Number.isFinite(reviews.averageRating) ? <Link href="/about-us" className="msx-trust-reviews"><span className="msx-trust-stars" aria-hidden><Star /><Star /><Star /><Star /><Star /></span><span><strong>{reviews.averageRating.toFixed(1)} / 5 on Google</strong>{reviews.totalReviews} customer reviews</span></Link> : <span><Users aria-hidden /><span><strong>Real people</strong>Personal support</span></span>}
        <span><Handshake aria-hidden /><span><strong>Motability accredited</strong>Help at every step</span></span>
        <a href="#branches"><MapPin aria-hidden /><span><strong>Two local teams</strong>Heathrow &amp; Ferndown</span></a>
      </div>
    </section>
    <div className="msx-evidence"><HomeEvidence project={evidence.project} reviews={evidence.reviews} /></div>
    <section id="branches" className="msx-container msx-section" aria-labelledby="branches-title">
      <div className="msx-section-heading"><div><p className="msx-eyebrow">Local people. Specialist know-how.</p><h2 id="branches-title">Visit one of our branches</h2></div><Link href="/locations" className="msx-text-link">Opening times &amp; directions<ArrowRight size={18} aria-hidden /></Link></div>
      <div className="msx-branches">{branches.map(branch => {
        const isDorset = /ferndown|dorset|wimborne/i.test(`${branch.name} ${branch.addressLocality}`);
        return <article key={branch.id} className={`msx-branch ${isDorset ? "msx-branch-dorset" : ""}`}>
          <div className="msx-branch-art"><Image src={isDorset ? "/images/hero-options/03-scooter-handover.webp" : "/images/hero-options/engineer-hand-controls.webp"} alt={isDorset ? "Our Ferndown team handing over a mobility scooter" : "Our Heathrow engineer fitting hand controls"} fill sizes="(max-width: 700px) 100vw, 220px" /><span>{isDorset ? "Dorset" : "West London"}</span></div>
          <div className="msx-branch-body"><h3>{isDorset ? "Ferndown / Dorset" : "Heathrow / West Drayton"}</h3><p className="msx-branch-address">{branch.addressLine1}<br />{branch.addressLocality}, {branch.postalCode}</p><ul><li><Check size={16} aria-hidden />Vehicle adaptation advice &amp; fitting</li>{isDorset ? <li><Check size={16} aria-hidden />Scooters &amp; wheelchairs to view and try</li> : <li><Check size={16} aria-hidden />Specialist workshop team</li>}</ul><div className="msx-branch-links"><a href={`tel:${branch.phone.replace(/\s/g, "")}`}><Phone size={15} aria-hidden />{branch.phone}</a><Link href="/locations" aria-label={`View ${branch.name} branch details`}>Branch details<ArrowRight size={17} aria-hidden /></Link></div></div>
        </article>;
      })}</div>
    </section>
    <section className="msx-container" aria-labelledby="help-title"><div className="msx-help"><div className="msx-help-copy"><h2 id="help-title">Not sure where to start?</h2><p>Tell us what you need. Our friendly team will help you find the right way forward.</p></div><div className="msx-help-options"><a href={SITE.phoneHref}><span className="msx-help-icon"><Phone size={22} aria-hidden /></span><span>Call our team<strong>{SITE.phone}</strong></span></a><EnquiryDialog mode="callback" title="Request a callback" triggerClassName="msx-help-option"><span className="msx-help-icon"><Mail size={22} aria-hidden /></span><span>Let us call you<strong>Request a callback<ArrowRight size={15} aria-hidden /></strong></span></EnquiryDialog><Link href="/contact"><span className="msx-help-icon"><CalendarDays size={22} aria-hidden /></span><span>Come and see us<strong>Arrange a visit<ArrowRight size={15} aria-hidden /></strong></span></Link></div></div></section>
    <section className="msx-container msx-section msx-categories-section" aria-labelledby="categories-title"><div className="msx-section-heading"><div><p className="msx-eyebrow">A good place to start</p><h2 id="categories-title">Explore popular categories</h2></div></div><div className="msx-categories">{categories.map(category => <Link key={category.title} href={category.href} className={`msx-category msx-category-${category.side}`}><div className="msx-category-photo">{category.image ? <Image src={category.image} alt={category.alt} fill sizes="(max-width: 560px) 45vw, (max-width: 1000px) 30vw, 210px" /> : <MobilityIcon kind="chair" />}</div><div className="msx-category-copy"><span className="msx-category-label">{category.side === "adapt" ? "Vehicle adaptations" : "Scooters & wheelchairs"}</span><h3>{category.title}</h3><p>{category.copy}</p><span className="msx-category-link">{category.side === "adapt" ? "Explore options" : "View the range"}<ArrowRight size={16} aria-hidden /></span></div></Link>)}</div></section>
    <section className="msx-container msx-motability" aria-labelledby="motability-title"><span className="msx-motability-symbol"><Handshake size={35} aria-hidden /></span><div><p className="msx-eyebrow">The Motability Scheme</p><h2 id="motability-title">Support for both sides of your journey.</h2><p>Choose the help you need. We will guide you through the options.</p></div><div className="msx-motability-links"><Link href="/motability/vehicle-adaptations">Vehicle adaptations<ArrowRight size={18} aria-hidden /></Link><Link href="/motability">Scooters &amp; wheelchairs<ArrowRight size={18} aria-hidden /></Link></div></section>
  </div>;
}
