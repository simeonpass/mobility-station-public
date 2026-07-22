import type { MetadataRoute } from "next";
import { ADAPTATION_SERVICES, BLOG_POSTS, PRODUCTS } from "@/data/content";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/vehicle-adaptations",
    "/lightweight-folding-mobility",
    "/locations",
    "/book-a-demo",
    "/book-a-service",
    "/contact",
    "/blog",
    "/mobility-scooter-hire",
    "/trade-in",
    "/about-us",
    "/motability",
    "/faq",
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE.url}${path || "/"}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...ADAPTATION_SERVICES.map((service) => ({
      url: `${SITE.url}/vehicle-adaptations/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${SITE.url}/${product.categorySlug}/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
