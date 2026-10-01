import Link from "next/link";
import { ArrowRight, HelpCircle, MapPin, Receipt, Truck, Wrench, CalendarDays } from "lucide-react";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Advice & Support", description: "Find answers, contact our team or arrange servicing for your mobility equipment.", path: "/support" });
const links = [
  { title: "Vehicle adaptation guides", text: "Prepare for choosing hand controls, boot hoists and swivel seats with practical compatibility checklists.", href: "/guides", action: "Explore the guides", Icon: HelpCircle },
  { title: "Contact & locations", text: "Send us a message, request a callback or plan a visit to the right branch.", href: "/contact", action: "Talk to our team", Icon: MapPin },
  { title: "Servicing & repairs", text: "Find workshop support, one-off service prices and repairs.", href: "/servicing", action: "Explore aftercare", Icon: Wrench },
  { title: "Your questions, answered", text: "Straightforward answers about equipment, vehicle adaptations and buying.", href: "/faq", action: "Read our FAQs", Icon: HelpCircle },
  { title: "Delivery & collection", text: "Check delivery options, collection information and the areas we cover.", href: "/delivery", action: "Delivery information", Icon: Truck },
  { title: "VAT relief", text: "Read about eligibility and the declaration required when claiming VAT relief.", href: "/vat-relief", action: "Understand VAT relief", Icon: Receipt },
  { title: "Arrange a demonstration", text: "Tell us what you are interested in and find out about demonstration options.", href: "/book-a-demo", action: "Plan a demonstration", Icon: CalendarDays },
];
export default function SupportPage() {
  return <>
    <CatalogIntro eyebrow="Here to help" breadcrumb="Advice & support" title="Advice, support and aftercare." subtitle="Find an answer or the right person to help, whether you need a vehicle adaptation or a mobility product." primary={{ href: "/contact", label: "Talk to our team" }} />
    <section className="container-site msx-support-grid" aria-label="Choose the support you need">{links.map(({ title, text, href, action, Icon }) => <Link key={href} href={href} className="msx-support-card"><Icon aria-hidden="true" /><h2>{title}</h2><p>{text}</p><span>{action}<ArrowRight size={17} aria-hidden="true" /></span></Link>)}</section>
    <CtaFooter title="Not sure who to ask?" subtitle="Tell us what you need. We will help you find the right next step." />
  </>;
}
