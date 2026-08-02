import { notFound, redirect } from "next/navigation";
import { getProductBySlug } from "@/lib/products";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

/**
 * Legacy Lovable product URLs were `/{slug}`.
 * Redirect to `/products/{slug}` when the slug is a published product;
 * otherwise return a real HTTP 404 (do not soft-404 as the homepage).
 */
export default async function LegacyProductSlugPage({ params }: Props) {
  const { slug } = await params;

  // Avoid clashing with reserved / static route segments
  const reserved = new Set([
    "api",
    "shop",
    "products",
    "product",
    "blog",
    "blogs",
    "checkout",
    "contact",
    "locations",
    "motability",
    "clearance",
    "search",
    "account",
    "admin",
    "manage",
    "dashboard",
    "engineer",
    "website",
    "privacy-policy",
    "cookie-policy",
    "terms",
    "faq",
    "about-us",
    "about",
    "book-a-demo",
    "book-a-service",
    "vehicle-adaptations",
    "adaptations",
    "order-confirmation",
    "trade-in",
    "mobility-scooter-hire",
    "lightweight-folding-mobility",
    "hire",
    "delivery",
    "service-area",
    "find-my-scooter",
    "our-work",
    "vat-relief",
    "collections",
    "pages",
    "policies",
    "services",
    "servicing",
    "cart",
    "home",
    "luggy-scooters",
    "luggie-scooters",
    "mobility-scooters",
    "powered-wheelchairs",
  ]);
  if (reserved.has(slug.toLowerCase())) notFound();

  const product = await getProductBySlug(slug);
  if (product) redirect(`/products/${product.slug}`);

  notFound();
}
