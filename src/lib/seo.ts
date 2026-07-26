import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
  /** Search/result pages should stay out of the index. */
  noIndex?: boolean;
  /** Absolute or site-relative image URL for Open Graph / Twitter. */
  image?: string | null;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export function createMetadata({
  title,
  description,
  path,
  type = "website",
  absoluteTitle = false,
  noIndex = false,
  image,
  publishedTime,
  modifiedTime,
  tags,
}: PageSeo): Metadata {
  const safeTitle = title.length > 60 ? `${title.slice(0, 57)}…` : title;
  const safeDescription =
    description.length > 160 ? `${description.slice(0, 157)}…` : description;
  const url = absoluteUrl(path);
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : undefined;

  return {
    title: absoluteTitle ? { absolute: safeTitle } : safeTitle,
    description: safeDescription,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      type,
      url,
      siteName: "Mobility Station",
      locale: "en_GB",
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: safeTitle,
      description: safeDescription,
      ...(imageUrl ? { images: [imageUrl] } : {}),
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
  legalName: "Adaptation Station Ltd",
  phone: "0800 772 3870",
  phoneHref: "tel:08007723870",
  smsHref: "sms:+441895520361",
  email: "hello@mobilitystation.co.uk",
  url: "https://mobilitystation.co.uk",
  lightweightUrl: "https://lightweightmobility.co.uk",
} as const;
