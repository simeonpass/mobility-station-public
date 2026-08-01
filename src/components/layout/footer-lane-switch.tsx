"use client";

import Link from "next/link";
import { useBusinessLane } from "@/hooks/use-business-lane";
import { writeBusinessLane } from "@/lib/business-lane";

export function FooterLaneSwitch() {
  const lane = useBusinessLane();

  if (lane === "adaptations") {
    return (
      <p className="mt-4 text-sm text-white/80">
        Looking for a scooter or wheelchair?{" "}
        <Link
          href="/shop"
          className="font-semibold text-accent-on-dark underline underline-offset-2 hover:text-white"
          onClick={() => writeBusinessLane("mobility")}
        >
          Browse the shop
        </Link>
      </p>
    );
  }

  if (lane === "mobility") {
    return (
      <p className="mt-4 text-sm text-white/80">
        Need your car adapted?{" "}
        <Link
          href="/vehicle-adaptations"
          className="font-semibold text-accent-on-dark underline underline-offset-2 hover:text-white"
          onClick={() => writeBusinessLane("adaptations")}
        >
          Vehicle adaptations
        </Link>
      </p>
    );
  }

  return (
    <p className="mt-4 text-sm text-white/80">
      Two services, one team —{" "}
      <Link href="/vehicle-adaptations" className="underline underline-offset-2 hover:text-accent-on-dark">
        adaptations
      </Link>{" "}
      or{" "}
      <Link href="/shop" className="underline underline-offset-2 hover:text-accent-on-dark">
        scooters &amp; wheelchairs
      </Link>
      .
    </p>
  );
}
