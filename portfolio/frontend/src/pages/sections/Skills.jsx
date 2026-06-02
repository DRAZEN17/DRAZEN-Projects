import SkillBar from '../../components/SkillBar.jsx';
import { useGsap } from '../../hooks/useGsap.js';
import { fadeUpOnScroll } from '../../utils/animations.js';

const skills = [
  { name: 'React / javaScript', value: 90 },
  { name: 'Node.js / Express', value: 83 },
  { name: 'MongoDB / Postgres', value: 79 },
  { name: 'GSAP / Motion Design', value: 85 },
  { name: 'Three.js / WebGL', value: 70 },
  { name: 'Design Systems', value: 91 },
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
