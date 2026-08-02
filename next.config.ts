import type { NextConfig } from "next";

/**
 * Legacy SEO cutover redirects (301).
 *
 * Canonical product URLs on this site are `/products/:slug`.
 * Do NOT redirect `/products/:slug` → `/:slug` — that would invert the
 * live canonicals. Root `/:slug` already 301s to `/products/:slug` when
 * the product exists (see `src/app/[slug]/page.tsx`).
 */
const nextConfig: NextConfig = {
  images: {
    // Prefer modern formats on mobile to cut payload size.
    formats: ["image/avif", "image/webp"],
    // Catalogue cards are small; avoid requesting oversized variants.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.myshopify.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "cdn.mobilitystation.co.uk" },
      // Catch-all for manufacturer / legacy product hosts (e.g. winches-uk).
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      // —— Specific legacy paths (before catch-alls) ——
      { source: "/shop/all", destination: "/shop", permanent: true },
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/cart", destination: "/checkout", permanent: true },
      {
        source: "/mobility-scooters",
        destination: "/shop?sub=scooters",
        permanent: true,
      },
      {
        source: "/powered-wheelchairs",
        destination: "/shop?sub=wheelchairs",
        permanent: true,
      },
      {
        source: "/luggy-scooters",
        destination: "/shop?q=luggie",
        permanent: true,
      },
      {
        source: "/luggie-scooters",
        destination: "/shop?q=luggie",
        permanent: true,
      },
      {
        source: "/adaptations",
        destination: "/vehicle-adaptations",
        permanent: true,
      },
      {
        source: "/adaptations/all",
        destination: "/vehicle-adaptations",
        permanent: true,
      },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/our-work", destination: "/blog", permanent: true },
      { source: "/find-my-scooter", destination: "/shop", permanent: true },
      {
        source: "/mobility-scooter-hire",
        destination: "/hire",
        permanent: true,
      },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/cookies", destination: "/cookie-policy", permanent: true },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/policies/privacy-policy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/policies/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/policies/refund-policy",
        destination: "/terms",
        permanent: true,
      },
      { source: "/policies/:path*", destination: "/", permanent: true },
      { source: "/services", destination: "/book-a-service", permanent: true },
      {
        source: "/services/:path*",
        destination: "/book-a-service",
        permanent: true,
      },
      { source: "/servicing", destination: "/book-a-service", permanent: true },
      {
        source: "/servicing/:path*",
        destination: "/book-a-service",
        permanent: true,
      },

      // Shopify / WordPress-style catalogue paths
      { source: "/product/:slug", destination: "/products/:slug", permanent: true },
      {
        source: "/product-category/:path*",
        destination: "/shop",
        permanent: true,
      },
      { source: "/collections", destination: "/shop", permanent: true },
      { source: "/collections/:path*", destination: "/shop", permanent: true },
      { source: "/pages/:path*", destination: "/", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:path*", destination: "/blog", permanent: true },

      // Old Lovable “website” prefix (keep hire checkout before catch-all)
      {
        source: "/website/hire/checkout/:id",
        destination: "/hire/checkout/:id",
        permanent: true,
      },
      {
        source: "/website/order-confirmation",
        destination: "/order-confirmation",
        permanent: true,
      },
      { source: "/website", destination: "/", permanent: true },
      { source: "/website/:path*", destination: "/:path*", permanent: true },

      // Admin / staff apps live on the Lovable system host
      {
        source: "/manage/:path*",
        destination:
          "https://system.mobilitystation.co.uk/manage/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "https://system.mobilitystation.co.uk/manage/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard/:path*",
        destination: "https://system.mobilitystation.co.uk/manage/dashboard",
        permanent: true,
      },
      {
        source: "/engineer",
        destination: "https://system.mobilitystation.co.uk/manage/dashboard",
        permanent: true,
      },
      {
        source: "/engineer/:path*",
        destination: "https://system.mobilitystation.co.uk/manage/dashboard",
        permanent: true,
      },

      // Adaptation variants split into standalone products — old parent SKUs
      {
        source: "/products/jeff-gosling-push-pull-hand-controls",
        destination: "/vehicle-adaptations/mechanical-hand-controls",
        permanent: true,
      },
      {
        source: "/products/cowal-push-pull-hand-controls",
        destination: "/vehicle-adaptations/mechanical-hand-controls",
        permanent: true,
      },
      {
        source: "/products/brig-ayd-push-pull-hand-controls",
        destination: "/vehicle-adaptations/mechanical-hand-controls",
        permanent: true,
      },
      {
        source: "/products/jeff-gosling-apex-assist-boot-hoist",
        destination: "/vehicle-adaptations/boot-hoists",
        permanent: true,
      },
      {
        source: "/products/smart-lifter-lc-compact-hoist",
        destination: "/vehicle-adaptations/boot-hoists",
        permanent: true,
      },
      {
        source: "/products/smartlifter-lm-mini-boot-hoist",
        destination: "/vehicle-adaptations/boot-hoists",
        permanent: true,
      },
      {
        source: "/products/smart-lifter-lp-olympian-hoist",
        destination: "/vehicle-adaptations/boot-hoists",
        permanent: true,
      },
      {
        source: "/products/brig-ayd-80kg-150kg-evotech-4-way-hoist",
        destination: "/vehicle-adaptations/boot-hoists",
        permanent: true,
      },
      {
        source: "/products/smartsteer-wireless-secondary-controls",
        destination: "/vehicle-adaptations/secondary-controls",
        permanent: true,
      },
      {
        source: "/products/lodgesons-wireless-secondary-controls",
        destination: "/vehicle-adaptations/secondary-controls",
        permanent: true,
      },
      {
        source: "/products/pedal-extensions",
        destination: "/vehicle-adaptations/pedal-extensions",
        permanent: true,
      },
      {
        source: "/products/menox-mini-stamp-pedal-extensions",
        destination: "/vehicle-adaptations/pedal-extensions",
        permanent: true,
      },
      {
        source: "/products/jeff-gosling-easy-release-handbrake",
        destination: "/vehicle-adaptations/easy-release",
        permanent: true,
      },
      {
        source: "/products/grab-handles",
        destination: "/vehicle-adaptations/grab-handles",
        permanent: true,
      },
      {
        source: "/products/electric-cassette-step",
        destination: "/vehicle-adaptations/side-steps",
        permanent: true,
      },
      {
        source: "/products/perspex-driver-protection-screens",
        destination: "/vehicle-adaptations/protective-screens",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
