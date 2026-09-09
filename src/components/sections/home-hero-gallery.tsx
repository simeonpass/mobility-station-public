import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import styles from "./home-hero-gallery.module.css";

const images = [
  { src: "/images/redesign/hero.webp", label: "Vehicle adaptations", alt: "An adviser helping a customer at an adapted vehicle", position: "50% 38%", href: "/vehicle-adaptations" },
  { src: "/images/hero-options/03-scooter-handover.webp", label: "Mobility scooters", alt: "A customer and mobility advisers with a scooter outside a home", position: "48% 55%", href: "/shop?sub=scooters" },
  { src: "/images/hero-options/02-wav-powerchair.webp", label: "Wheelchairs", alt: "A powered wheelchair user and an adviser beside an accessible vehicle", position: "62% 55%", href: "/shop?sub=wheelchairs" },
];

export function HomeHeroGallery() {
  return (
    <div className={styles.gallery}>
      <div className={styles.collage}>
        {images.map((image, index) => (
          <Link key={image.src} href={image.href} className={`${styles.tile} ${index === 0 ? styles.featured : ""}`}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes={index === 0
                ? "(max-width: 780px) calc(100vw - 40px), (max-width: 1416px) 46vw, 635px"
                : "(max-width: 780px) calc(50vw - 26px), (max-width: 1416px) 23vw, 312px"}
              className={styles.photo}
              style={{ objectPosition: image.position }}
            />
            <span className={styles.label}>{image.label}<ArrowUpRight size={18} aria-hidden="true" /></span>
          </Link>
        ))}
      </div>
      <Link className={styles.note} href="/book-a-demo">
        <CalendarDays size={24} aria-hidden="true" />
        <span><strong>Let’s find your fit.</strong><small>Book a free branch demonstration</small></span>
        <ArrowUpRight size={21} aria-hidden="true" />
      </Link>
    </div>
  );
}
