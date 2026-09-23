import { useMemo, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import RevealTag from "../components/RevealTag";
import { useProducts } from "../context/ProductsContext";

const JustForYouSection = () => {
  const { products, loading } = useProducts();
  const rowRef = useRef(null);
  const [active, setActive] = useState(0);

  const items = useMemo(() => products.slice(8, 14), [products]);
  const dotCount = Math.max(items.length - 2, 1);

  const onScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const ratio = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setActive(Math.min(dotCount - 1, Math.round(ratio * (dotCount - 1))));
  };

  if (!loading && items.length === 0) return null;

  return (
    <section>
      <div className="section-heading">
        <div>
          <RevealTag>Handpicked</RevealTag>
          <h2 className="mt-4">Just For You</h2>
        </div>
      </div>

      {loading ? (
        <div className="carousel-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="product-card animate-pulse">
              <div className="product-frame" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div ref={rowRef} onScroll={onScroll} className="carousel-row">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="carousel-dots">
            {Array.from({ length: dotCount }).map((_, i) => (
              <span key={i} className={i === active ? "active" : ""} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default JustForYouSection;
