import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogsService } from '../services/content.js';
import { trackBlogView } from '../services/analytics.js';

export default function BlogDetail() {
  const { slug } = useParams();
  const [b, setB] = useState(null);

  useEffect(() => {
    blogsService.get(slug).then((doc) => { setB(doc); if (doc?._id) trackBlogView(doc._id); }).catch(() => {});
  }, [slug]);

  if (!b) return <div className="section pt-40">Loading…</div>;
  return (
    <article className="section pt-40 max-w-3xl">
      <Helmet><title>{b.title} · Blog</title></Helmet>
      <Link to="/blog" className="text-neon-cyan font-mono text-sm">← All posts</Link>
      <h1 className="h1 mt-6 text-4xl md:text-6xl">{b.title}</h1>
      <p className="text-muted mt-4">{new Date(b.createdAt).toLocaleDateString()} · {b.views} views</p>
      {b.coverImage && <img src={b.coverImage} alt="" className="rounded-2xl mt-8 border border-white/10" />}
      <div className="prose prose-invert mt-10 whitespace-pre-line text-muted">{b.content}</div>
    </article>
  );
}
