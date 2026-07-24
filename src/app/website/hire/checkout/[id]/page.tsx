import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

/** DNA returns non-production origins to /website/hire/checkout/:id */
export default async function WebsiteHireCheckoutRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/hire/checkout/${id}`);
}
