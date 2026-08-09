import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import {
  getBlogPost,
  getBlogPosts,
  getRelatedBlogPosts,
} from "@/lib/data";
import { plainTextToHtml, sanitizeBlogHtml } from "@/lib/sanitize-html";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { truncate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.slice(0, 40).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return createMetadata({
      title: "Article not found",
      description: "This blog post could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: truncate(post.title, 55),
    description: truncate(post.excerpt || post.title, 160),
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.image,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
  });
}

export const revalidate = 300;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post, 3);

  const html = sanitizeBlogHtml(
    post.contentHtml?.trim()
      ? post.contentHtml
      : plainTextToHtml(post.content),
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: { "@type": "Organization", name: post.author },
      publisher: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
      },
      mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
      ...(post.image ? { image: [post.image] } : {}),
      ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
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
          name: "Blog",
          item: `${SITE.url}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${SITE.url}/blog/${post.slug}`,
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
      <article className="pb-4 md:pb-8">
        <div className="container-site pt-6 md:pt-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>

        <header className="container-site mt-4 max-w-3xl md:mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
          ) : null}
          {post.tags?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        {post.image ? (
          <div className="container-site mt-8 md:mt-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-soft md:aspect-[21/9]">
              {/* eslint-disable-next-line @next/next/no-img-element -- blog hero; skip Vercel Image Optimization */}
              <img
                src={post.image}
                alt={post.imageAlt || post.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        ) : null}

        <div className="container-site mt-8 grid gap-10 md:mt-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
          <div>
            <div
              className="blog-article max-w-3xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {post.slug.includes("lightweight") ? (
              <p className="mt-8 text-sm text-muted">
                Looking for ultra-lightweight folding products?{" "}
                <a
                  href={SITE.lightweightUrl}
                  className="font-semibold text-primary hover:text-primary-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit lightweightmobility.co.uk
                </a>
                .
              </p>
            ) : null}
          </div>

          <aside className="space-y-8 lg:pt-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Explore
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/vehicle-adaptations"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Vehicle adaptations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/motability"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Motability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Scooters &amp; wheelchairs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-work"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Recent work
                  </Link>
                </li>
              </ul>
            </div>

            {related.length ? (
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  More stories
                </p>
                <ul className="mt-3 space-y-4">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="group block"
                      >
                        <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-soft">
                          {/* eslint-disable-next-line @next/next/no-img-element -- related thumb; skip Vercel Image Optimization */}
                          <img
                            src={item.image}
                            alt={item.imageAlt || item.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <p className="text-sm font-semibold leading-snug text-primary group-hover:underline">
                          {item.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </article>
      <CtaFooter
        title="Planning a similar adaptation?"
        subtitle="Tell us about your vehicle and needs — we’ll confirm compatibility and a firm quotation."
      />
    </>
  );
}
