import { useRef, useEffect } from "react";
import { ShoppingBag, X, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { gsap } from "gsap";

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem }) {
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (isOpen) {
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
      gsap.to(drawerRef.current, { x: "0%", duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
      gsap.to(drawerRef.current, { x: "100%", duration: 0.3, ease: "power3.in" });
    }
  }, [isOpen]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-ink/50 opacity-0 backdrop-blur-sm invisible"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 h-full w-full max-w-md bg-paper shadow-2xl translate-x-full flex flex-col border-l border-line"
      >
        <div className="p-6 border-b border-line flex justify-between items-center">
          <h2 className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" aria-hidden="true" /> Your Cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 hover:bg-paper-dim rounded-full transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-meta space-y-4 text-center">
              <ShoppingBag className="w-12 h-12 opacity-40" aria-hidden="true" />
              <p>Nothing logged in your cart yet.</p>
              <button type="button" onClick={onClose} className="text-stamp font-medium hover:underline">
                Browse the index
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 border border-line">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover bg-paper-dim shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-ink line-clamp-1 text-sm">{item.name}</h3>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-meta hover:text-stamp transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="font-mono text-sm font-semibold text-ink">${item.price}</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="w-6 h-6 rounded-full bg-paper-dim flex items-center justify-center hover:bg-line"
                    >
                      <Minus className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <span className="text-sm font-mono w-4 text-center" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="w-6 h-6 rounded-full bg-paper-dim flex items-center justify-center hover:bg-line"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-line space-y-4">
            <div className="space-y-2 text-sm text-meta font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-ink pt-2 border-t border-dotted border-line">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-ink text-paper py-4 font-mono text-sm uppercase tracking-widest hover:bg-stamp transition-colors active:scale-[0.99] flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
