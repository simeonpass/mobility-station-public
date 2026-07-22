import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <article key={post.id}>
          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-soft">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <h2 className="mt-1 text-lg font-bold leading-snug group-hover:text-primary-dark">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
          </Link>
        </article>
      ))}
    </div>
  );
}
