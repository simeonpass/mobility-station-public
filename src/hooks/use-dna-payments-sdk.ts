"use client";

import { useEffect, useState } from "react";
import { loadDnaPaymentsSdk } from "@/lib/dna-payments";

export function useDnaPaymentsSdk() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadDnaPaymentsSdk()
      .then(() => {
        if (!cancelled) {
          setReady(true);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false);
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, failed };
}
