import Link from "next/link";

export function BrandLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="ms-logo" aria-label="Mobility Station home" onClick={onNavigate}>
      {/* Outlined SVG artwork preserves the stacked Open Road lettering at every size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-light" src="/brand/open-road-c/logo.svg" alt="" width={920} height={408} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-dark" src="/brand/open-road-c/logo-white.svg" alt="" width={920} height={408} />
    </Link>
  );
}
