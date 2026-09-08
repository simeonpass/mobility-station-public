import { HireDetailPage } from "@/components/hire/hire-detail-page";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = createMetadata({ title: "Short-Term Mobility Scooter & Wheelchair Hire | Mobility Station", description: "Hire a mobility scooter or wheelchair for 3 to 28 days. Book and pay online. Free collection from Heathrow or Ferndown, or delivery available.", path: "/hire/short-term", absoluteTitle: true });
export default function Page() { return <HireDetailPage mode="short" />; }
