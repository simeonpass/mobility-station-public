import { ChevronDown, ExternalLink } from "lucide-react";

// Public review destinations verified against each branch's Google listing.
const branches = [
  { name: "Heathrow", url: "https://g.page/r/CUOQFe58KWWaEBM/review" },
  { name: "Ferndown", url: "https://search.google.com/local/writereview?placeid=ChIJnd9YnaSec0gRQQzk_5n_k7s" },
];

export function LeaveGoogleReview({ label = "Leave a review", align = "start" }: { label?: string; align?: "start" | "end" }) {
  return <details className={`ms-leave-review ms-leave-review-${align}`}>
    <summary>{label}<ChevronDown size={14} aria-hidden="true" /></summary>
    <div className="ms-review-options">
      <p>Choose your branch</p>
      {branches.map(branch => <a key={branch.name} href={branch.url} target="_blank" rel="noopener noreferrer" aria-label={`Leave a Google review for ${branch.name} (opens in a new tab)`}>
        {branch.name}<ExternalLink size={14} aria-hidden="true" />
      </a>)}
      <p>Opens Google reviews.</p>
    </div>
  </details>;
}
