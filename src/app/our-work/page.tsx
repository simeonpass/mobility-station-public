import Link from "next/link";
import { OurWorkGallery } from "@/components/sections/our-work-gallery";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { getPublicPortfolio } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Our recent work",
  description:
    "See real adaptations fitted, scooters delivered and repairs completed by the Mobility Station team across the UK.",
  path: "/our-work",
});

export default async function OurWorkPage() {
  let items: Awaited<ReturnType<typeof getPublicPortfolio>> = [];
  try {
    items = await getPublicPortfolio(96);
  } catch (error) {
    console.error("Portfolio error:", error);
  }

  return (
    <>
      <Hero
        compact
        title="Our recent work"
        subtitle="A gallery of real jobs from our workshop and engineers — adaptations, deliveries and repairs we're proud of."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <OurWorkGallery items={items} />
          <p className="mt-10 text-center text-sm text-muted">
            Prefer written stories?{" "}
            <Link href="/blog" className="font-semibold text-primary underline">
              Visit our blog / portfolio posts
            </Link>
            .
          </p>
        </div>
      </section>
      <CtaFooter title="Like what you see?" />
    </>
  );
}
