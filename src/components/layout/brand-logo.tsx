import Link from "next/link";

/**
 * The Mobility Station logo. The wordmark never changes; only the figure's
 * colour follows the current side of the site (CSS picks which image shows).
 */
export function BrandLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="ms-logo" aria-label="Mobility Station home" onClick={onNavigate}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-light ms-logo-main" src="/brand/site-palette/logo.svg" alt="" width={800} height={300} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-light ms-logo-adapt" src="/brand/site-palette/logo-adapt.svg" alt="" width={800} height={300} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-light ms-logo-shop" src="/brand/site-palette/logo-shop.svg" alt="" width={800} height={300} />
    </Link>
  );
}
