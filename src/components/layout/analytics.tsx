"use client";
import { useEffect } from "react";
import { getAiReferralSource } from "@/lib/ai-referral";
import { COOKIE_CONSENT_KEY } from "./cookie-consent-banner";
/** Optional measurement follows the site's existing analytics consent. */
export function Analytics() {
  useEffect(() => {
    const landingPage = window.location.pathname;
    const source = getAiReferralSource(window.location.href, document.referrer);
    let referralTracked = false;
    const allowed = () => { try { return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted" && !!window.gtag; } catch { return false; } };
    const trackReferral = () => {
      if (!allowed() || !source || referralTracked) return;
      window.gtag?.("event", "ai_referral", {ai_source: source, landing_page: landingPage});
      referralTracked = true;
    };
    const onClick = (event: MouseEvent) => {
      if (!allowed() || !(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      const action = url.protocol === "tel:" ? "call" : url.protocol === "mailto:" ? "email" : url.origin === window.location.origin && url.pathname === "/book-a-demo" ? "demo" : null;
      if (!action) return;
      window.gtag?.("event", "enquiry_intent", {enquiry_action: action, page_path: window.location.pathname, ...(source ? {ai_source: source} : {})});
    };
    trackReferral();
    window.addEventListener("ms:analytics-ready", trackReferral);
    document.addEventListener("click", onClick);
    return () => { window.removeEventListener("ms:analytics-ready", trackReferral); document.removeEventListener("click", onClick); };
  }, []);
  return null;
}
