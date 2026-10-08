import Link from "next/link";
import { ArrowUpRight, Check, Phone } from "lucide-react";
import { FLEX_SETUP_FEE_GBP, SHORT_TERM_DEPOSIT_GBP } from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { createMetadata, SITE } from "@/lib/seo";

export const metadata = createMetadata({ title: "Mobility Scooter & Wheelchair Hire", description: "Hire a mobility scooter or wheelchair for 3–28 days or 3 months and more. Choose your equipment and dates, see the price and book online.", path: "/hire" });
export default function HirePage() {
  return <>
    <section className="ms-page-intro"><div className="container-site ms-simple-intro"><p className="ms-eyebrow">Scooters &amp; wheelchairs</p><h1>Hire, made simple.</h1><p>Choose how long you need it. Then pick your equipment and dates, see your price and book online.</p></div></section>
    <section className="ms-simple-section"><div className="container-site">
      <h2 className="ms-simple-section-title">How long do you need it?</h2>
      <div className="ms-hire-choices">
        <article><p className="ms-eyebrow">Short-term hire</p><h3>3–28 days</h3><p>For holidays, recovery or a few weeks of extra support.</p><ul className="ms-simple-checks"><li><Check size={18} aria-hidden />Free collection from either branch</li><li><Check size={18} aria-hidden />Delivery available — price checked by postcode</li><li><Check size={18} aria-hidden />{formatGBP(SHORT_TERM_DEPOSIT_GBP)} refundable deposit</li></ul><Link href="/hire/short-term#book" className="ms-button">Choose short-term hire<ArrowUpRight size={20} aria-hidden /></Link></article>
        <article><p className="ms-eyebrow">Monthly hire</p><h3>3 months or more</h3><p>For everyday use, with ongoing support included.</p><ul className="ms-simple-checks"><li><Check size={18} aria-hidden />Servicing, batteries &amp; breakdown support</li><li><Check size={18} aria-hidden />First month + {formatGBP(FLEX_SETUP_FEE_GBP)} set-up, before VAT</li><li><Check size={18} aria-hidden />3-month minimum, then monthly</li></ul><Link href="/hire/flex#book" className="ms-button">Choose monthly hire<ArrowUpRight size={20} aria-hidden /></Link></article>
      </div>
      <div className="ms-simple-help"><div><h2>Not sure what you need?</h2><p>Call us for help choosing equipment or arranging a different hire period.</p></div><a href={SITE.phoneHref} className="ms-link"><Phone size={19} aria-hidden />{SITE.phone}</a></div>
    </div></section>
  </>;
}
