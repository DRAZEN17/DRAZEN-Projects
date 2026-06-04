import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { gsap } from '../utils/animations.js';
import { trackProjectClick } from '../services/analytics.js';

export default function ProjectCard({ project }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: px * 12, rotateX: -py * 12, duration: 0.4, ease: 'power3.out', transformPerspective: 800 });
  };
  const onLeave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });

  return (
    <Link
      to={`/projects/${project.slug}`}
      onClick={() => trackProjectClick(project._id)}
      className="group block"
    >
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
           className="glass glass-hover overflow-hidden will-change-transform">
        <div className="aspect-[16/10] overflow-hidden">
          <img src={project.coverImage} alt={project.title} loading="lazy"
               className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-xl">{project.title}</h3>
            <span className="text-neon-cyan text-xs font-mono">→</span>
          </div>
          <p className="text-muted text-sm mt-2 line-clamp-2">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack?.slice(0, 4).map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-white/10 text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
