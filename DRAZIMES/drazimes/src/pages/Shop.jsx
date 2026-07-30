import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import { navCategories, CLOTHING_CATEGORIES } from "../constants";
import { useProducts } from "../context/ProductsContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const PAGE_SIZE = 8;

const sortFns = {
  featured: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
};

// Recognizes a gender word inside a free-text search (e.g. "men", "women's
// bags", "ladies dress") so searching "men" shows only men's items instead
// of a text match against titles/brands. Word-boundaried so "women" never
// false-matches the "men" pattern it happens to contain as a substring.
const GENDER_PATTERNS = {
  women: /\b(women'?s?|woman|ladies|female)\b/i,
  men: /\b(men'?s?|man|male)\b/i,
};

const parseGenderFromQuery = (raw) => {
  const q = raw.trim();
  if (GENDER_PATTERNS.women.test(q)) {
    return { gender: "women", text: q.replace(GENDER_PATTERNS.women, "").trim() };
  }
  if (GENDER_PATTERNS.men.test(q)) {
    return { gender: "men", text: q.replace(GENDER_PATTERNS.men, "").trim() };
  }
  return { gender: null, text: q };
};

const Shop = () => {
  const { products, loading, error, retry } = useProducts();
  const rootRef = useRef(null);
  useScrollReveal(rootRef, [loading]);

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const urlGender = searchParams.get("gender") || "";
  const q = searchParams.get("q") || "";
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

  const { gender: queryGender, text: queryText } = useMemo(() => parseGenderFromQuery(q), [q]);
  const effectiveGender = urlGender || queryGender;

  const filtered = useMemo(() => {
    let list = [...products];
    if (category === "clothing") list = list.filter((p) => CLOTHING_CATEGORIES.includes(p.category));
    else if (category) list = list.filter((p) => p.category === category);

    // Unisex items (gender: null, e.g. tops, sunglasses) always pass a
    // gender filter rather than being excluded by it.
    if (effectiveGender) list = list.filter((p) => !p.gender || p.gender === effectiveGender);

    if (queryText) {
      const needle = queryText.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle)
      );
    }

    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    if (min != null && !Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    if (max != null && !Number.isNaN(max)) list = list.filter((p) => p.price <= max);
    if (minRating > 0) list = list.filter((p) => (p.rating ?? 0) >= minRating);

    return list.sort(sortFns[sort]);
  }, [products, category, effectiveGender, queryText, sort, minPrice, maxPrice, minRating]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categoryLabel = navCategories.find((c) => c.slug === category)?.label;
  const genderLabel = effectiveGender ? effectiveGender[0].toUpperCase() + effectiveGender.slice(1) : "";

  const clearCategory = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
    setPage(1);
  };

  const clearGender = () => {
    const next = new URLSearchParams(searchParams);
    if (urlGender) {
      next.delete("gender");
    } else if (queryGender) {
      // Gender came from free text ("men jacket") — keep any leftover
      // search text, drop just the gender word.
      if (queryText) next.set("q", queryText);
      else next.delete("q");
    }
    setSearchParams(next);
    setPage(1);
  };

  const clearSearchText = () => {
    const next = new URLSearchParams(searchParams);
    if (queryGender && !urlGender) {
      // Preserve the gender filter as its own param, drop just the text.
      next.set("gender", queryGender);
    }
    next.delete("q");
    setSearchParams(next);
    setPage(1);
  };

  const clearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const clearRating = () => {
    setMinRating(0);
    setPage(1);
  };

  const hasPriceFilter = minPrice !== "" || maxPrice !== "";

  return (
    <div ref={rootRef} className="shop-page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: categoryLabel || queryText || genderLabel ? "/shop" : undefined },
          ...(categoryLabel ? [{ label: categoryLabel }] : []),
        ]}
      />
      <div className="shop-header">
        <p className="eyebrow mb-3">{loading ? "Loading…" : `${filtered.length} Products`}</p>
        <h1>{categoryLabel || (queryText ? `Results for “${queryText}”` : genderLabel ? `${genderLabel}'s` : "All Products")}</h1>
      </div>

      <div className="shop-toolbar">
        <div className="active-filters">
          {genderLabel && (
            <span>
              {genderLabel}
              <button type="button" onClick={clearGender} aria-label="Clear gender filter">
                <Icon name="close" className="size-3" />
              </button>
            </span>
          )}
          {categoryLabel && (
            <span>
              {categoryLabel}
              <button type="button" onClick={clearCategory} aria-label="Clear category filter">
                <Icon name="close" className="size-3" />
              </button>
            </span>
          )}
          {queryText && (
            <span>
              &ldquo;{queryText}&rdquo;
              <button type="button" onClick={clearSearchText} aria-label="Clear search">
                <Icon name="close" className="size-3" />
              </button>
            </span>
          )}
          {hasPriceFilter && (
            <span>
              ${minPrice || 0}–${maxPrice || "∞"}
              <button type="button" onClick={clearPrice} aria-label="Clear price filter">
                <Icon name="close" className="size-3" />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span>
              {minRating}+ <Icon name="star" className="size-3" filled />
              <button type="button" onClick={clearRating} aria-label="Clear rating filter">
                <Icon name="close" className="size-3" />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={`font-sans text-sm border rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors ${
              filtersOpen ? "bg-ink text-cream border-ink" : "text-ink border-line"
            }`}
          >
            <Icon name="filter" className="size-3.5" />
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="font-sans text-sm text-ink border border-line rounded-full px-4 py-2 bg-transparent outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {filtersOpen && (
        <div className="filter-panel fade-up">
          <div>
            <p className="font-sans text-xs uppercase tracking-wide text-taupe mb-2">Price</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span className="text-taupe">–</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div>
            <p className="font-sans text-xs uppercase tracking-wide text-taupe mb-2">Rating</p>
            <div className="flex items-center gap-2">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={minRating === r ? "active" : ""}
                  onClick={() => {
                    setMinRating(r);
                    setPage(1);
                  }}
                >
                  {r === 0 ? "Any" : (
                    <>
                      {r}+ <Icon name="star" className="size-3" filled />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="col-center gap-4 py-20 text-center px-6">
          <p className="font-sans text-sm text-taupe max-w-sm">{error}</p>
          <button type="button" onClick={retry} className="btn-outline">
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card animate-pulse">
              <div className="product-frame" />
              <div className="h-3 w-2/3 bg-sand rounded mt-3" />
              <div className="h-3 w-1/3 bg-sand rounded mt-2" />
            </div>
          ))}
        </div>
      ) : visible.length > 0 ? (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-taupe md:px-10 px-5">
          No products match those filters yet — try clearing one.
        </p>
      )}

      {!loading && !error && pageCount > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <Icon name="chevronLeft" className="size-4" />
          </button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
            aria-label="Next page"
          >
            <Icon name="chevronRight" className="size-4" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
