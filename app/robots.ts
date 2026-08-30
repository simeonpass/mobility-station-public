import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return {rules:{userAgent:"*",allow:"/"},sitemap:"https://klym.co.uk/sitemap.xml",host:"https://klym.co.uk"}; }
