import { useEffect, useRef } from 'react';
import { gsap } from '../utils/animations.js';

export function useGsap(callback, deps = []) {
  const scopeRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => callback(scopeRef.current), scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scopeRef;
}
