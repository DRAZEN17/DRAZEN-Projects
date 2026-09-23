import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import FormField from "../components/FormField";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import { useAccount } from "../context/AccountContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const Account = () => {
  const { account, isSignedIn, signIn, signOut, orders } = useAccount();
  const rootRef = useRef(null);
  useScrollReveal(rootRef);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!email.trim()) return;
    if (!password.trim()) return;
    signIn({ name: name.trim(), email: email.trim(), password: password.trim() });
  };

  if (!isSignedIn) {
    return (
      <div ref={rootRef}>
        <div className="md:pt-40 pt-24 md:px-10 px-5 md:pb-24 pb-16 max-w-md mx-auto">
          <p className="eyebrow mb-3">Account</p>
          <h1 className="font-display italic md:text-4xl text-2xl text-ink">Sign In</h1>

          <form onSubmit={handleSignIn} className="flex flex-col gap-5 mt-8">
            <FormField
              label="Name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormField
              label="Email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
              label="Password"
              name="password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-solid w-fit mt-2">
              <Icon name="user" className="size-4" />
              Continue
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <div className="md:pt-40 pt-24 md:px-10 px-5 md:pb-24 pb-16 max-w-2xl mx-auto">
        <div className="flex items-start justify-between gap-4 fade-up">
          <div>
            <p className="eyebrow mb-3">Account</p>
            <h1 className="font-display italic md:text-4xl text-2xl text-ink">
              Hi, {account.name}
            </h1>
            {account.email && (
              <p className="font-sans text-sm text-taupe mt-2">{account.email}</p>
            )}
          </div>
          <button type="button" onClick={signOut} className="btn-outline flex-none">
            <Icon name="logout" className="size-4" />
            Sign Out
          </button>
        </div>

        <div className="mt-14 fade-up">
          <h2 className="font-sans uppercase text-sm tracking-[.15em] text-ink pb-4 border-b border-line mb-6">
            Order History
          </h2>

          {orders.length === 0 ? (
            <p className="font-sans text-sm text-taupe">
              No orders placed in this browser yet.{" "}
              <Link to="/shop" className="text-ink underline">
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <div key={order.orderNumber} className="border border-line rounded-md p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-sans text-sm text-ink">Order {order.orderNumber}</p>
                    <time className="font-sans text-xs text-taupe">
                      {new Date(order.placedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <p className="font-sans text-xs text-taupe mt-1">
                    {order.lines.length} {order.lines.length === 1 ? "item" : "items"} · $
                    {order.total.toFixed(2)}
                  </p>
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {order.lines.map((line) => (
                      <div key={line.id} className="size-14 flex-none bg-sand rounded overflow-hidden">
                        <img src={line.thumbnail} alt={line.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
