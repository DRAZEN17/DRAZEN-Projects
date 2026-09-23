import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import { useScrollReveal } from "../hooks/useScrollReveal";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const order = state?.order;
  const rootRef = useRef(null);
  useScrollReveal(rootRef);

  if (!order) {
    return (
      <div className="col-center min-h-[70vh] gap-6 text-center px-6">
        <p className="font-display italic text-3xl text-ink">No recent order to show.</p>
        <p className="font-sans text-sm text-taupe max-w-sm">
          This page only shows details right after checking out. Head back to the
          shop to place an order.
        </p>
        <Link to="/shop" className="btn-solid w-fit">
          <Icon name="bag" className="size-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const placedDate = new Date(order.placedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div ref={rootRef} className="checkout-page">
      <div className="confirmation-header fade-up">
        <span className="flex-center size-16 rounded-full bg-rust/10 text-rust mx-auto mb-6">
          <Icon name="heart" filled className="size-7" />
        </span>
        <p className="eyebrow">Order Confirmed</p>
        <h1 className="mt-3">Thank you.</h1>
        <p className="font-sans text-ink-soft mt-4 max-w-md mx-auto">
          Your order has been placed. A confirmation would normally be emailed
          to you — this is a front-end demo, so consider this that email.
        </p>
      </div>

      <div className="order-summary max-w-xl mx-auto md:mt-12 mt-8 fade-up">
        <div className="flex items-center justify-between">
          <h2 className="mt-0">Order {order.orderNumber}</h2>
          <span className="font-sans text-xs text-taupe">{placedDate}</span>
        </div>

        <div className="flex flex-col gap-4 my-5">
          {order.lines.map((line) => (
            <div key={line.id} className="flex items-center gap-3">
              <div className="size-14 flex-none bg-sand rounded-md overflow-hidden">
                <ProductImage src={line.thumbnail} alt={line.title} category={line.category} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-ink truncate">{line.title}</p>
                <p className="font-sans text-xs text-taupe">
                  Qty {line.qty}{line.size ? ` · Size ${line.size}` : ""}
                </p>
              </div>
              <p className="font-sans text-sm text-ink-soft flex-none">${(line.price * line.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="order-summary-row">
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="order-summary-row">
          <span>Shipping</span>
          <span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="order-summary-row">
          <span>Estimated Tax</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div className="order-summary-row order-summary-total">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex-center md:mt-12 mt-8">
        <Link to="/shop" className="btn-outline">
          Continue Shopping
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
