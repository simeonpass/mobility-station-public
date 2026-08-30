import {
  HIRE_PRICING_CATEGORIES,
  type HirePricingCategoryId,
} from "@/lib/hire-pricing";
import { getProductsBySlugs } from "@/lib/products";

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

type HireImageSource = {
  slug: string;
  name: string;
  /** Curated product photo from the live catalogue page. */
  imageUrl: string;
};

/**
 * Staff-chosen catalogue examples for each hire category.
 * Prefer live product image_url by slug when Supabase is available;
 * otherwise use the curated imageUrl so previews stay accurate.
 * heavy_duty_manual left unset until confirmed.
 */
export const HIRE_CATEGORY_IMAGE_SOURCES: Partial<
  Record<HirePricingCategoryId, HireImageSource>
> = {
  transit_wheelchair: {
    slug: "karma-ergo-lite-2-transit-wheelchair",
    name: "Karma Ergo Lite 2 Transit Wheelchair",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0568/2928/0435/files/Karma-Ergo-Lite-2-Transit-Wheelchair.jpg?v=1761236999",
  },
  self_propelled_manual: {
    slug: "karma-ergo-lite-2-self-propel-wheelchair",
    name: "Karma Ergo Lite 2 Self-Propel Wheelchair",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0568/2928/0435/files/Karma-Ergo-Lite-2-Self-Propel-Wheelchair.jpg?v=1761236610",
  },
  folding_electric_wheelchair: {
    slug: "ergofold-folding-power-chair",
    name: "ErgoFold Folding Power Chair",
    imageUrl:
      "https://uwalzdrmowrciwnbetzk.supabase.co/storage/v1/object/public/stock-images/fc36591e-fab0-4345-8ae5-767610a7e45d.webp",
  },
  powered_wheelchair: {
    slug: "k-activ-rehab",
    name: "K-Activ Rehab",
    imageUrl:
      "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/9a4ddfe7-df31-4a50-87fb-cf68fc4b06de.jpg",
  },
  folding_scooter: {
    slug: "eezy-fold-mobility-scooter-white",
    name: "Eezy-Fold Mobility Scooter",
    imageUrl:
      "https://uwalzdrmowrciwnbetzk.supabase.co/storage/v1/object/public/stock-images/4ba18505-ec1f-460a-8a70-50bd8b8b1e82.webp",
  },
  small_boot_scooter: {
    slug: "pride-go-go-elite-traveller-2-0-mobility-scooter",
    name: "Pride Go Go Elite Traveller 2.0",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0568/2928/0435/files/Pride-Go-Go-Elite-Traveller-2_0-Mobility-Scooter.webp?v=1761237268",
  },
  medium_scooter: {
    slug: "agility-mobility-scooter",
    name: "Agility Mobility Scooter",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0568/2928/0435/files/Agility-Mobility-Scooter.jpg?v=1761236988",
  },
  large_scooter: {
    slug: "pride-colt-pursuit-mobility-scooter-1",
    name: "Pride Colt Pursuit Mobility Scooter",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0568/2928/0435/files/Pride-Colt-Pursuit-Mobility-Scooter.jpg?v=1761236518",
  },
};

/** @deprecated use HIRE_CATEGORY_IMAGE_SOURCES */
export const HIRE_CATEGORY_PRODUCT_SLUGS: Partial<
  Record<HirePricingCategoryId, string>
> = Object.fromEntries(
  Object.entries(HIRE_CATEGORY_IMAGE_SOURCES).map(([id, src]) => [
    id,
    src.slug,
  ]),
) as Partial<Record<HirePricingCategoryId, string>>;

/**
 * Pick one genuine catalogue photo per hire category from the mapped product.
 * Never invents AI imagery — falls back to local placeholders only.
 */
export async function getHireCategoryImages(): Promise<HireCategoryImage[]> {
  let bySlug = new Map<string, { name: string; image_url: string | null }>();
  try {
    const slugs = Object.values(HIRE_CATEGORY_IMAGE_SOURCES).map((source) => source.slug);
    const products = await getProductsBySlugs(slugs);
    bySlug = new Map(
      products.map((p) => [p.slug, { name: p.name, image_url: p.image_url }]),
    );
  } catch {
    bySlug = new Map();
  }

  return HIRE_PRICING_CATEGORIES.map((category) => {
    const source = HIRE_CATEGORY_IMAGE_SOURCES[category.id];
    if (!source) {
      return {
        id: category.id,
        src: FALLBACKS[category.id],
        alt: category.imageAlt,
      };
    }

    const live = bySlug.get(source.slug);
    const src = live?.image_url || source.imageUrl;
    const name = live?.name || source.name;

    return {
      id: category.id,
      src,
      alt: `${category.imageAlt} — example: ${name}`,
    };
  });
}
