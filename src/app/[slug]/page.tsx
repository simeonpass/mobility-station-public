import { notFound, redirect } from "next/navigation";
import { getProductBySlug } from "@/lib/products";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

/** Legacy Lovable URLs were `/{slug}`. Redirect to `/products/{slug}` when the slug is a published product. */
export default async function LegacyProductSlugPage({ params }: Props) {
  const { slug } = await params;

  // Avoid clashing with reserved words if a static route is ever removed
  const reserved = new Set([
    "api",
    "shop",
    "products",
    "blog",
    "checkout",
    "contact",
    "locations",
    "motability",
    "clearance",
    "search",
    "account",
    "admin",
    "manage",
    "website",
    "privacy-policy",
    "cookie-policy",
    "terms",
    "faq",
    "about-us",
    "book-a-demo",
    "book-a-service",
    "vehicle-adaptations",
    "order-confirmation",
    "trade-in",
    "mobility-scooter-hire",
    "lightweight-folding-mobility",
  ]);
  if (reserved.has(slug.toLowerCase())) notFound();

  try {
    const product = await getProductBySlug(slug);
    if (product) redirect(`/products/${product.slug}`);
  } catch {
    notFound();
  }

  notFound();
}
