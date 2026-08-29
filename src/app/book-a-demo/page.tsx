import Link from "next/link";
import { Check } from "lucide-react";
import { DemoBookingForm } from "@/components/forms/demo-booking-form";
import { DEMO_PRICING_STRIP, HOME_DEMO_FEE_GBP } from "@/lib/demo-booking";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Book a Demo | Home Demonstrations", description: "Book a free branch demonstration or a £195 home demonstration for scooters, wheelchairs or vehicle adaptations. Fee deducted if you buy; waived for Motability PWSS.", path: "/book-a-demo" });

export default async function BookADemoPage({ searchParams }: { searchParams: Promise<{ product?: string; type?: string }> }) {
  const { product, type } = await searchParams;
  const productSlug = product?.trim() || undefined;
  const defaultProductName = productSlug ? productSlug.replace(/-/g, " ") : "";
  const defaultCategory = type === "adaptation" ? ("vehicle_adaptation" as const) : undefined;
  return <>
    <section className="border-b border-border bg-white"><div className="container-site py-14 md:py-20 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Try before you decide</p><h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">Book a demonstration.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{DEMO_PRICING_STRIP}</p><a href="#form" className="mt-8 inline-flex rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground hover:bg-accent-hover">Start booking</a></div></section>
    <section id="form" className="py-14 md:py-20"><div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Choose what suits you</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Demo options.</h2><ul className="mt-8 space-y-5">{[
      ["Branch demonstration", "Always free at Heathrow or Ferndown."],
      ["Home demonstration", `£${HOME_DEMO_FEE_GBP} flat. Non-refundable, but deducted in full from your purchase price if you go ahead.`],
      ["Motability PWSS", "The home demonstration fee is waived for the Powered Wheelchair & Scooter Scheme when selected at booking."],
      ["At your home", "Try equipment where you actually live and move around. Enter your postcode so we can confirm coverage; home demos need at least 5 days’ notice."],
    ].map(([title, body]) => <li key={title} className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="h-3.5 w-3.5" aria-hidden /></span><div><h3 className="font-bold text-primary">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{body}</p></div></li>)}</ul><p className="mt-8 text-sm text-muted">Need something else? <Link href="/contact" className="font-semibold text-primary underline underline-offset-2">Contact the team</Link> or <Link href="/book-a-service" className="font-semibold text-primary underline underline-offset-2">book a service</Link>.</p></div><div className="rounded-[2rem] border border-border bg-soft/55 p-6 md:p-8"><DemoBookingForm defaultProductName={defaultProductName} defaultCategory={defaultCategory} /></div></div></section>
    <section id="demo-terms" className="border-t border-border bg-soft/55 py-12 md:py-16"><div className="container-site max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">The small print, clearly stated</p><h2 className="mt-2 text-2xl font-extrabold text-primary md:text-3xl">Home demonstration terms</h2><div className="mt-5 space-y-3 text-sm leading-relaxed text-muted"><p>{DEMO_PRICING_STRIP}</p><p>The £{HOME_DEMO_FEE_GBP} home demonstration fee is <strong className="text-foreground">non-refundable</strong>. If you purchase, it is <strong className="text-foreground">deducted in full from the purchase price</strong>.</p><p>Call-out distance bands do <strong className="text-foreground">not</strong> apply to demonstrations. Bands still apply to service call-outs and hire deliveries only.</p><p>Branch demonstrations at Heathrow and Ferndown remain free. See our <Link href="/terms" className="font-semibold text-primary underline underline-offset-2">Terms &amp; Conditions</Link>.</p></div></div></section>
  </>;
}
