import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { categoryLabel, type RecentWorkProject } from "@/lib/recent-work";
import type { ReviewsSummary } from "@/lib/types";

export function HomeEvidence({ project, reviews }: { project?: RecentWorkProject; reviews: ReviewsSummary }) {
  // Only the live Google feed supplies a source URL for each review.
  const sourcedReviews = reviews.reviews.filter(review => review.googleMapsUrl && review.quote.trim() && review.author.trim());
  const first = sourcedReviews[0];
  const second = first && (sourcedReviews.find(review => review.id !== first.id && review.location !== first.location)
    ?? sourcedReviews.find(review => review.id !== first.id));
  const selected = [first, second].filter(review => review != null);
  if (!project && !selected.length) return null;

  return <section className="container-site ms-section ms-home-evidence" aria-labelledby="home-evidence-title">
    <div className="ms-section-heading">
      <div><p className="ms-eyebrow">People, places and practical support.</p><h2 id="home-evidence-title">See the difference we make.</h2></div>
      <Link href="/our-work" className="ms-text-link">More from our workshop <ArrowUpRight size={18} aria-hidden /></Link>
    </div>
    <div className={`ms-evidence-grid${project ? selected.length ? "" : " ms-evidence-project-only" : " ms-evidence-reviews-only"}`}>
      {project ? <article className="ms-work-story">
        <Link href={`/our-work/${project.slug}`} className="ms-work-story-image">
          {project.hero_image ? <Image src={project.hero_image} alt={project.images?.[0]?.alt || project.title} fill sizes="(min-width: 1000px) 45vw, 100vw" className="object-cover" /> : null}
        </Link>
        <div><p className="ms-eyebrow">{[categoryLabel(project.category), project.town].filter(Boolean).join(" · ")}</p>
          <h3><Link href={`/our-work/${project.slug}`}>{project.title}</Link></h3>
          <p>{project.summary}</p>
          <Link href={`/our-work/${project.slug}`} className="ms-text-link">See this installation <ArrowUpRight size={18} aria-hidden /></Link>
        </div>
      </article> : null}
      {selected.length ? <div className="ms-home-reviews" id="google-reviews">
        {selected.map(review => <figure key={review.id} className="ms-home-review">
          <span className="ms-review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={17} fill={index < review.rating ? "currentColor" : "none"} aria-hidden />)}</span>
          <blockquote>“{review.quote}”</blockquote>
          <figcaption><strong>{review.author}</strong><span>{[review.location, "Google review"].filter(Boolean).join(" · ")}</span></figcaption>
          {review.googleMapsUrl || reviews.googleMapsUrl ? <a href={review.googleMapsUrl || reviews.googleMapsUrl || undefined} target="_blank" rel="noopener noreferrer" className="ms-text-link">Read reviews on Google <ArrowUpRight size={16} aria-hidden /></a> : null}
        </figure>)}
      </div> : null}
    </div>
  </section>;
}
