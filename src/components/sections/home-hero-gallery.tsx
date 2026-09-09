"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Pause, Play } from "lucide-react";
import styles from "./home-hero-gallery.module.css";

const slides = [
  { src: "/images/redesign/hero.webp", label: "Vehicle adaptations", alt: "An adviser helping a customer at an adapted vehicle", position: "50% 35%" },
  { src: "/images/hero-options/03-scooter-handover.webp", label: "Scooters", alt: "A customer and mobility advisers with a scooter outside a home", position: "48% 40%" },
  { src: "/images/hero-options/02-wav-powerchair.webp", label: "Powered wheelchairs", alt: "A wheelchair user and an adviser beside an accessible vehicle", position: "57% 45%" },
];

function subscribeToMotionPreference(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function getMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerMotionPreference() {
  return true;
}

export function HomeHeroGallery() {
  const galleryId = useId();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const loadedSlides = useRef(new Set<number>());
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, getServerMotionPreference);
  const rotationEnabled = !paused && !reducedMotion;
  const rotating = rotationEnabled && !hovered && !focused;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setActive((current) => {
        const next = (current + 1) % slides.length;
        return loadedSlides.current.has(next) ? next : current;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, [rotating]);

  function move(direction: number) {
    setPaused(true);
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <div
      className={styles.gallery}
      role="region"
      aria-roledescription="carousel"
      aria-label="Vehicle adaptations, scooters and wheelchairs"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div className={`ms-hero-visual ${styles.stage}`} id={galleryId}>
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`${styles.slide} ${active === index ? styles.active : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}
            aria-hidden={active !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              loading="eager"
              fetchPriority={index === 0 ? "high" : "low"}
              sizes="(max-width: 780px) calc(100vw - 40px), (max-width: 1416px) 46vw, 635px"
              className={styles.photo}
              style={{ objectPosition: slide.position }}
              onLoad={() => loadedSlides.current.add(index)}
            />
          </div>
        ))}
        <Link className={`ms-hero-note ${styles.note}`} href="/book-a-demo">
          <span className="ms-note-icon"><CalendarDays aria-hidden="true" /></span>
          <span><strong>Let’s find your fit.</strong><small>Book a free branch demonstration</small></span>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.toolbar}>
        <p className={styles.caption} aria-live={rotating ? "off" : "polite"} aria-atomic="true">
          <span className={styles.count}>{active + 1} / {slides.length}</span>
          {slides[active].label}
        </p>
        <div className={styles.controls}>
          {!reducedMotion ? (
            <button type="button" className={styles.control} aria-label={rotationEnabled ? "Pause slideshow" : "Play slideshow"} aria-controls={galleryId} onClick={() => setPaused((current) => !current)}>
              {rotationEnabled ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
            </button>
          ) : null}
          <button type="button" className={styles.control} aria-label="Previous hero image" aria-controls={galleryId} onClick={() => move(-1)}><ArrowLeft size={19} aria-hidden="true" /></button>
          <button type="button" className={styles.control} aria-label="Next hero image" aria-controls={galleryId} onClick={() => move(1)}><ArrowRight size={19} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
