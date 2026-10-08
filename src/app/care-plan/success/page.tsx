import { CarePlanSuccessClient } from "@/components/care-plans/care-plan-success-client";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Care Plan confirmation",
  description: "Your Mobility Station Care Plan payment confirmation.",
  path: "/care-plan/success",
  noIndex: true,
});

type Props = {
  searchParams: Promise<{
    sid?: string;
    session_id?: string;
    sessionId?: string;
  }>;
};

export default async function CarePlanSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId =
    params.sid?.trim() ||
    params.session_id?.trim() ||
    params.sessionId?.trim() ||
    null;

  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container-site">
        <CarePlanSuccessClient sessionId={sessionId} />
      </div>
    </section>
  );
}
