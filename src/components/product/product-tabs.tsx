import type { ReactNode } from "react";
import { ArrowDownRight, Play } from "lucide-react";

type Section = { id: string; title: string; content: ReactNode };

/** A visible product story instead of hiding decision-making details in tabs. */
export function ProductTabs({ sections, isAdaptation }: { sections: Section[]; isAdaptation: boolean }) {
  if (!sections.length) return null;
  const find = (id: string) => sections.find((section) => section.id === id);
  const overview = find("description");
  const video = find("video");
  const features = find("features");
  const suitability = find("suitability");
  const specs = find("specs");
  const guide = find(isAdaptation ? "fitting" : "buying");
  const visibleOrder = [
    overview || video ? "overview" : null,
    isAdaptation && suitability ? "suitability" : null,
    features ? "features" : null,
    specs ? "specs" : null,
    !isAdaptation && suitability ? "suitability" : null,
    guide ? "guide" : null,
  ].filter(Boolean);
  const number = (id: string) => String(visibleOrder.indexOf(id) + 1).padStart(2, "0");

  function heading(number: string, label: string, title: string) {
    return <div className="mb-6 flex items-start gap-4 sm:gap-5">
      <span className="font-mono text-sm font-medium text-accent-hover" aria-hidden>{number}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{label}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">{title}</h2>
      </div>
    </div>;
  }

  return <div className="space-y-12 md:space-y-16">
    <div className="border-y border-border py-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-hover">{isAdaptation ? "Vehicle adaptation" : "Mobility equipment"}</p>
        <p className="mt-1 text-xl font-bold tracking-tight text-primary sm:text-2xl">{isAdaptation ? "See how it works and how it is fitted" : "Explore the details before you decide"}</p>
      </div>
      <nav aria-label="On this page" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 sm:mt-0">
        {[
          overview && ["Overview", "overview"],
          video && ["Video", "product-video"],
          specs && ["Specifications", "specifications"],
          guide && [isAdaptation ? "Fitting" : "Delivery", "product-guide"],
        ].filter((item): item is string[] => Boolean(item)).map(([label, id]) =>
          <a key={id} href={`#${id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline decoration-border underline-offset-4 transition-colors hover:text-accent-hover">
            {label}<ArrowDownRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </nav>
    </div>

    {(overview || video) && <section id="overview" className="scroll-mt-28">
      {heading(number("overview"), "The overview", isAdaptation ? "Understand the adaptation" : "Get to know the product")}
      <div className={video && overview ? "grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10" : "max-w-4xl"}>
        {overview && <div className="border-l-2 border-accent pl-5 sm:pl-7">{overview.content}</div>}
        {video && <div id="product-video" className="scroll-mt-28">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><Play className="h-4 w-4 text-accent-hover" aria-hidden />{isAdaptation ? "See the adaptation" : "Watch the product"}</div>
          <div className="overflow-hidden rounded-lg border border-border bg-soft shadow-[0_20px_45px_-35px_rgba(15,44,59,0.45)]">{video.content}</div>
        </div>}
      </div>
    </section>}

    {isAdaptation && suitability && <section id="suitability" className="scroll-mt-28 border-t border-border pt-10">
      {heading(number("suitability"), "The right fit", "Who is it suitable for?")}<div className="max-w-4xl">{suitability.content}</div>
    </section>}
    {features && <section id="features" className="scroll-mt-28 border-t border-border pt-10">
      {heading(number("features"), "At a glance", "Key features")}{features.content}
    </section>}
    {specs && <section id="specifications" className="scroll-mt-28 border-t border-border pt-10">
      {heading(number("specs"), "The detail", "Technical specifications")}<div className="max-w-5xl">{specs.content}</div>
    </section>}
    {!isAdaptation && suitability && <section id="suitability" className="scroll-mt-28 border-t border-border pt-10">
      {heading(number("suitability"), "The right fit", "Who is it suitable for?")}<div className="max-w-4xl">{suitability.content}</div>
    </section>}
    {guide && <section id="product-guide" className="scroll-mt-28 border-t border-border pt-10">
      {heading(number("guide"), isAdaptation ? "From enquiry to fitting" : "After you choose", isAdaptation ? "Fitting & coverage" : "Delivery & buying")}{guide.content}
    </section>}
  </div>;
}
