import type { Metadata } from "next";
import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { checkoutBrand, CHECKOUT_BRANDS, parseBasketReferences } from "@/lib/checkout-brands";
import { resolveCheckoutBasket } from "@/lib/checkout-basket";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Secure checkout", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function SharedCheckout({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const brand = checkoutBrand(params.brand);
  let items;
  try {
    if (typeof params.basket !== "string") throw new Error("Please return to the shop and choose your products.");
    items = await resolveCheckoutBasket(parseBasketReferences(params.basket));
  } catch (e) {
    console.error("Shared checkout basket could not be prepared", e instanceof Error ? e.message : "Unknown error");
    return <CheckoutShell brand={brand}><h1 className="text-3xl font-bold">Let’s check your basket</h1><p className="mt-4 max-w-xl">We couldn’t prepare this basket. A product or option may have changed, or our system may be temporarily unavailable. Please return to the shop and try again, or call 0800 772 3870.</p><a href={CHECKOUT_BRANDS[brand].home} className="mt-6 inline-block font-semibold underline">Return to {CHECKOUT_BRANDS[brand].name}</a></CheckoutShell>;
  }
  return <CheckoutShell brand={brand}><h1 className="text-3xl font-bold text-primary">Complete your order</h1><p className="mb-8 mt-2 text-muted">Your {CHECKOUT_BRANDS[brand].name} order, with support from Mobility Station.</p><CheckoutForm initialItems={items} brand={brand} /></CheckoutShell>;
}
