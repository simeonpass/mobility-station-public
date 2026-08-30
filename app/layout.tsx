import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://klym.co.uk"),
  title: { default: "KLYM | XSTO Powered Wheelchairs UK", template: "%s | KLYM" },
  description: "KLYM is a UK XSTO specialist store for M4, M4B, M4 Pro, X12 and X12 Pro self-balancing and stair-climbing powered wheelchairs.",
  alternates: { canonical: "/" },
  openGraph: { title: "KLYM | XSTO Mobility", description: "Advanced XSTO mobility. M4B, M4, M4 Pro, X12 and X12 Pro.", url: "https://klym.co.uk", siteName: "KLYM", type: "website" },
};

function Logo() {
  return <span className="brand" aria-label="KLYM"><span className="wordmark">KL<i>Y</i>M</span><small>XSTO MOBILITY</small></span>;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <header className="site-header">
          <Link href="/"><Logo /></Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/xsto-m4b">M4B</Link><Link href="/xsto-m4">M4</Link><Link href="/xsto-m4-pro">M4 Pro</Link><Link href="/xsto-x12">X12</Link><Link href="/xsto-x12-pro">X12 Pro</Link><Link href="/compare">Compare</Link>
          </nav>
          <div className="header-actions"><Link className="btn ghost small" href="/book-a-demo">Book a demo</Link><Link className="btn blue small" href="/xsto-m4b">Buy M4B →</Link></div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-brand"><Logo /><p>Next-generation XSTO mobility, presented simply.</p><Link className="btn blue small" href="/compare">Explore the range →</Link></div>
            <div className="footer-col"><h4>Models</h4><Link href="/xsto-m4b">M4B</Link><Link href="/xsto-m4">M4</Link><Link href="/xsto-m4-pro">M4 Pro</Link><Link href="/xsto-x12">X12</Link><Link href="/xsto-x12-pro">X12 Pro</Link></div>
            <div className="footer-col"><h4>Help</h4><Link href="/book-a-demo">Book a demo</Link><Link href="/vat-relief">VAT relief</Link><Link href="/compare">Compare</Link><Link href="/self-balancing-wheelchairs">Self-balancing</Link><Link href="/stair-climbing-wheelchairs">Stair climbing</Link></div>
            <div className="footer-col"><h4>KLYM</h4><p>Operated by Adaptation Station Ltd, trading as Mobility Station.</p><p>UK delivery & support.</p></div>
          </div>
          <div className="footer-bottom"><span>© 2026 KLYM.</span><span>Built for a better tomorrow.</span></div>
        </footer>
      </body>
    </html>
  );
}
