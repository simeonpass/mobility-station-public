import { rankProductSearch } from "@/lib/product-search";
import { displayPrice, type ProductListItem } from "@/lib/products";

export const SHOP_PAGE_SIZE = 24;

export type ShopSortKey =
  | "featured"
  | "name"
  | "price-low"
  | "price-high"
  | "motability";

export type ShopSub = "" | "scooters" | "wheelchairs" | "accessories";

export type ShopFilters = {
  query: string;
  category: string;
  manufacturer: string;
  sort: ShopSortKey;
  motabilityOnly: boolean;
  clearanceOnly: boolean;
  sub: ShopSub;
  /** 1-based number of result pages to render on the server. */
  page: number;
};

export const SCOOTER_CATS = [
  "Small Scooters",
  "Mid Size Scooters",
  "Large Mobility Scooters",
  "Folding Mobility Scooters",
  "Mobility Scooters",
];

export const WHEELCHAIR_CATS = [
  "Manual Wheelchairs",
  "Powered Wheelchairs",
  "Folding Powered Wheelchairs",
  "Wheelchairs",
];

export const ACCESSORY_CATS = [
  "XSTO Accessories",
  "Batteries & Chargers",
  "Lithium Batteries",
  "AGM Batteries",
  "Scooter Canopies",
  "Walking Aids",
];

export const SHOP_SUBS = [
  { id: "" as const, label: "All" },
  { id: "scooters" as const, label: "Scooters" },
  { id: "wheelchairs" as const, label: "Wheelchairs" },
  { id: "accessories" as const, label: "Batteries & extras" },
];

const SORT_KEYS: ShopSortKey[] = [
  "featured",
  "name",
  "price-low",
  "price-high",
  "motability",
];

export function parseShopFilters(
  params: Record<string, string | string[] | undefined>,
): ShopFilters {
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  };
  const subRaw = one("sub");
  const sortRaw = one("sort");
  const pageRaw = Number(one("page"));
  return {
    query: one("q").trim(),
    category: one("category"),
    manufacturer: one("manufacturer"),
    sort: SORT_KEYS.includes(sortRaw as ShopSortKey)
      ? (sortRaw as ShopSortKey)
      : "featured",
    motabilityOnly: one("motability") === "1",
    clearanceOnly: one("clearance") === "1",
    sub:
      subRaw === "scooters" ||
      subRaw === "wheelchairs" ||
      subRaw === "accessories"
        ? subRaw
        : "",
    page: Number.isFinite(pageRaw) ? Math.min(20, Math.max(1, Math.floor(pageRaw))) : 1,
  };
}

export function shopFiltersToSearchParams(filters: ShopFilters) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.sub) params.set("sub", filters.sub);
  if (filters.category) params.set("category", filters.category);
  if (filters.manufacturer) params.set("manufacturer", filters.manufacturer);
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  if (filters.motabilityOnly) params.set("motability", "1");
  if (filters.clearanceOnly) params.set("clearance", "1");
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export function shopManufacturers(products: ProductListItem[]) {
  const set = new Set<string>();
  for (const product of products) {
    if (product.manufacturer) set.add(product.manufacturer);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function filterShopProducts(
  products: ProductListItem[],
  filters: ShopFilters,
) {
  let list = [...products];

  if (filters.sub === "scooters") {
    list = list.filter((p) => SCOOTER_CATS.includes(p.category || ""));
  } else if (filters.sub === "wheelchairs") {
    list = list.filter((p) => WHEELCHAIR_CATS.includes(p.category || ""));
  } else if (filters.sub === "accessories") {
    list = list.filter((p) => ACCESSORY_CATS.includes(p.category || ""));
  }

  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }

  if (filters.manufacturer) {
    list = list.filter((p) => p.manufacturer === filters.manufacturer);
  }

  if (filters.query) {
    list = rankProductSearch(list, filters.query).items;
  }

  if (filters.motabilityOnly) {
    list = list.filter(
      (p) =>
        (p.motability_weekly_price != null && p.motability_weekly_price > 0) ||
        p.motability_price != null,
    );
  }

  if (filters.clearanceOnly) {
    list = list.filter(
      (p) =>
        p.condition === "ex-demo" ||
        p.condition === "refurbished" ||
        p.condition === "pre-owned",
    );
  }

  list.sort((a, b) => {
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    if (filters.sort === "price-low" || filters.sort === "price-high") {
      const pa = displayPrice(a).current ?? Number.POSITIVE_INFINITY;
      const pb = displayPrice(b).current ?? Number.POSITIVE_INFINITY;
      return filters.sort === "price-low" ? pa - pb : pb - pa;
    }
    if (filters.sort === "motability") {
      const ma = a.motability_weekly_price ?? a.motability_price ?? 99999;
      const mb = b.motability_weekly_price ?? b.motability_price ?? 99999;
      return ma - mb;
    }
    // Keep search relevance unless the customer deliberately chooses a sort.
    if (filters.query) return 0;
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return list;
}

export function manufacturerToSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Menu and older links use these slugs as well as the live catalogue name. */
const BRAND_PAGE_ALIASES: Record<string, string> = {
  pride: "Pride",
  "pride-mobility": "Pride",
  tga: "TGA",
  "tga-mobility": "TGA",
  kymco: "Kymco",
  "kymco-healthcare": "Kymco",
};

export function resolveManufacturerFromSlug(
  manufacturers: string[],
  slug: string,
) {
  const exact =
    manufacturers.find((name) => manufacturerToSlug(name) === slug) ?? null;
  if (exact) return exact;
  const brand = BRAND_PAGE_ALIASES[slug];
  if (!brand) return null;
  return manufacturers.find((name) => shopBrandMatches(name, brand)) ?? null;
}

export const FEATURED_SHOP_BRANDS = [
  "Pride",
  "TGA",
  "Drive Medical",
  "Kymco",
  "Freerider",
  "Karma",
  "Sunrise Medical",
  "Motion Healthcare",
];

export function shopBrandMatches(manufacturer: string, brand: string) {
  const hay = manufacturer.toLowerCase();
  const needle = brand.toLowerCase();
  return hay === needle || hay.includes(needle) || needle.includes(hay);
}

export function shopSeoFromFilters(filters: ShopFilters) {
  const params = shopFiltersToSearchParams(filters).toString();
  const path = params ? `/shop?${params}` : "/shop";
  const noIndex = Boolean(filters.query);

  if (filters.clearanceOnly) {
    return {
      title: "Clearance scooters & wheelchairs",
      description:
        "Ex-demo, refurbished and pre-owned mobility scooters and wheelchairs from Heathrow and Ferndown. Honest grades and clear prices.",
      path,
      noIndex,
    };
  }

  if (filters.motabilityOnly) {
    return {
      title: "Motability scooters & wheelchairs",
      description:
        "Scooters and wheelchairs available on the Motability Scheme, with weekly figures from our live catalogue. Heathrow and Ferndown demonstrations.",
      path,
      noIndex,
    };
  }

  if (filters.manufacturer) {
    return {
      title: `${filters.manufacturer} scooters & wheelchairs`,
      description: `Browse ${filters.manufacturer} mobility scooters and wheelchairs from Mobility Station. VAT relief, Motability options and demonstrations from Heathrow and Ferndown.`,
      path,
      noIndex,
    };
  }

  if (filters.sub === "scooters") {
    return {
      title: "Mobility scooters for sale",
      description:
        "Small, mid-size, large and folding mobility scooters from Pride, TGA, Kymco, Drive and more. VAT relief and Motability options. Heathrow and Ferndown.",
      path,
      noIndex,
    };
  }

  if (filters.sub === "wheelchairs") {
    return {
      title: "Wheelchairs & powerchairs for sale",
      description:
        "Manual wheelchairs, folding powerchairs and powered wheelchairs from trusted brands. VAT relief, Motability and demonstrations from Heathrow and Ferndown.",
      path,
      noIndex,
    };
  }

  if (filters.sub === "accessories") {
    return {
      title: "Mobility batteries, chargers & extras",
      description:
        "Batteries, chargers, canopies and extras for mobility scooters and wheelchairs, with advice from our Heathrow and Ferndown teams.",
      path,
      noIndex,
    };
  }

  if (filters.category) {
    return {
      title: filters.category,
      description: `Browse ${filters.category} from Mobility Station. Home and branch demonstrations from Heathrow and Ferndown.`,
      path,
      noIndex,
    };
  }

  return {
    title: "Shop scooters, wheelchairs & more",
    description:
      "Browse mobility scooters, powered wheelchairs and more. Home and branch demonstrations from Heathrow and Ferndown.",
    path,
    noIndex,
  };
}
