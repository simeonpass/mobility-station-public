import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { KNOWLEDGE_FAQ_CATEGORIES } from "@/data/knowledge-faqs";
import {
  getKnowledgeFaq,
  getKnowledgeFaqs,
  getRelatedKnowledgeFaqs,
} from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { truncate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const faqs = await getKnowledgeFaqs();
  return faqs.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const faq = await getKnowledgeFaq(slug);
  if (!faq) {
    return createMetadata({
      title: "Question not found",
      description: "This FAQ could not be found.",
      path: `/faq/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: truncate(faq.question, 55),
    description: truncate(faq.answer, 160),
    path: `/faq/${faq.slug}`,
    type: "article",
    publishedTime: faq.publishedAt,
    modifiedTime: faq.updatedAt,
  });
}

export default async function KnowledgeFaqPage({ params }: Props) {
  const { slug } = await params;
  const faq = await getKnowledgeFaq(slug);
  if (!faq) notFound();

  const related = await getRelatedKnowledgeFaqs(faq, 3);
  const categoryLabel =
    KNOWLEDGE_FAQ_CATEGORIES.find((c) => c.id === faq.category)?.label ??
    "Advice";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        },
      ],
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
          name: "FAQ",
          item: `${SITE.url}/faq`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: faq.question,
          item: `${SITE.url}/faq/${faq.slug}`,
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
      <article className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl pt-8 md:pt-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "FAQ", href: "/faq" },
              { label: truncate(faq.question, 48) },
            ]}
          />

          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {categoryLabel}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            {faq.question}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">
            {faq.answer}
          </p>

          <p className="mt-6 text-sm text-muted">
            Based on common customer questions. Personal details from calls and
            jobs are never published.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {faq.relatedHref && faq.relatedLabel ? (
              <Link
                href={faq.relatedHref}
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                {faq.relatedLabel}
              </Link>
            ) : null}
            <EnquiryDialog
              mode="callback"
              defaultInterest="adaptation"
              title="Ask about your vehicle"
              triggerClassName="inline-flex items-center justify-center rounded-md border border-primary/25 bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Ask about your vehicle
            </EnquiryDialog>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/40"
            >
              All FAQs
            </Link>
          </div>

          {related.length ? (
            <aside className="mt-14 border-t border-border pt-8">
              <h2 className="text-xl font-extrabold text-primary">
                Related questions
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/faq/${item.slug}`}
                      className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {item.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </article>
      <CtaFooter />
    </>
  );
}
