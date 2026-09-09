import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  onNavigate,
  tone = "light",
}: {
  onNavigate?: () => void;
  tone?: "light" | "dark";
}) {
  return (
    <Link href="/" className="ms-logo" aria-label="Mobility Station home" onClick={onNavigate}>
      {tone === "dark" && (
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="ms-logo-filters">
          <defs>
            <filter id="ms-2026-logo-reverse" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
              {/* Lift only the navy artwork to white; retain the original blue, lime and transparency. */}
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 -12 0 0 3.3" result="navy-mask" />
              <feComposite in="navy-mask" in2="SourceAlpha" operator="in" result="white-artwork" />
              <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="white-artwork" /></feMerge>
            </filter>
          </defs>
        </svg>
      )}
      <Image
        src="/brand/mobility-2026/logo.png"
        alt=""
        width={2048}
        height={768}
        sizes={tone === "dark" ? "220px" : "(max-width: 420px) 166px, (max-width: 780px) 176px, 200px"}
        loading={tone === "dark" ? "lazy" : "eager"}
        style={tone === "dark" ? { filter: "url(#ms-2026-logo-reverse)" } : undefined}
      />
    </Link>
  );
}
