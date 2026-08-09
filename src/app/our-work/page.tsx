import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { RecentWorkCard } from "@/components/sections/recent-work-card";
import { RecentWorkFilters } from "@/components/sections/recent-work-filters";
import { buttonVariants } from "@/components/ui/button";
import {
  categoryLabel,
  listRecentWork,
  RECENT_WORK_CATEGORIES,
} from "@/lib/recent-work";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { category } = await searchParams;
  const valid = RECENT_WORK_CATEGORIES.some((c) => c.id === category);
  const label = valid ? categoryLabel(category) : null;

  return createMetadata({
    title: label ? `${label} — Recent work` : "Recent work",
    description: label
      ? `Real ${label.toLowerCase()} projects from Mobility Station — Heathrow and Ferndown. Anonymised case studies from jobs we’ve completed.`
      : "Real vehicle adaptations, scooters and wheelchair work from Mobility Station — Heathrow and Ferndown. Anonymised case studies from jobs we’ve completed.",
    path: valid ? `/our-work?category=${category}` : "/our-work",
  });
}

export default async function OurWorkPage({ searchParams }: Props) {
  const { category: rawCategory } = await searchParams;
  const category = RECENT_WORK_CATEGORIES.some((c) => c.id === rawCategory)
    ? rawCategory
    : undefined;

  const { total, projects } = await listRecentWork({
    limit: 24,
    category,
  });

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
            Real fittings from our Heathrow and Ferndown workshops — published
            when the job is done. Stories stay anonymised: no names, plates or
            addresses.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-site">
          <RecentWorkFilters active={category} />

          <p className="mt-6 text-sm text-muted">
            {total === 0
              ? "No published projects in this view yet."
              : `${total} ${total === 1 ? "project" : "projects"}`}
            {category ? ` · ${categoryLabel(category)}` : null}
          </p>

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
                Case studies coming soon
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Our team publishes completed jobs from the workshop here. In the
                meantime, ask us about a similar adaptation or browse advice
                stories.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact?interest=adaptation"
                  className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
                >
                  Request a quotation
                </Link>
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
