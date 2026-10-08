import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type HeroProps = { title: string; subtitle: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string; compact?: boolean };

export function Hero({ title, subtitle, primaryHref = "/book-a-demo", primaryLabel = "Book a Demo", secondaryHref = "/contact?interest=callback#callback", secondaryLabel = "Request a callback", compact = false }: HeroProps) {
  return (
    <section className={`ms-page-intro${compact ? " ms-page-intro-compact" : ""}`}>
      <div className="container-site">
        <p className="ms-eyebrow">Mobility Station</p>
        <h1>{title}</h1>
        <p className="ms-page-description">{subtitle}</p>
        <div className="ms-actions">
          <Link href={primaryHref} className="ms-button">{primaryLabel}<ArrowUpRight size={20} aria-hidden /></Link>
          {secondaryHref.startsWith("/") ? <Link href={secondaryHref} className="ms-button ms-button-outline">{secondaryLabel}<ArrowUpRight size={20} aria-hidden /></Link> : <a href={secondaryHref} className="ms-button ms-button-outline">{secondaryLabel}<ArrowUpRight size={20} aria-hidden /></a>}
        </div>
      </div>
    </section>
  );
}
