import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
type Cta = { href: string; label: string };
export function CtaFooter({ title = "A little advice goes a long way.", subtitle = "Tell us what matters to you. We’ll help with the rest.", primary = { href: "/contact", label: "Talk to our team" }, secondary }: { title?: string; subtitle?: string; primary?: Cta; secondary?: Cta }) {
  return <section className="ms-help-band"><div className="container-site"><div><p className="ms-eyebrow">Let’s take the next step together</p><h2>{title}</h2><p>{subtitle}</p></div><div className="ms-help-actions"><Link href={primary.href} className="ms-button">{primary.label}<ArrowUpRight size={19} aria-hidden /></Link>{secondary && <Link className="ms-text-link" href={secondary.href}>{secondary.label}<ArrowUpRight size={17} aria-hidden /></Link>}</div></div></section>;
}
