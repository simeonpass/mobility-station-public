import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { RecentWorkCard } from "@/components/sections/recent-work-card";
import { RecentWorkSearch } from "@/components/sections/recent-work-search";
import { buttonVariants } from "@/components/ui/button";
import {
  filterRecentWorkByQuery,
  listAllRecentWork,
} from "@/lib/recent-work";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim();
  return createMetadata({
    title: query ? `Search “${query}” — Recent work` : "Recent work",
    description:
      "Real customers, real stories — vehicle adaptations, scooters and wheelchair work from Mobility Station in Heathrow and Ferndown.",
    path: query ? `/our-work?q=${encodeURIComponent(query)}` : "/our-work",
    ...(query ? { noIndex: true } : {}),
  });
}

export default async function OurWorkPage({ searchParams }: Props) {
  const { q, category } = await searchParams;
  // Prefer search. Legacy ?category= links become a search for that label/slug.
  const query = (q || category || "").trim();

  const all = await listAllRecentWork();
  const projects = filterRecentWorkByQuery(all, query);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Recent work — Mobility Station",
    url: `${SITE.url}/our-work`,
    description:
      "Completed vehicle adaptation and mobility projects from Mobility Station.",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <section className="border-b border-border bg-soft/40">
        <div className="container-site py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Recent work" },
            ]}
          />
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">
            Mobility Station
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Recent work
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
            Real customers, real stories — from our Heathrow and Ferndown
            workshops.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-site">
          <RecentWorkSearch query={query} resultCount={projects.length} />

          {!query ? (
            <p className="mt-6 text-sm text-muted">
              {all.length === 0
                ? "No published projects yet."
                : `${all.length} ${all.length === 1 ? "project" : "projects"}`}
            </p>
          ) : null}

          {projects.length ? (
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.slug}>
                  <RecentWorkCard project={project} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 max-w-xl border-t border-border pt-8">
              <h2 className="text-2xl font-extrabold text-primary">
                {query ? "No matches" : "Case studies coming soon"}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {query
                  ? "Try a different word — for example hoist, scooter, hand controls, Heathrow or Ferndown."
                  : "Our team publishes completed jobs from the workshop here. In the meantime, ask us about a similar adaptation or browse advice stories."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {query ? (
                  <Link
                    href="/our-work"
                    className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
                  >
                    Show all work
                  </Link>
                ) : (
                  <Link
                    href="/contact?interest=adaptation"
                    className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
                  >
                    Request a quotation
                  </Link>
                )}
                <Link
                  href="/blog"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "rounded-md bg-white",
                  )}
                >
                  Read stories
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaFooter
        title="Planning something similar?"
        subtitle="Tell us about your vehicle or mobility need — we’ll advise on the right adaptation or product."
        primary={{ href: "/contact?interest=adaptation", label: "Get a quotation" }}
        secondary={{ href: "/book-a-demo", label: "Book a demo" }}
      />
    </>
  );
}
