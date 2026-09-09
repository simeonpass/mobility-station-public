import Link from "next/link";

export function BrandLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="ms-logo" aria-label="Mobility Station home" onClick={onNavigate}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-light" src="/brand/mobility-station-wordmark.png" alt="" width={800} height={300} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-dark" src="/brand/mobility-station-wordmark-on-dark.png" alt="" width={800} height={300} />
    </Link>
  );
}
