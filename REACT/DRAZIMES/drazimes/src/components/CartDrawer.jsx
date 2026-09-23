import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import { useCart } from "../context/CartContext";
import { useFocusTrap } from "../hooks/useFocusTrap";

const CartDrawer = () => {
  const { isCartOpen, closeCart, lines, updateQty, removeItem, subtotal } = useCart();
  const backdropRef = useRef(null);
  const drawerRef = useRef(null);

  useFocusTrap(isCartOpen, drawerRef, closeCart);


  useGSAP(
    () => {
      if (isCartOpen) {
        gsap.set(backdropRef.current, { visibility: "visible", pointerEvents: "auto" });
        gsap.set(drawerRef.current, { visibility: "visible", pointerEvents: "auto" });
        gsap.to(backdropRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
        gsap.to(drawerRef.current, { x: 0, autoAlpha: 1, duration: 0.55, ease: "power4.out" });
      } else {
        const drawerWidth = drawerRef.current?.offsetWidth || 420;
        gsap.to(backdropRef.current, { autoAlpha: 0, duration: 0.35, ease: "power2.in", onComplete: () => gsap.set(backdropRef.current, { pointerEvents: "none" }) });
        gsap.to(drawerRef.current, {
          x: drawerWidth,
          autoAlpha: 0,
          duration: 0.45,
          ease: "power3.in",
          onComplete: () => gsap.set(drawerRef.current, { visibility: "hidden", pointerEvents: "none" }),
        });
      }
    },
    { dependencies: [isCartOpen] }
  );

  return (
    <>
      <div ref={backdropRef} className="cart-backdrop" onClick={closeCart} aria-hidden="true" />
      <aside ref={drawerRef} className="cart-drawer" aria-hidden={!isCartOpen}>
        <div className="cart-header">
          <span className="font-sans uppercase text-sm tracking-[.15em]">Cart</span>
          <button type="button" aria-label="Close cart" onClick={closeCart} className="icon-btn">
            <Icon name="close" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 col-center gap-6 px-6 text-center">
            <p className="font-sans text-sm text-taupe">You have no items in your shopping bag.</p>
            <button type="button" onClick={closeCart} className="btn-solid">
              <Icon name="bag" className="size-4" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {lines.map((line) => (
                <div key={line.id} className="cart-line">
                  <div className="size-20 flex-none bg-sand rounded-md overflow-hidden">
                    <ProductImage
                      src={line.thumbnail}
                      alt={line.title}
                      category={line.category}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-sans text-xs uppercase tracking-wide text-ink">{line.brand}</p>
                        <p className="font-sans text-sm text-taupe mt-0.5">{line.title}</p>
                        {line.size && (
                          <p className="font-sans text-xs text-taupe/80 mt-0.5">Size {line.size}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeItem(line.id)}
                        className="text-taupe hover:text-ink transition-colors"
                      >
                        <Icon name="close" className="size-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="qty-stepper">
                        <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(line.id, line.qty - 1)}>
                          <Icon name="minus" className="size-3" />
                        </button>
                        <span className="font-sans text-sm w-4 text-center">{line.qty}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => updateQty(line.id, line.qty + 1)}>
                          <Icon name="plus" className="size-3" />
                        </button>
                      </div>
                      <p className="font-sans text-sm text-rust">${(line.price * line.qty).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans uppercase text-sm tracking-[.1em]">Subtotal</span>
                <span className="font-sans text-lg text-rust">${subtotal.toFixed(2)}</span>
              </div>
              <p className="font-sans text-xs text-taupe mb-5">
                Shipping, taxes, and discount codes are calculated at checkout.
              </p>
              <Link to="/checkout" onClick={closeCart} className="btn-solid w-full justify-center mb-3">
                <Icon name="bag" className="size-4" />
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={closeCart}
                className="flex-center gap-2 font-sans text-sm text-taupe hover:text-ink transition-colors"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
