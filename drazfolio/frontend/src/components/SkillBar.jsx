import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../utils/animations.js';

export default function SkillBar({ name, value }) {
  const fill = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      fill.current,
      { width: 0 },
      {
        width: `${value}%`,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: fill.current, start: 'top 90%' },
      }
    );
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [value]);
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{name}</span>
        <span className="text-muted font-mono">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div ref={fill} className="h-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta" />
      </div>
    </div>
  );
}
