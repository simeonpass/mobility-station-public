import Link from "next/link";
import { BadgeCheck, HandHeart, MapPinned, Store, Truck, Wrench } from "lucide-react";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Testimonials } from "@/components/sections/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { getReviewsSummary } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({ title: "About Mobility Station", description: "Independent mobility specialists at Heathrow and Ferndown — try scooters and wheelchairs at a branch for free, or book a home demonstration. Motability, adaptations, hire and honest advice.", path: "/about-us" });

const PILLARS = [
  { icon: Store, title: "Come to us — free", body: "Visit Heathrow or Ferndown and try scooters and wheelchairs with no visit fee." },
  { icon: Truck, title: "Or we come to you", body: "Home demonstrations are available where they help, with the fee explained clearly before booking." },
  { icon: Wrench, title: "Our own workshops", body: "Adaptations are assessed, fitted and serviced by our engineers — not subcontracted out and forgotten." },
  { icon: BadgeCheck, title: "Motability accredited", body: "Clear scheme pricing, the right paperwork and practical help choosing equipment for real life." },
] as const;

const PATHS = [
  { href: "/shop", label: "Scooters & wheelchairs", blurb: "New stock from leading brands — try at a branch or book a demo." },
  { href: "/clearance", label: "Clearance", blurb: "Ex-demo and pre-owned, graded A–C so you know the condition." },
  { href: "/hire", label: "Hire & Flex", blurb: "Short-term or monthly hire when you need it for a while." },
  { href: "/vehicle-adaptations", label: "Vehicle adaptations", blurb: "Quoted against your car — hand controls, hoists and more." },
  { href: "/motability", label: "Motability", blurb: "Weekly allowance prices on scooters and powerchairs." },
  { href: "/locations", label: "Heathrow & Ferndown", blurb: "Two workshops with parking and step-free access." },
] as const;

function AboutVisual() {
  return <div className="grid h-[390px] grid-cols-5 grid-rows-2 gap-3 sm:h-[470px] sm:gap-4 lg:h-[500px]">
    <div className="relative col-span-3 row-span-2 overflow-hidden rounded-[2rem] bg-soft"><img src="/images/hero-options/06-customer-handover.png" alt="Mobility Station adviser helping a customer" className="h-full w-full object-cover object-[50%_35%]" width={900} height={1100} /><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/82 px-4 py-3 text-white backdrop-blur-sm sm:inset-x-5 sm:bottom-5 sm:px-5 sm:py-4"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Independent specialists</p><p className="mt-1 text-sm font-semibold sm:text-base">Practical advice. Long-term support.</p></div></div>
    <div className="relative col-span-2 overflow-hidden rounded-[1.6rem] bg-soft"><img src="/images/hero-options/03-scooter-handover.png" alt="Mobility scooter demonstration" className="h-full w-full object-cover" width={700} height={500} /><span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm">Mobility</span></div>
    <div className="relative col-span-2 overflow-hidden rounded-[1.6rem] bg-soft"><img src="/images/hero-options/05-hand-controls.png" alt="Vehicle hand controls" className="h-full w-full object-cover" width={700} height={500} /><span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1.5 text-[11px] font-bold text-white">Adaptations</span></div>
  </div>;
}

export default async function AboutPage() {
  const reviewSummary = await getReviewsSummary();
  const jsonLd = { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, legalName: SITE.legalName, url: SITE.url, telephone: SITE.phone, email: SITE.email, description: "Mobility Station supplies and fits mobility scooters, wheelchairs and vehicle adaptations from Heathrow and Ferndown." };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <CatalogIntro eyebrow="Mobility Station · Since 2011" title="Mobility, properly supported." subtitle="Independent specialists helping people stay mobile — from scooters and wheelchairs to vehicle adaptations fitted by our own engineers." primary={{ href: "/book-a-demo", label: "Book a demonstration" }} secondary={{ href: "/locations", label: "Find your branch" }} visual={<AboutVisual />} />

    <section className="border-b border-border py-14 md:py-20"><div className="container-site grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Our approach</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Built around real life, not pressure.</h2><div className="mt-6 space-y-5 text-base leading-relaxed text-muted md:text-lg"><p>You should be able to try equipment properly before you decide. Visit Heathrow or Ferndown free of charge, or arrange a home visit when that makes more sense.</p><p>From both workshops we support private and Motability customers through assessment, fitting, servicing and long-term support — whether that means a folding chair, a full-size scooter, hand controls or a boot hoist.</p><p>Vehicle adaptations are always checked against your specific car before work is booked. Compatibility matters more than a generic price list.</p></div></div><aside className="rounded-[2rem] bg-primary p-7 text-white md:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Two specialist bases</p><div className="mt-7 space-y-7"><div><h3 className="text-2xl font-extrabold">Heathrow</h3><p className="mt-2 text-sm leading-relaxed text-white/70">West London and the Thames Valley — workshop, demonstrations and local support.</p></div><div className="border-t border-white/15 pt-7"><h3 className="text-2xl font-extrabold">Ferndown</h3><p className="mt-2 text-sm leading-relaxed text-white/70">Dorset and Hampshire — mobility showroom, workshop and South Coast support.</p></div></div><Link href="/locations" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-8 rounded-full border-white/30 bg-white text-primary hover:bg-accent")}><MapPinned className="h-4 w-4" aria-hidden />Opening hours &amp; maps</Link></aside></div></section>

    <section className="border-b border-border bg-soft/55 py-14 md:py-20"><div className="container-site"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">How we work</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Advice before a decision.</h2><ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{PILLARS.map(({ icon: Icon, title, body }) => <li key={title} className="rounded-2xl border border-border bg-white p-6"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><Icon className="h-5 w-5" aria-hidden /></span><h3 className="mt-5 text-lg font-extrabold text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{body}</p></li>)}</ul><div className="mt-6 max-w-3xl rounded-2xl border border-border bg-white p-6 md:p-7"><div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><HandHeart className="h-4 w-4" aria-hidden /></span><div><h3 className="text-lg font-extrabold text-primary">Demonstrations — kept simple</h3><p className="mt-2 text-sm leading-relaxed text-muted">Branch visits are free at Heathrow and Ferndown. Home demonstrations are <strong className="text-foreground">£195</strong> — deducted in full if you go ahead, and waived for the Motability Powered Wheelchair &amp; Scooter Scheme.</p><p className="mt-3 text-sm"><Link href="/book-a-demo#demo-terms" className="font-semibold text-primary underline underline-offset-2">Full demonstration terms</Link> · <Link href="/book-a-demo" className="font-semibold text-primary underline underline-offset-2">Book a demonstration</Link></p></div></div></div></div></section>

    <section className="border-b border-border py-14 md:py-20"><div className="container-site"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">One specialist team</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">What we can help with.</h2><ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{PATHS.map(({ href, label, blurb }) => <li key={href}><Link href={href} className="group flex h-full flex-col rounded-2xl border border-border bg-white px-6 py-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"><span className="text-lg font-extrabold text-primary">{label}</span><span className="mt-2 text-sm leading-relaxed text-muted">{blurb}</span><span className="mt-5 text-sm font-semibold text-primary">Explore <span aria-hidden>→</span></span></Link></li>)}</ul></div></section>

    <Testimonials reviews={reviewSummary.reviews} averageRating={reviewSummary.averageRating} totalReviews={reviewSummary.totalReviews} googleMapsUrl={reviewSummary.googleMapsUrl} profiles={reviewSummary.profiles} />
    <CtaFooter title="Ready when you are" subtitle="Pop into Heathrow or Ferndown free of charge, or book a demonstration — we’ll confirm the right option before we visit." primary={{ href: "/book-a-demo", label: "Book a demonstration" }} secondary={{ href: "/locations", label: "Visit a branch" }} />
  </>;
}
