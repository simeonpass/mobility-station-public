import { CatalogIntro } from "@/components/sections/catalog-intro";
import Link from "next/link";
import { CtaFooter } from "@/components/sections/cta-footer";
import { RecentWorkCard } from "@/components/sections/recent-work-card";
import { RecentWorkSearch } from "@/components/sections/recent-work-search";
import { buttonVariants } from "@/components/ui/button";
import { filterRecentWorkByQuery, listAllRecentWork } from "@/lib/recent-work";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;
type Props = { searchParams: Promise<{ q?: string; category?: string }> };
export async function generateMetadata({ searchParams }: Props) { const { q } = await searchParams; const query = q?.trim(); return createMetadata({ title: query ? `Search “${query}” — Recent work` : "Recent work", description: "Real customers, real stories — vehicle adaptations, scooters and wheelchair work from Mobility Station in Heathrow and Ferndown.", path: query ? `/our-work?q=${encodeURIComponent(query)}` : "/our-work", ...(query ? { noIndex: true } : {}) }); }

export default async function OurWorkPage({ searchParams }: Props) {
  const { q, category } = await searchParams; const query = (q || category || "").trim(); const all = await listAllRecentWork(); const projects = filterRecentWorkByQuery(all, query);
  const jsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Recent work — Mobility Station", url: `${SITE.url}/our-work`, description: "Completed vehicle adaptation and mobility projects from Mobility Station.", isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url } };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <CatalogIntro breadcrumb="Recent work" eyebrow="From our workshops" title="Real work. Real independence." subtitle="Completed vehicle adaptations and mobility projects from our Heathrow and Ferndown teams." />
    <section className="py-14 md:py-20"><div className="container-site"><RecentWorkSearch query={query} resultCount={projects.length} />{!query ? <p className="mt-6 text-sm text-muted">{all.length === 0 ? "No published projects yet." : `${all.length} ${all.length === 1 ? "project" : "projects"}`}</p> : null}{projects.length ? <ul className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <li key={project.slug}><RecentWorkCard project={project} /></li>)}</ul> : <div className="mt-12 max-w-xl border-t border-border pt-8"><h2 className="text-2xl font-extrabold text-primary">{query ? "No matches" : "Case studies coming soon"}</h2><p className="mt-3 text-base leading-relaxed text-muted">{query ? "Try a different word — for example hoist, scooter, hand controls, Heathrow or Ferndown." : "Our team publishes completed jobs from the workshop here. In the meantime, ask us about a similar adaptation or browse advice stories."}</p><div className="mt-6 flex flex-wrap gap-3">{query ? <Link href="/our-work" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>Show all work</Link> : <Link href="/contact?interest=adaptation" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>Request a quotation</Link>}<Link href="/blog" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full bg-white")}>Read stories</Link></div></div>}</div></section>
    <CtaFooter title="Planning something similar?" subtitle="Tell us about your vehicle or mobility need — we’ll advise on the right adaptation or product." primary={{ href: "/contact?interest=adaptation", label: "Get a quotation" }} secondary={{ href: "/book-a-demo", label: "Book a demo" }} />
  </>;
}
