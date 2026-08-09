import Link from "next/link";
import { BlogGrid } from "@/components/sections/blog-grid";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { OurWorkGallery } from "@/components/sections/our-work-gallery";
import { getBlogPosts, getPublicPortfolio } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Recent work & mobility stories",
  description:
    "Real vehicle adaptations, scooter installations and mobility advice from Mobility Station — Heathrow and Ferndown.",
  path: "/blog",
});

export const revalidate = 300;

export default async function BlogPage() {
  const [posts, gallery] = await Promise.all([
    getBlogPosts(),
    getPublicPortfolio(96).catch((error) => {
      console.error("Portfolio error:", error);
      return [];
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Mobility Station — Recent work & stories",
    url: `${SITE.url}/blog`,
    description:
      "Recent vehicle adaptations, installations and mobility advice from Mobility Station.",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        compact
        title="Recent work & stories"
        subtitle="Real adaptations we’ve fitted, installations we’re proud of, and practical mobility advice from our Heathrow and Ferndown teams."
        primaryHref="/contact?interest=adaptation"
        primaryLabel="Request a quotation"
        secondaryHref="/our-work"
        secondaryLabel="Browse recent work"
      />

      <section className="pb-14 md:pb-16">
        <div className="container-site">
          {posts.length ? (
            <p className="mb-8 text-sm text-muted">
              {posts.length} {posts.length === 1 ? "story" : "stories"}
              {gallery.length ? (
                <>
                  {" · "}
                  <a
                    href="#gallery"
                    className="font-semibold text-primary underline"
                  >
                    {gallery.length} photos from the workshop
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
          <BlogGrid posts={posts} />
        </div>
      </section>

      {gallery.length ? (
        <section
          id="gallery"
          className="scroll-mt-24 border-t border-border bg-soft py-14 md:py-16"
        >
          <div className="container-site">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                Photo gallery
              </h2>
              <p className="mt-3 text-muted">
                Adaptations, deliveries and repairs from our Heathrow and
                Ferndown workshops.
              </p>
            </div>
            <OurWorkGallery items={gallery} />
            <p className="mt-10 text-center text-sm text-muted">
              Planning something similar?{" "}
              <Link
                href="/contact?interest=adaptation"
                className="font-semibold text-primary underline"
              >
                Ask us for a quotation
              </Link>
              .
            </p>
          </div>
        </section>
      ) : null}

      <CtaFooter />
    </>
  );
}
