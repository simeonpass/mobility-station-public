import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Cta = { href: string; label: string };

export function CtaFooter({ title = "Ready to try before you buy?", subtitle = "Tell us what you need and we will bring it to you — or visit our Heathrow or Ferndown branch.", primary = { href: "/book-a-demo", label: "Book a Demo" }, secondary = { href: "/contact?interest=callback#callback", label: "Request a callback" } }: { title?: string; subtitle?: string; primary?: Cta; secondary?: Cta }) {
  return (
    <section className="ms-help-footer">
      <div className="container-site">
        <div><p className="ms-eyebrow">Here to help you move forward</p><h2>{title}</h2><p className="ms-help-description">{subtitle}</p></div>
        <div className="ms-help-actions"><Link href={primary.href} className="ms-button">{primary.label}<ArrowUpRight size={20} aria-hidden /></Link><Link href={secondary.href} className="ms-link">{secondary.label}<ArrowUpRight size={20} aria-hidden /></Link></div>
      </div>
    </section>
  );
}
