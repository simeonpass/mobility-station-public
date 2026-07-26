import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { CtaFooter } from "@/components/sections/cta-footer";
import {
  ADAPTATION_SECTIONS,
  LEGACY_ADAPTATION_REDIRECTS,
  adaptationHref,
  categoryToSlug,
  findCategoryBySlug,
  findSectionById,
  findSectionForCategory,
  sectionHref,
} from "@/lib/adaptations";
import { getAdaptationProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { truncate } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ service: string }> };

export function generateStaticParams() {
  const sections = ADAPTATION_SECTIONS.map((s) => ({ service: s.id }));
  const categories = ADAPTATION_SECTIONS.flatMap((s) =>
    s.categories.map((c) => ({ service: categoryToSlug(c) })),
  );
  const legacy = Object.keys(LEGACY_ADAPTATION_REDIRECTS).map((service) => ({
    service,
  }));
  return [...sections, ...categories, ...legacy];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const section = findSectionById(slug);
  if (section) {
    return createMetadata({
      title: truncate(`${section.title} | Vehicle Adaptations`, 60),
      description: truncate(section.description, 160),
      path: `/vehicle-adaptations/${section.id}`,
    });
  }
  const category = findCategoryBySlug(slug);
  if (category) {
    return createMetadata({
      title: truncate(`${category} | Vehicle Adaptations`, 60),
      description: truncate(
        `Browse ${category} adaptations. Indicative supplied & fitted prices, Motability options, and free quotations.`,
        160,
      ),
      path: `/vehicle-adaptations/${categoryToSlug(category)}`,
    });
  }
  return createMetadata({
    title: "Vehicle Adaptations",
    description: "Vehicle adaptations supplied and fitted.",
    path: `/vehicle-adaptations/${slug}`,
  });
}

export default async function AdaptationCategoryPage({ params }: Props) {
  const { service: slug } = await params;

  const legacy = LEGACY_ADAPTATION_REDIRECTS[slug];
  if (legacy) {
    if (legacy.type === "hub") redirect("/vehicle-adaptations");
    if (legacy.type === "section") redirect(sectionHref(legacy.target));
    redirect(adaptationHref(legacy.target));
  }

  const section = findSectionById(slug);
  const category = section ? null : findCategoryBySlug(slug);
  if (!section && !category) notFound();

  const title = section?.title ?? category!;
  const description =
    section?.description ??
    `Indicative supplied & fitted prices for ${category}. Compatibility varies by vehicle — request a free quotation.`;
  const parentSection = category
    ? findSectionForCategory(category)
    : section;

  let products: Awaited<ReturnType<typeof getAdaptationProducts>> = [];
  let loadError = false;
  try {
    products = section
      ? await getAdaptationProducts({ categories: [...section.categories] })
      : await getAdaptationProducts({ category: category! });
  } catch (error) {
    console.error("Adaptation category fetch failed:", error);
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="container-site py-16">
        <h1 className="text-3xl font-extrabold text-primary">{title}</h1>
        <p className="mt-4 text-muted">
          We could not load this category right now. Please call 0800 772 3870 or{" "}
          <Link href="/contact" className="font-semibold text-primary underline">
            contact us
          </Link>
          .
        </p>
      </div>
    );
  }

  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    const cat = p.category || "Other";
    const list = byCategory.get(cat) ?? [];
    list.push(p);
    byCategory.set(cat, list);
  }

  return (
    <>
      <div className="container-site pt-6 md:pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Vehicle Adaptations", href: "/vehicle-adaptations" },
            ...(parentSection && category
              ? [
                  {
                    label: parentSection.title,
                    href: sectionHref(parentSection.id),
                  },
                ]
              : []),
            { label: title },
          ]}
        />

        <header className="max-w-3xl pb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted">
            Supplied &amp; fitted · Quotation only
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            {description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact?interest=adaptation"
              className="rounded-xl bg-accent px-5 py-3 text-center font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Request a quotation
            </Link>
            <Link
              href="/book-a-demo?type=adaptation"
              className="rounded-xl border border-primary px-5 py-3 text-center font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Book a home demo
            </Link>
          </div>
        </header>

        {section ? (
          <nav
            className="mb-8 flex flex-wrap gap-2"
            aria-label={`${section.title} categories`}
          >
            {section.categories.map((cat) => {
              const count = byCategory.get(cat)?.length ?? 0;
              if (!count) return null;
              return (
                <Link
                  key={cat}
                  href={adaptationHref(cat)}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                >
                  {cat} ({count})
                </Link>
              );
            })}
          </nav>
        ) : null}

        {products.length ? (
          <div className="grid grid-cols-2 gap-4 pb-12 lg:grid-cols-4">
            {products.map((p) => (
              <AdaptationCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="pb-12 text-muted">
            No published products in this category yet.{" "}
            <Link href="/contact" className="font-semibold text-primary underline">
              Contact us
            </Link>{" "}
            for advice.
          </p>
        )}
      </div>

      <CtaFooter
        title={`Get a quote for ${title.toLowerCase()}`}
        subtitle="We’ll check your vehicle, confirm Motability options if relevant, and arrange fitting."
      />
    </>
  );
}
