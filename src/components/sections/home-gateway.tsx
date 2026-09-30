import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bike, CircleGauge } from "lucide-react";

/** The homepage split: two equal doors into the two sides of the business. */
export function GatewayHero() {
  return <section className="container-site mss-gateway" aria-labelledby="gateway-title">
    <div className="mss-gateway-head">
      <div>
        <p className="mss-kicker">Keeping you moving</p>
        <h1 id="gateway-title">One team. Two ways to keep you moving.</h1>
      </div>
      <p>Specialist vehicle adaptations, and mobility scooters and wheelchairs you can try before you buy. Choose where you’d like to start.</p>
    </div>
    <div className="mss-doors">
      <Link href="/vehicle-adaptations" className="mss-door mss-door-adapt">
        <span className="mss-door-image"><Image src="/images/redesign/controls.webp" alt="" fill sizes="(max-width: 860px) 100vw, 50vw" priority /></span>
        <span className="mss-door-body">
          <span className="mss-door-kicker"><CircleGauge size={18} aria-hidden />Vehicle adaptations</span>
          <span className="mss-door-title">Your car. Your independence.</span>
          <span className="mss-door-text">Hand controls, boot hoists and swivel seats — assessed, supplied and fitted by our workshop teams in Heathrow and Ferndown.</span>
          <span className="mss-door-foot"><small>Free quotations · Motability options</small><span className="mss-door-go">Explore adaptations<ArrowRight size={18} aria-hidden /></span></span>
        </span>
      </Link>
      <Link href="/shop" className="mss-door mss-door-shop">
        <span className="mss-door-image"><Image src="/images/redesign/scooter.webp" alt="" fill sizes="(max-width: 860px) 100vw, 50vw" priority /></span>
        <span className="mss-door-body">
          <span className="mss-door-kicker"><Bike size={18} aria-hidden />Scooters &amp; wheelchairs</span>
          <span className="mss-door-title">Everyday freedom, your way.</span>
          <span className="mss-door-text">Folding and road scooters, powered and manual wheelchairs, hire and servicing — with a free demonstration at either branch.</span>
          <span className="mss-door-foot"><small>Free branch demos · VAT relief where eligible</small><span className="mss-door-go">Shop mobility<ArrowRight size={18} aria-hidden /></span></span>
        </span>
      </Link>
    </div>
  </section>;
}

/** Plain-language routes for visitors who aren't sure which side they need. */
export function HomeRoutes() {
  return <section className="container-site mss-routes" aria-labelledby="routes-title">
    <div className="mss-routes-head">
      <h2 id="routes-title">Not sure where to start?</h2>
      <p>Tell us what matters to you — we’ll point you the right way.</p>
    </div>
    <div className="mss-route-grid">
      <Link href="/vehicle-adaptations" className="mss-route mss-route-adapt">
        <span className="mss-tag mss-tag-adapt">Vehicle adaptations</span>
        <strong>“I want to keep driving my own car.”</strong>
        <p>Hand controls, pedal modifications, steering aids, and hoists that lift your scooter or wheelchair into the boot.</p>
        <span className="mss-route-link">Find your adaptation<ArrowRight size={18} aria-hidden /></span>
      </Link>
      <Link href="/shop" className="mss-route mss-route-shop">
        <span className="mss-tag mss-tag-shop">Scooters &amp; wheelchairs</span>
        <strong>“I need help getting around day to day.”</strong>
        <p>Lightweight folders for trips away, road scooters for longer journeys, powerchairs and manual wheelchairs — plus short-term hire.</p>
        <span className="mss-route-link">Explore the range<ArrowRight size={18} aria-hidden /></span>
      </Link>
      <div className="mss-route">
        <span className="mss-tag mss-tag-moti">Motability</span>
        <strong>“I’m a Motability customer.”</strong>
        <p>Our accredited team helps with both adaptations and scooters — from choosing the right model to the paperwork.</p>
        <span className="mss-route-links">
          <Link href="/motability/vehicle-adaptations">Adaptations on Motability</Link>
          <Link href="/motability">Scooters &amp; wheelchairs on Motability</Link>
        </span>
      </div>
    </div>
  </section>;
}

/** Closing call to action with one button per side of the business. */
export function SplitCta() {
  return <section className="mss-split-cta">
    <div className="container-site">
      <div>
        <p className="mss-kicker">Let’s take the next step together</p>
        <h2>A little advice goes a long way.</h2>
        <p>Tell us what matters to you. We’ll help with the rest — whichever side of the business you need.</p>
      </div>
      <div className="mss-split-actions">
        <Link href="/contact?interest=adaptation" className="mss-go-adapt">Get an adaptation quote<ArrowRight size={20} aria-hidden /></Link>
        <Link href="/book-a-demo" className="mss-go-shop">Book a free scooter demo<ArrowRight size={20} aria-hidden /></Link>
      </div>
    </div>
  </section>;
}
