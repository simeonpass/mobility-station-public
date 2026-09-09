import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import styles from "./home-hero-gallery.module.css";

const scenes = [
  {
    src: "/images/hero-options/customer-hand-controls.webp",
    label: "Drive with confidence",
    alt: "AI-created customer scene based on our Jeff Gosling push-pull controls photograph, showing a smiling driver with her fingers around the upright hand-control grip beside the steering wheel",
    href: "/vehicle-adaptations/mechanical-hand-controls",
    featured: true,
  },
  {
    src: "/images/hero-options/hoist-demonstration.webp",
    label: "Boot hoists",
    alt: "AI-created scene of an engineer demonstrating a boot hoist and scooter to a customer, based on the actual hoist photograph",
    href: "/vehicle-adaptations/boot-hoists",
  },
  {
    src: "/images/hero-options/engineer-hand-controls-crouched.webp",
    label: "Professional fitting",
    alt: "AI-created scene of an engineer crouching with his back to the camera at an open driver doorway, with fitted Jeff Gosling hand controls visible",
    href: "/vehicle-adaptations/mechanical-hand-controls",
    uncropped: true,
  },
  {
    src: "/images/hero-options/product-campaign.webp",
    label: "Scooters & wheelchairs",
    alt: "AI-created composition based on our GoGo Carbon scooter, Jazzy Carbon powered wheelchair and boot-hoist product photos",
    href: "/shop",
  },
];

export function HomeHeroGallery() {
  return (
    <div className={styles.gallery}>
      <div className={styles.collage}>
        {scenes.map((scene) => (
          <Link
            key={scene.src}
            href={scene.href}
            className={`${styles.scene} ${scene.featured ? styles.featured : ""}`}
          >
            <div className={styles.frame}>
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                loading="eager"
                fetchPriority={scene.featured ? "high" : "auto"}
                sizes={scene.featured
                  ? "(max-width: 780px) calc(100vw - 40px), (max-width: 1416px) 58vw, 780px"
                  : scene.href === "/shop"
                    ? "(max-width: 540px) calc(100vw - 40px), (max-width: 780px) 31vw, (max-width: 1416px) 19vw, 252px"
                    : "(max-width: 540px) calc(50vw - 26px), (max-width: 780px) 31vw, (max-width: 1416px) 19vw, 252px"}
                className={`${styles.photo} ${scene.uncropped ? styles.uncropped : ""}`}
              />
            </div>
            <span className={styles.label}>{scene.label}<ArrowUpRight size={17} aria-hidden="true" /></span>
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
