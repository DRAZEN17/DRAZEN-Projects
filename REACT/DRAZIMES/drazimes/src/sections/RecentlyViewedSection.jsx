import { useMemo } from "react";
import ProductCard from "../components/ProductCard";
import RevealTag from "../components/RevealTag";
import { useProducts } from "../context/ProductsContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

const RecentlyViewedSection = () => {
  const { ids } = useRecentlyViewed();
  const { products } = useProducts();

  const items = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [ids, products]
  );

  // Nothing viewed yet (first-time visitor) — the whole section stays out
  // of the page rather than showing an empty carousel.
  if (items.length === 0) return null;

  return (
    <section>
      <div className="section-heading">
        <div>
          <RevealTag>Welcome Back</RevealTag>
          <h2 className="mt-4">Recently Viewed</h2>
        </div>
      </div>
      <div className="carousel-row">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
