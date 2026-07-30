import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import FormField from "../components/FormField";
import Icon from "../components/Icon";
import { useCart } from "../context/CartContext";
import { useAccount } from "../context/AccountContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const TAX_RATE = 0.08;
const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard Shipping", detail: "5–7 business days", price: 0 },
  { id: "express", label: "Express Shipping", detail: "2–3 business days", price: 15 },
];

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const generateOrderNumber = () =>
  `DZ-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

const Checkout = () => {
  const { lines, subtotal, clearCart } = useCart();
  const { recordOrder } = useAccount();
  const rootRef = useRef(null);
  useScrollReveal(rootRef);
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [card, setCard] = useState({ number: "", expiry: "" });
  const [placing, setPlacing] = useState(false);

  const shippingCost = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod)?.price ?? 0;
  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = subtotal + shippingCost + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lines.length === 0 || placing) return;
    setPlacing(true);

    const order = {
      orderNumber: generateOrderNumber(),
      lines,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingMethod,
      placedAt: new Date().toISOString(),
    };

    // No backend here — this is a front-end demo, so "placing an order"
    // means handing the summary to the confirmation page via router state,
    // then clearing the cart. Navigating first (rather than clearing then
    // navigating) means Checkout can't ever re-render its empty-cart state
    // for a frame before the route actually changes.
    setTimeout(() => {
      recordOrder(order);
      navigate("/order-confirmation", { state: { order } });
      clearCart();
    }, 600);
  };

  if (lines.length === 0) {
    return (
      <div ref={rootRef} className="col-center min-h-[70vh] gap-6 text-center px-6">
        <p className="font-display italic text-3xl text-ink">Nothing to check out yet.</p>
        <Link to="/shop" className="btn-solid w-fit">
          <Icon name="bag" className="size-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="checkout-page">
      <div className="checkout-page-header">
        <h1>Checkout</h1>
        <Link to="/cart" className="font-sans text-sm text-taupe hover:text-ink transition-colors">
          &larr; Back to cart
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="checkout-grid">
        <div className="checkout-form-col">
          <section>
            <h2>Contact</h2>
            <div className="grid sm:grid-cols-1 gap-5">
              <FormField label="Email" type="email" required autoComplete="email" />
            </div>
          </section>

          <section>
            <h2>Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="Full Name" required autoComplete="name" className="sm:col-span-2" />
              <FormField label="Address" required autoComplete="address-line1" className="sm:col-span-2" />
              <FormField label="Apartment, suite, etc. (optional)" autoComplete="address-line2" className="sm:col-span-2" />
              <FormField label="City" required autoComplete="address-level2" />
              <FormField label="State / Region" required autoComplete="address-level1" />
              <FormField label="Postal Code" required autoComplete="postal-code" />
              <FormField label="Phone" type="tel" required autoComplete="tel" />
            </div>
          </section>

          <section>
            <h2>Shipping Method</h2>
            <div className="flex flex-col gap-3">
              {SHIPPING_OPTIONS.map((opt) => (
                <label key={opt.id} className="shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === opt.id}
                    onChange={() => setShippingMethod(opt.id)}
                  />
                  <span className="flex-1">
                    <span className="block font-sans text-sm text-ink">{opt.label}</span>
                    <span className="block font-sans text-xs text-taupe">{opt.detail}</span>
                  </span>
                  <span className="font-sans text-sm text-ink">
                    {opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2>Payment</h2>
            <p className="font-sans text-xs text-taupe -mt-2 mb-1">
              Demo checkout — this is a front-end project with no payment processor, nothing is charged.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="Name on Card" required autoComplete="cc-name" className="sm:col-span-2" />
              <FormField
                label="Card Number"
                required
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                className="sm:col-span-2"
              />
              <FormField
                label="Expiry (MM/YY)"
                required
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
              />
              <FormField label="CVC" required inputMode="numeric" autoComplete="cc-csc" maxLength={4} />
            </div>
          </section>
        </div>

        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1 mb-4">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center gap-3">
                <div className="relative size-14 flex-none bg-sand rounded-md overflow-hidden">
                  <ProductImage src={line.thumbnail} alt={line.title} category={line.category} className="w-full h-full" />
                  <span className="absolute -top-1.5 -right-1.5 flex-center size-4 rounded-full bg-ink text-cream text-[10px]">
                    {line.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-ink truncate">{line.title}</p>
                  {line.size && <p className="font-sans text-xs text-taupe">Size {line.size}</p>}
                </div>
                <p className="font-sans text-sm text-ink-soft flex-none">${(line.price * line.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="order-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="order-summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="order-summary-row">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="order-summary-row order-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button type="submit" disabled={placing} className="btn-solid w-full justify-center mt-6">
            {placing ? "Placing Order…" : `Place Order — $${total.toFixed(2)}`}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
