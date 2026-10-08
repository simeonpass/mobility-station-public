"use client";

import Image from "next/image";
import { useState } from "react";

/** Keep older stories readable when their original photograph is unavailable. */
export function StoryImage({ src, alt, className, loading = "lazy", fetchPriority }: {
  src?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div className="ms-story-image-fallback" role="img" aria-label="Mobility Station stories and advice">
        <span>Mobility Station</span>
        <strong>Stories &amp; advice.</strong>
        <span className="ms-story-image-rule" aria-hidden />
      </div>
    );
  }

  return <Image key={src} src={src} alt={alt} fill unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className={className} loading={loading} fetchPriority={fetchPriority} onError={() => setFailedSrc(src)} />;
}
