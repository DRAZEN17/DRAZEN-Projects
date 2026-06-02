import { useEffect, useState } from 'react';
import { testimonialsService } from '../../services/content.js';
import { useGsap } from '../../hooks/useGsap.js';
import { fadeUpOnScroll } from '../../utils/animations.js';

export default function Testimonials() {
  const [items, setItems] = useState([]);
  useEffect(() => { testimonialsService.list().then((r) => setItems(r.data || [])).catch(() => {}); }, []);
  const ref = useGsap((root) => fadeUpOnScroll(root.querySelectorAll('.fade-up')), [items.length]);

  return (
    <section ref={ref} className="section">
      <p className="eyebrow fade-up">Testimonials</p>
      <h2 className="h2 mt-4 fade-up">Trusted by people who ship.</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {items.map((t) => (
          <figure key={t._id} className="glass p-6 fade-up">
            <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
            <figcaption className="mt-6 text-sm text-muted">
              <span className="text-white">{t.name}</span> · {t.role}{t.company ? `, ${t.company}` : ''}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
