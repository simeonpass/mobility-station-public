import type { MetadataRoute } from "next";
import { LOCATION_PAGES } from "@/data/location-pages";
import {
  ADAPTATION_SECTIONS,
  categoryToSlug as adaptationCategoryToSlug,
} from "@/lib/adaptations";
import { getBlogPosts, getKnowledgeFaqs } from "@/lib/data";
import { categoryToSlug, getAllPublishedSlugs, getCategories } from "@/lib/products";
import { listAllRecentWork } from "@/lib/recent-work";
import { SITE } from "@/lib/seo";

/** Only emit lastmod when we have a real content timestamp — never build time. */
function withLastMod(
  entry: Omit<MetadataRoute.Sitemap[number], "lastModified">,
  date: string | Date | null | undefined,
): MetadataRoute.Sitemap[number] {
  if (!date) return entry;
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return entry;
  return { ...entry, lastModified: parsed };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/shop`, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${SITE.url}/vehicle-adaptations`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/locations`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/book-a-demo`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/book-a-service`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/servicing`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    { url: `${SITE.url}/hire`, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${SITE.url}/hire/short-term`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/hire/flex`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/hire/terms`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    { url: `${SITE.url}/our-work`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${SITE.url}/clearance`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/delivery`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/service-area`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/lightweight-folding-mobility`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/trade-in`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE.url}/about-us`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE.url}/motability`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/motability/vehicle-adaptations`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${SITE.url}/faq`, changeFrequency: "weekly", priority: 0.65 },
    {
      url: `${SITE.url}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/vat-relief`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE.url}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/cookie-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    { url: `${SITE.url}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let products: { slug: string; updated_at: string }[] = [];
  try {
    products = await getAllPublishedSlugs();
  } catch (error) {
    console.error("Sitemap product fetch failed:", error);
  }

  let blogPosts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  try {
    blogPosts = await getBlogPosts();
  } catch (error) {
    console.error("Sitemap blog fetch failed:", error);
  }

  let knowledgeFaqs: Awaited<ReturnType<typeof getKnowledgeFaqs>> = [];
  try {
    knowledgeFaqs = await getKnowledgeFaqs();
  } catch (error) {
    console.error("Sitemap knowledge FAQ fetch failed:", error);
  }

  let recentWork: Awaited<ReturnType<typeof listAllRecentWork>> = [];
  try {
    recentWork = await listAllRecentWork();
  } catch (error) {
    console.error("Sitemap recent work fetch failed:", error);
  }

  let shopCategories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    shopCategories = await getCategories({ shopOnly: true });
  } catch (error) {
    console.error("Sitemap shop category fetch failed:", error);
  }

  const townRoutes = LOCATION_PAGES.map((loc) => ({
    url: `${SITE.url}/service-area/${loc.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const adaptationRoutes = [
    ...ADAPTATION_SECTIONS.map((section) => ({
      url: `${SITE.url}/vehicle-adaptations/${section.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...ADAPTATION_SECTIONS.flatMap((section) =>
      section.categories.map((category) => ({
        url: `${SITE.url}/vehicle-adaptations/${adaptationCategoryToSlug(category)}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ),
  ];

  const shopCategoryRoutes = shopCategories.map((c) => ({
    url: `${SITE.url}/shop/${categoryToSlug(c.category)}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...townRoutes,
    ...shopCategoryRoutes,
    ...adaptationRoutes,
    ...products.map((p) =>
      withLastMod(
        {
          url: `${SITE.url}/products/${p.slug}`,
          changeFrequency: "weekly",
          priority: 0.7,
        },
        p.updated_at,
      ),
    ),
    ...recentWork.map((project) =>
      withLastMod(
        {
          url: `${SITE.url}/our-work/${project.slug}`,
          changeFrequency: "monthly",
          priority: 0.6,
        },
        project.updated_at || project.work_date,
      ),
    ),
    ...blogPosts.map((post) =>
      withLastMod(
        {
          url: `${SITE.url}/blog/${post.slug}`,
          changeFrequency: "monthly",
          priority: 0.5,
        },
        post.updatedAt || post.publishedAt,
      ),
    ),
    ...knowledgeFaqs.map((faq) =>
      withLastMod(
        {
          url: `${SITE.url}/faq/${faq.slug}`,
          changeFrequency: "monthly",
          priority: 0.55,
        },
        faq.updatedAt || faq.publishedAt,
      ),
    ),
  ];
}
