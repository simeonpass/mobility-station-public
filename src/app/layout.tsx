import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Analytics } from "@/components/layout/analytics";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { MobileUtilityBar } from "@/components/layout/mobile-utility-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuickViewHost } from "@/components/product/product-quick-view";
import { DEFAULT_SHARE_IMAGE, SITE } from "@/lib/seo";
import "./globals.css";
import "./mobility-blue-theme.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Mobility Station | Adaptations, Scooters & Wheelchairs",
    template: "%s | Mobility Station",
  },
  description:
    "Vehicle adaptations, mobility scooters and wheelchairs from Heathrow & Ferndown. Motability accredited. Home and branch demonstrations available.",
  icons: {
    icon: [{ url: "/brand/mobility-station-favicon-blue.svg?v=20260831", type: "image/svg+xml" }],
    apple: [{ url: "/brand/mobility-station-favicon-blue.svg?v=20260831" }],
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Mobility Station",
    title: "Mobility Station | Adaptations, Scooters & Wheelchairs",
    description:
      "Vehicle adaptations, scooters and wheelchairs from Heathrow & Ferndown. Motability accredited dealer.",
    images: [{ url: DEFAULT_SHARE_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${manrope.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <CartProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="relative z-0 flex-1 overflow-x-clip outline-none">{children}</main>
          <SiteFooter />
          <MobileUtilityBar />
          <QuickViewHost />
          <CartDrawer />
          <CookieConsentBanner />
          <Analytics />
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  );
}
