import { useRef, useState } from "react";
import { Star, Plus, Check, ImageOff } from "lucide-react";
import { useGsapEffect } from "../hooks/useGsap";

export default function ProductCard({ product, addToCart, CATEGORIES }) {
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useGsapEffect(
    (gsap) => {
      const card = cardRef.current;
      if (!card) return;

      const onEnter = () => gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out" });
      const onLeave = () => gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      };
    },
    [],
    cardRef
  );

  const handleAdd = () => {
    addToCart(product);
    setJustAdded(true);
    window.clearTimeout(handleAdd._t);
    handleAdd._t = window.setTimeout(() => setJustAdded(false), 1100);
  };

  const categoryName = CATEGORIES.find((c) => c.id === product.category)?.name;

  return (
    <div
      ref={cardRef}
      className="group bg-paper border border-line hover:border-ink/40 transition-colors duration-300 flex flex-col h-full"
    >
      <div className="relative pt-[75%] bg-paper-dim overflow-hidden border-b border-line">
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 bg-paper-dim animate-pulse" aria-hidden="true" />
        )}
        {imageFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-meta">
            <ImageOff className="w-6 h-6" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-widest">No image on file</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        )}

        <div className="absolute top-3 left-3 bg-ink text-paper font-mono text-[10px] px-2 py-1 tracking-widest">
          № {product.sku}
        </div>
        <div className="absolute top-3 right-3 bg-paper/90 backdrop-blur-sm px-2 py-1 text-xs font-mono font-semibold flex items-center gap-1 border border-line">
          <Star className="w-3 h-3 text-stamp fill-stamp" aria-hidden="true" /> {product.rating}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] text-meta mb-1.5 uppercase tracking-widest font-mono">
          {categoryName}
        </div>
        <h3 className="font-display text-lg mb-2 leading-snug">{product.name}</h3>
        <p className="text-meta text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dotted border-line">
          <span className="font-mono text-lg font-semibold text-ink">${product.price}</span>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`p-2.5 rounded-full transition-all active:scale-90 ${
              justAdded ? "bg-moss text-paper" : "bg-ink text-paper hover:bg-stamp"
            }`}
          >
            {justAdded ? <Check className="w-5 h-5" aria-hidden="true" /> : <Plus className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
