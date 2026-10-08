import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type CatalogCta = { href: string; label: string };

export function CatalogIntro({ title, subtitle, primary, secondary, primaryAction, eyebrow = "Mobility Station · Shop", visual }: {
  title: string;
  subtitle: string;
  primary: CatalogCta;
  secondary: CatalogCta;
  primaryAction?: ReactNode;
  eyebrow?: string;
  visual?: ReactNode;
}) {
  return (
    <section className={`ms-catalog-intro${visual ? " ms-catalog-intro-visual" : ""}`}>
      <div className="container-site ms-catalog-grid">
        <div className="ms-catalog-copy">
          <p className="ms-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="ms-catalog-description">{subtitle}</p>
          <div className="ms-actions ms-catalog-actions">
            {primaryAction ?? <Link href={primary.href} className="ms-button ms-button-light">{primary.label}<ArrowUpRight size={20} aria-hidden /></Link>}
            <Link href={secondary.href} className="ms-button ms-button-hero-outline">{secondary.label}<ArrowUpRight size={20} aria-hidden /></Link>
          </div>
        </div>
        {visual ?? null}
      </div>
    </section>
  );
}
