import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import RevealTag from "../components/RevealTag";
import { collections } from "../constants";
import { useProducts } from "../context/ProductsContext";

const CollectionsSection = () => {
  const { products, loading } = useProducts();

  const banners = useMemo(
    () =>
      collections.map((c) => ({
        ...c,
        product: products.find((p) => p.category === c.categorySlug),
      })),
    [products]
  );

  return (
    <section>
      <div className="section-heading">
        <div>
          <RevealTag>Curated</RevealTag>
          <h2 className="mt-4">Collections</h2>
        </div>
      </div>

      <div className="collections-section">
        {banners.map((c) => (
          <Link
            key={c.title}
            to={`/shop?category=${c.categorySlug}`}
            className={`collection-banner fade-up ${c.dark ? "bg-ink" : "bg-sand"}`}
          >
            {!loading && c.product && (
              <ProductImage
                src={c.product.thumbnail}
                alt={c.title}
                category={c.categorySlug}
                className="absolute inset-0 w-full h-full"
              />
            )}
            <span
              className={`absolute inset-0 bg-gradient-to-t ${
                c.dark ? "from-ink/90 via-ink/20" : "from-ink-soft/70 via-ink-soft/10"
              } to-transparent`}
            />
            <div className="collection-copy">
              <p className="eyebrow">{c.label}</p>
              <h3>{c.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;
