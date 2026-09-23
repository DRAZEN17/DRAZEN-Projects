import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAccount } from "../context/AccountContext";

const NavBar = () => {
  const { openMenu, openCart, count } = useCart();
  const { count: wishCount } = useWishlist();
  const { isSignedIn } = useAccount();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <nav className="nav-bar">
      <div className="flex items-center md:gap-5 gap-3">
        <button type="button" aria-label="Open menu" onClick={openMenu} className="icon-btn">
          <Icon name="menu" />
        </button>
        <Link to="/" className="logo-mark">
          DRAZIME&apos;S<span className="text-rust">.</span>
        </Link>
      </div>

      <div className="flex items-center gap-1 relative">
        {searchOpen && (
          <form onSubmit={submitSearch} className="absolute right-12 top-1/2 -translate-y-1/2 md:w-64 w-40">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => !query && setSearchOpen(false)}
              placeholder="Search products…"
              className="w-full border-b border-ink bg-transparent text-sm font-sans py-1.5 outline-none placeholder:text-taupe"
            />
          </form>
        )}
        <button
          type="button"
          aria-label="Search"
          onClick={() => setSearchOpen((s) => !s)}
          className="icon-btn"
        >
          <Icon name="search" />
        </button>
        <Link to="/account" aria-label="Account" className="icon-btn relative">
          <Icon name="user" />
          {isSignedIn && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rust" />
          )}
        </Link>
        <Link to="/wishlist" aria-label="Open wishlist" className="icon-btn relative">
          <Icon name="heart" />
          {wishCount > 0 && (
            <span className="absolute top-1 right-1 flex-center size-4 rounded-full bg-rust text-cream text-[9px] font-medium">
              {wishCount}
            </span>
          )}
        </Link>
        <button type="button" aria-label="Open cart" onClick={openCart} className="icon-btn relative">
          <Icon name="bag" />
          {count > 0 && (
            <span className="absolute top-1 right-1 flex-center size-4 rounded-full bg-rust text-cream text-[9px] font-medium">
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
