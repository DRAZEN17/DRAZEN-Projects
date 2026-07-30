import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab focus inside `containerRef` while `active` is true — moves
 * focus into the panel on open, cycles Tab/Shift+Tab within it, calls
 * `onClose` on Escape, and restores focus to whatever triggered it once
 * it closes. Used by the cart drawer, menu overlay, and image lightbox —
 * anything that covers the page and shouldn't leak keyboard focus to
 * content behind it.
 */
export const useFocusTrap = (active, containerRef, onClose) => {
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!active) return;

    previousFocus.current = document.activeElement;
    const container = containerRef.current;

    const focusables = () =>
      Array.from(container?.querySelectorAll(FOCUSABLE_SELECTOR) ?? []).filter(
        (el) => el.offsetParent !== null
      );

    focusables()[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [active, containerRef, onClose]);
};
