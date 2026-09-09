import Link from "next/link";

export function BrandLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="ms-logo" aria-label="Mobility Station home" onClick={onNavigate}>
      {/* Outlined SVG artwork preserves the stacked Drive & Move lettering at every size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-light" src="/brand/drive-and-move/b-original.svg" alt="" width={920} height={488} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ms-logo-dark" src="/brand/drive-and-move/b-original-white.svg" alt="" width={920} height={488} />
    </Link>
  );
}
