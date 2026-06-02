import { useGsap } from '../../hooks/useGsap.js';
import { fadeUpOnScroll } from '../../utils/animations.js';

export default function About() {
  const ref = useGsap((root) => {
    fadeUpOnScroll(root.querySelectorAll('.fade-up'));
  });
  return (
    <section ref={ref} id="about" className="section">
      <p className="eyebrow fade-up">About</p>
      <h2 className="h2 mt-4 fade-up max-w-3xl">A developer who treats interfaces like cinema.</h2>
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <p className="md:col-span-2 text-lg text-muted leading-relaxed fade-up">
          I'm a Web developer focused on building digital products that combine engineering rigor
          with cinematic motion design. From real-time dashboards to e-commerce platforms,
          I ship fast, accessible, and visually striking interfaces backed by robust APIs.
        </p>
        <div className="grid grid-cols-2 gap-4 fade-up">
          {[
            ['2+', 'Years building'],
            ['10+', 'Projects shipped'],
            ['+', 'Awwwards-style'],
            ['100%', 'Owned codebase'],
          ].map(([n, l]) => (
            <div key={l} className="glass p-4">
              <div className="font-display text-2xl neon-text">{n}</div>
              <div className="text-xs text-muted mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
