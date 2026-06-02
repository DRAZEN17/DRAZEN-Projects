import { useGsap } from '../../hooks/useGsap.js';
import { gsap, revealText } from '../../utils/animations.js';
import MagneticButton from '../../components/MagneticButton.jsx';
import ParticlesBg from '../../components/ParticlesBg.jsx';
import { Link } from 'react-router-dom';

export default function Hero() {
  const ref = useGsap((root) => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    revealText(root.querySelector('.hero-eyebrow'), { duration: 0.6, stagger: 0.015 });
    tl.from(root.querySelector('.hero-title'), { opacity: 0, y: 80, duration: 1.2 }, 0.1)
      .from(root.querySelector('.hero-sub'), { opacity: 0, y: 40, duration: 1 }, '-=0.7')
      .from(root.querySelectorAll('.hero-cta > *'), { opacity: 0, y: 20, stagger: 0.1, duration: 0.7 }, '-=0.6')
      .from(root.querySelector('.hero-grid'), { opacity: 0, scale: 1.05, duration: 1.6 }, 0);
  });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="hero-grid absolute inset-0 bg-grid-cyber [background-size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <ParticlesBg />
      <div className="section pt-40 md:pt-48">
        <p className="hero-eyebrow eyebrow">Independent - Engineer - Designer - developer</p>
        <h1 className="hero-title h1 mt-6">
          Building <span className="neon-text">cinematic</span><br />
          web experiences.
        </h1>
        <p className="hero-sub mt-8 max-w-xl text-lg text-muted">
          A Web Developer crafting fast, beautiful, production-grade products.
          Obsessed with motion, performance, and details that make software feel alive.
        </p>
        <div className="hero-cta mt-10 flex flex-wrap gap-4">
          <MagneticButton as={Link} to="/projects">View Projects</MagneticButton>
          <MagneticButton as={Link} to="/contact" className="!bg-transparent">Get in touch</MagneticButton>
        </div>
      </div>
    </section>
  );
}
