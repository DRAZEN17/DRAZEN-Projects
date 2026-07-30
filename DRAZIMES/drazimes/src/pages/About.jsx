import { useRef } from "react";
import RevealTag from "../components/RevealTag";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import { footerFeatures } from "../constants";
import { useScrollReveal } from "../hooks/useScrollReveal";

const About = () => {
  const rootRef = useRef(null);
  useScrollReveal(rootRef);

  return (
    <div ref={rootRef}>
      <div className="md:pt-40 pt-24 md:px-10 px-5 md:pb-20 pb-12 max-w-3xl">
        <RevealTag>Our Story</RevealTag>
        <h1 className="font-display italic md:text-5xl text-3xl text-ink mt-5">
          A considered wardrobe, made to last.
        </h1>
        <p className="font-sans text-ink-soft mt-6 leading-relaxed fade-up">
          DRAZIME&apos;S was founded on a simple idea: that fewer, better pieces beat
          a closet full of things you don&apos;t reach for. We work with small
          ateliers and monitored mills to make outerwear, knitwear, and fine
          jewelry that holds up to years of wear — not just a season of it.
        </p>
        <p className="font-sans text-ink-soft mt-4 leading-relaxed fade-up">
          Every piece in our catalogue is chosen for material quality first,
          silhouette second, and trend a distant third. It&apos;s a slower way
          to shop, and we think it&apos;s the better one.
        </p>
      </div>

      <div className="footer-features md:px-10 px-5 md:pb-24 pb-16 max-w-3xl fade-up">
        {footerFeatures.map((f) => (
          <div key={f.title} className="feature">
            <Icon name={f.icon} className="size-6 text-ink" />
            <p className="font-sans text-sm text-ink-soft mt-3 max-w-[26ch]">
              {f.title}. {f.description}
            </p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default About;
