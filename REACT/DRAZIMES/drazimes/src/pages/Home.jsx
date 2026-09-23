import { useRef } from "react";
import HeroSection from "../sections/HeroSection";
import RecentlyViewedSection from "../sections/RecentlyViewedSection";
import NewArrivalsSection from "../sections/NewArrivalsSection";
import EditorialSection from "../sections/EditorialSection";
import CollectionsSection from "../sections/CollectionsSection";
import JustForYouSection from "../sections/JustForYouSection";
import TrendingSection from "../sections/TrendingSection";
import Footer from "../components/Footer";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useProducts } from "../context/ProductsContext";

const Home = () => {
  const rootRef = useRef(null);
  const { loading } = useProducts();
  // Re-run once loading flips to false: the skeleton placeholders share the
  // .product-card class so the initial batch reveal fires on them, not on
  // the real cards that replace them — this dependency makes sure the
  // real, final cards get their scroll-in animation too.
  useScrollReveal(rootRef, [loading]);

  return (
    <div ref={rootRef}>
      <HeroSection />
      <RecentlyViewedSection />
      <NewArrivalsSection />
      <EditorialSection />
      <CollectionsSection />
      <JustForYouSection />
      <TrendingSection />
      <Footer />
    </div>
  );
};

export default Home;
