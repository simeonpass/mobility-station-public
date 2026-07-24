import { FindMyScooterQuiz } from "@/components/product/find-my-scooter-quiz";
import { Hero } from "@/components/sections/hero";
import { getScooterQuizProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Find my scooter",
  description:
    "Answer 3 quick questions and we'll suggest mobility scooters that fit your life.",
  path: "/find-my-scooter",
});

export default async function FindMyScooterPage() {
  let products: Awaited<ReturnType<typeof getScooterQuizProducts>> = [];
  try {
    products = await getScooterQuizProducts();
  } catch (error) {
    console.error("Find my scooter error:", error);
  }

  return (
    <>
      <Hero
        compact
        title="Find my scooter"
        subtitle="Answer 3 quick questions and we'll suggest scooters that fit your life."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <FindMyScooterQuiz products={products} />
        </div>
      </section>
    </>
  );
}
