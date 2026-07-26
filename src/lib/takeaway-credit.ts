/**
 * Old scooter / wheelchair takeaway credit.
 *
 * Not a valuation trade-in — a fixed gesture off the new purchase when we
 * collect and dispose of (or keep) their old machine.
 *
 * Bands (ex-VAT catalogue price of the main scooter/wheelchair):
 *   under £1,000 → £100
 *   under £2,000 → £200
 *   … £100 per £1,000 band
 */

export const TAKEAWAY_CREDIT_PER_BAND = 100;
export const TAKEAWAY_BAND_SIZE = 1000;
/** Soft ceiling so a £20k machine doesn't create a huge gesture. */
export const TAKEAWAY_CREDIT_MAX = 1000;

const ELIGIBLE_CATEGORY =
  /scooter|wheelchair|power\s*chair|powerchair|mobility\s*chair/i;

export function isTakeawayEligibleCategory(category: string | null | undefined) {
  return ELIGIBLE_CATEGORY.test(category || "");
}

export function isTakeawayEligibleProduct(product: {
  category?: string | null;
  name?: string | null;
  product_type?: string | null;
}) {
  if (product.product_type === "vehicle_adaptation") return false;
  if (isTakeawayEligibleCategory(product.category)) return true;
  return ELIGIBLE_CATEGORY.test(product.name || "");
}

/**
 * Credit for a purchase price in GBP (ex VAT catalogue line price).
 * £0–£999.99 → £100, £1,000–£1,999.99 → £200, etc.
 */
export function takeawayCreditForPrice(priceGbp: number): number {
  if (!Number.isFinite(priceGbp) || priceGbp <= 0) return 0;
  const band = Math.floor(priceGbp / TAKEAWAY_BAND_SIZE) + 1;
  return Math.min(band * TAKEAWAY_CREDIT_PER_BAND, TAKEAWAY_CREDIT_MAX);
}

export type TakeawayBand = {
  upTo: number;
  credit: number;
  label: string;
};

/** Published table for the trade-in / takeaway page. */
export function takeawayCreditBands(maxBand = 6): TakeawayBand[] {
  return Array.from({ length: maxBand }, (_, i) => {
    const upTo = (i + 1) * TAKEAWAY_BAND_SIZE;
    const credit = Math.min((i + 1) * TAKEAWAY_CREDIT_PER_BAND, TAKEAWAY_CREDIT_MAX);
    return {
      upTo,
      credit,
      label: `Under £${upTo.toLocaleString("en-GB")}`,
    };
  });
}

/** Highest eligible line unit price in a cart (one gesture per order). */
export function mainTakeawayPurchasePrice(
  items: Array<{
    unitPrice: number;
    quantity?: number;
    category?: string | null;
    name?: string | null;
    product_type?: string | null;
  }>,
): number {
  let best = 0;
  for (const item of items) {
    if (!isTakeawayEligibleProduct(item)) continue;
    const price = Number(item.unitPrice) || 0;
    if (price > best) best = price;
  }
  return best;
}

export function takeawayCreditForCart(
  items: Array<{
    unitPrice: number;
    category?: string | null;
    name?: string | null;
    product_type?: string | null;
  }>,
): number {
  return takeawayCreditForPrice(mainTakeawayPurchasePrice(items));
}
