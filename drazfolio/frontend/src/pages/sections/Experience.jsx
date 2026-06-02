import Timeline from '../../components/Timeline.jsx';
import { useGsap } from '../../hooks/useGsap.js';
import { fadeUpOnScroll } from '../../utils/animations.js';

const items = [
  { period: '2023 — Present', title: 'Senior Engineer', company: 'Independent', description: 'Designing and shipping award-grade product experiences for startups and labs.' },
  { period: '2021 — 2023', title: 'Lead Frontend', company: 'Lumen Labs', description: 'Led design system and animation engine across 6 product surfaces.' },
  { period: '2018 — 2021', title: 'Full-stack Engineer', company: 'Orbit', description: 'Built realtime dashboards and ecommerce backends with Node + Mongo.' },
];

export default function Experience() {
  const ref = useGsap((root) => fadeUpOnScroll(root.querySelectorAll('.fade-up')));
  return (
    <section ref={ref} className="section">
      <p className="eyebrow fade-up">Experience</p>
      <h2 className="h2 mt-4 fade-up">A decade of building.</h2>
      <div className="mt-12 fade-up">
        <Timeline items={items} />
      </div>
    </section>
  );
}
