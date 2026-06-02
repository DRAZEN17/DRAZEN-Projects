import { Link } from 'react-router-dom';
import MagneticButton from '../../components/MagneticButton.jsx';

export default function CTA() {
  return (
    <section className="section">
      <div className="glass p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-0 bg-grid-cyber [background-size:36px_36px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <p className="eyebrow">Let's collaborate</p>
        <h2 className="h2 mt-4 max-w-3xl mx-auto">Have a wild idea? Let's make it real.</h2>
        <div className="mt-8 flex justify-center">
          <MagneticButton as={Link} to="/contact">Start a project</MagneticButton>
        </div>
      </div>
    </section>
  );
}
