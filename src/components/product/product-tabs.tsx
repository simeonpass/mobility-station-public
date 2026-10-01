import type { ReactNode } from "react";

type ProductSection = { id: string; title: string; content: ReactNode };

export function ProductTabs({ sections, isAdaptation }: {
  sections: ProductSection[];
  isAdaptation: boolean;
}) {
  if (!sections.length) return null;

  const video = sections.find((section) => section.id === "video");
  const information = sections.filter((section) => section.id !== "video");
  const order = isAdaptation
    ? ["suitability", "features", "fitting", "specs", "description", "reviews", "buying"]
    : ["features", "specs", "description", "buying", "suitability", "reviews", "fitting"];
  const ordered = [...information].sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );

  return (
    <section className={`ms-product-information ${isAdaptation ? "ms-product-information-adaptation" : "ms-product-information-mobility"}`} aria-labelledby="product-information-title">
      <div className="ms-product-information-heading">
        <p className="ms-eyebrow">{isAdaptation ? "The right fit for your vehicle" : "Make the right choice"}</p>
        <h2 id="product-information-title">{isAdaptation ? "How it works, from first check to fitting." : "A closer look at this product."}</h2>
        <p>{isAdaptation
          ? "Explore suitability, fitting and technical details before speaking with our specialists."
          : "See the features, measurements and practical information in one place."}</p>
      </div>

      {video ? (
        <div className="ms-product-featured-video" id="product-info-video">
          <div>
            <p className="ms-eyebrow">Product film</p>
            <h3>See it in action</h3>
            <p>{isAdaptation
              ? "See how this adaptation works before discussing compatibility and fitting with our team."
              : "Get a closer look at the product before making your choice."}</p>
          </div>
          <div className="ms-product-featured-video-frame">{video.content}</div>
        </div>
      ) : null}

      {ordered.length > 1 ? (
        <nav className="ms-product-information-nav" aria-label="On this product page">
          <span>Explore details</span>
          {ordered.map((section) => (
            <a key={section.id} href={`#product-info-${section.id}`}>{section.title}</a>
          ))}
        </nav>
      ) : null}

      <div className="ms-product-information-grid">
        {ordered.map((section) => (
          <section className={`ms-product-information-card ms-product-information-card-${section.id}`} key={section.id} id={`product-info-${section.id}`} aria-labelledby={`product-info-title-${section.id}`}>
            <h3 id={`product-info-title-${section.id}`}>{section.title}</h3>
            <div className="ms-product-information-content">{section.content}</div>
          </section>
        ))}
      </div>
    </section>
  );
}
