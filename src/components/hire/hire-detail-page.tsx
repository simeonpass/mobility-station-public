import Link from "next/link";
import { HireSelfServeForm } from "@/components/hire/hire-self-serve-form";
import { getHireCategoryImages } from "@/lib/hire-images";
import { FLEX_FAQS, SHORT_TERM_FAQS, FLEX_SETUP_FEE_GBP, LOCAL_DELIVERY_FEE_GBP, WIDER_DELIVERY_FROM_GBP, type HirePricingCategoryId } from "@/lib/hire-pricing";
import { formatGBP } from "@/lib/products";
import { SITE } from "@/lib/seo";

export async function HireDetailPage({ mode }: { mode: "short" | "flex" }) {
  const flex = mode === "flex";
  const imageList = await getHireCategoryImages();
  const images = Object.fromEntries(imageList.map(image => [image.id, { src: image.src, alt: image.alt }])) as Record<HirePricingCategoryId, { src: string | null; alt: string }>;
  const faqs = flex ? FLEX_FAQS : SHORT_TERM_FAQS;
  return <div className="container-site py-10 md:py-12">
    <nav aria-label="Hire navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
      <Link href="/hire" className="text-muted">Hire</Link>
      <Link href="/hire/short-term" aria-current={!flex ? "page" : undefined} className={!flex ? "font-semibold underline underline-offset-4" : "text-muted"}>Short-term</Link>
      <Link href="/hire/flex" aria-current={flex ? "page" : undefined} className={flex ? "font-semibold underline underline-offset-4" : "text-muted"}>Flex monthly</Link>
    </nav>
    <div className="mt-7 grid gap-5 md:grid-cols-[1fr_0.9fr] md:gap-12">
      <div><p className="ms-eyebrow">{flex ? "Three months or more" : "Three days to four weeks"}</p><h1 className="mt-3 text-4xl tracking-tight md:text-5xl">{flex ? "Flex monthly hire." : "Short-term hire."}</h1><p className="mt-4 text-muted">{flex ? "Keep moving without buying outright. Servicing, batteries and breakdown support included." : "A scooter or wheelchair for a holiday, recovery or a few days away."}</p></div>
      <div className="self-center border-l-2 border-accent pl-6 text-sm leading-relaxed text-muted">
        <p>{flex ? "First month + " + formatGBP(FLEX_SETUP_FEE_GBP) + " set-up, then pay monthly in advance. Minimum three months." : "Hire charge + £100 refundable deposit. Free collection from Heathrow or Ferndown."}</p>
        <p className="mt-2">{flex ? "Delivery and handover are included in set-up." : "Delivery is £45 within 15 miles or £95 for 15–40 miles, before VAT."}</p>
        <p className="mt-3">Choose equipment below to see your price. <a href={SITE.phoneHref} className="font-semibold text-primary underline">{SITE.phone}</a></p>
      </div>
    </div>
    <section id="book" aria-label="Arrange your hire" className="scroll-mt-28 mt-9 border-t border-border pt-7">
      <div id="prices" className="scroll-mt-28"><HireSelfServeForm defaultHireType={mode} lockHireType images={images} /></div>
    </section>
    <details className="mt-10 border-t border-border py-5">
      <summary className="cursor-pointer text-lg font-semibold">Good to know before you hire</summary>
      <div className="mt-4 grid gap-x-10 md:grid-cols-2">{faqs.map(faq => <details key={faq.q} className="border-t border-border py-4"><summary className="cursor-pointer font-medium">{faq.q}</summary><p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p></details>)}</div>
      <p className="mt-5 text-sm text-muted">{!flex && <>Delivery: {formatGBP(LOCAL_DELIVERY_FEE_GBP)} within 15 miles or {formatGBP(WIDER_DELIVERY_FROM_GBP)} for 15–40 miles before VAT. </>}<Link href="/hire/terms" className="font-semibold text-primary underline">Read the hire terms</Link>.</p>
    </details>
  </div>;
}
