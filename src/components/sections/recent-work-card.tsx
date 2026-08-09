import Image from "next/image";
import Link from "next/link";
import {
  categoryLabel,
  formatWorkDate,
  type RecentWorkProject,
} from "@/lib/recent-work";

export function RecentWorkCard({ project }: { project: RecentWorkProject }) {
  const date = formatWorkDate(project.work_date);
  const meta = [categoryLabel(project.category), project.town, date]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/our-work/${project.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-soft"
      >
        {project.hero_image ? (
          <Image
            src={project.hero_image}
            alt={
              project.images?.[0]?.alt ||
              project.title ||
              "Recent Mobility Station work"
            }
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 bg-primary/5" aria-hidden />
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        {meta ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {meta}
          </p>
        ) : null}
        <h2 className="mt-1 text-lg font-bold leading-snug text-primary">
          <Link
            href={`/our-work/${project.slug}`}
            className="transition-colors hover:text-primary-dark"
          >
            {project.title}
          </Link>
        </h2>
        {project.summary ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {project.summary}
          </p>
        ) : null}
        <p className="mt-auto pt-4 text-sm font-semibold text-primary">
          <Link
            href={`/our-work/${project.slug}`}
            className="underline-offset-4 transition-colors hover:underline"
          >
            View project →
          </Link>
        </p>
      </div>
    </article>
  );
}
