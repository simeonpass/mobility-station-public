import { NextResponse } from "next/server";
import { SITE } from "@/lib/seo";

export const revalidate = 3600;

const EDGE_FEED =
  "https://evgvbvvpiculuizvvqyh.supabase.co/functions/v1/google-shopping-feed";

function rewriteForMerchantCenter(xml: string) {
  // Legacy Lovable URLs were /{slug}; canonical shop URLs are /products/{slug}.
  let next = xml.replace(
    /<g:link>https:\/\/mobilitystation\.co\.uk\/(?!products\/)([^<]+)<\/g:link>/g,
    `<g:link>${SITE.url}/products/$1</g:link>`,
  );

  // The live shop offers free mainland UK delivery on every order.
  next = next.replace(
    /<g:shipping>\s*<g:country>GB<\/g:country>\s*<g:service>[^<]*<\/g:service>\s*<g:price>[^<]*<\/g:price>\s*<\/g:shipping>/g,
    `<g:shipping>
    <g:country>GB</g:country>
    <g:service>Standard</g:service>
    <g:price>0.00 GBP</g:price>
  </g:shipping>`,
  );

  return next;
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLIC_SITE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const feedUrl = supabaseUrl
    ? `${supabaseUrl.replace(/\/$/, "")}/functions/v1/google-shopping-feed`
    : EDGE_FEED;

  if (!key) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><error>Shopping feed is not configured</error>`,
      { status: 503, headers: { "Content-Type": "application/xml; charset=utf-8" } },
    );
  }

  const upstream = await fetch(feedUrl, {
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
    next: { revalidate: 3600 },
  });

  if (!upstream.ok) {
    const detail = (await upstream.text()).slice(0, 180);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><error>Upstream feed HTTP ${upstream.status}: ${detail}</error>`,
      { status: 502, headers: { "Content-Type": "application/xml; charset=utf-8" } },
    );
  }

  const xml = rewriteForMerchantCenter(await upstream.text());
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
