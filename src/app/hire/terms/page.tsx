import Link from "next/link";
import { HIRE_TERMS, HIRE_TERMS_VERSION } from "@/lib/hire-terms";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Hire terms & conditions",
  description:
    "Mobility Station short-term and Flex Hire terms — deposits, delivery, Flex zone, cancellation and your responsibilities.",
  path: "/hire/terms",
});

export default function HireTermsPage() {
  return (
    <div className="container-site py-12 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        Hire agreement · {HIRE_TERMS_VERSION}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
        Hire terms &amp; conditions
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        These terms apply to short-term hire and Flex Hire. You also accept them
        when you sign at checkout.
      </p>

      <div className="mt-10 max-w-3xl space-y-8">
        {HIRE_TERMS.map((term) => (
          <section key={term.heading}>
            <h2 className="text-lg font-bold text-primary">{term.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {term.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted">
        <Link href="/hire" className="font-semibold text-primary underline">
          ← Back to hire
        </Link>
        {" · "}
        <Link href="/privacy-policy" className="font-semibold text-primary underline">
          Privacy policy
        </Link>
      </p>
    </div>
  );
}
