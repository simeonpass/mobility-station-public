import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) throw new Error("Missing public Supabase environment variables");
  return createClient(url, key, { auth: { persistSession: false } });
}

export type LightweightProduct = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  manufacturer: string | null;
  unit_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  weight: number | null;
  delivery_estimate: string | null;
  quantity: number | null;
  track_stock: boolean | null;
  pre_order_enabled: boolean | null;
  pre_order_message: string | null;
  is_discontinued: boolean | null;
};

const CATEGORIES = [
  "Folding Mobility Scooters",
  "Small Scooters",
  "Mid Size Scooters",
  "Mobility Scooters",
  "Folding Powered Wheelchairs",
  "Powered Wheelchairs",
  "Wheelchairs",
];

const FIELDS = `id,name,slug,category,manufacturer,unit_price,sale_price,image_url,weight,delivery_estimate,quantity,track_stock,pre_order_enabled,pre_order_message,is_discontinued`;

export async function getLightweightProducts(limit = 120): Promise<LightweightProduct[]> {
  const { data, error } = await getClient()
    .from("stock_items")
    .select(FIELDS)
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .neq("product_type", "archived")
    .in("category", CATEGORIES)
    .not("slug", "is", null)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as LightweightProduct[];
}

export function currentPrice(product: LightweightProduct) {
  return product.sale_price ?? product.unit_price;
}

export function formatPrice(value: number | null) {
  if (value == null) return "Call for price";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
}

export function isScooter(product: LightweightProduct) {
  return product.category?.toLowerCase().includes("scooter") ?? false;
}

export function isPoweredWheelchair(product: LightweightProduct) {
  const category = product.category?.toLowerCase() ?? "";
  return category.includes("powered wheelchair") || category === "wheelchairs";
}

export function underWeight(product: LightweightProduct, max: number) {
  return typeof product.weight === "number" && product.weight > 0 && product.weight <= max;
}
