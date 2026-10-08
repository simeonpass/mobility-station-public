"use client";

import { useEffect, type RefObject } from "react";

const activeDialogs: HTMLElement[] = [];
let previousBodyOverflow = "";

/** Keep keyboard focus inside an open dialog and return it to the trigger. */
export function useDialogFocus(open: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const panel = ref.current;
    if (!open || !panel) return;
    const previous = document.activeElement;
    if (activeDialogs.length === 0) previousBodyOverflow = document.body.style.overflow;
    activeDialogs.push(panel);
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0 && !element.closest('[hidden], [aria-hidden="true"]'));
    const frame = requestAnimationFrame(() => (focusable()[0] ?? panel).focus({ preventScroll: true }));
    function trap(event: KeyboardEvent) {
      if (event.key !== "Tab" || activeDialogs.at(-1) !== panel) return;
      const controls = focusable();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) {
        event.preventDefault();
        panel?.focus();
      } else if (!panel?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", trap);
    return () => {
      const index = activeDialogs.indexOf(panel);
      if (index !== -1) activeDialogs.splice(index, 1);
      if (activeDialogs.length === 0) document.body.style.overflow = previousBodyOverflow;
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", trap);
      if (previous instanceof HTMLElement && previous.isConnected &&
          (panel.contains(document.activeElement) || document.activeElement === document.body)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [open, ref]);
}
