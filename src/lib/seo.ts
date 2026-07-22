import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  type = "website",
  absoluteTitle = false,
}: PageSeo): Metadata {
  const safeTitle = title.length > 60 ? `${title.slice(0, 57)}…` : title;
  const safeDescription =
    description.length > 160 ? `${description.slice(0, 157)}…` : description;
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: safeTitle } : safeTitle,
    description: safeDescription,
    alternates: { canonical: url },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      type,
      url,
      siteName: "Mobility Station",
      locale: "en_GB",
    },
    twitter: {
      card: "summary",
      title: safeTitle,
      description: safeDescription,
    },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export const SITE = {
  name: "Mobility Station",
  legalName: "Mobility Station Ltd",
  phone: "0800 772 3870",
  phoneHref: "tel:08007723870",
  email: "hello@mobilitystation.co.uk",
  url: "https://mobilitystation.co.uk",
  lightweightUrl: "https://lightweightmobility.co.uk",
} as const;
