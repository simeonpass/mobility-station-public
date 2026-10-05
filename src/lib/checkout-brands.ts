export const CHECKOUT_BRANDS = {
  mobilitystation: { name: "Mobility Station", home: "https://mobilitystation.co.uk/shop", colour: "#003f43" },
  lightweight: { name: "Lightweight Mobility", home: "https://lightweightmobility.co.uk", colour: "#123f54" },
  ergofold: { name: "ErgoFold", home: "https://ergofold.co.uk", colour: "#172d31" },
} as const;
export type CheckoutBrand = keyof typeof CHECKOUT_BRANDS;
export function checkoutBrand(value: unknown): CheckoutBrand {
  return typeof value === "string" && Object.hasOwn(CHECKOUT_BRANDS, value)
    ? value as CheckoutBrand : "mobilitystation";
}
export const CHECKOUT_ORIGIN = "https://mobilitystation.co.uk";
export type BasketReference = { id: string; slug: string; quantity: number; variantIds?: string[]; addonVariantId?: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Only public product references cross domains; never prices or personal details. */
export function parseBasketReferences(raw: string): BasketReference[] {
  if (raw.length > 12000) throw new Error("Your basket is too large. Please call us to place this order.");
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || !data.length || data.length > 30) throw new Error("Please add a product to your basket.");
  return data.map((v: Record<string, unknown>) => {
    if (!v || typeof v.id !== "string" || !uuid.test(v.id) || typeof v.slug !== "string" || !/^[a-z0-9-]{1,160}$/.test(v.slug) || !Number.isInteger(v.quantity) || Number(v.quantity) < 1 || Number(v.quantity) > 100) throw new Error("A basket item is invalid. Please return to the shop and try again.");
    const variants = v.variantIds ?? [];
    if (!Array.isArray(variants) || variants.length > 12 || variants.some(id => typeof id !== "string" || !uuid.test(id)) || new Set(variants).size !== variants.length) throw new Error("Invalid product options.");
    if (v.addonVariantId !== undefined && (typeof v.addonVariantId !== "string" || !uuid.test(v.addonVariantId) || variants.length)) throw new Error("Invalid optional extra.");
    return { id: v.id, slug: v.slug, quantity: Number(v.quantity), variantIds: variants, addonVariantId: v.addonVariantId as string | undefined };
  });
}
export function sharedCheckoutPath(brand: CheckoutBrand, items: BasketReference[]) {
  return `/checkout/start?${new URLSearchParams({ brand, basket: JSON.stringify(items) })}`;
}
