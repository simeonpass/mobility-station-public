import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type CatalogCta = { href: string; label: string };
export function CatalogIntro({ title, subtitle, primary, secondary, primaryAction, eyebrow = "Mobility Station", visual, image, tone = "navy", breadcrumb }: {
  title: ReactNode;
  subtitle: string;
  primary?: CatalogCta;
  secondary?: CatalogCta;
  primaryAction?: ReactNode;
  eyebrow?: string;
  visual?: ReactNode;
  image?: { src: string; alt: string };
  tone?: "navy" | "soft";
  breadcrumb?: string;
}) {
  return <section className={`ms-page-intro msx-page-intro ms-intro-${tone}`}>
    <div className="container-site">
      <nav className="ms-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{breadcrumb ?? eyebrow.replace("Mobility Station \u00b7 ", "")}</span>
      </nav>
      <div className={`msx-intro-panel ${image || visual ? "msx-intro-with-media" : ""}`}>
        <div className="msx-intro-copy">
          <p className="ms-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="ms-intro-description">{subtitle}</p>
          {(primary || primaryAction || secondary) && <div className="ms-intro-actions">
            {primaryAction ?? (primary && <Link href={primary.href} className="ms-button">{primary.label}<ArrowRight size={19} aria-hidden="true" /></Link>)}
            {secondary && <Link href={secondary.href} className="ms-intro-secondary">{secondary.label}<ArrowRight size={17} aria-hidden="true" /></Link>}
          </div>}
        </div>
        {image ? <div className="ms-intro-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 44vw" priority /></div> : visual ? <div className="msx-intro-visual">{visual}</div> : null}
      </div>
    </div>
  </section>;
}
