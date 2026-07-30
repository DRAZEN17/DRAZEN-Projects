import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared scroll-in motion for every page: the RevealTag clip-path unfurl,
 * a generic fade-up utility (`.fade-up`), and a staggered entrance for
 * product grids. Call once per page with a ref scoping it to that page's
 * root element so GSAP's context cleans up correctly on route change.
 */
export const useScrollReveal = (scopeRef, deps = []) => {
  useGSAP(
    () => {
      gsap.utils.toArray(".reveal-tag-inner").forEach((el) => {
        gsap.set(el, { clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)" });
        gsap.to(el, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray(".fade-up").forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      gsap.utils.toArray(".product-grid, .carousel-row").forEach((grid) => {
        ScrollTrigger.batch(grid.querySelectorAll(".product-card"), {
          start: "top 92%",
          onEnter: (batch) =>
            gsap.from(batch, {
              y: 28,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out",
              overwrite: true,
            }),
          once: true,
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: scopeRef, dependencies: deps, revertOnUpdate: true }
  );
};
