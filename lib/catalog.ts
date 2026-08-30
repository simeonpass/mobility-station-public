export type Product = {
  id: string;
  name: string;
  shortName: "M4" | "M4B" | "M4 Pro" | "X12" | "X12 Pro";
  sku?: string | null;
  slug: string;
  unit_price?: number | string | null;
  retail_price?: number | string | null;
  sale_price?: number | string | null;
  image_url?: string | null;
  image_url_wide?: string | null;
  additional_images?: unknown;
  description?: string | null;
  features?: string[] | null;
  specifications?: Record<string, unknown> | null;
  delivery_estimate?: string | null;
  meta_description?: string | null;
  seo_title?: string | null;
  track_stock?: boolean | null;
  quantity?: number | null;
  fallback?: boolean;
};

const M4_IMAGE = "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/sq_08b2b85a-3166-4b68-a636-b7b3c099d677.webp";

export const fallbackProducts: Product[] = [
  {
    id: "xsto-m4b-fallback",
    name: "XSTO M4B",
    shortName: "M4B",
    slug: "xsto-m4b",
    unit_price: 3750,
    image_url: M4_IMAGE,
    description: "The latest evolution of the XSTO M4 platform, with redesigned front wheels and a new folding footrest for easier transfers and a cleaner folded footprint.",
    features: ["New folding footrest", "Redesigned front wheels", "Self-balancing chassis", "Electric seat elevation", "Omnidirectional movement"],
    specifications: { "Max load": "115 kg", "Range": "15 km", "Top speed": "6 km/h", "Max slope": "10°", "Seat height": "347–650 mm" },
    delivery_estimate: "3–4 working days",
    fallback: true,
  },
  {
    id: "5da5602d-d9c7-4d1c-a65e-75b29bc5a944",
    name: "XSTO M4 Self-Balancing Power Wheelchair",
    shortName: "M4",
    sku: "FPW-046",
    slug: "xsto-m4",
    unit_price: 3495,
    image_url: M4_IMAGE,
    description: "The original self-balancing XSTO for everyday indoor and outdoor mobility.",
    delivery_estimate: "1–3 days",
  },
  {
    id: "388ba693-fd9e-4b85-a386-c7fdb09ce95e",
    name: "XSTO M4 Pro Self-Balancing Power Wheelchair",
    shortName: "M4 Pro",
    sku: "FPW-047",
    slug: "xsto-m4-pro",
    unit_price: 4495,
    image_url: "https://wgxtyckmxpmrrghpduwm.supabase.co/storage/v1/object/public/product-images/1772057791249-M4_Pro_01.webp",
    description: "Premium comfort, greater range and more adjustment while keeping XSTO self-balancing control.",
    delivery_estimate: "1–3 days",
  },
  {
    id: "f241df85-8f61-496f-9c49-2596ef6a4d9c",
    name: "XSTO X12 All-Terrain Mobility Robot",
    shortName: "X12",
    sku: "PWC-051",
    slug: "xsto-x12",
    unit_price: 14995,
    sale_price: 12995,
    image_url: "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/sq_81b50b59-109d-4159-8c8f-a123e932c944.webp",
    description: "A stair-climbing, all-terrain mobility robot engineered to go far beyond conventional powered wheelchairs.",
    delivery_estimate: "10 days",
  },
  {
    id: "b482885a-f098-4e37-b577-8dcdda238572",
    name: "XSTO X12 Pro All-Terrain Mobility Robot",
    shortName: "X12 Pro",
    sku: "PWC-087",
    slug: "xsto-x12-pro",
    unit_price: 16995,
    sale_price: 14995,
    image_url: "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/23a51d87-f0e5-4b38-9005-7abe37927e41.webp",
    description: "The ultimate XSTO platform: stair climbing and rough-terrain capability with Pro-level comfort and control.",
    delivery_estimate: "10 days",
  },
];

const CATALOG_URL = "https://evgvbvvpiculuizvvqyh.supabase.co/functions/v1/klym-catalog";

function shortName(name: string): Product["shortName"] | null {
  if (/\bM4B\b/i.test(name)) return "M4B";
  if (/M4 Pro/i.test(name)) return "M4 Pro";
  if (/\bM4\b/i.test(name)) return "M4";
  if (/X12 Pro/i.test(name)) return "X12 Pro";
  if (/\bX12\b/i.test(name)) return "X12";
  return null;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(CATALOG_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const json = await res.json() as { products?: Array<Record<string, unknown>> };
    const live = (json.products ?? []).flatMap((row) => {
      const label = shortName(String(row.name ?? ""));
      if (!label) return [];
      const fallback = fallbackProducts.find((p) => p.shortName === label)!;
      const features = Array.isArray(row.features) ? row.features.filter((v): v is string => typeof v === "string") : fallback.features;
      const specifications = row.specifications && typeof row.specifications === "object" && !Array.isArray(row.specifications) ? row.specifications as Record<string, unknown> : fallback.specifications;
      return [{ ...fallback, ...row, features, specifications, shortName: label, slug: fallback.slug, fallback: false } as Product];
    });
    return fallbackProducts.map((fallback) => live.find((p) => p.shortName === fallback.shortName) ?? fallback);
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export function displayPrice(product: Product) {
  const raw = product.sale_price ?? product.unit_price ?? product.retail_price ?? 0;
  const value = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export function gbp(value: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
}
