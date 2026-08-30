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
  video_url?: string | null;
  video_poster_url?: string | null;
  manual_url?: string | null;
  manual_label?: string | null;
  fallback?: boolean;
};

const M4_IMAGE = "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/sq_08b2b85a-3166-4b68-a636-b7b3c099d677.webp";
const M4_MANUAL = "https://www.spinlife.com/files/M4_XSTO_OwnersManual.pdf";
const M4B_VIDEO = "https://www.youtube.com/watch?v=D-7Pt3OUdQg";

const M4_IMAGES = [
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-01.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-02.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-03.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-04.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-05.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-06.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-07.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-08.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-09.jpg?v=1783959479",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/m4-10.jpg?v=1783959479",
];

const M4B_IMAGES = [
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B.png?v=1784395920",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B_1.png?v=1784395920",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B_2.png?v=1784395920",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B_3.png?v=1784395920",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B_4.png?v=1784395920",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B_5.png?v=1784395920",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B_6.png?v=1784395920",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B_7.png?v=1784395920",
];

const M4_PRO_IMAGES = [
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-9425362.jpg?v=1771010430",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-9563651.jpg?v=1771010429",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-1573822.jpg?v=1771010430",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-6544439.jpg?v=1771010432",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-8840849.jpg?v=1771010379",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-4784054.jpg?v=1771010380",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-3549319.jpg?v=1771010380",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-8781936.jpg?v=1771010381",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-1791631.jpg?v=1771010431",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/xsto-m4-pro-mobility-wheelchair-adjustable-seat-backrest-1523885.jpg?v=1771010378",
];

const X12_IMAGES = [
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-8874875.jpg?v=1770295862",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-3449319.jpg?v=1762593315",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-9175545.jpg?v=1762593361",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-3796951.jpg?v=1762593312",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-5770972.jpg?v=1762593311",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-3847978.jpg?v=1762593314",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-4295527.jpg?v=1762593387",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-8365307.jpg?v=1762593358",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-8386824.jpg?v=1762593313",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-9583848.jpg?v=1762593359",
];

const X12_PRO_IMAGES = [
  "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/8cbf72b9-9b2b-47d2-a0c0-717252b71e27.webp",
  "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/db5f4055-7eb4-4977-be82-82a30e29f093.webp",
  "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/0eff3af2-5a82-4eae-ba75-0f520e58bab4.webp",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-pro-hero.webp?v=1780226734",
  "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-hero-stairs.webp?v=1780226734",
];

export const fallbackProducts: Product[] = [
  {
    id: "xsto-m4b-fallback",
    name: "XSTO M4B Self-Balancing Power Wheelchair",
    shortName: "M4B",
    sku: "XSTO-M4B",
    slug: "xsto-m4b",
    unit_price: 3750,
    retail_price: 4500,
    image_url: M4B_IMAGES[0],
    additional_images: M4B_IMAGES.slice(1),
    video_url: M4B_VIDEO,
    video_poster_url: "https://img.youtube.com/vi/D-7Pt3OUdQg/maxresdefault.jpg",
    manual_url: M4_MANUAL,
    manual_label: "XSTO M4 / M4B User Manual (PDF)",
    description: "The latest evolution of the XSTO M4 platform, with redesigned front wheels and an integrated folding footrest for easier transfers and a cleaner folded footprint.",
    features: ["New integrated folding footrest", "Redesigned front-wheel system", "Front/rear self-balancing control", "Electric seat elevation 347–650 mm", "15 km range", "6 km/h top speed"],
    specifications: { "Range": "15 km (9.3 miles)", "Top Speed": "6 km/h (3.7 mph)", "Max Slope": "10°", "Max Load Capacity": "115 kg (254 lbs)", "Seat Height Range": "347–650 mm", "Footrest": "Integrated folding footrest" },
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
    additional_images: M4_IMAGES,
    manual_url: M4_MANUAL,
    manual_label: "XSTO M4 / M4B User Manual (PDF)",
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
    additional_images: M4_PRO_IMAGES,
    description: "Premium comfort, greater adjustment and XSTO self-balancing control in the M4 Pro platform.",
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
    additional_images: X12_IMAGES,
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
    additional_images: X12_PRO_IMAGES,
    description: "The ultimate XSTO platform: stair climbing and rough-terrain capability with Pro-level comfort and control.",
    delivery_estimate: "10 days",
  },
];

const CATALOG_URL = "https://evgvbvvpiculuizvvqyh.supabase.co/functions/v1/klym-catalog";

function shortName(name: string): Product["shortName"] | null {
  if (/\bM4B\b/i.test(name)) return "M4B";
  if (/M4 Pro/i.test(name)) return "M4 Pro";
  if (/X12 Pro/i.test(name)) return "X12 Pro";
  if (/\bX12\b/i.test(name)) return "X12";
  if (/\bM4\b/i.test(name)) return "M4";
  return null;
}

function stringImages(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function productRecordScore(row: Record<string, unknown>, label: Product["shortName"]): number {
  const name = String(row.name ?? "");
  const extras = stringImages(row.additional_images).length;
  let score = extras * 10;
  if (/XSTO/i.test(name)) score += 10;
  if (/Power Wheelchair|Mobility Robot|Self-Balancing/i.test(name)) score += 20;
  if (label === "M4 Pro" && /M4 Pro Self-Balancing Power Wheelchair/i.test(name)) score += 50;
  if (label === "M4" && /XSTO M4 Self-Balancing Power Wheelchair/i.test(name)) score += 50;
  if (label === "M4B" && /XSTO M4B Self-Balancing Power Wheelchair/i.test(name)) score += 50;
  if (label === "X12" && /XSTO X12 All-Terrain Mobility Robot/i.test(name)) score += 50;
  if (label === "X12 Pro" && /XSTO X12 Pro All-Terrain Mobility Robot/i.test(name)) score += 50;
  if (/accessor|bag|battery|charger|cushion|holder|support|wheel|cover|headrest|joystick/i.test(name) && !/Power Wheelchair|Mobility Robot/i.test(name)) score -= 100;
  return score;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(CATALOG_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const json = await res.json() as { products?: Array<Record<string, unknown>> };
    const rows = json.products ?? [];

    return fallbackProducts.map((fallback) => {
      const candidates = rows
        .filter((row) => shortName(String(row.name ?? "")) === fallback.shortName)
        .sort((a, b) => productRecordScore(b, fallback.shortName) - productRecordScore(a, fallback.shortName));

      const row = candidates[0];
      if (!row) return fallback;

      const liveExtras = stringImages(row.additional_images);
      const fallbackExtras = stringImages(fallback.additional_images);
      const mergedImages = Array.from(new Set([...liveExtras, ...fallbackExtras]));
      const features = Array.isArray(row.features)
        ? row.features.filter((v): v is string => typeof v === "string")
        : fallback.features;
      const specifications = row.specifications && typeof row.specifications === "object" && !Array.isArray(row.specifications)
        ? row.specifications as Record<string, unknown>
        : fallback.specifications;

      return {
        ...fallback,
        ...row,
        image_url: (typeof row.image_url === "string" && row.image_url) ? row.image_url : fallback.image_url,
        image_url_wide: (typeof row.image_url_wide === "string" && row.image_url_wide) ? row.image_url_wide : fallback.image_url_wide,
        additional_images: mergedImages,
        features,
        specifications,
        shortName: fallback.shortName,
        slug: fallback.slug,
        fallback: false,
      } as Product;
    });
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export function productImages(product: Product): string[] {
  const extras = stringImages(product.additional_images);
  return Array.from(new Set([
    product.image_url,
    product.image_url_wide,
    ...extras,
  ].filter((value): value is string => typeof value === "string" && value.length > 0)));
}

export function displayPrice(product: Product) {
  const raw = product.sale_price ?? product.unit_price ?? product.retail_price ?? 0;
  const value = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export function gbp(value: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
}
