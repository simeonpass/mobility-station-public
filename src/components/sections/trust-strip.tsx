import Link from "next/link";
import { LeaveGoogleReview } from "./leave-google-review";
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
      {reviews ? (
        <div className="ms-trust-review-group">
        <Link href="/about-us#google-reviews" className="ms-trust-reviews">
          <Star aria-hidden="true" />
          <span>{hasGoogleRating ? `${reviews.averageRating!.toFixed(1)} / 5 · ${reviews.totalReviews.toLocaleString("en-GB")} Google reviews` : "Read our Google reviews"}</span>
        </Link>
        <LeaveGoogleReview />
        </div>
      ) : (
        <span><HeartHandshake aria-hidden="true" />Advice that puts you first</span>
      )}
      <span><MapPin aria-hidden="true" />Two local branches</span>
    </div>
  </section>;
}
