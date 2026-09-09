import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { HomeHeroGallery } from "./home-hero-gallery";
export function HomeHero() {
  return (
    <div className="ms-hero-backdrop">
      <section className="ms-hero container-site">
        <div className="ms-hero-copy">
          <p className="ms-eyebrow"><i aria-hidden="true" />Your independence. Our expertise.</p>
          <h1>Vehicle adaptation experts.<br /><span>Scooter &amp; wheelchair specialists.</span></h1>
          <p className="ms-hero-description">Expertly fitted vehicle adaptations, mobility scooters and wheelchairs. Find the right solution with personal advice from our Heathrow and Ferndown teams.</p>
          <div className="ms-hero-actions">
            <Link href="/vehicle-adaptations" className="ms-button">Explore vehicle adaptations <ArrowUpRight size={19} aria-hidden="true" /></Link>
            <Link href="/shop" className="ms-button ms-button-secondary">Shop mobility <ArrowUpRight size={19} aria-hidden="true" /></Link>
          </div>
          <div className="ms-reassurance">
            <span><Check size={19} aria-hidden="true" /></span>
            <p>Real people. Specialist advice.<br /><strong>Here for your next step.</strong></p>
          </div>
        </div>
        <HomeHeroGallery />
      </section>
    </div>
  );
}
