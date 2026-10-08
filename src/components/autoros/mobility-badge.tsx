import { ArrowUpRight } from "lucide-react";

export function MobilityBadge() {
  return (
    <div className="ms-badge">
      <input className="sr-only" type="checkbox" id="ms-pause-badge" aria-label="Pause badge animation" />
      <div className="ms-badge-art" aria-hidden="true">
        <div className="ms-badge-ring">
          <svg viewBox="0 0 160 160">
            <defs><path id="ms-badge-circle" d="M80,80 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" /></defs>
            <text><textPath href="#ms-badge-circle" textLength="370">MOBILITY STATION · KEEPING YOU MOVING ·</textPath></text>
          </svg>
        </div>
        <ArrowUpRight className="ms-badge-centre" strokeWidth={1.2} />
      </div>
      <label htmlFor="ms-pause-badge"><span className="ms-pause-label">Pause animation</span><span className="ms-play-label">Play animation</span></label>
    </div>
  );
}
