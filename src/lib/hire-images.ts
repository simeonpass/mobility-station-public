import {
  HIRE_PRICING_CATEGORIES,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { getPublishedProducts, type ProductListItem } from "@/lib/products";

export type HireCategoryImage = {
  id: HirePricingCategoryId;
  src: string | null;
  alt: string;
};

const FALLBACKS: Record<HirePricingCategoryId, string> = {
  transit_wheelchair: "/images/products/placeholder-wheelchair.svg",
  self_propelled_manual: "/images/products/placeholder-wheelchair.svg",
  heavy_duty_manual: "/images/products/placeholder-wheelchair.svg",
  folding_electric_wheelchair: "/images/products/placeholder-powerchair.svg",
  powered_wheelchair: "/images/products/placeholder-powerchair.svg",
  folding_scooter: "/images/products/placeholder-scooter.svg",
  small_boot_scooter: "/images/products/placeholder-scooter.svg",
  medium_scooter: "/images/products/placeholder-scooter.svg",
  large_scooter: "/images/products/placeholder-scooter.svg",
};

function scoreProduct(
  product: ProductListItem,
  match: RegExp,
): number {
  const hay = `${product.name} ${product.category ?? ""}`;
  if (!match.test(hay)) return 0;
  let score = 10;
  if (product.image_url) score += 5;
  if (/wheelchair/i.test(match.source) && /wheelchair/i.test(hay)) score += 2;
  if (/scooter/i.test(match.source) && /scooter/i.test(hay)) score += 2;
  return score;
}

/**
 * Pick one genuine catalogue photo per hire category.
 * Never invents AI imagery — falls back to local product placeholders only.
 */
export async function getHireCategoryImages(): Promise<HireCategoryImage[]> {
  let products: ProductListItem[] = [];
  try {
    products = await getPublishedProducts({ limit: 400, shopOnly: true });
  } catch {
    products = [];
  }

  const used = new Set<string>();

  return HIRE_PRICING_CATEGORIES.map((category) => {
    const ranked = products
      .map((p) => ({ p, score: scoreProduct(p, category.imageMatch) }))
      .filter((r) => r.score > 0 && r.p.image_url && !used.has(r.p.id))
      .sort((a, b) => b.score - a.score);

    const best = ranked[0]?.p;
    if (best?.image_url) {
      used.add(best.id);
      return {
        id: category.id,
        src: best.image_url,
        alt: `${category.imageAlt} — example: ${best.name}`,
      };
    }

    return {
      id: category.id,
      src: FALLBACKS[category.id],
      alt: category.imageAlt,
    };
  });
}
