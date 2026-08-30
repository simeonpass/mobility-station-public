import type { Metadata } from "next";
import type { Branch } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

export const DEFAULT_SHARE_IMAGE = "/brand/og-default.jpg";

const BRANCH_OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "09:00",
    closes: "17:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Friday",
    opens: "09:00",
    closes: "16:00",
  },
] as const;

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
  const resolvedImage = image ?? DEFAULT_SHARE_IMAGE;
  const imageUrl = resolvedImage.startsWith("http")
    ? resolvedImage
    : absoluteUrl(resolvedImage);

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
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: [imageUrl],
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

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { "@id": `${SITE.url}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd({
  branches,
  averageRating,
  totalReviews,
}: {
  branches: Branch[];
  averageRating?: number | null;
  totalReviews?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE.url}${DEFAULT_SHARE_IMAGE}`,
    logo: `${SITE.url}/brand/mobility-station-wordmark.png`,
    areaServed: "GB",
    ...(averageRating && totalReviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(averageRating.toFixed(1)),
            reviewCount: totalReviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    department: branches.map((branch) => ({
      "@type": "LocalBusiness",
      "@id": `${SITE.url}/locations#${branch.slug}`,
      name: branch.name,
      telephone: branch.phone,
      email: branch.email,
      image: `${SITE.url}${DEFAULT_SHARE_IMAGE}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: [branch.addressLine1, branch.addressLine2]
          .filter(Boolean)
          .join(", "),
        addressLocality: branch.addressLocality,
        postalCode: branch.postalCode,
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: branch.lat,
        longitude: branch.lng,
      },
      openingHoursSpecification: BRANCH_OPENING_HOURS,
    })),
  };
}
