import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../utils/animations.js';
import { projectsService } from '../../services/content.js';
import ProjectCard from '../../components/ProjectCard.jsx';

export default function FeaturedProjects() {
  const [items, setItems] = useState([]);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    projectsService.list({ limit: 8 }).then((r) => setItems(r.data || [])).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!items.length || window.innerWidth < 1024) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const distance = track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, [items]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="section !py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2 className="h2 mt-4 max-w-2xl">Projects engineered with intent.</h2>
          </div>
          <Link to="/projects" className="hidden md:inline text-neon-cyan hover:underline font-mono text-sm">All projects →</Link>
        </div>
      </div>
      <div ref={trackRef} className="flex gap-8 px-10 pb-32 will-change-transform">
        {items.map((p) => (
          <div key={p._id} className="w-[85vw] md:w-[520px] shrink-0">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
