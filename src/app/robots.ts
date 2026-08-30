import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/order-confirmation",
        "/hire/checkout",
        "/hire/thank-you",
        "/book-a-demo/thank-you",
        "/book-a-service/thank-you",
        "/care-plan/success",
        "/website/",
        "/api/",
        "/search",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
