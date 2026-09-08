import Link from "next/link";
export function BrandLogo({ onNavigate }: { onNavigate?: () => void }) {
  return <Link href="/" className="ms-logo" aria-label="Mobility Station home" onClick={onNavigate}><span className="ms-logo-mark" aria-hidden="true">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/mobility-station-approved-mark.png" alt="" width={1254} height={1254} /></span><span>mobility<span className="ms-logo-bottom">station<span className="ms-brand-dot">.</span></span></span></Link>;
}
