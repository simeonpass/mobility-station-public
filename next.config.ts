import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "cdn.mobilitystation.co.uk" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      { source: "/shop/all", destination: "/shop", permanent: true },
      { source: "/products", destination: "/shop", permanent: true },
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
      // Portfolio gallery merged into the blog hub.
      { source: "/our-work", destination: "/blog", permanent: true },
      // Quiz removed — send people to the shop instead.
      {
        source: "/find-my-scooter",
        destination: "/shop",
        permanent: true,
      },
      // Legacy hire URL → unified hire hub (short-term + Flex).
      {
        source: "/mobility-scooter-hire",
        destination: "/hire",
        permanent: true,
      },
      {
        source: "/website/hire/checkout/:id",
        destination: "/hire/checkout/:id",
        permanent: false,
      },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/cookies", destination: "/cookie-policy", permanent: true },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      // Adaptation variants were split into standalone products; old parent
      // product URLs redirect to the matching category catalogue.
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
