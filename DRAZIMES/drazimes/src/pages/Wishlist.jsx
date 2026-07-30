import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductsContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const Wishlist = () => {
  const { ids } = useWishlist();
  const { products, loading } = useProducts();
  const rootRef = useRef(null);
  useScrollReveal(rootRef, [loading]);

  const items = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [ids, products]
  );

  return (
    <div ref={rootRef} className="shop-page">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
      <div className="shop-header">
        <p className="eyebrow mb-3">{items.length} Saved</p>
        <h1>Your Wishlist</h1>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="product-card animate-pulse">
              <div className="product-frame" />
              <div className="h-3 w-2/3 bg-sand rounded mt-3" />
              <div className="h-3 w-1/3 bg-sand rounded mt-2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="col-center gap-6 py-24 text-center px-6">
          <Icon name="heart" className="size-8 text-taupe" />
          <p className="font-sans text-sm text-taupe max-w-xs">
            Nothing saved yet — tap the heart on anything you love to keep it here.
          </p>
          <Link to="/shop" className="btn-solid w-fit">
            <Icon name="bag" className="size-4" />
            Browse the Shop
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Wishlist;
