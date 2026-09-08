import Link from "next/link";
import { CallbackForm } from "@/components/forms/callback-form";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { getBranches } from "@/lib/data";
import { getProductBySlug } from "@/lib/products";
import { createMetadata, SITE } from "@/lib/seo";

export const metadata = createMetadata({ title: "Contact & Locations", description: "Contact Mobility Station or visit our Heathrow and Ferndown branches. Addresses, opening hours and directions.", path: "/contact" });
const PRESETS: Record<string, string> = { adaptation: "Vehicle adaptation quotation", adaptations: "Vehicle adaptation quotation", scooter: "Mobility scooter", wheelchair: "Wheelchair", motability: "Motability enquiry", service: "Service / repair", "trade-in": "Old scooter takeaway", hire: "Hire / Flex Hire", callback: "General enquiry" };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string; interest?: string; product?: string; mode?: string }> }) {
  const { sent, interest, product, mode } = await searchParams;
  const branches = await getBranches();
  const isCallback = mode === "callback" || (mode !== "message" && (interest === "callback" || sent === "callback"));
  const linkedProduct = product ? await getProductBySlug(product).catch(() => null) : null;
  const slug = linkedProduct?.slug ?? product;
  const topic = (PRESETS[interest?.toLowerCase() ?? ""] ?? interest ?? "General enquiry") + (linkedProduct ? " — " + linkedProduct.name : "");
  const modeHref = (value: string) => {
    const params = new URLSearchParams({ mode: value });
    if (interest) params.set("interest", interest);
    if (slug) params.set("product", slug);
    return "/contact?" + params.toString() + "#enquire";
  };
  return <>
    <section className="container-site py-12 md:py-16">
      <nav className="flex gap-3 text-sm text-muted" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span>Contact &amp; locations</nav>
      <h1 className="mt-6 text-4xl tracking-tight md:text-6xl">Let’s talk.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">A question, a quotation or a visit to our team. Everything you need is here.</p>
    </section>
    <section id="enquire" className="container-site scroll-mt-28 grid gap-10 pb-16 lg:grid-cols-2 lg:gap-20">
      <div>
        <h2 className="text-2xl font-bold">How can we help?</h2>
        <a href={SITE.phoneHref} className="mt-5 block text-2xl font-semibold">{SITE.phone}</a>
        <a href={"mailto:" + SITE.email} className="mt-2 inline-block break-all text-muted underline underline-offset-4">{SITE.email}</a>
        <p className="mt-8 text-muted">Prefer to visit? <a href="#locations" className="font-semibold text-primary underline underline-offset-4">Find our branches below.</a></p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 text-sm font-semibold">
          <Link href="/book-a-demo" className="underline underline-offset-4">Book a demonstration</Link>
          <Link href="/book-a-service" className="underline underline-offset-4">Book a service</Link>
        </div>
      </div>
      <div id="callback" className="scroll-mt-28">
        <nav aria-label="Contact method" className="mb-6 flex gap-6 border-b border-border">
          <Link href={modeHref("message")} aria-current={!isCallback ? "page" : undefined} className={"pb-3 font-semibold " + (!isCallback ? "border-b-2 border-primary" : "text-muted")}>Send a message</Link>
          <Link href={modeHref("callback")} aria-current={isCallback ? "page" : undefined} className={"pb-3 font-semibold " + (isCallback ? "border-b-2 border-primary" : "text-muted")}>Call me back</Link>
        </nav>
        {slug && <p className="mb-5 text-sm text-muted">About: <Link href={"/products/" + slug} className="text-primary underline">{linkedProduct?.name ?? slug}</Link></p>}
        {sent ? <p role="status" className="py-6">Thanks — {sent === "callback" ? "we’ll call you back during opening hours." : "your message has been sent. We’ll be in touch soon."}</p> : isCallback ?
          <CallbackForm key={"callback-" + topic} defaultTopic={topic} productSlug={slug} inline compact /> :
          <EnquiryForm key={"message-" + topic} enquiryType="contact" defaultInterest={topic} productSlug={slug} showBranch={false} showDate={false} showInterest={false} inline compact />}
      </div>
    </section>
    <section id="locations" className="scroll-mt-28 border-t border-border py-12 md:py-16">
      <div className="container-site">
        <h2 className="text-3xl font-bold tracking-tight">Come and see us.</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {branches.map(branch => <article key={branch.id}>
            <h3 className="text-2xl font-semibold">{branch.name}</h3>
            <p className="mt-3 text-muted">{[branch.addressLine1, branch.addressLine2].filter(Boolean).join(", ")}<br />{branch.addressLocality}, {branch.postalCode}</p>
            <a href={"tel:" + branch.phone.replace(/\s/g, "")} className="mt-3 inline-block font-semibold">{branch.phone}</a>
            <ul className="mt-4 space-y-1 text-sm text-muted">{branch.openingHours.map(line => <li key={line}>{line}</li>)}</ul>
            <a href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent([branch.addressLine1, branch.addressLocality, branch.postalCode].join(", "))} target="_blank" rel="noreferrer" className="mt-5 inline-block font-semibold underline underline-offset-4">Maps &amp; directions ↗</a>
          </article>)}
        </div>
        <p className="mt-10 border-t border-border pt-6 text-sm text-muted">Need a home visit or delivery? <Link href="/service-area" className="text-primary underline underline-offset-4">Check our coverage</Link> or read our <Link href="/delivery" className="text-primary underline underline-offset-4">delivery information</Link>.</p>
      </div>
    </section>
  </>;
}
