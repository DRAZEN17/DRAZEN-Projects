import { useState } from "react";
import ProductArt from "./ProductArt";

// Only used if a real photo 404s (or while there's genuinely no image) —
// maps our real categories to the closest hand-drawn fallback silhouette.
const FALLBACK_ART = {
  tops: "tee",
  shirts: "blouse",
  dresses: "dress",
  shoes: "boots",
  bags: "bag",
  jewelry: "ring",
  watches: "bracelet",
  sunglasses: "tee",
};

const ProductImage = ({ src, alt, category, className = "" }) => {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <ProductArt
        type={FALLBACK_ART[category] || "tee"}
        className={`${className} p-6 text-ink-soft/50`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  );
};

export default ProductImage;
