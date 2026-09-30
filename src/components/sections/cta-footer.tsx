"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useSiteDivision } from "@/components/layout/division-scope";
import { DIVISIONS } from "@/lib/division";
import { SITE } from "@/lib/seo";

type Cta = { href: string; label: string };
export function CtaFooter({ title = "A little advice goes a long way.", subtitle = "Tell us what matters to you. We will help with the rest.", primary, secondary }: { title?: string; subtitle?: string; primary?: Cta; secondary?: Cta }) {
  const division = useSiteDivision();
  const action = primary ?? (division ? DIVISIONS[division].cta : { href: "/contact", label: "Talk to our team" });
  return <section className="ms-help-band msx-help-band">
    <div className="container-site"><div className="msx-help-panel">
      <div><p className="ms-eyebrow">Here to help you move forward</p><h2>{title}</h2><p>{subtitle}</p></div>
      <div className="ms-help-actions">
        <Link href={action.href} className="ms-button">{action.label}<ArrowRight size={19} aria-hidden="true" /></Link>
        {secondary ? <Link href={secondary.href} className="ms-text-link">{secondary.label}<ArrowRight size={17} aria-hidden="true" /></Link> : <a href={SITE.phoneHref} className="ms-text-link"><Phone size={17} aria-hidden="true" />{SITE.phone}</a>}
      </div>
    </div></div>
  </section>;
}
