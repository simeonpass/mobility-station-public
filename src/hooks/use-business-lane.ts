"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  isBusinessLane,
  laneFromPathname,
  readBusinessLane,
  writeBusinessLane,
  type BusinessLane,
} from "@/lib/business-lane";

/**
 * Active business lane: path wins when you're in a clear section,
 * otherwise the choice saved from the homepage doors.
 */
export function useBusinessLane(): BusinessLane | null {
  const pathname = usePathname();
  const [lane, setLane] = useState<BusinessLane | null>(null);

  useEffect(() => {
    const fromPath = laneFromPathname(pathname);
    if (fromPath) {
      writeBusinessLane(fromPath);
      setLane(fromPath);
      return;
    }

    setLane(readBusinessLane());

    function onLaneEvent(event: Event) {
      const detail = (event as CustomEvent<unknown>).detail;
      if (detail === null) {
        setLane(null);
        return;
      }
      if (typeof detail === "string" && isBusinessLane(detail)) {
        setLane(detail);
      }
    }

    window.addEventListener("ms-business-lane", onLaneEvent);
    return () => window.removeEventListener("ms-business-lane", onLaneEvent);
  }, [pathname]);

  return lane;
}
