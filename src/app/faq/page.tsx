import Link from "next/link";
import { CtaFooter } from "@/components/sections/cta-footer";
import { KNOWLEDGE_FAQ_CATEGORIES } from "@/data/knowledge-faqs";
import { getKnowledgeFaqs } from "@/lib/data";
import { createMetadata, jsonLdScript } from "@/lib/seo";

const operationalFaqs: { q:string; a:string; href?:string; hrefLabel?:string }[] = [
  { q: "Do you offer home demonstrations?", a: "Yes. Branch demonstrations at Heathrow and Ferndown are always free, and we bring equipment to your home across our service area.", href: "/book-a-demo", hrefLabel: "Book a demonstration" },
  { q: "What does a home demonstration cost?", a: "Branch demonstrations are free. Home demonstrations are £195 flat — deducted in full from your price if you go ahead, and waived for the Motability Powered Wheelchair & Scooter Scheme.", href: "/book-a-demo#demo-terms", hrefLabel: "Full demo terms" },
  { q: "Do you cover my area?", a: "Check your postcode to see which workshop covers you, the local call-out band and whether we can deliver locally. Large equipment ships nationwide on a pallet.", href: "/service-area", hrefLabel: "Check your postcode" },
  { q: "Can I buy adaptations online?", a: "No — every adaptation is checked against your vehicle first, so we quote before work is booked. Prices shown are indicative supplied and fitted figures.", href: "/contact?interest=adaptation", hrefLabel: "Request a quotation" },
  { q: "Do you supply Motability scooters and wheelchairs?", a: "Yes. We are a Motability Scheme accredited dealer, with weekly figures on our Motability catalogue and demonstrations from Heathrow and Ferndown.", href: "/motability", hrefLabel: "See Motability options" },
  { q: "Can I claim VAT relief?", a: "Many customers with a long-term illness or disability can buy eligible products without VAT. You declare eligibility at checkout.", href: "/vat-relief", hrefLabel: "How VAT relief works" },
];
export const metadata = createMetadata({ title: "FAQ | Mobility Station", description: "Answers to real customer questions about boot hoists, Motability, demos, VAT relief and vehicle adaptations — written for search and AI assistants, without personal details.", path: "/faq" });
export const revalidate = 300;

export default async function FaqPage() {
  const knowledge = await getKnowledgeFaqs(); const byCategory = KNOWLEDGE_FAQ_CATEGORIES.map((cat) => ({ ...cat, items: knowledge.filter((f) => f.category === cat.id) })).filter((cat) => cat.items.length > 0);
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [...operationalFaqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })), ...knowledge.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } }))] };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <section className="border-b border-border bg-white"><div className="container-site py-14 md:py-20 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Mobility Station · Help</p><h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">Questions, clearly answered.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Practical answers about demonstrations, Motability, VAT relief, vehicle adaptations and mobility equipment.</p></div></section>
    <section className="py-14 md:py-20"><div className="container-site max-w-4xl"><p className="text-sm leading-relaxed text-muted">Advice pages use anonymised question themes only. We never publish personal details from calls or jobs.</p><div className="mt-10"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Getting started</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary">Booking &amp; how we work</h2><div className="mt-7 grid gap-4 md:grid-cols-2">{operationalFaqs.map((faq) => <div key={faq.q} className="rounded-2xl border border-border bg-white p-6"><h3 className="text-lg font-bold text-primary">{faq.q}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>{faq.href ? <Link href={faq.href} className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4">{faq.hrefLabel} →</Link> : null}</div>)}</div></div>{byCategory.map((cat) => <div key={cat.id} className="mt-14 border-t border-border pt-10"><h2 className="text-3xl font-extrabold tracking-tight text-primary">{cat.label}</h2><div className="mt-7 space-y-0 divide-y divide-border">{cat.items.map((faq) => <div key={faq.slug} className="py-6 first:pt-0"><h3 className="text-xl font-bold"><Link href={`/faq/${faq.slug}`} className="text-primary hover:underline underline-offset-4">{faq.question}</Link></h3><p className="mt-2 leading-relaxed text-muted">{faq.answer}</p><Link href={`/faq/${faq.slug}`} className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4">Read full answer →</Link></div>)}</div></div>)}</div></section>
    <CtaFooter />
  </>;
}
