import Link from "next/link";
import { ShieldCheck, Wrench, HeartHandshake, MapPin, Star } from "lucide-react";
import type { ReviewsSummary } from "@/lib/types";

export function TrustStrip({ reviews }: { reviews?: ReviewsSummary }) {
  const hasGoogleRating = Boolean(
    reviews?.profiles?.length &&
    reviews.averageRating != null &&
    Number.isFinite(reviews.averageRating) &&
    reviews.averageRating > 0 && reviews.averageRating <= 5 &&
    Number.isFinite(reviews.totalReviews) && reviews.totalReviews > 0
  );

  return <section className="container-site" aria-label="Our service">
    <div className="ms-trust">
      <span><ShieldCheck aria-hidden="true" />Motability accredited</span>
      <span><Wrench aria-hidden="true" />Specialist fitting &amp; aftercare</span>
      {hasGoogleRating && reviews ? (
        <Link href="/about-us#google-reviews" className="ms-trust-reviews">
          <Star aria-hidden="true" />
          <span>{reviews.averageRating!.toFixed(1)} / 5 · {reviews.totalReviews.toLocaleString("en-GB")} Google reviews</span>
        </Link>
      ) : (
        <span><HeartHandshake aria-hidden="true" />Advice that puts you first</span>
      )}
      <span><MapPin aria-hidden="true" />Two local branches</span>
    </div>
  </section>;
}
