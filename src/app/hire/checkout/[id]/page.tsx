import { HireCheckoutClient } from "@/components/hire/hire-checkout-client";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Complete your hire booking",
  description:
    "Confirm fulfilment details and sign your hire agreement. We’ll take payment when we confirm your booking.",
  path: "/hire/checkout",
});

type Props = { params: Promise<{ id: string }> };

export default async function HireCheckoutPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="container-site py-10 md:py-14">
      <HireCheckoutClient bookingId={id} />
    </div>
  );
}
