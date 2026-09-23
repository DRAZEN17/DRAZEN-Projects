import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Icon from "./Icon";

const AccordionItem = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef(null);
  const iconRef = useRef(null);

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
