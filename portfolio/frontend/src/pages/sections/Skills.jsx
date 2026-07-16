import SkillBar from '../../components/SkillBar.jsx';
import { useGsap } from '../../hooks/useGsap.js';
import { fadeUpOnScroll } from '../../utils/animations.js';

const skills = [
  { name: 'React', value: 90 },
  { name: 'Node.js / Express', value: 73 },
  { name: 'MongoDB', value: 65 },
  { name: 'Java', value: 70 },
  { name: 'Python', value: 60 },
  { name: 'HTML/CSS', value: 88 },
  { name: 'UI/UX', value: 92 },
  { name: 'Flutter/Dart', value: 79 },
];

export default function Skills() {
  const ref = useGsap((root) => fadeUpOnScroll(root.querySelectorAll('.fade-up')));
  return (
    <section ref={ref} className="section">
      <p className="eyebrow fade-up">Skills</p>
      <h2 className="h2 mt-4 fade-up">Technical fluency across the stack.</h2>
      <div className="grid md:grid-cols-4 gap-x-12 gap-y-8 mt-12">
        {skills.map((s) => (
          <div key={s.name} className="fade-up"><SkillBar {...s} /></div>
        ))}
      </div>
    </section>
  );
}
