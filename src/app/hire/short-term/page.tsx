import { SimpleHirePage } from "@/components/hire/simple-hire-page";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Short-term Scooter & Wheelchair Hire", description: "Book a mobility scooter or wheelchair for 3–28 days. Choose your dates, see your total and pay online. Heathrow and Ferndown collection or local delivery.", path: "/hire/short-term" });
export default function ShortTermHirePage() { return <SimpleHirePage mode="short" />; }
