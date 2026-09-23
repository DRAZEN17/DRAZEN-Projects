import { useMemo, useRef, useState } from "react";
import ProductImage from "../components/ProductImage";
import Footer from "../components/Footer";
import { blogPosts, blogTabs } from "../constants";
import { useProducts } from "../context/ProductsContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const THUMB_CATEGORIES = ["shirts", "dresses", "shoes", "bags", "jewelry", "tops"];
const PAGE_SIZE = 4;

const Blog = () => {
  const { products, loading } = useProducts();
  const rootRef = useRef(null);
  useScrollReveal(rootRef, [loading]);
  const [tab, setTab] = useState(blogTabs[0]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => blogPosts.filter((p) => p.tag === tab), [tab]);
  const visible = filtered.slice(0, visibleCount);

  // Borrow real product photography for each post's thumbnail, cycling
  // through a spread of categories so the list doesn't repeat one look.
  const thumbFor = (i) => {
    const category = THUMB_CATEGORIES[i % THUMB_CATEGORIES.length];
    return products.find((p) => p.category === category) || products[i % (products.length || 1)];
  };

  return (
    <div ref={rootRef} className="blog-page">
      <div className="blog-header">
        <h1>Blog</h1>
      </div>

      <div className="filter-tabs justify-center">
        {blogTabs.map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? "active" : ""}
            onClick={() => {
              setTab(t);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="blog-list">
        {visible.length === 0 && (
          <p className="font-sans text-sm text-taupe py-10 text-center">
            No posts in this category yet.
          </p>
        )}
        {visible.map((post, i) => {
          const thumb = thumbFor(i);
          return (
            <article key={post.id} className="blog-row fade-up">
              <div className="thumb">
                {thumb && (
                  <ProductImage
                    src={thumb.thumbnail}
                    alt={post.title}
                    category={thumb.category}
                    className="w-full h-full"
                  />
                )}
              </div>
              <div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <time>{post.date}</time>
              </div>
            </article>
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex-center md:my-16 my-10">
          <button type="button" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="btn-outline">
            Load More
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Blog;
