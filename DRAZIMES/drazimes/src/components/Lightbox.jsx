import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import { useFocusTrap } from "../hooks/useFocusTrap";

/**
 * Full-screen click-to-enlarge view of the product gallery. Follows the
 * same GSAP-owns-the-state pattern as CartDrawer/MenuOverlay (autoAlpha
 * set via gsap.set on mount, never a static inline style) so an unrelated
 * re-render can't silently reset it mid-animation.
 */
const Lightbox = ({ open, onClose, images, activeIndex, onNavigate, alt, category }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
    },
    { dependencies: [] }
  );

  useGSAP(
    () => {
      if (open) {
        gsap.set(overlayRef.current, { autoAlpha: 1 });
        gsap.fromTo(
          panelRef.current,
          { scale: 0.94, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }
        );
      } else {
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.25, ease: "power2.in" });
      }
    },
    { dependencies: [open] }
  );

  useFocusTrap(open, panelRef, onClose);

  return (
    <div ref={overlayRef} className="lightbox" onClick={onClose} aria-hidden={!open}>
      <div ref={panelRef} className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Close image" onClick={onClose} className="lightbox-close">
          <Icon name="close" />
        </button>

        <ProductImage
          src={images[activeIndex]}
          alt={alt}
          category={category}
          className="w-full h-full"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => onNavigate(-1)}
              className="lightbox-nav lightbox-nav--prev"
            >
              <Icon name="chevronLeft" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => onNavigate(1)}
              className="lightbox-nav lightbox-nav--next"
            >
              <Icon name="chevronRight" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
