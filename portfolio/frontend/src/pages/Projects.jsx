import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { projectsService } from '../services/content.js';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Projects() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { projectsService.list({ limit: 100 }).then((r) => setItems(r.data || [])); }, []);
  // Use a fixed, custom list of filter labels instead of deriving from project tags
  const CUSTOM_TAGS = ['all', 'React', 'Python', 'Node.js (backends)', 'UI/UX', 'Flutter/Dart', 'Java'];
  const tags = CUSTOM_TAGS;
  const filtered = filter === 'all' ? items : items.filter((i) => i.techStack?.includes(filter));

  return (
    <section className="section pt-40">
      <Helmet><title>Projects · Portfolio</title></Helmet>
      <p className="eyebrow">Projects</p>
      <h1 className="h1 mt-4">Recent work.</h1>
      <div className="mt-10 flex flex-wrap gap-2">
        {tags.slice(0, 12).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
                  className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition ${filter === t ? 'border-neon-cyan text-white bg-neon-cyan/10' : 'border-white/10 text-muted hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {filtered.map((p) => <ProjectCard key={p._id} project={p} />)}
      </div>
    </section>
  );
}
