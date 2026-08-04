/**
 * Custom next/image loader — bypasses Vercel Image Optimization entirely.
 *
 * Catalogue assets already live on Cloudflare R2 and are pre-resized by the
 * admin pipeline, so Vercel's optimiser adds cost without benefit.
 *
 * Optional: enable Cloudflare Image Resizing on the mobilitystation.co.uk
 * zone, then set NEXT_PUBLIC_CF_IMAGE_RESIZING=1 to route remote URLs through
 * /cdn-cgi/image/... (billed by Cloudflare, not Vercel). Until then we return
 * the R2 URL unchanged.
 */
export default function r2Loader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (!src.startsWith("http")) return src;

  if (process.env.NEXT_PUBLIC_CF_IMAGE_RESIZING !== "1") {
    return src;
  }

  // Cloudflare Image Resizing on our own zone — free on the Cloudflare plan.
  return `https://mobilitystation.co.uk/cdn-cgi/image/width=${width},quality=${quality ?? 78},format=auto/${src}`;
}
