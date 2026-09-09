"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./home-hero-gallery.module.css";

const poster = "/images/hero-options/hand-controls-video-poster.webp";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackPreference = useRef<"auto" | "play" | "pause">("auto");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    let inView = false;

    const syncPlayback = () => {
      const wantsPlayback = playbackPreference.current === "play" || (
        playbackPreference.current === "auto" &&
        !reducedMotion.matches &&
        !connection?.saveData
      );

      if (inView && !document.hidden && wantsPlayback && !video.error) {
        // Browsers can decline autoplay; the play button remains available.
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    // Start only after checking motion/data preferences and viewport visibility.
    video.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      syncPlayback();
    }, { threshold: 0.15 });
    observer.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      playbackPreference.current = "play";
      void video.play().catch(() => {});
    } else {
      playbackPreference.current = "pause";
      video.pause();
    }
  }

  return (
    <>
      <Image
        src={poster}
        alt="A driver demonstrating the steering aid and hand controls fitted to a car"
        fill
        preload
        sizes="(max-width: 780px) calc(100vw - 40px), (max-width: 1416px) 58vw, 780px"
        className={styles.photo}
      />
      <video
        ref={videoRef}
        id="home-hero-video"
        className={styles.video}
        hidden={hasError}
        src="/videos/hand-controls-demonstration.mp4"
        poster={poster}
        width={1280}
        height={720}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Demonstration of steering and hand controls in an adapted car"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />
      {!hasError && (
        <button
          type="button"
          className={styles.videoControl}
          onClick={togglePlayback}
          aria-controls="home-hero-video"
          aria-label={isPlaying ? "Pause hero video" : "Play hero video"}
        >
          {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          <span>{isPlaying ? "Pause video" : "Play video"}</span>
        </button>
      )}
    </>
  );
}
