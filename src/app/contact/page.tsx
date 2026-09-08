import Link from "next/link";
import { CalendarCheck, MessageSquare, PhoneCall, Wrench } from "lucide-react";
import { CallbackForm } from "@/components/forms/callback-form";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { BRANCHES } from "@/data/content";
import { getProductBySlug } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({ title: "Contact Mobility Station", description: "Contact Mobility Station for scooters, wheelchairs and vehicle adaptations. Request a callback, message the team, or visit Heathrow & Ferndown.", path: "/contact" });

const INTEREST_PRESETS: Record<string, string> = { adaptation: "Vehicle adaptation quotation", adaptations: "Vehicle adaptation quotation", scooter: "Mobility scooter", wheelchair: "Wheelchair", motability: "Motability enquiry", service: "Service / repair", "trade-in": "Old scooter takeaway", callback: "Request a callback", hire: "Hire / Flex Hire" };
const ROUTES = [
  { icon: PhoneCall, title: "Request a callback", body: "Leave your number and a good time. One of our team will call you back.", href: "#callback", label: "Request a callback" },
  { icon: MessageSquare, title: "Send an enquiry", body: "Questions, quotations and product advice — send us the details online.", href: "#enquire", label: "Send a message" },
  { icon: CalendarCheck, title: "Book a demonstration", body: "Try equipment at a branch or arrange a home demonstration where suitable.", href: "/book-a-demo", label: "Book a demonstration" },
  { icon: Wrench, title: "Service & repair", body: "Servicing and repairs for scooters, wheelchairs and vehicle adaptations.", href: "/book-a-service", label: "Book a service" },
] as const;

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string; interest?: string; product?: string }> }) {
  const { sent, interest, product: productSlugParam } = await searchParams;
  const interestKey = interest?.toLowerCase() ?? "";
  const isCallback = interestKey === "callback" || sent === "callback";
  const productSlug = productSlugParam?.trim() || "";
  let linkedProduct: Awaited<ReturnType<typeof getProductBySlug>> = null;
  if (productSlug) { try { linkedProduct = await getProductBySlug(productSlug); } catch { linkedProduct = null; } }
  const productLabel = linkedProduct?.name ?? null;
  const resolvedSlug = linkedProduct?.slug ?? (productSlug || undefined);
  const productHref = resolvedSlug ? `/products/${resolvedSlug}` : null;
  const baseInterest = interest ? (INTEREST_PRESETS[interestKey] ?? interest) : "General enquiry";
  const presetInterest = productLabel ? interestKey === "motability" || baseInterest.toLowerCase().includes("motability") ? `Motability — ${productLabel}` : `${baseInterest} — ${productLabel}` : baseInterest;
  const callbackTopic = productLabel ? `Motability — ${productLabel}` : isCallback && presetInterest !== "Request a callback" ? presetInterest : "";
  const jsonLd = { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Mobility Station", url: `${SITE.url}/contact`, mainEntity: { "@type": "Organization", name: SITE.name, telephone: SITE.phone, email: SITE.email, url: SITE.url } };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <section className="container-site ms-contact-intro"><nav className="ms-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span>Contact &amp; locations</nav><p className="ms-eyebrow">A real conversation. A helpful next step.</p><h1>Let’s work it out.<br /><span>Together.</span></h1><p>Questions about your car, choosing a scooter or keeping things running?<br />Our team is here to help.</p><div className="ms-intro-actions"><a href="#callback" className="ms-button">Request a callback</a><a href="#enquire" className="ms-text-link">Send a message</a></div></section>

    {productLabel || productSlug ? <div className="border-b border-border bg-soft/55"><div className="container-site flex flex-wrap items-center justify-between gap-3 py-4 text-sm"><p className="text-primary"><span className="font-semibold">Enquiring about:</span> {productHref ? <Link href={productHref} className="font-bold underline underline-offset-2">{productLabel ?? productSlug}</Link> : <span className="font-bold">{productLabel ?? productSlug}</span>}</p>{productHref ? <Link href={productHref} className="font-semibold text-primary hover:underline">View product →</Link> : null}</div></div> : null}

    <section className="py-12 md:py-16"><div className="container-site"><ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ROUTES.map(({ icon: Icon, title, body, href, label }) => <li key={title}><Link href={href} className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><Icon className="h-5 w-5" aria-hidden /></span><h2 className="mt-5 text-lg font-bold text-primary">{title}</h2><p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{body}</p><span className="mt-5 text-sm font-semibold text-primary">{label} →</span></Link></li>)}</ul><p className="mt-7 text-sm text-muted">Branch demonstrations are free. Home demonstrations are £195 — deducted in full if you go ahead, and waived for the Motability Powered Wheelchair &amp; Scooter Scheme. <Link href="/book-a-demo#demo-terms" className="font-semibold text-primary underline underline-offset-2">Full demo terms</Link>.</p></div></section>

    <section id="callback" className="scroll-mt-24 border-y border-border bg-soft/55 py-14 md:py-20"><div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Prefer to speak?</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">We’ll call you back.</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">Leave your number and what you need help with. Our team will call at a time that suits you.</p><p className="mt-5 text-sm text-muted">Or call freephone: <a href={SITE.phoneHref} className="font-bold text-primary">{SITE.phone}</a></p></div><div className="rounded-[2rem] border border-border bg-white p-6 md:p-8">{sent === "callback" ? <p className="mb-6 rounded-xl bg-soft px-4 py-3 text-sm font-medium text-primary">Thanks — we’ve got your callback request and will ring you soon.</p> : null}<CallbackForm defaultTopic={callbackTopic} productSlug={resolvedSlug} productLabel={productLabel ?? undefined} /></div></div></section>

    <section id="enquire" className="scroll-mt-24 py-14 md:py-20"><div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Email or visit</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Branches &amp; email.</h2><a href={`mailto:${SITE.email}`} className="mt-4 inline-block font-semibold text-primary">{SITE.email}</a><ul className="mt-8 space-y-6">{BRANCHES.map((branch) => <li key={branch.id} className="border-t border-border pt-5"><h3 className="text-xl font-bold text-primary">{branch.name}</h3><p className="mt-2 text-sm text-muted">{branch.addressLine1}, {branch.addressLocality}, {branch.postalCode}</p><a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="mt-2 inline-block text-sm font-semibold text-primary">{branch.phone}</a></li>)}</ul><p className="mt-6 text-sm text-muted">Opening hours and maps are on our <Link href="/locations" className="font-semibold text-primary underline underline-offset-2">locations page</Link>.</p></div><div className="rounded-[2rem] border border-border bg-soft/55 p-6 md:p-8">{sent === "1" ? <p className="mb-6 rounded-xl bg-white px-4 py-3 text-sm font-medium text-primary">Thanks — your message has been sent. We will reply shortly.</p> : null}<EnquiryForm enquiryType="contact" title="Send a message" defaultInterest={isCallback && !productLabel ? "General enquiry" : presetInterest} productSlug={resolvedSlug} /></div></div></section>
  </>;
}
