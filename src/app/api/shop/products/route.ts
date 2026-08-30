import { NextResponse } from "next/server";
import { getPublishedProducts } from "@/lib/products";
import {
  SHOP_PAGE_SIZE,
  filterShopProducts,
  parseShopFilters,
} from "@/lib/shop-catalogue";

export const revalidate = 300;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = parseShopFilters(Object.fromEntries(url.searchParams));
  const offset = Math.max(0, Number(url.searchParams.get("offset") || 0) || 0);
  const limit = Math.min(
    SHOP_PAGE_SIZE,
    Math.max(1, Number(url.searchParams.get("limit") || SHOP_PAGE_SIZE) || SHOP_PAGE_SIZE),
  );

  try {
    const products = await getPublishedProducts({ limit: 500, shopOnly: true });
    const filtered = filterShopProducts(products, filters);
    return NextResponse.json({
      products: filtered.slice(offset, offset + limit),
      total: filtered.length,
    });
  } catch (error) {
    console.error("Shop catalogue page fetch failed:", error);
    return NextResponse.json(
      { error: "Could not load products" },
      { status: 500 },
    );
  }
}
