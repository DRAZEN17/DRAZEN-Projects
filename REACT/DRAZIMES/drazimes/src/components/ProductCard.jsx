import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import Icon from "./Icon";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);
  const hasDiscount = product.discountPercentage >= 8;

  return (
    <div className="product-card">
      <div className="product-frame">
        <Link to={`/product/${product.id}`} className="absolute inset-0">
          <ProductImage
            src={product.thumbnail}
            alt={product.title}
            category={product.category}
            className="w-full h-full"
          />
        </Link>

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-rust text-cream text-[11px] uppercase tracking-[.1em] px-3 py-1 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="wishlist-btn"
        >
          <Icon name="heart" filled={wished} className={`size-4 ${wished ? "text-rust" : ""}`} />
        </button>
      </div>

      <Link to={`/product/${product.id}`} className="product-meta block">
        <p className="brand">{product.brand}</p>
        <p className="name">{product.title}</p>
        <p className="price">
          ${hasDiscount
            ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
            : product.price}
          {hasDiscount && (
            <span className="text-taupe line-through ml-2 text-xs">${product.price}</span>
          )}
        </p>
      </Link>
    </div>
  );
};

export default ProductCard;
