import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Analytics } from "@/components/layout/analytics";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    icon: [
      { url: "/favicon.ico?v=20260830d", sizes: "any" },
      { url: "/favicon-32x32.png?v=20260830d", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=20260830d", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png?v=20260830d", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=20260830d", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Mobility Station",
    title: "Mobility Station | Adaptations, Scooters & Wheelchairs",
    description:
      "Vehicle adaptations, scooters and wheelchairs from Heathrow & Ferndown. Motability accredited dealer.",
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
          <CartDrawer />
          <CookieConsentBanner />
          <Analytics />
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  );
}
