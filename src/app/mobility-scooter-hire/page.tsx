import { redirect } from "next/navigation";

/** Legacy URL — unified hire hub is /hire (short-term + Flex). */
export default function MobilityScooterHireRedirectPage() {
  redirect("/hire");
}
