import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { projectsService } from '../services/content.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => { projectsService.get(slug).then(setP).catch(() => setErr('Not found')); }, [slug]);

  if (err) return <div className="section pt-40"><p>{err}</p></div>;
  if (!p) return <div className="section pt-40">Loading…</div>;

  return (
    <article className="section pt-40">
      <Helmet><title>{p.title} · Portfolio</title><meta name="description" content={p.description} /></Helmet>
      <Link to="/projects" className="text-neon-cyan font-mono text-sm">← All projects</Link>
      <h1 className="h1 mt-6">{p.title}</h1>
      <p className="text-lg text-muted mt-4 max-w-3xl">{p.description}</p>
      <div className="mt-6 flex gap-3 flex-wrap">
        {p.techStack?.map((t) => <span key={t} className="text-xs uppercase tracking-wider px-2 py-1 rounded-full border border-white/10">{t}</span>)}
      </div>
      <div className="mt-8 flex gap-4">
        {p.liveUrl && <a className="btn-magnetic" href={p.liveUrl} target="_blank" rel="noreferrer">Live demo</a>}
        {p.githubUrl && <a className="btn-magnetic" href={p.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
      </div>
      {p.coverImage && <img src={p.coverImage} alt={p.title} className="rounded-2xl mt-12 border border-white/10" />}
      {p.longDescription && <div className="prose prose-invert max-w-3xl mt-10 text-muted leading-relaxed whitespace-pre-line">{p.longDescription}</div>}
    </article>
  );
}
