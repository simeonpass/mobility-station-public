import Link from "next/link";
import { Check } from "lucide-react";
import { DemoBookingForm } from "@/components/forms/demo-booking-form";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { isAdaptationProduct } from "@/lib/adaptations";
import { DEMO_PRICING_STRIP, HOME_DEMO_FEE_GBP, type ScooterWheelchairKind } from "@/lib/demo-booking";
import { getProductBySlug } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Book a Demo | Home Demonstrations", description: "Book a free branch demonstration or a £195 home demonstration for scooters, wheelchairs or vehicle adaptations. Fee deducted if you buy; waived for Motability PWSS.", path: "/book-a-demo" });

export default async function BookADemoPage({ searchParams }: { searchParams: Promise<{ product?: string; type?: string }> }) {
  const { product, type } = await searchParams;
  const productSlug = product?.trim() || undefined;
  let linkedProduct: Awaited<ReturnType<typeof getProductBySlug>> = null;
  if (productSlug) {
    try { linkedProduct = await getProductBySlug(productSlug); }
    catch { linkedProduct = null; }
  }
  const defaultProductName = linkedProduct?.name ?? "";
  const defaultCategory = type === "adaptation" || (linkedProduct && isAdaptationProduct(linkedProduct)) ? ("vehicle_adaptation" as const) : linkedProduct ? ("scooter_wheelchair" as const) : undefined;
  const productHref = linkedProduct ? `/products/${linkedProduct.slug}` : null;
  const category = linkedProduct?.category?.toLowerCase() || "";
  const defaultEquipmentKind: ScooterWheelchairKind | undefined = defaultCategory !== "scooter_wheelchair" ? undefined : category.includes("scooter") ? "scooter" : category.includes("powered wheelchair") ? "powered_wheelchair" : category.includes("manual wheelchair") ? "manual_wheelchair" : undefined;
  return <>
    <CatalogIntro breadcrumb="Book a demonstration" eyebrow="Try before you decide" title="Book a demonstration." subtitle={DEMO_PRICING_STRIP} primary={{ href: "#form", label: "Start booking" }} secondary={{ href: "#demo-terms", label: "View demonstration terms" }} />
    {defaultProductName ? <div className="border-b border-border bg-soft/55"><div className="container-site flex flex-wrap items-center justify-between gap-3 py-4 text-sm"><p className="text-primary"><span className="font-semibold">Booking a demo of:</span> {productHref ? <Link href={productHref} className="font-bold underline underline-offset-2">{defaultProductName}</Link> : <span className="font-bold">{defaultProductName}</span>}</p>{productHref ? <Link href={productHref} className="font-semibold text-primary hover:underline">View product →</Link> : null}</div></div> : null}
    <section id="form" className="scroll-under-header py-8 md:py-12"><div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"><div><p className="ms-eyebrow">Choose what suits you</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary">Demo options.</h2><ul className="mt-8 space-y-5">{[
      ["Branch demonstration", "Always free at Heathrow or Ferndown."],
      ["Home demonstration", `£${HOME_DEMO_FEE_GBP} flat. Non-refundable, but deducted in full from your purchase price if you go ahead.`],
      ["Motability PWSS", "The home demonstration fee is waived for the Powered Wheelchair & Scooter Scheme when selected at booking."],
      ["At your home", "Try equipment where you actually live and move around. Enter your postcode so we can confirm coverage; home demos need at least 5 days’ notice."],
    ].map(([title, body]) => <li key={title} className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="h-3.5 w-3.5" aria-hidden /></span><div><h3 className="font-bold text-primary">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{body}</p></div></li>)}</ul><p className="mt-8 text-sm text-muted">Need something else? <Link href="/contact" className="font-semibold text-primary underline underline-offset-2">Contact the team</Link> or <Link href="/book-a-service" className="font-semibold text-primary underline underline-offset-2">book a service</Link>.</p></div><div className="msx-form-panel"><DemoBookingForm defaultProductName={defaultProductName} defaultCategory={defaultCategory} defaultEquipmentKind={defaultEquipmentKind} /></div></div></section>
    <section id="demo-terms" className="scroll-under-header border-t border-border bg-soft/55 py-10 md:py-12"><div className="container-site"><div className="max-w-3xl"><p className="ms-eyebrow">The small print, clearly stated</p><h2 className="mt-2 text-2xl font-extrabold text-primary md:text-3xl">Home demonstration terms</h2><div className="mt-5 space-y-3 text-sm leading-relaxed text-muted"><p>{DEMO_PRICING_STRIP}</p><p>The £{HOME_DEMO_FEE_GBP} home demonstration fee is <strong className="text-foreground">non-refundable</strong>. If you purchase, it is <strong className="text-foreground">deducted in full from the purchase price</strong>.</p><p>Call-out distance bands do <strong className="text-foreground">not</strong> apply to demonstrations. Bands still apply to service call-outs and hire deliveries only.</p><p>Branch demonstrations at Heathrow and Ferndown remain free. See our <Link href="/terms" className="font-semibold text-primary underline underline-offset-2">Terms &amp; Conditions</Link>.</p></div></div></div></section>
  </>;
}
