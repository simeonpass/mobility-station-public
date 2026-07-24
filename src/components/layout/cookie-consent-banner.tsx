"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const COOKIE_CONSENT_KEY = "ms_cookie_consent";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-Y9L9EQ94TN";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGa() {
  if (typeof window === "undefined" || window.gtag) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === "accepted") {
      loadGa();
      return;
    }
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
    loadGa();
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="pointer-events-auto mx-auto max-w-2xl rounded-2xl border border-border bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
            <Cookie className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-sm font-semibold text-primary">
              We use cookies
            </h3>
            <p className="text-xs leading-relaxed text-muted">
              We use essential cookies to keep the site working and functional
              cookies for your basket. Analytics cookies load only if you
              accept. Read our{" "}
              <Link
                href="/cookie-policy"
                className="underline hover:text-primary"
              >
                Cookie Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button type="button" size="sm" onClick={accept}>
                Accept all
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={decline}
              >
                Essential only
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={decline}
            className="shrink-0 text-muted hover:text-primary"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
