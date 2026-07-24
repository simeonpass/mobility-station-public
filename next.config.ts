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
      { source: "/hire", destination: "/mobility-scooter-hire", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/cookies", destination: "/cookie-policy", permanent: true },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
