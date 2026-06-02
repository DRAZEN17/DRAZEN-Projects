import Timeline from '../../components/Timeline.jsx';
import { useGsap } from '../../hooks/useGsap.js';
import { fadeUpOnScroll } from '../../utils/animations.js';

const items = [
  { period: '2024 — Present', title: 'Small-time dev', company: 'Independent', description: 'Designing and shipping  product experiences for startups.' },
];

export default function Experience() {
  const ref = useGsap((root) => fadeUpOnScroll(root.querySelectorAll('.fade-up')));
  return (
    <section ref={ref} className="section">
      <p className="eyebrow fade-up">Experience</p>
      <h2 className="h2 mt-4 fade-up"> Years of building.</h2>
      <div className="mt-12 fade-up">
        <Timeline items={items} />
      </div>
    </section>
  );
}
