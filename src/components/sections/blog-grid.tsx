import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-border bg-soft/60 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-primary">
          No posts published yet
        </p>
        <p className="mt-2 text-sm text-muted">
          Check back soon for recent installations and mobility advice — or{" "}
          <Link href="/contact" className="font-semibold text-primary underline">
            ask us about a project
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="flex h-full flex-col">
          <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-soft">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="mt-3 flex flex-1 flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h2 className="mt-1 text-lg font-bold leading-snug text-primary group-hover:underline">
                {post.title}
              </h2>
              {post.excerpt ? (
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {post.excerpt}
                </p>
              ) : null}
              {post.tags?.length ? (
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-medium text-primary"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
