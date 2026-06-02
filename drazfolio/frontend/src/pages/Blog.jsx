import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogsService } from '../services/content.js';

export default function Blog() {
  const [items, setItems] = useState([]);
  useEffect(() => { blogsService.list({ limit: 50 }).then((r) => setItems((r.data || []).filter((b) => b.published))); }, []);
  return (
    <section className="section pt-40">
      <Helmet><title>Blog · Portfolio</title></Helmet>
      <p className="eyebrow">Writing</p>
      <h1 className="h1 mt-4">Notes & essays.</h1>
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        {items.map((b) => (
          <Link to={`/blog/${b.slug}`} key={b._id} className="glass glass-hover p-6 block">
            {b.coverImage && <img src={b.coverImage} alt="" className="rounded-xl mb-4 aspect-video object-cover w-full" loading="lazy" />}
            <h2 className="font-display text-2xl">{b.title}</h2>
            <p className="text-muted mt-2 line-clamp-2">{b.excerpt}</p>
            <div className="mt-4 text-xs font-mono text-muted">{new Date(b.createdAt).toLocaleDateString()}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
