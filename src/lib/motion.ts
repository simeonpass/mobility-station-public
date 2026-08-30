/** Motion-style easing: fast start, long settle. */
export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const MOTION_MS = 420;
export const MOTION_TRANSITION = `transform ${MOTION_MS}ms ${EASE_OUT}`;
export const FADE_TRANSITION = `opacity ${MOTION_MS}ms ${EASE_OUT}`;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
