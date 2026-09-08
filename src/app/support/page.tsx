import Link from "next/link";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Help & Support", description: "Find answers, contact our team or arrange servicing for your mobility equipment.", path: "/support" });
const links = [
  { title: "Contact & locations", text: "Message us, ask for a callback or find your nearest branch.", href: "/contact" },
  { title: "Servicing & repairs", text: "Book workshop support or explore our Care Plans.", href: "/servicing" },
  { title: "Frequently asked questions", text: "Straightforward answers about equipment, fitting and buying.", href: "/faq" },
  { title: "Delivery & collection", text: "Delivery options, home visits and the areas we cover.", href: "/delivery" },
];
export default function SupportPage() {
  return <div className="container-site py-12 md:py-16">
    <p className="ms-eyebrow">Here to help</p>
    <h1 className="mt-4 text-4xl tracking-tight md:text-6xl">A little support.</h1>
    <p className="mt-4 max-w-xl text-lg text-muted">Find an answer or the right person to help.</p>
    <div className="mt-10 max-w-3xl">{links.map(item => <Link key={item.href} href={item.href} className="group flex items-center justify-between gap-6 border-t border-border py-7">
      <div><h2 className="text-xl font-semibold group-hover:underline">{item.title}</h2><p className="mt-2 text-muted">{item.text}</p></div><span aria-hidden>↗</span>
    </Link>)}</div>
  </div>;
}