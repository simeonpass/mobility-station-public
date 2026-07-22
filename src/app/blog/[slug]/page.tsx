import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { getBlogPost, getBlogPosts } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { truncate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return createMetadata({
      title: "Article not found",
      description: "This blog post could not be found.",
      path: `/blog/${slug}`,
    });
  }
  return createMetadata({
    title: truncate(post.title, 50),
    description: truncate(post.excerpt, 160),
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export const revalidate = 300;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <article className="container-site py-10 md:py-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
              {post.title}
            </h1>
            <div className="relative mt-8 aspect-[3/4] max-w-md overflow-hidden bg-soft">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <div className="prose-mobility mt-8 max-w-3xl space-y-4 text-lg leading-relaxed text-foreground/85">
              {post.content.split("\n\n").map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
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
          <aside className="lg:pt-16">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Related
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/lightweight-folding-mobility" className="hover:text-primary-dark">
                  Lightweight folding mobility
                </Link>
              </li>
              <li>
                <Link href="/vehicle-adaptations" className="hover:text-primary-dark">
                  Vehicle adaptations
                </Link>
              </li>
              <li>
                <Link href="/motability" className="hover:text-primary-dark">
                  Motability
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </article>
      <CtaFooter />
    </>
  );
}
