import Link from "next/link";
import { Check, Phone, ChevronDown } from "lucide-react";
import { HireSelfServeForm } from "@/components/hire/hire-self-serve-form";
import { HIRE_PRICING_CATEGORIES, FLEX_SETUP_FEE_GBP, SHORT_TERM_DEPOSIT_GBP } from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { SITE } from "@/lib/seo";

export function SimpleHirePage({ mode }: { mode: "short" | "flex" }) {
  const monthly = mode === "flex";
  return <>
    <section id="book" className="ms-simple-section ms-hire-booking-page"><div className="container-site ms-simple-booking-grid">
      <div className="ms-simple-explainer"><Link href="/hire" className="ms-link">← Hire options</Link><p className="ms-eyebrow mt-7">{monthly ? "3 months or more" : "3–28 days"}</p><h1 className="ms-simple-title">{monthly ? "Monthly hire." : "Short-term hire."}</h1><p>{monthly ? "A scooter or wheelchair for everyday use, with ongoing support included." : "A scooter or wheelchair for your holiday, recovery or a few weeks of extra support."}</p>
        <ul className="ms-simple-checks">{(monthly ? ["3-month minimum, then monthly", `First month + ${formatGBP(FLEX_SETUP_FEE_GBP)} set-up, before VAT`, "Servicing, batteries and breakdown support included"] : ["Free collection from Heathrow or Ferndown", "Delivery available — checked by postcode", `${formatGBP(SHORT_TERM_DEPOSIT_GBP)} refundable damage deposit`]).map(item=><li key={item}><Check size={18} aria-hidden />{item}</li>)}</ul>
        <a href="#prices" className="ms-link">See all hire prices</a>
        <div className="ms-simple-note"><h2>Need a hand choosing?</h2><p>We’ll help you find equipment that suits you.</p><a href={SITE.phoneHref} className="ms-link"><Phone size={18} aria-hidden />{SITE.phone}</a></div>
      </div>
      <div className="ms-simple-form-panel"><HireSelfServeForm defaultHireType={mode} lockHireType /></div>
    </div></section>
    <section className="ms-simple-section ms-simple-secondary"><div className="container-site">
      <details id="prices" className="ms-simple-details"><summary>See all {monthly ? "monthly" : "short-term"} hire prices<ChevronDown size={20} aria-hidden /></summary><div className="ms-simple-details-body"><p>Prices below are before VAT. Your booking shows the total, including any VAT, {monthly ? "set-up" : "deposit"} and delivery.</p><div className="overflow-x-auto"><table className="ms-hire-price-list"><caption className="sr-only">{monthly ? "Monthly" : "Short-term"} hire prices before VAT</caption><thead><tr><th scope="col">Equipment</th>{monthly ? <th scope="col">Per month</th> : <><th scope="col">3 days</th><th scope="col">1 week</th><th scope="col">4 weeks</th></>}</tr></thead><tbody>{HIRE_PRICING_CATEGORIES.map(category=><tr key={category.id}><th scope="row">{category.label}</th>{(monthly ? [category.flexMonthly] : [category.threeDay,category.week,category.fourWeeks]).map((price,index)=><td key={index}>{formatGBP(price)}</td>)}</tr>)}</tbody></table></div><p>{monthly ? `Plus a one-off ${formatGBP(FLEX_SETUP_FEE_GBP)} set-up fee before VAT. Three-month minimum.` : `Plus a ${formatGBP(SHORT_TERM_DEPOSIT_GBP)} refundable deposit. Delivery is extra if selected; collection is free.`}</p></div></details>
      <details className="ms-simple-details"><summary>Delivery, collection &amp; hire terms<ChevronDown size={20} aria-hidden /></summary><div className="ms-simple-details-body"><p>{monthly ? "Monthly hire is our Flex hire service. Set-up includes delivery and handover; we check your postcode during booking." : "Collect free from Heathrow or Ferndown by appointment. For delivery, enter your postcode in the booking form to check the area and charge."}</p><p>{monthly ? "You pay monthly in advance with an initial three-month term. Please read the hire terms before booking." : "Your damage deposit is refundable when the equipment is returned in the agreed condition."}</p><Link href="/hire/terms" className="ms-link">Read the hire terms</Link></div></details>
      <div id="enquiry-fallback" className="ms-simple-help"><div><h2>Prefer to speak to us?</h2><p>Call {SITE.phone} or send the team a message.</p></div><Link href="/contact" className="ms-link">Contact the team →</Link></div>
    </div></section>
  </>;
}
