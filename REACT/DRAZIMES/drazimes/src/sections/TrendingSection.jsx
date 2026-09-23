import { useMemo } from "react";
import ProductCard from "../components/ProductCard";
import RevealTag from "../components/RevealTag";
import { trendingTags } from "../constants";
import { useProducts } from "../context/ProductsContext";

const TrendingSection = () => {
  const { products, loading } = useProducts();

  // Real "trending" signal from real data: the highest-rated items across
  // the whole catalogue, rather than an arbitrary fixed slice.
  const trendingItems = useMemo(
    () => [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4),
    [products]
  );

  return (
    <section>
      <div className="section-heading">
        <div>
          <RevealTag>Talk of the town</RevealTag>
          <h2 className="mt-4">@Trending</h2>
        </div>
      </div>

      {loading ? (
        <div className="product-grid mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="product-card animate-pulse">
              <div className="product-frame" />
              <div className="h-3 w-2/3 bg-sand rounded mt-3" />
              <div className="h-3 w-1/3 bg-sand rounded mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="product-grid mb-12">
          {trendingItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className="trending-tags fade-up">
        {trendingTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
