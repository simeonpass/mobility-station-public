import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  onNavigate,
  tone = "light",
}: {
  onNavigate?: () => void;
  tone?: "light" | "dark" | "badge";
}) {
  const filterId = `ms-2026-logo-${tone}`;

  return (
    <Link href="/" className={tone === "badge" ? "ms-logo ms-logo-badge" : "ms-logo"} aria-label="Mobility Station home" onClick={onNavigate}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="ms-logo-filters">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            {/* The clear gap at 32% separates the original icon from both words. */}
            <feFlood x="32%" y="0" width="68%" height="100%" floodColor={tone === "dark" ? "#ffffff" : "#102C46"} result="wordmark-fill" />
            <feComposite in="wordmark-fill" in2="SourceAlpha" operator="in" result="wordmark" />
            <feComposite in="SourceGraphic" in2="wordmark-fill" operator="out" result="original-icon" />
            {tone === "dark" && (
              <>
                {/* Lift the navy person to white; retain the blue wheel and lime detail. */}
                <feColorMatrix in="original-icon" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 -12 0 0 3.3" result="navy-mask" />
                <feComposite in="navy-mask" in2="original-icon" operator="in" result="white-person" />
              </>
            )}
            <feMerge>
              <feMergeNode in="original-icon" />
              {tone === "dark" && <feMergeNode in="white-person" />}
              <feMergeNode in="wordmark" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <Image
        src="/brand/mobility-2026/logo.png"
        alt=""
        width={2048}
        height={768}
        sizes={tone === "badge" ? "244px" : tone === "dark" ? "220px" : "(max-width: 420px) 166px, (max-width: 780px) 176px, 200px"}
        loading={tone === "light" ? "eager" : "lazy"}
        style={{ filter: `url(#${filterId})` }}
      />
    </Link>
  );
}

