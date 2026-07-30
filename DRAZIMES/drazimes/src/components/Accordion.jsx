import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Icon from "./Icon";

const AccordionItem = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef(null);
  const iconRef = useRef(null);

  // Same reasoning as CartDrawer/MenuOverlay: a static inline style tied to
  // the defaultOpen *prop* (which never changes) would get reconciled by
  // React on any unrelated re-render of this page and reset the panel back
  // to its default height, even after the user has toggled it open. GSAP
  // sets the real initial height once on mount instead.
  useGSAP(
    () => {
      gsap.set(panelRef.current, { height: defaultOpen ? "auto" : 0 });
    },
    { dependencies: [] }
  );

  useGSAP(
    () => {
      if (!panelRef.current) return;
      gsap.to(panelRef.current, {
        height: open ? "auto" : 0,
        duration: 0.45,
        ease: "power2.inOut",
      });
      gsap.to(iconRef.current, {
        rotate: open ? 180 : 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
    },
    { dependencies: [open] }
  );

  return (
    <div className="accordion-item">
      <button type="button" className="accordion-trigger" onClick={() => setOpen((o) => !o)}>
        {title}
        <span ref={iconRef} className="inline-flex">
          <Icon name="chevronDown" className="size-4" />
        </span>
      </button>
      <div ref={panelRef} className="accordion-panel">
        <div className="pb-5">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
