import { getProductBySlug, priceWithVariants, addonLinePrice } from "@/lib/products";
import { isAdaptationProduct, configuredCartLineId, addonCartLineId, type CartItem } from "@/lib/cart";
import type { BasketReference } from "@/lib/checkout-brands";

/** Rebuild the displayed basket from V1, not the sending website's prices. */
export async function resolveCheckoutBasket(refs: BasketReference[]): Promise<CartItem[]> {
  const products = await Promise.all([...new Set(refs.map(r => r.slug))].map(getProductBySlug));
  const bySlug = new Map(products.filter(p => p !== null).map(p => [p.slug, p]));
  const demand = new Map<string, number>();
  const variantDemand = new Map<string, number>();
  const lines = new Map<string, CartItem>();
  for (const ref of refs) {
    const p = bySlug.get(ref.slug);
    if (!p || p.id !== ref.id || isAdaptationProduct(p) || p.is_discontinued) throw new Error("One of your products is no longer available online. Please contact our team.");
    const optionIds = ref.variantIds || [];
    const selected = optionIds.map(id => p.variants.find(v => v.id === id && !v.is_addon));
    if (selected.some(v => !v)) throw new Error("A selected product option is no longer available.");
    const options = selected.filter(v => v !== undefined);
    const groups = options.map(v => v.variant_group || "Options");
    if (new Set(groups).size !== groups.length) throw new Error("Please choose only one option from each group.");
    const addon = ref.addonVariantId ? p.variants.find(v => v.id === ref.addonVariantId && v.is_addon) : undefined;
    if (ref.addonVariantId && !addon) throw new Error("An optional extra is no longer available.");
    const price = addon ? addonLinePrice(addon) : priceWithVariants(p, options).current;
    if (price === null || !Number.isFinite(price) || price < 0 || (!addon && price === 0)) throw new Error("Please contact us for a current price.");
    if (!addon) {
      demand.set(p.id, (demand.get(p.id) || 0) + ref.quantity);
      if (p.track_stock && !p.pre_order_enabled && Number(p.quantity || 0) < demand.get(p.id)!) throw new Error(`${p.name} does not have enough stock for this order.`);
    }
    for (const v of addon ? [addon] : options) {
      variantDemand.set(v.id, (variantDemand.get(v.id) || 0) + ref.quantity);
      if (v.track_stock && Number(v.quantity || 0) < variantDemand.get(v.id)!) throw new Error(`${v.label || "Your selected option"} is out of stock.`);
    }
    const id = addon ? addonCartLineId(p.id, addon.id) : configuredCartLineId(p.id, optionIds);
    const existing = lines.get(id);
    if (existing) existing.quantity += ref.quantity;
    else lines.set(id, { quantity: ref.quantity, product: {
      id, stockItemId: p.id, name: addon?.label || p.name, slug: p.slug,
      image_url: addon?.image_url || p.image_url, unit_price: price, sale_price: null,
      category: addon ? "Accessories" : p.category, weight: p.weight, condition: p.condition,
      product_type: p.product_type, pre_order_enabled: p.pre_order_enabled,
      variantIds: optionIds, addonVariantId: addon?.id,
      optionSummary: options.map(v => v.label).filter(Boolean).join(", "),
    } });
  }
  return [...lines.values()];
}
