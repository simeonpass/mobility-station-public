import Link from "next/link";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { HireSelfServeForm } from "@/components/hire/hire-self-serve-form";
import { HIRE_PRICING_CATEGORIES } from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Scooter & Wheelchair Hire Prices", description: "Simple scooter and wheelchair hire, with discounted two- and four-week prices. Collect from Heathrow or Ferndown, or arrange local delivery.", path: "/hire" });

export default function HirePage() {
  return <>
    <CatalogIntro breadcrumb="Hire" eyebrow="Scooter & wheelchair hire" title={<>Hire for the time<br />you need.</>} subtitle="For a holiday, recovery or everyday independence. Choose your equipment and dates, with better weekly value when you hire for longer." primary={{ href: "#prices", label: "See hire prices" }} secondary={{ href: "#book", label: "Book your hire" }} />
    <section id="prices" className="container-site scroll-mt-28 py-12">
      <h2 className="text-3xl font-semibold">Simple hire prices</h2>
      <p className="mt-3 max-w-2xl text-muted">Prices below are before VAT. A £100 refundable deposit applies to every booking. Your VAT relief choice and any delivery charge are shown in the booking total.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {HIRE_PRICING_CATEGORIES.map(item => <article key={item.id} className="rounded-2xl border border-border p-6">
          <h3 className="text-xl font-semibold text-primary">{item.label}</h3>
          <p className="mt-2 text-sm text-muted">User weight: {item.userWeight}</p>
          <dl className="mt-5 space-y-2">{[["3 days", item.threeDay], ["1 week", item.week], ["2 weeks", item.twoWeeks], ["4 weeks", item.fourWeeks]].map(([label, price]) => <div key={label} className="flex justify-between gap-4 border-b border-border py-2"><dt>{label}</dt><dd className="font-semibold">{formatGBP(Number(price))}</dd></div>)}</dl>
          <p className="mt-4 text-sm text-muted">Save {formatGBP(item.week * 4 - item.fourWeeks)} over four separate weekly hires.</p>
        </article>)}
      </div>
      <p className="mt-5 text-sm text-muted">For dates between these periods, the booking calculator applies the existing daily rates and caps the price at the next package rate.</p>
    </section>
    <section className="container-site pb-12"><div className="grid gap-6 rounded-2xl bg-soft p-7 md:grid-cols-3">
      <div><h2 className="text-xl font-semibold">Collection is free</h2><p className="mt-3 text-muted">Collect and return your equipment at Heathrow or Ferndown.</p></div>
      <div><h2 className="text-xl font-semibold">Local delivery</h2><p className="mt-3 text-muted">£45 within 15 miles or £95 for 15–40 miles, before VAT. Enter your postcode when booking to check availability.</p></div>
      <div><h2 className="text-xl font-semibold">Need more than four weeks?</h2><p className="mt-3 text-muted">Tell us how long you need it and we’ll quote for a longer hire.</p><Link href="/contact?interest=hire#enquire" className="mt-3 inline-block font-semibold underline">Ask for a longer-hire price</Link></div>
    </div></section>
    <section id="book" className="container-site scroll-mt-28 pb-14"><h2 className="text-3xl font-semibold">Arrange your hire</h2><p className="mt-3 text-muted">Book online for 3–28 days. Choose your equipment, dates and collection or delivery below.</p><details className="mt-6 rounded-2xl border border-border p-5 md:p-7"><summary className="cursor-pointer text-lg font-semibold">Choose dates &amp; book online</summary><div className="mt-6"><HireSelfServeForm defaultHireType="short" lockHireType /></div></details><p className="mt-5 text-sm text-muted">Bring photo ID and proof of address when collecting. <Link href="/hire/terms" className="underline">Read the hire terms</Link>.</p></section>
  </>;
}
