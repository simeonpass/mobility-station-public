import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import styles from "./home-hero-gallery.module.css";

export function HomeHeroGallery() {
  return (
    <div className={styles.gallery}>
      <div className={styles.artwork}>
        <Image
          src="/images/hero-options/product-campaign.webp"
          alt="AI-created composition based on our GoGo Carbon scooter, Jazzy Carbon powered wheelchair and vehicle boot-hoist product photos"
          width={1536}
          height={1024}
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 780px) calc(100vw - 40px), (max-width: 1416px) 58vw, 780px"
          className={styles.photo}
        />
      </div>
      <nav className={styles.categories} aria-label="Explore our adaptations and mobility range">
        <Link href="/vehicle-adaptations">Vehicle adaptations <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <Link href="/shop?sub=scooters">Scooters <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <Link href="/shop?sub=wheelchairs">Wheelchairs <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </nav>
      <Link className={styles.note} href="/book-a-demo">
        <CalendarDays size={24} aria-hidden="true" />
        <span><strong>Let’s find your fit.</strong><small>Book a free branch demonstration</small></span>
        <ArrowUpRight size={21} aria-hidden="true" />
      </Link>
    </div>
  );
}
