import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SHIPPING_THRESHOLD_NOTE = "Free shipping on every order.";

const Cart = () => {
  const { lines, updateQty, removeItem, subtotal } = useCart();
  const rootRef = useRef(null);
  useScrollReveal(rootRef);

  return (
    <div ref={rootRef} className="cart-page">
      <div className="cart-page-header">
        <h1>Your Cart</h1>
        <p className="eyebrow mt-2">{lines.length} {lines.length === 1 ? "item" : "items"}</p>
      </div>

      {lines.length === 0 ? (
        <div className="col-center gap-6 py-24 text-center px-6">
          <p className="font-sans text-sm text-taupe">Your cart is empty.</p>
          <Link to="/shop" className="btn-solid w-fit">
            <Icon name="bag" className="size-4" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-page-grid">
          <div className="cart-page-items">
            {lines.map((line) => (
              <div key={line.id} className="cart-page-line">
                <Link to={`/product/${line.productId}`} className="thumb">
                  <ProductImage
                    src={line.thumbnail}
                    alt={line.title}
                    category={line.category}
                    className="w-full h-full"
                  />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wide text-ink">{line.brand}</p>
                      <Link to={`/product/${line.productId}`} className="font-display italic text-lg text-ink hover:text-rust transition-colors">
                        {line.title}
                      </Link>
                      {line.size && (
                        <p className="font-sans text-xs text-taupe mt-1">Size {line.size}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeItem(line.id)}
                      className="text-taupe hover:text-rust transition-colors flex-none"
                    >
                      <Icon name="close" className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="qty-stepper">
                      <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(line.id, line.qty - 1)}>
                        <Icon name="minus" className="size-3" />
                      </button>
                      <span className="font-sans text-sm w-4 text-center">{line.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => updateQty(line.id, line.qty + 1)}>
                        <Icon name="plus" className="size-3" />
                      </button>
                    </div>
                    <p className="font-sans text-base text-rust">${(line.price * line.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="order-summary-row">
              <span>Shipping</span>
              <span className="text-taupe">{SHIPPING_THRESHOLD_NOTE}</span>
            </div>
            <div className="order-summary-row order-summary-total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn-solid w-full justify-center mt-6">
              Proceed to Checkout
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <Link to="/shop" className="flex-center gap-2 font-sans text-sm text-taupe hover:text-ink transition-colors mt-4">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
