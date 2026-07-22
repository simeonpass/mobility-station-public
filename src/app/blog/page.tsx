import { BlogGrid } from "@/components/sections/blog-grid";
import { Hero } from "@/components/sections/hero";
import { getBlogPosts } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Mobility Advice Blog",
  description:
    "Guides on home demonstrations, Motability, lightweight folding mobility and vehicle adaptations from Mobility Station.",
  path: "/blog",
});

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Hero
        compact
        title="Advice from Mobility Station"
        subtitle="Practical guides on scooters, wheelchairs, Motability and vehicle adaptations."
        primaryHref="/book-a-demo"
        primaryLabel="Book a Demo"
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
