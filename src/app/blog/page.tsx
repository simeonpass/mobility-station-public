import Link from "next/link";
import { BlogGrid } from "@/components/sections/blog-grid";
import { CtaFooter } from "@/components/sections/cta-footer";
import { OurWorkGallery } from "@/components/sections/our-work-gallery";
import { getBlogPosts, getPublicPortfolio } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({ title: "Recent work & mobility stories", description: "Real vehicle adaptations, scooter installations and mobility advice from Mobility Station — Heathrow and Ferndown.", path: "/blog" });
export const revalidate = 300;

export default async function BlogPage() {
  const [posts, gallery] = await Promise.all([getBlogPosts(), getPublicPortfolio(96).catch((error) => { console.error("Portfolio error:", error); return []; })]);
  const jsonLd = { "@context": "https://schema.org", "@type": "Blog", name: "Mobility Station — Recent work & stories", url: `${SITE.url}/blog`, description: "Recent vehicle adaptations, installations and mobility advice from Mobility Station.", publisher: { "@type": "Organization", name: SITE.name, url: SITE.url } };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    <section className="border-b border-border bg-white"><div className="container-site py-14 md:py-20 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Mobility Station · Stories &amp; advice</p><h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">Experience worth sharing.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Real adaptations, workshop projects and practical mobility advice from our Heathrow and Ferndown teams.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/our-work" className="rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground">Browse recent work</Link><Link href="/contact?interest=adaptation" className="rounded-full border border-primary px-7 py-3 font-semibold text-primary hover:bg-primary hover:text-white">Request a quotation</Link></div></div></section>
    <section className="py-14 md:py-20"><div className="container-site">{posts.length ? <div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Latest from the team</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Stories &amp; advice</h2></div><p className="text-sm text-muted">{posts.length} {posts.length === 1 ? "story" : "stories"}{gallery.length ? <> · <a href="#gallery" className="font-semibold text-primary underline">{gallery.length} workshop photos</a></> : null}</p></div> : null}<BlogGrid posts={posts} /></div></section>
    {gallery.length ? <section id="gallery" className="scroll-mt-24 border-t border-border bg-soft/55 py-14 md:py-20"><div className="container-site"><div className="mb-9 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Behind the scenes</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">From our workshops.</h2><p className="mt-3 text-muted">Adaptations, deliveries and repairs from Heathrow and Ferndown.</p></div><OurWorkGallery items={gallery} /><p className="mt-10 text-center text-sm text-muted">Planning something similar? <Link href="/contact?interest=adaptation" className="font-semibold text-primary underline">Ask us for a quotation</Link>.</p></div></section> : null}
    <CtaFooter />
  </>;
}
