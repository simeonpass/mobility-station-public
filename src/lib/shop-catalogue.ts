import { displayPrice, type ProductListItem } from "@/lib/products";

export const SHOP_PAGE_SIZE = 48;

export type ShopSortKey =
  | "featured"
  | "name"
  | "price-low"
  | "price-high"
  | "motability";

export type ShopSub = "" | "scooters" | "wheelchairs";

export type ShopFilters = {
  query: string;
  category: string;
  manufacturer: string;
  sort: ShopSortKey;
  motabilityOnly: boolean;
  clearanceOnly: boolean;
  sub: ShopSub;
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

export const SHOP_SUBS = [
  { id: "" as const, label: "All" },
  { id: "scooters" as const, label: "Scooters" },
  { id: "wheelchairs" as const, label: "Wheelchairs" },
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
  return {
    query: one("q").trim(),
    category: one("category"),
    manufacturer: one("manufacturer"),
    sort: SORT_KEYS.includes(sortRaw as ShopSortKey)
      ? (sortRaw as ShopSortKey)
      : "featured",
    motabilityOnly: one("motability") === "1",
    clearanceOnly: one("clearance") === "1",
    sub: subRaw === "scooters" || subRaw === "wheelchairs" ? subRaw : "",
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
  }

  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }

  if (filters.manufacturer) {
    list = list.filter((p) => p.manufacturer === filters.manufacturer);
  }

  if (filters.query) {
    const raw = filters.query.toLowerCase();
    const words = raw.split(/\s+/).filter(Boolean);
    const tokens = words.filter((t) => t.length >= 2);
    const compounds: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
      const a = words[i];
      const b = words[i + 1];
      if (a.length <= 2 || a.includes("-") || b.includes("-")) {
        compounds.push(`${a}-${b}`, `${a}${b}`);
      }
    }
    for (const word of words) {
      if (word.includes("-")) compounds.push(word.replace(/-/g, ""));
    }
    const compact = (value: string) => value.replace(/[^a-z0-9]+/g, "");
    const phraseCompact = compact(raw);
    list = list.filter((p) => {
      const haystack = [p.name, p.manufacturer || "", p.category || ""]
        .join(" ")
        .toLowerCase();
      const haystackCompact = compact(haystack);
      if (phraseCompact && haystackCompact.includes(phraseCompact)) return true;
      if (
        compounds.some(
          (c) => haystack.includes(c) || haystackCompact.includes(compact(c)),
        )
      ) {
        return true;
      }
      if (!tokens.length) return false;
      return tokens.every((t) => haystack.includes(t));
    });
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
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return list;
}
