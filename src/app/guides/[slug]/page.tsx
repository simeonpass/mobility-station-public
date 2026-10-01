import Link from "next/link";
import { notFound } from "next/navigation";
import { ADVICE_GUIDES } from "@/data/advice-guides";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
export function generateStaticParams() { return ADVICE_GUIDES.map(({slug}) => ({slug})); }
async function getGuide(params: Promise<{slug: string}>) { const {slug} = await params; const guide = ADVICE_GUIDES.find(item => item.slug === slug); if (!guide) notFound(); return guide; }
export async function generateMetadata({params}: {params: Promise<{slug: string}>}) { const guide = await getGuide(params); return createMetadata({title: guide.title, description: guide.description, path: `/guides/${guide.slug}`, type: "article"}); }
export default async function GuidePage({params}: {params: Promise<{slug: string}>}) {
 const guide = await getGuide(params); const url = `${SITE.url}/guides/${guide.slug}`;
 const schema = [{"@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, mainEntityOfPage: url, inLanguage: "en-GB", publisher: {"@type": "Organization", name: SITE.name, url: SITE.url}}, {"@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{"@type": "ListItem", position: 1, name: "Home", item: SITE.url}, {"@type": "ListItem", position: 2, name: "Vehicle adaptation guides", item: `${SITE.url}/guides`}, {"@type": "ListItem", position: 3, name: guide.title, item: url}]}];
 return <div className="container-site py-12 md:py-20">
  <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schema)} />
  <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted"><Link href="/support">Advice &amp; support</Link> / <Link href="/guides">Vehicle adaptation guides</Link></nav>
  <div className="max-w-3xl"><p className="text-sm font-semibold text-muted">{guide.category}</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-primary md:text-5xl">{guide.title}</h1><p className="mt-6 text-xl leading-relaxed">{guide.answer}</p></div>
  <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]">
   <article className="max-w-3xl">{guide.sections.map(section => <section className="mb-10 scroll-mt-28" key={section.id} id={section.id}><h2 className="mb-4 text-2xl font-bold text-primary">{section.title}</h2>{section.paragraphs.map(paragraph => <p className="mb-4 leading-relaxed text-muted" key={paragraph}>{paragraph}</p>)}{section.bullets && <ul className="list-disc space-y-3 pl-6 text-muted">{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}<p className="border-t border-border pt-6 text-sm text-muted">General buying guidance. Confirm compatibility, specifications and the complete installation with the team before ordering. A guide cannot determine an individual’s driving, seating or transfer suitability.</p></article>
   <aside className="rounded-2xl bg-soft p-6 self-start"><nav aria-label="In this guide"><h2 className="font-bold text-primary">In this guide</h2><ul className="mt-4 space-y-3">{guide.sections.map(section => <li key={section.id}><a className="text-sm underline" href={`#${section.id}`}>{section.title}</a></li>)}</ul></nav><h2 className="mt-8 font-bold text-primary">Your next step</h2><ul className="mt-4 space-y-4">{guide.links.map(link => <li key={link.href}><Link className="font-semibold underline" href={link.href}>{link.label}</Link></li>)}</ul><Link className="mt-8 block text-sm underline" href="/our-work">See recent workshop projects</Link></aside>
  </div>
  <section className="mt-12 border-t border-border pt-8" aria-label="Related guides"><h2 className="text-2xl font-bold text-primary">Keep exploring</h2><ul className="mt-5 space-y-3">{ADVICE_GUIDES.filter(item => item.slug !== guide.slug).map(item => <li key={item.slug}><Link className="underline" href={`/guides/${item.slug}`}>{item.title}</Link></li>)}</ul></section>
 </div>;
}
