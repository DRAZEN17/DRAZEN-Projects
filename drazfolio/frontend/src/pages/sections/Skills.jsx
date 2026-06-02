import SkillBar from '../../components/SkillBar.jsx';
import { useGsap } from '../../hooks/useGsap.js';
import { fadeUpOnScroll } from '../../utils/animations.js';

const skills = [
  { name: 'React / TypeScript', value: 96 },
  { name: 'Node.js / Express', value: 92 },
  { name: 'MongoDB / Postgres', value: 88 },
  { name: 'GSAP / Motion Design', value: 94 },
  { name: 'Three.js / WebGL', value: 78 },
  { name: 'Design Systems', value: 90 },
];

export default function Skills() {
  const ref = useGsap((root) => fadeUpOnScroll(root.querySelectorAll('.fade-up')));
  return (
    <section ref={ref} className="section">
      <p className="eyebrow fade-up">Skills</p>
      <h2 className="h2 mt-4 fade-up">Technical fluency across the stack.</h2>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-12">
        {skills.map((s) => (
          <div key={s.name} className="fade-up"><SkillBar {...s} /></div>
        ))}
      </div>
    </section>
  );
}
