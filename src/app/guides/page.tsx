import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { ADVICE_GUIDES } from "@/data/advice-guides";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({title: "Vehicle Adaptation Guides", description: "Practical guides to hand controls, boot hoists and swivel seats. Prepare for a compatibility check with Mobility Station.", path: "/guides"});
export default function GuidesPage() {
  return <>
    <CatalogIntro eyebrow="Advice before you choose" breadcrumb="Vehicle adaptation guides" title="Understand your options." subtitle="Practical questions to help you choose vehicle adaptations around your car and your everyday needs." primary={{href: "/contact?interest=adaptation", label: "Ask our team"}} />
    <section className="container-site msx-support-grid" aria-label="Vehicle adaptation guides">{ADVICE_GUIDES.map(guide => <Link className="msx-support-card" key={guide.slug} href={`/guides/${guide.slug}`}><p>{guide.category}</p><h2>{guide.title}</h2><p>{guide.description}</p><span>Read the guide <ArrowRight size={17} aria-hidden="true" /></span></Link>)}</section>
    <CtaFooter title="Make it specific to you." subtitle="Tell us about your vehicle and what you need to make easier." />
  </>;
}
