"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Hidden fields that real users never see or fill.
 * - website: classic honeypot (bots auto-fill)
 * - form_started_at: used server-side to reject instant POSTs
 */
export function FormSpamTraps() {
  const startedRef = useRef<HTMLInputElement>(null);
  const honeypotId = useId();

  useEffect(() => {
    if (startedRef.current) {
      startedRef.current.value = String(Date.now());
    }
  }, []);

  return (
    <>
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor={honeypotId}>Website</label>
        <input
          id={honeypotId}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input
        ref={startedRef}
        type="hidden"
        name="form_started_at"
        defaultValue=""
      />
    </>
  );
}
