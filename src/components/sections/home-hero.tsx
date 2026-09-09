import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { HomeHeroGallery } from "./home-hero-gallery";
export function HomeHero() {
  return (
    <div className="ms-hero-backdrop">
      <section className="ms-hero container-site">
        <div className="ms-hero-copy">
          <p className="ms-eyebrow"><i aria-hidden="true" />More freedom. Every day.</p>
          <h1>Your world.<br />More <span>possible.</span></h1>
          <p className="ms-hero-description">From the driving seat to your next adventure. Find vehicle adaptations, scooters and wheelchairs that fit your life.</p>
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
