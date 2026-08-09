import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import {
  bodyToParagraphs,
  categoryLabel,
  formatWorkDate,
  getRecentWorkProject,
  listAllRecentWork,
  listRecentWork,
} from "@/lib/recent-work";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn, truncate } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await listAllRecentWork();
  return projects.slice(0, 60).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getRecentWorkProject(slug);
  if (!project) {
    return createMetadata({
      title: "Project not found",
      description: "This recent work project could not be found.",
      path: `/our-work/${slug}`,
      noIndex: true,
    });
  }
  const description =
    project.seo_description?.trim() ||
    project.summary ||
    project.title;
  return createMetadata({
    title: truncate(project.title, 55),
    description: truncate(description, 160),
    path: `/our-work/${project.slug}`,
    type: "article",
    image: project.hero_image,
    publishedTime: project.work_date ?? undefined,
    modifiedTime: project.updated_at ?? undefined,
  });
}

export default async function OurWorkProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getRecentWorkProject(slug);
  if (!project) notFound();

  const paragraphs = bodyToParagraphs(project.body);
  const date = formatWorkDate(project.work_date);
  const related = (
    await listRecentWork({
      limit: 4,
      category: project.category,
    })
  ).projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  const images =
    project.images?.length > 0
      ? project.images
      : project.hero_image
        ? [{ url: project.hero_image, alt: project.title }]
        : [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: project.title,
      description: project.summary,
      datePublished: project.work_date,
      dateModified: project.updated_at || project.work_date,
      author: { "@type": "Organization", name: SITE.name },
      publisher: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
      },
      mainEntityOfPage: `${SITE.url}/our-work/${project.slug}`,
      ...(project.hero_image ? { image: [project.hero_image] } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Recent work",
          item: `${SITE.url}/our-work`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: project.title,
          item: `${SITE.url}/our-work/${project.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <article>
        <section className="border-b border-border">
          <div className="container-site py-8 md:py-12">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Recent work", href: "/our-work" },
                { label: truncate(project.title, 48) },
              ]}
            />

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">
              {[categoryLabel(project.category), project.town, date]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-primary md:text-5xl">
              {project.title}
            </h1>
            {project.summary ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
                {project.summary}
              </p>
            ) : null}
          </div>
        </section>

        {images[0] ? (
          <div className="relative aspect-[16/9] max-h-[min(70vh,720px)] w-full bg-soft md:aspect-[21/9]">
            <Image
              src={images[0].url}
              alt={images[0].alt || project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <section className="py-10 md:py-14">
          <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
            <div className="max-w-2xl">
              {paragraphs.length ? (
                <div className="space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
                  {paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-relaxed text-muted">
                  {project.summary}
                </p>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/contact?interest=adaptation"
                  className={cn(buttonVariants({ size: "lg" }), "rounded-md")}
                >
                  Ask about a similar job
                </Link>
                <Link
                  href="/our-work"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "rounded-md",
                  )}
                >
                  All recent work
                </Link>
              </div>
            </div>

            <aside className="space-y-6 text-sm text-muted lg:pt-1">
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-primary">About this project</p>
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt>Category</dt>
                    <dd className="text-right font-medium text-foreground">
                      <Link
                        href={`/our-work?q=${encodeURIComponent(categoryLabel(project.category))}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {categoryLabel(project.category)}
                      </Link>
                    </dd>
                  </div>
                  {project.town ? (
                    <div className="flex justify-between gap-4">
                      <dt>Area</dt>
                      <dd className="text-right font-medium text-foreground">
                        {project.town}
                      </dd>
                    </div>
                  ) : null}
                  {date ? (
                    <div className="flex justify-between gap-4">
                      <dt>Completed</dt>
                      <dd className="text-right font-medium text-foreground">
                        {date}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
              <p className="leading-relaxed">
                Photos and copy are anonymised. We never publish customer names,
                number plates, postcodes or job numbers.
              </p>
            </aside>
          </div>

          {images.length > 1 ? (
            <div className="container-site mt-12 md:mt-16">
              <h2 className="text-2xl font-extrabold tracking-tight text-primary">
                More from this job
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.slice(1).map((img) => (
                  <li
                    key={img.url}
                    className="relative aspect-[4/3] overflow-hidden bg-soft"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {related.length ? (
            <div className="container-site mt-14 border-t border-border pt-12 md:mt-16">
              <h2 className="text-2xl font-extrabold tracking-tight text-primary">
                Related work
              </h2>
              <ul className="mt-6 grid gap-8 sm:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/our-work/${item.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
                        {item.hero_image ? (
                          <Image
                            src={item.hero_image}
                            alt={item.title}
                            fill
                            sizes="(min-width: 640px) 33vw, 100vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : null}
                      </div>
                      <p className="mt-3 text-base font-bold text-primary group-hover:text-primary-dark">
                        {item.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </article>

      <CtaFooter
        title="Want this kind of result?"
        subtitle="Book a demo or request a quotation — we’ll match the right adaptation or mobility product to you."
        primary={{ href: "/book-a-demo", label: "Book a demo" }}
        secondary={{
          href: "/contact?interest=adaptation",
          label: "Request a quotation",
        }}
      />
    </>
  );
}
