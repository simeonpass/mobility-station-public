import { SimpleHirePage } from "@/components/hire/simple-hire-page";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Monthly Scooter & Wheelchair Hire", description: "Monthly scooter and wheelchair hire with servicing, batteries and breakdown support. Three-month minimum, then monthly. View your price and book online.", path: "/hire/flex" });
export default function FlexHirePage() { return <SimpleHirePage mode="flex" />; }
