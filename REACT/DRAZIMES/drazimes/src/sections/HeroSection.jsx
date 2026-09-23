import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import ProductImage from "../components/ProductImage";
import Icon from "../components/Icon";
import { useProducts } from "../context/ProductsContext";

gsap.registerPlugin(SplitText, ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const artRef = useRef(null);
  const { products, loading } = useProducts();

  // An exquisite real piece for the hero — prefer a highly-rated dress,
  // falling back to whatever's loaded if dresses aren't available.
  const heroProduct = useMemo(() => {
    if (!products.length) return null;
    const dresses = products.filter((p) => p.category === "dresses");
    const pool = dresses.length ? dresses : products;
    return [...pool].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
  }, [products]);

  useGSAP(
    () => {
      const split = new SplitText(".hero-title", { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.02,
      });
      gsap.from(".hero-sub, .hero-cta", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.6,
      });
      gsap.from(".hero-art", {
        opacity: 0,
        scale: 0.94,
        duration: 1.4,
        ease: "power3.out",
      });

      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
      }).to(artRef.current, { y: 120, scale: 1.06, ease: "none" }, 0);

      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [loading] }
  );

  return (
    <section ref={sectionRef} className="hero-section">
      <div ref={artRef} className="hero-art absolute inset-0">
        {heroProduct && (
          <ProductImage
            src={heroProduct.thumbnail}
            alt={heroProduct.title}
            category={heroProduct.category}
            className="w-full h-full"
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      </div>

      <div className="hero-copy">
        <h1 className="hero-title">
          Luxury Fashion
          <br />& Accessories
        </h1>
        <p className="hero-sub">
          Considered outerwear, knitwear, and fine jewelry — made to be worn
          for years, not seasons.
        </p>
        <Link to="/shop" className="hero-cta btn-solid w-fit mt-8">
          Explore Collection
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
