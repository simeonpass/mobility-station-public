import type { NextConfig } from "next";

/**
 * Legacy SEO cutover redirects (301).
 *
 * Canonical product URLs on this site are `/products/:slug`.
 * Do NOT redirect `/products/:slug` → `/:slug` — that would invert the
 * live canonicals. Root `/:slug` already 301s to `/products/:slug` when
 * the product exists (see `src/app/[slug]/page.tsx`).
 */

/**
 * Current vehicle adaptation category slugs (categoryToSlug() of the
 * categories in src/lib/adaptations.ts — keep in sync if one is added or
 * renamed). Old WordPress, Shopify and Lovable adaptation links are matched
 * against these so each lands on its own adaptation page, never the
 * scooter & wheelchair shop.
 */
const ADAPTATION_CATEGORY_SLUGS = [
  "mechanical-hand-controls",
  "electronic-accelerators",
  "hinged-accelerator",
  "parking-sensors",
  "left-foot-accelerators",
  "pedal-extensions",
  "pedal-guards",
  "steering-aids",
  "electric-handbrakes",
  "secondary-controls",
  "easy-release",
  "boot-hoists",
  "pre-owned-boot-hoists",
  "person-hoists",
  "wheelchair-docking-systems",
  "wheelchair-stowage-rooftop",
  "wheelchair-winches",
  "boot-straps",
  "automatic-boot-openers",
  "swivel-seats",
  "transfer-plates",
  "side-steps",
  "grab-handles",
  "seating-modifications",
  "protective-screens",
];
const ADAPTATION_SLUG_PATTERN = ADAPTATION_CATEGORY_SLUGS.join("|");

/** Old adaptation groups (WordPress and Lovable sites) → today's sections. */
const OLD_ADAPTATION_GROUPS: Record<string, string> = {
  "driving-controls": "/vehicle-adaptations/driving-controls",
  "wheelchair-scooter-loading": "/vehicle-adaptations/hoists-stowage",
  "swivel-seats-vehicle-access": "/vehicle-adaptations/vehicle-access",
  "general-adaptations": "/vehicle-adaptations",
};

/** Current scooter & wheelchair shop category slugs. */
const SHOP_CATEGORY_PATTERN = [
  "large-mobility-scooters",
  "mid-size-scooters",
  "small-scooters",
  "folding-mobility-scooters",
  "powered-wheelchairs",
  "folding-powered-wheelchairs",
  "manual-wheelchairs",
].join("|");

/**
 * Old vehicle adaptation addresses still listed in search results.
 * These must come BEFORE the /product-category and /collections
 * catch-alls, which send everything else to /shop.
 */
const legacyAdaptationRedirects = [
  // WordPress: /product-category/vehicle-adaptations/<group>/<category>/
  {
    source: `/product-category/vehicle-adaptations/:group/:category(${ADAPTATION_SLUG_PATTERN})/:rest*`,
    destination: "/vehicle-adaptations/:category",
    permanent: true,
  },
  {
    source: `/product-category/vehicle-adaptations/:category(${ADAPTATION_SLUG_PATTERN})/:rest*`,
    destination: "/vehicle-adaptations/:category",
    permanent: true,
  },
  ...Object.entries(OLD_ADAPTATION_GROUPS).map(([group, destination]) => ({
    source: `/product-category/vehicle-adaptations/${group}/:rest*`,
    destination,
    permanent: true,
  })),
  {
    source: "/product-category/vehicle-adaptations/:rest*",
    destination: "/vehicle-adaptations",
    permanent: true,
  },

  // Shopify: /collections/<category>
  {
    source: `/collections/:category(${ADAPTATION_SLUG_PATTERN}|driving-controls|hoists-stowage|vehicle-access)`,
    destination: "/vehicle-adaptations/:category",
    permanent: true,
  },
  {
    source: "/collections/vehicle-adaptations",
    destination: "/vehicle-adaptations",
    permanent: true,
  },

  // Lovable: /vehicle-adaptations/category/<group>-<category>
  ...Object.keys(OLD_ADAPTATION_GROUPS).flatMap((group) =>
    ADAPTATION_CATEGORY_SLUGS.map((category) => ({
      source: `/vehicle-adaptations/category/${group}-${category}`,
      destination: `/vehicle-adaptations/${category}`,
      permanent: true,
    })),
  ),
  {
    source: `/vehicle-adaptations/category/:category(${ADAPTATION_SLUG_PATTERN})`,
    destination: "/vehicle-adaptations/:category",
    permanent: true,
  },
  ...Object.entries(OLD_ADAPTATION_GROUPS).map(([group, destination]) => ({
    source: `/vehicle-adaptations/category/${group}`,
    destination,
    permanent: true,
  })),
  {
    source: "/vehicle-adaptations/category/:rest*",
    destination: "/vehicle-adaptations",
    permanent: true,
  },

  // Old WordPress pages
  {
    source: "/home/vehicle-adaptations-2",
    destination: "/vehicle-adaptations",
    permanent: true,
  },
  { source: "/home/:path*", destination: "/", permanent: true },
];

/** Old scooter & wheelchair addresses → the matching shop category. */
const legacyShopRedirects = [
  // WordPress: /product-category/mobility-shop/…
  {
    source: `/product-category/mobility-shop/:group/:category(${SHOP_CATEGORY_PATTERN})/:rest*`,
    destination: "/shop/:category",
    permanent: true,
  },
  {
    source: `/product-category/mobility-shop/:category(${SHOP_CATEGORY_PATTERN})/:rest*`,
    destination: "/shop/:category",
    permanent: true,
  },
  {
    source:
      "/product-category/mobility-shop/:group(clearance-ex-display-items|used-secondhand-items)/:rest*",
    destination: "/clearance",
    permanent: true,
  },
  {
    source: "/product-category/mobility-shop/mobility-scooters/:rest*",
    destination: "/shop?sub=scooters",
    permanent: true,
  },
  {
    source: "/product-category/mobility-scooters/:rest*",
    destination: "/shop?sub=scooters",
    permanent: true,
  },

  // Shopify: /collections/<category> and /collections/<any>/products/<slug>
  {
    source: `/collections/:category(${SHOP_CATEGORY_PATTERN})`,
    destination: "/shop/:category",
    permanent: true,
  },
  {
    source: "/collections/:collection/products/:slug",
    destination: "/products/:slug",
    permanent: true,
  },

  // Lovable: /mobility-shop/category/<category>
  {
    source: "/mobility-shop/category/manual-wheelchairs-assistant-propelled",
    destination: "/shop/manual-wheelchairs",
    permanent: true,
  },
  {
    source: `/mobility-shop/category/:category(${SHOP_CATEGORY_PATTERN})`,
    destination: "/shop/:category",
    permanent: true,
  },
  { source: "/mobility-shop/:rest*", destination: "/shop", permanent: true },
];

const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: [
      { source: "/", has: [{ type: "host", value: "ergofold.co.uk" }], destination: "/ergofold" },
      { source: "/", has: [{ type: "host", value: "www.ergofold.co.uk" }], destination: "/ergofold" },
    ], afterFiles: [], fallback: [] };
  },
  images: {
    // Serve remote images via Cloudflare/R2 — not Vercel Image Optimization.
    // Without this, every width variant on next/image burns Hobby quota.
    loader: "custom",
    loaderFile: "./src/lib/r2ImageLoader.ts",
    // Prefer modern formats when the custom loader builds a srcset.
    formats: ["image/avif", "image/webp"],
    // Tight matrix — even with a custom loader, keep variant count low.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [96, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.myshopify.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "cdn.mobilitystation.co.uk" },
      { protocol: "https", hostname: "mobilitystation.co.uk" },
      // Catch-all for manufacturer / legacy product hosts (e.g. winches-uk).
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      // —— Specific legacy paths (before catch-alls) ——
      { source: "/shop/all", destination: "/shop", permanent: true },
      {
        source: "/lightweight-folding-mobility",
        destination: "/shop?sub=scooters",
        permanent: true,
      },
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
      // /our-work is a live App Router page (Recent Work case studies)
      { source: "/find-my-scooter", destination: "/shop", permanent: true },
      {
        source: "/mobility-scooter-hire",
        destination: "/hire",
        permanent: true,
      },
      { source: "/rental", destination: "/hire", permanent: true },
      { source: "/hire-rental", destination: "/hire", permanent: true },
      { source: "/scooter-hire", destination: "/hire", permanent: true },
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
      // /servicing is a live App Router page (Care Plans + service booking)

      // Old adaptation and shop addresses — before the catch-alls below
      ...legacyAdaptationRedirects,
      ...legacyShopRedirects,

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
