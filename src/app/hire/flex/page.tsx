import { HireDetailPage } from "@/components/hire/hire-detail-page";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = createMetadata({ title: "Flex Monthly Mobility Scooter & Wheelchair Hire | Mobility Station", description: "Flex monthly hire for scooters and wheelchairs. Servicing, batteries and breakdown cover included. Book online from Heathrow and Ferndown.", path: "/hire/flex", absoluteTitle: true });
export default function Page() { return <HireDetailPage mode="flex" />; }
