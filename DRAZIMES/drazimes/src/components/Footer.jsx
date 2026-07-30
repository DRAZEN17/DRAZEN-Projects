import { useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import { footerFeatures, instaHandles, contactInfo, siteInfo } from "../constants";
import { useProducts } from "../context/ProductsContext";

// A varied spread of real categories so the "Follow Us" grid doesn't show
// four of the same kind of item.
const INSTA_CATEGORIES = ["dresses", "shirts", "shoes", "bags"];

const Footer = () => {
  const { products } = useProducts();

  const instaTiles = useMemo(
    () => INSTA_CATEGORIES.map((cat) => products.find((p) => p.category === cat)),
    [products]
  );

  return (
    <footer className="site-footer">
      <div className="fade-up">
        <span className="logo-mark">
          DRAZIME&apos;S<span className="text-rust">.</span>
        </span>
        <p className="font-sans text-sm text-ink-soft mt-4 max-w-sm">
          Making a considered, luxurious wardrobe accessible for a generous group of
          women and men is our daily drive.
        </p>
      </div>

      <div className="footer-features fade-up">
        {footerFeatures.map((f) => (
          <div key={f.title} className="feature">
            <Icon name={f.icon} className="size-6 text-ink" />
            <p>{f.title}. {f.description}</p>
          </div>
        ))}
      </div>

      <div className="fade-up">
        <p className="eyebrow text-center md:text-3xl text-2xl font-display italic text-ink tracking-normal normal-case">
          Follow Us
        </p>
        <div className="flex-center mt-3">
          <Icon name="instagram" className="size-5 text-ink" />
        </div>
        <div className="insta-grid mx-auto">
          {instaHandles.map((handle, i) => (
            <div key={i} className="relative bg-sand rounded-md overflow-hidden aspect-square">
              {instaTiles[i] && (
                <ProductImage
                  src={instaTiles[i].thumbnail}
                  alt={instaTiles[i].title}
                  category={instaTiles[i].category}
                  className="w-full h-full"
                />
              )}
              <span className="absolute bottom-2 left-2 text-cream text-xs font-sans drop-shadow">
                {handle}
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom flex-col">
        <div className="flex items-center gap-5">
          <a href="#" aria-label="Twitter" className="text-ink"><Icon name="twitter" filled /></a>
          <a href="#" aria-label="Instagram" className="text-ink"><Icon name="instagram" /></a>
          <a href="#" aria-label="YouTube" className="text-ink"><Icon name="youtube" filled /></a>
        </div>

        <div>
          <p className="font-sans text-sm text-taupe">{contactInfo.email}</p>
          <p className="font-sans text-sm text-taupe mt-1">{contactInfo.phone}</p>
          <p className="font-sans text-sm text-taupe mt-1">{contactInfo.hours}</p>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/about" className="text-ink">About</Link>
          <Link to="/contact" className="text-ink">Contact</Link>
          <Link to="/blog" className="text-ink">Blog</Link>
        </div>
      </div>

      <p className="text-center font-sans text-xs text-taupe/70 mt-10">
        Designed &amp; developed by {siteInfo.developer}
      </p>
    </footer>
  );
};

export default Footer;
