import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LightweightHeader, LightweightFooter } from "@/components/lightweight/SiteChrome";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lightweightmobility.co.uk"),
  title: {
    default: "Lightweight Mobility | Folding Scooters & Electric Wheelchairs",
    template: "%s | Lightweight Mobility",
  },
  description:
    "UK specialists in lightweight, folding and travel-friendly mobility scooters and electric wheelchairs. Nationwide delivery and VAT relief support.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Lightweight Mobility",
    title: "Lightweight Mobility | Folding Scooters & Electric Wheelchairs",
    description: "Lightweight mobility products chosen for easier lifting, folding, travel and car-boot transport.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${manrope.variable} h-full`}>
      <body className="min-h-full bg-[#fbfcfa] font-sans text-slate-950 antialiased">
        <LightweightHeader />
        <main>{children}</main>
        <LightweightFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
