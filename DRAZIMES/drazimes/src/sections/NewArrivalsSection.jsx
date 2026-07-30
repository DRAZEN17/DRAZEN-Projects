import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import RevealTag from "../components/RevealTag";
import Icon from "../components/Icon";
import { quickFilters, CLOTHING_CATEGORIES } from "../constants";
import { useProducts } from "../context/ProductsContext";

const matchesFilter = (product, filter) => {
  if (filter === "all") return true;
  if (filter === "clothing") return CLOTHING_CATEGORIES.includes(product.category);
  return product.category === filter;
};

const NewArrivalsSection = () => {
  const [active, setActive] = useState("all");
  const { products, loading } = useProducts();

  const items = useMemo(
    () => products.filter((p) => matchesFilter(p, active)).slice(0, 8),
    [products, active]
  );

  return (
    <section>
      <div className="section-heading">
        <div>
          <RevealTag>New In</RevealTag>
          <h2 className="mt-4">New Arrivals</h2>
        </div>
      </div>

      <div className="filter-tabs">
        {quickFilters.map((f) => (
          <button
            key={f.slug}
            type="button"
            className={active === f.slug ? "active" : ""}
            onClick={() => setActive(f.slug)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card animate-pulse">
              <div className="product-frame" />
              <div className="h-3 w-2/3 bg-sand rounded mt-3" />
              <div className="h-3 w-1/3 bg-sand rounded mt-2" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-taupe md:px-10 px-5">No products in this filter yet.</p>
      )}

      <div className="flex-center mt-12">
        <Link to="/shop" className="btn-outline">
          Explore More
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
