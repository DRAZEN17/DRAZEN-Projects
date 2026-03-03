import React, { useRef, useEffect } from "react";
import { ShoppingCart, X, Trash2, Minus, Plus, Package, ArrowRight } from "lucide-react";

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem, gsapReady }) {
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    if (!gsapReady || !drawerRef.current) return;

    if (isOpen) {
      window.gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
      window.gsap.to(drawerRef.current, { x: "0%", duration: 0.4, ease: "power3.out" });
    } else {
      window.gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
      window.gsap.to(drawerRef.current, { x: "100%", duration: 0.3, ease: "power3.in" });
    }
  }, [isOpen, gsapReady]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div ref={overlayRef} className="absolute inset-0 bg-black/50 opacity-0 backdrop-blur-sm" onClick={onClose} />
      <div ref={drawerRef} className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform translate-x-full flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <Package className="w-16 h-16 opacity-50" />
              <p>Your cart is empty.</p>
              <button onClick={onClose} className="text-blue-600 font-medium hover:underline">Start Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-blue-600 font-bold">${item.price}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50 space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2">
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
