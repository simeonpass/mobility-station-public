import { HIRE_FAQS } from "@/lib/hire-pricing";

export function HireFaq() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
        Hire FAQ
      </h2>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {HIRE_FAQS.map((faq) => (
          <details key={faq.q} className="group py-4">
            <summary className="cursor-pointer list-none text-base font-bold text-primary marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {faq.q}
                <span
                  className="mt-0.5 text-muted transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
