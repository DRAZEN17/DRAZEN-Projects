import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Returns the shared gsap instance. GSAP is now a real npm dependency
 * (bundled, no CDN round-trip, no global `window.gsap` dependency), so this
 * hook is mostly a thin convenience wrapper that exposes `gsap` plus a
 * context ref scoped to the calling component for easy cleanup.
 */
export default function useGsap() {
  return gsap;
}

/**
 * Scopes a gsap.context() to a container ref and reverts all tweens/timelines
 * created inside `callback` when the component unmounts or deps change.
 * Pass a ref to the element that contains everything you're animating.
 */
export function useGsapEffect(callback, deps, scopeRef) {
  const ctxRef = useRef(null);

  useEffect(() => {
    if (scopeRef && !scopeRef.current) return undefined;

    ctxRef.current = gsap.context(() => {
      callback(gsap);
    }, scopeRef?.current ?? undefined);

    return () => ctxRef.current?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
