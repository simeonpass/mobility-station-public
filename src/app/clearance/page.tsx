import Link from "next/link";
import { ClearanceBrowser } from "@/components/product/clearance-browser";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { CONDITION_GRADES, getPublishedProducts, isUsedCondition, type ProductListItem } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = createMetadata({ title: "Clearance scooters & wheelchairs", description: "Ex-demo, refurbished and pre-owned mobility scooters graded A–C by our team at Heathrow & Ferndown. Honest condition, clear prices.", path: "/clearance" });

export default async function ClearancePage() {
  let products: ProductListItem[] = [];
  try { const all = await getPublishedProducts({ limit: 500, shopOnly: true }); products = all.filter((p) => isUsedCondition(p.condition)); } catch (error) { console.error("Clearance catalogue error:", error); }
  return <>
    <CatalogIntro eyebrow="Mobility Station · Clearance" title="Good equipment. Better value." subtitle="Ex-demo, refurbished and pre-owned scooters and wheelchairs — inspected and graded by our team so condition is clear before you decide." primary={{ href: "/book-a-demo", label: "Book a demonstration" }} secondary={{ href: "/contact?interest=callback#callback", label: "Ask about a model" }} />
    <section className="border-b border-border bg-soft/55 py-12 md:py-16"><div className="container-site"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Clear condition standards</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Our clearance grades.</h2><p className="mt-3 max-w-2xl text-muted">Every clearance machine is inspected before sale. The grade describes appearance and age, not whether it is safe to use.</p><ul className="mt-9 grid gap-4 md:grid-cols-3">{CONDITION_GRADES.map((g) => <li key={g.id} className="rounded-2xl border border-border bg-white p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Grade {g.id}</p><h3 className="mt-3 text-xl font-extrabold text-primary">{g.short}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{g.body}</p></li>)}</ul><p className="mt-6 text-sm text-muted">Listings also show whether equipment is <strong className="text-primary">Ex-Demo</strong>, <strong className="text-primary">Refurbished</strong> or <strong className="text-primary">Pre-Owned</strong>. Ask us about the warranty on the individual model.</p></div></section>
    <section className="py-14 md:py-20"><div className="container-site"><div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Current stock</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Available now</h2><p className="mt-2 text-sm text-muted">{products.length ? `${products.length} clearance ${products.length === 1 ? "item" : "items"}` : "Stock changes often — call us if you need something specific."}</p></div><Link href="/shop" className="text-sm font-semibold text-primary underline underline-offset-2">Browse full shop</Link></div>{products.length ? <ClearanceBrowser products={products} /> : <p className="rounded-2xl border border-border bg-soft/50 px-5 py-8 text-sm text-muted">No clearance items are listed right now. Browse the <Link href="/shop" className="font-semibold text-primary underline">full shop</Link> or <Link href="/contact?interest=callback#callback" className="font-semibold text-primary underline">request a callback</Link>.</p>}</div></section>
    <CtaFooter title="Want to try a clearance model?" subtitle="Book a home or branch demonstration — we’ll talk through grade, condition and warranty before you decide." />
  </>;
}
