import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@/components/layout/analytics";
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
    default: "Mobility Station | Free Home Demonstrations",
    template: "%s | Mobility Station",
  },
  description:
    "Free home demonstrations for scooters, wheelchairs and vehicle adaptations. Heathrow & Ferndown. Motability accredited. Call 0800 772 3870.",
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Mobility Station",
    title: "Mobility Station | Free Home Demonstrations",
    description:
      "We come to you with scooters, wheelchairs and vehicle adaptations. Heathrow & Ferndown branches.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
