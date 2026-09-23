import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Icon from "./Icon";
import { navCategories } from "../constants";
import { useCart } from "../context/CartContext";
import { useFocusTrap } from "../hooks/useFocusTrap";

const genders = ["Women", "Men"];

const MenuOverlay = () => {
  const { isMenuOpen, closeMenu } = useCart();
  const [activeGender, setActiveGender] = useState("Women");
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const rowsRef = useRef([]);

  useFocusTrap(isMenuOpen, overlayRef, closeMenu);

  // Same reasoning as CartDrawer: initial state is set via GSAP itself so
  // React's reconciliation of a static inline style object never fights
  // with GSAP's direct DOM manipulation mid-animation.
  useGSAP(
    () => {
      gsap.set(overlayRef.current, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" });
    },
    { dependencies: [] }
  );

  useGSAP(
    () => {
      if (isMenuOpen) {
        gsap.set(overlayRef.current, { autoAlpha: 1 });
        gsap.fromTo(
          overlayRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power4.inOut" }
        );
        gsap.fromTo(
          rowsRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, delay: 0.25, ease: "power2.out" }
        );
      } else {
        gsap.to(overlayRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => gsap.set(overlayRef.current, { autoAlpha: 0 }),
        });
      }
    },
    { dependencies: [isMenuOpen] }
  );

  const goToCategory = (slug) => {
    closeMenu();
    navigate(`/shop?category=${slug}&gender=${activeGender.toLowerCase()}`);
  };

  return (
    <div ref={overlayRef} className="menu-overlay" aria-hidden={!isMenuOpen}>
      <div className="menu-header">
        <span className="logo-mark">
          DRAZIME&apos;S<span className="text-rust">.</span>
        </span>
        <button type="button" aria-label="Close menu" onClick={closeMenu} className="icon-btn">
          <Icon name="close" />
        </button>
      </div>

      <div className="menu-gender-tabs">
        {genders.map((g) => (
          <button
            key={g}
            type="button"
            className={activeGender === g ? "active" : ""}
            onClick={() => setActiveGender(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="menu-scroll">
        {navCategories.map((cat, i) => (
          <button
            key={cat.slug}
            ref={(el) => (rowsRef.current[i] = el)}
            type="button"
            className="menu-row"
            onClick={() => goToCategory(cat.slug)}
          >
            {cat.label}
            <Icon name="chevronRight" className="size-4 text-taupe" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuOverlay;
