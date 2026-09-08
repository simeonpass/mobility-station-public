import Link from "next/link";

export function BrandLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="ms-logo" aria-label="Mobility Station home" onClick={onNavigate}>
      {/* Outlined SVG artwork preserves the approved lettering at every size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-light" src="/brand/refined-a/logo.svg" alt="" width={773} height={198} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-dark" src="/brand/refined-a/logo-white.svg" alt="" width={773} height={198} />
    </Link>
  );
}
