import { Helmet } from 'react-helmet-async';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Skills from './sections/Skills.jsx';
import FeaturedProjects from './sections/FeaturedProjects.jsx';
import Experience from './sections/Experience.jsx';
import Testimonials from './sections/Testimonials.jsx';
import CTA from './sections/CTA.jsx';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>DRAZEN Portfolio</title>
        <meta name="description" content="Premium developer portfolio with GSAP-powered animations." />
      </Helmet>
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <Experience />
      <Testimonials />
      <CTA />
    </>
  );
}
