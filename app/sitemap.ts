import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://klym.co.uk";
  const paths = ["", "/xsto-m4b", "/xsto-m4", "/xsto-m4-pro", "/xsto-x12", "/xsto-x12-pro", "/compare", "/book-a-demo", "/self-balancing-wheelchairs", "/stair-climbing-wheelchairs", "/vat-relief"];
  return paths.map((path) => ({ url: base + path, lastModified: new Date(), changeFrequency: path === "" ? "daily" : "weekly", priority: path === "" ? 1 : path.includes("xsto-m4b") ? 0.95 : 0.75 }));
}
