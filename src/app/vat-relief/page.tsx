import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { VAT_DECLARATION } from "@/lib/cart";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createMetadata({
  title: "VAT Relief on Mobility Products",
  description:
    "Save 20% with VAT relief on mobility scooters, wheelchairs and daily living aids. Check if you qualify and how to claim at checkout.",
  path: "/vat-relief",
});

const qualifyingConditions = [
  "A physical disability",
  "A chronic illness or condition",
  "A mental health condition",
  "A terminal illness",
  "Blindness or partial sight",
  "Deafness or hearing impairment",
  "A learning disability",
  "Mobility impairment",
];

const faqs = [
  {
    q: "What products qualify for VAT relief?",
    a: "Products designed to assist with a disability or chronic condition qualify, including mobility scooters, powered and manual wheelchairs, vehicle adaptations, and related accessories. Batteries and chargers qualify when collected and fitted at our workshop.",
  },
  {
    q: "Do I need proof of my disability?",
    a: "No. You do not need to provide medical evidence at purchase. You sign a declaration confirming you have a qualifying condition. HMRC may request evidence later.",
  },
  {
    q: "Can I claim VAT relief on behalf of someone else?",
    a: "Yes. If you are purchasing for a disabled person (for example, a family member or carer), the product can still qualify as long as it is for their personal use.",
  },
  {
    q: "What happens if I'm not eligible?",
    a: "If you do not have a qualifying condition, VAT is charged at the standard rate of 20%. Falsely claiming VAT relief is a criminal offence.",
  },
  {
    q: "How does it work at checkout?",
    a: "Tick the VAT exemption box, select the nature of your disability or chronic condition, and confirm the digital declaration. VAT is then removed from your order total.",
  },
  {
    q: "I'm elderly but don't have a disability — do I qualify?",
    a: "No. Being elderly alone does not qualify. You must have a qualifying disability or chronic condition. Age-related conditions that are disabling may qualify.",
  },
];

export default function VatReliefPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqLd)}
      />
      <Hero
        compact
        title="VAT relief on mobility products"
        subtitle="If you have a qualifying disability or chronic condition, you may buy mobility products VAT-free — saving 20%."
      />

      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-4xl space-y-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-primary">
              What is VAT relief?
            </h2>
            <p className="mt-3 text-muted">
              Under the VAT Act 1994, eligible disabled and chronically sick
              people can buy certain goods and services without paying VAT.
              Catalogue prices show the VAT relief (ex VAT) amount, with the
              standard price including 20% VAT shown alongside.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">Who qualifies?</h2>
                <p className="mt-2 text-muted">
                  You are eligible if you have a long-term illness or disability.
                  Qualifying conditions include, but are not limited to:
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {qualifyingConditions.map((c) => (
                    <div
                      key={c}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted">
                  If you&apos;re unsure,{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-primary underline"
                  >
                    contact us
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-center text-2xl font-extrabold text-primary">
              How it works
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Select VAT exemption",
                  desc: "At checkout, tick the box to declare you are eligible for VAT relief.",
                },
                {
                  step: "2",
                  title: "Provide a declaration",
                  desc: "Confirm your qualifying condition and the digital HMRC declaration.",
                },
                {
                  step: "3",
                  title: "Pay the VAT-free price",
                  desc: "VAT is removed from your order total. You pay the net (ex VAT) price.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-border bg-white p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  The declaration
                </h2>
                <blockquote className="mt-4 rounded-r-lg border-l-4 border-accent bg-soft p-4 text-sm italic text-muted">
                  &ldquo;{VAT_DECLARATION}&rdquo;
                </blockquote>
                <p className="mt-3 text-sm text-muted">
                  Required by HMRC. We retain a copy of all VAT exemption
                  declarations.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  Important notice
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Making a false declaration to claim VAT relief is a{" "}
                  <strong>criminal offence</strong> and may result in penalties
                  from HMRC. VAT relief is only for those who genuinely have a
                  qualifying disability or chronic condition.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-center text-2xl font-extrabold text-primary">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-border bg-white p-5"
                >
                  <h3 className="flex items-start gap-2 text-sm font-bold text-primary">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="mt-2 ml-6 text-sm text-muted">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted">
            Browse{" "}
            <Link href="/shop" className="font-semibold text-primary underline">
              scooters &amp; wheelchairs
            </Link>{" "}
            or{" "}
            <Link
              href="/contact?interest=callback#callback"
              className="font-semibold text-primary underline"
            >
              request a callback
            </Link>
            .
          </p>
        </div>
      </section>
      <CtaFooter title="Need help with VAT relief?" />
    </>
  );
}
