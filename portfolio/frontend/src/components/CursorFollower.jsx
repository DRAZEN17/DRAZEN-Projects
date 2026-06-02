import { useEffect, useRef } from 'react';
import { gsap } from '../utils/animations.js';

export default function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = dotRef.current, ring = ringRef.current;
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.1 });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.1 });
    const onMove = (e) => { xTo(e.clientX); yTo(e.clientY); xDot(e.clientX); yDot(e.clientY); };
    const onOver = (e) => {
      const interactive = e.target.closest('a, button, [data-magnetic]');
      gsap.to(ring, { scale: interactive ? 1.8 : 1, duration: 0.3 });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="pointer-events-none fixed top-0 left-0 z-[100] -ml-5 -mt-5 h-10 w-10 rounded-full border border-neon-cyan/60 mix-blend-difference" />
      <div ref={dotRef} className="pointer-events-none fixed top-0 left-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-neon-magenta" />
    </>
  );
}
