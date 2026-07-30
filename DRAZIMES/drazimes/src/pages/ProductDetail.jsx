import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import AccordionItem from "../components/Accordion";
import Breadcrumbs from "../components/Breadcrumbs";
import Lightbox from "../components/Lightbox";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useWishlist } from "../context/WishlistContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const ProductDetail = () => {
  const { id } = useParams();
  const { getById, getRelated, loading, error, retry } = useProducts();
  const product = getById(id);
  const rootRef = useRef(null);
  useScrollReveal(rootRef, [id, loading]);
  const { addItem } = useCart();
  const { isWished, toggle } = useWishlist();
  const { recordView } = useRecentlyViewed();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const related = useMemo(() => (product ? getRelated(product, 4) : []), [product, getRelated]);

  // Bags/jewelry/watches/sunglasses only ever have "One Size" — don't make
  // the user click it before Add to Basket will do anything. Multi-option
  // products (clothing, shoes) still require an explicit choice, and
  // switching products resets the selection instead of carrying over a
  // stale one.
  useEffect(() => {
    if (!product) return;
    setSize(product.sizes.length === 1 ? product.sizes[0] : undefined);
    setQty(1);
  }, [product]);

  useEffect(() => {
    if (product) recordView(product.id);
  }, [product, recordView]);

  if (error) {
    return (
      <div className="col-center min-h-[70vh] gap-4 text-center px-6">
        <p className="font-sans text-sm text-taupe max-w-sm">{error}</p>
        <button type="button" onClick={retry} className="btn-outline">
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pdp md:pt-32 pt-20">
        <div className="fade-up animate-pulse">
          <div className="main-frame" />
        </div>
        <div className="fade-up animate-pulse flex flex-col gap-4">
          <div className="h-4 w-24 bg-sand rounded" />
          <div className="h-8 w-2/3 bg-sand rounded" />
          <div className="h-6 w-16 bg-sand rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="col-center min-h-[70vh] gap-4 text-center px-6">
        <p className="font-display italic text-3xl">We couldn&apos;t find that piece.</p>
        <Link to="/shop" className="btn-solid w-fit">
          Back to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage >= 8;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleAdd = () => {
    if (product.sizes?.length && !size) return;
    addItem(product, { size, qty, price: hasDiscount ? Number(discountedPrice) : product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div ref={rootRef}>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: product.categoryLabel, to: `/shop?category=${product.category}` },
          { label: product.title },
        ]}
      />
      <div className="pdp">
      <div className="pdp-gallery fade-up">
        <div className="main-frame">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setLightboxOpen(true)}
            aria-label="Enlarge image"
          >
            <ProductImage
              src={product.images[activeImage] || product.thumbnail}
              alt={product.title}
              category={product.category}
              className="w-full h-full"
            />
          </button>
          <span className="absolute bottom-3 right-3 flex-center size-9 rounded-full bg-paper/80 text-ink pointer-events-none">
            <Icon name="expand" className="size-4" />
          </span>
        </div>
        {product.images.length > 1 && (
          <div className="thumb-row">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                className={activeImage === i ? "active" : ""}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
              >
                <ProductImage src={img} alt="" category={product.category} className="w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pdp-info fade-up">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="brand">{product.brand}</p>
            <h1 className="name">{product.title}</h1>
          </div>
          <button type="button" aria-label="Share" className="icon-btn flex-none">
            <Icon name="share" className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <p className="price mt-0">${hasDiscount ? discountedPrice : product.price}</p>
          {hasDiscount && (
            <>
              <span className="font-sans text-sm text-taupe line-through">${product.price}</span>
              <span className="font-sans text-xs uppercase tracking-wide bg-rust/10 text-rust rounded-full px-2.5 py-1">
                -{Math.round(product.discountPercentage)}%
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2">
          {product.rating != null && (
            <span className="flex items-center gap-1 font-sans text-sm text-ink-soft">
              <Icon name="heart" className="size-3.5 text-rust" filled />
              {product.rating.toFixed(1)}
            </span>
          )}
          <span
            className={`font-sans text-xs uppercase tracking-wide px-2.5 py-1 rounded-full ${
              product.stock > 0 ? "bg-sand text-ink-soft" : "bg-rust/10 text-rust"
            }`}
          >
            {product.availabilityStatus}
          </span>
        </div>

        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="font-sans text-xs text-taupe border border-line rounded-full px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-5 mt-6">
          <div>
            <p className="font-sans text-sm text-taupe mb-2">Size</p>
            <div className="size-row">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={size === s ? "active" : ""}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-sm text-taupe mb-2">Quantity</p>
            <div className="qty-stepper">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Icon name="minus" className="size-3" />
              </button>
              <span className="font-sans text-sm w-6 text-center">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => (product.stock ? Math.min(product.stock, q + 1) : q + 1))}
              >
                <Icon name="plus" className="size-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn-solid flex-1 justify-center"
          >
            <Icon name={added ? "chevronDown" : "plus"} className="size-4" />
            {product.stock === 0 ? "Out of Stock" : added ? "Added" : "Add to Basket"}
          </button>
          <button
            type="button"
            aria-label={isWished(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => toggle(product.id)}
            className="icon-btn border border-line"
          >
            <Icon
              name="heart"
              filled={isWished(product.id)}
              className={`size-5 ${isWished(product.id) ? "text-rust" : ""}`}
            />
          </button>
        </div>
        {product.sizes?.length && !size && (
          <p className="font-sans text-xs text-rust mt-2">Please select a size.</p>
        )}

        <div className="mt-10">
          <AccordionItem title="Description" defaultOpen>
            <p>{product.description}</p>
          </AccordionItem>

          <AccordionItem title="Shipping, Warranty &amp; Returns">
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2">
                <Icon name="truck" className="size-4 text-taupe flex-none" />
                {product.shippingInformation}
              </p>
              <p className="flex items-center gap-2">
                <Icon name="shield" className="size-4 text-taupe flex-none" />
                {product.warrantyInformation}
              </p>
              <p>{product.returnPolicy}</p>
            </div>
          </AccordionItem>

          <AccordionItem title="Details">
            <ul className="flex flex-col gap-2 list-none pl-0">
              <li>Brand: {product.brand}</li>
              <li>Category: {product.categoryLabel}</li>
              <li>Stock: {product.stock} available</li>
            </ul>
          </AccordionItem>

          {product.reviews.length > 0 && (
            <AccordionItem title={`Reviews (${product.reviews.length})`}>
              <div className="flex flex-col gap-5">
                {product.reviews.map((review, i) => (
                  <div key={i} className="flex flex-col gap-1 pb-4 border-b border-line/60 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-sans text-sm text-ink">{review.reviewerName}</p>
                      <span className="flex items-center gap-1 font-sans text-xs text-ink-soft flex-none">
                        <Icon name="heart" className="size-3 text-rust" filled />
                        {review.rating}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-ink-soft">{review.comment}</p>
                    {review.date && (
                      <time className="font-sans text-xs text-taupe">
                        {new Date(review.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                ))}
              </div>
            </AccordionItem>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="lg:col-span-2 md:mt-12 mt-4">
          <div className="section-heading mt-0">
            <h2>You May Also Like</h2>
          </div>
          <div className="product-grid px-0">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="lg:col-span-2">
        <Footer />
      </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={product.images}
        activeIndex={activeImage}
        onNavigate={(dir) =>
          setActiveImage((i) => (i + dir + product.images.length) % product.images.length)
        }
        alt={product.title}
        category={product.category}
      />
    </div>
  );
};

export default ProductDetail;
