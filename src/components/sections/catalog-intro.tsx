import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
type CatalogCta = { href: string; label: string };
export function CatalogIntro({ title, subtitle, primary, secondary, primaryAction, eyebrow = "Mobility Station", visual, image, tone = "navy", breadcrumb }: {
  title: ReactNode; subtitle: string; primary?: CatalogCta; secondary?: CatalogCta; primaryAction?: ReactNode;
  eyebrow?: string; visual?: ReactNode; image?: { src: string; alt: string }; tone?: "navy" | "soft"; breadcrumb?: string;
}) {
  return <section className={`ms-page-intro ms-intro-${tone}`}><div className={`container-site ${image || visual ? "ms-intro-grid" : "ms-intro-simple"}`}>
    <div>
      <nav className="ms-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span><span>{breadcrumb ?? eyebrow.replace("Mobility Station · ", "")}</span></nav>
      <p className="ms-eyebrow">{eyebrow}</p>
      <h1>{title}</h1><p className="ms-intro-description">{subtitle}</p>
      {(primary || primaryAction || secondary) && <div className="ms-intro-actions">{primaryAction ?? (primary && <Link href={primary.href} className="ms-button">{primary.label}<ArrowUpRight size={19} aria-hidden /></Link>)}{secondary && <Link href={secondary.href} className="ms-intro-secondary">{secondary.label}<ArrowUpRight size={17} aria-hidden /></Link>}</div>}
    </div>
    {image ? <div className="ms-intro-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 780px) 100vw, 48vw" priority /></div> : visual}
  </div></section>;
}
