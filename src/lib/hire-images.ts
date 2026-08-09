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

/** Extra positive / negative keywords so powered chairs never win a manual slot. */
const MATCH_RULES: Record<
  HirePricingCategoryId,
  { prefer: RegExp; reject: RegExp }
> = {
  transit_wheelchair: {
    prefer: /transit|attendant/i,
    reject: /power|electric|joystick|self.?propel|scooter/i,
  },
  self_propelled_manual: {
    prefer: /manual wheelchair|self.?propel/i,
    reject: /power|electric|joystick|transit|attendant|scooter|bariatric|heavy.?duty/i,
  },
  heavy_duty_manual: {
    prefer:
      /(?:heavy.?duty|bariatric).*(?:manual )?wheelchair|(?:manual )?wheelchair.*(?:heavy.?duty|bariatric)|wide(?:r)? seat.*wheelchair/i,
    reject: /power|electric|joystick|scooter|folding electric/i,
  },
  folding_electric_wheelchair: {
    prefer: /folding.*(electric|power).*wheelchair|lightweight.*power/i,
    reject: /scooter|manual wheelchair|transit/i,
  },
  powered_wheelchair: {
    prefer: /powered wheelchair|powerchair|power chair/i,
    reject: /folding|scooter|manual|transit/i,
  },
  folding_scooter: {
    prefer: /folding.*scooter/i,
    reject: /wheelchair/i,
  },
  small_boot_scooter: {
    prefer: /boot|portable|travel.*scooter|small.*scooter|class\s*2/i,
    reject: /wheelchair|folding.*scooter|class\s*3|large|road/i,
  },
  medium_scooter: {
    prefer: /medium|mid.?size|mobility scooter/i,
    reject: /wheelchair|folding|boot|portable|class\s*3|large|road/i,
  },
  large_scooter: {
    prefer: /large|road|class\s*3/i,
    reject: /wheelchair|folding|boot|portable|class\s*2/i,
  },
};

function scoreProduct(
  product: ProductListItem,
  categoryId: HirePricingCategoryId,
  match: RegExp,
): number {
  const hay = `${product.name} ${product.category ?? ""}`;
  const rules = MATCH_RULES[categoryId];
  if (rules.reject.test(hay)) return 0;
  if (!match.test(hay) && !rules.prefer.test(hay)) return 0;

  let score = 10;
  if (product.image_url) score += 5;
  if (rules.prefer.test(hay)) score += 8;
  if (match.test(hay)) score += 4;

  // Manual wheelchair categories must look like manual chairs.
  if (
    categoryId === "heavy_duty_manual" ||
    categoryId === "self_propelled_manual" ||
    categoryId === "transit_wheelchair"
  ) {
    if (/manual/i.test(hay)) score += 6;
    if (/wheelchair/i.test(hay)) score += 3;
  }

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
      .map((p) => ({
        p,
        score: scoreProduct(p, category.id, category.imageMatch),
      }))
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

    // Prefer placeholder over a wrong powered-chair photo for manual categories.
    return {
      id: category.id,
      src: FALLBACKS[category.id],
      alt: category.imageAlt,
    };
  });
}
