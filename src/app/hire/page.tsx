import Link from "next/link";
import { FLEX_SETUP_FEE_GBP } from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
export const revalidate = 300;
export const metadata = createMetadata({ title: "Scooter & Wheelchair Hire", description: "Choose short-term or Flex monthly mobility hire, with collection from Heathrow and Ferndown or delivery available.", path: "/hire" });
const OPTIONS = [
 { title: "Short-term hire", eyebrow: "3–28 days", body: "For holidays, recovery or a few days away.", points: ["Hire plus a refundable deposit", "Free collection from Heathrow or Ferndown", "Delivery available"], href: "/hire/short-term" },
 { title: "Flex monthly hire", eyebrow: "3+ months", body: "For longer use without buying outright.", points: ["Three months minimum, then monthly", "First month + " + formatGBP(FLEX_SETUP_FEE_GBP) + " set-up", "Delivery, servicing, batteries and breakdown cover included"], href: "/hire/flex" },
];
export default function HirePage() {
  return <div className="container-site py-12 md:py-16">
    <p className="ms-eyebrow">Scooter &amp; wheelchair hire</p>
    <h1 className="mt-4 text-4xl tracking-tight md:text-6xl">For a little while.<br />Or a little longer.</h1>
    <p className="mt-5 max-w-xl text-lg text-muted">Two simple ways to hire, with help from our Heathrow and Ferndown teams.</p>
    <section id="hire-options" aria-label="Hire options" className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
      {OPTIONS.map(option => <article key={option.href} className="border-t border-border pt-7">
        <p className="ms-eyebrow">{option.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold">{option.title}</h2>
        <p className="mt-4 max-w-lg text-muted">{option.body}</p>
        <ul className="mt-5 space-y-2 text-sm">{option.points.map(point => <li key={point}>{point}</li>)}</ul>
        <Link href={option.href} className="ms-button mt-7">View prices &amp; book ↗</Link>
      </article>)}
    </section>
    <p className="mt-12 border-t border-border pt-6 text-muted">Not sure which suits you? <Link href="/contact?interest=hire#enquire" className="font-semibold text-primary underline underline-offset-4">Talk to our team</Link>.</p>
  </div>;
}