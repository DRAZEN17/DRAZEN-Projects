import { useEffect, useState } from 'react';
import { fetchAnalyticsSummary } from '../../services/analytics.js';

const Stat = ({ label, value, accent }) => (
  <div className="glass p-6">
    <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
    <div className={`font-display text-4xl mt-2 ${accent}`}>{value}</div>
  </div>
);

export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { fetchAnalyticsSummary().then(setS).catch(() => {}); }, []);
  return (
    <div>
      <h1 className="h2">Overview</h1>
      <p className="text-muted mt-2">Last 30 days.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Stat label="Page views" value={s?.pageViews ?? '—'} accent="text-neon-cyan" />
        <Stat label="Project clicks" value={s?.projectClicks ?? '—'} accent="text-neon-magenta" />
        <Stat label="Blog views" value={s?.blogViews ?? '—'} accent="text-neon-violet" />
        <Stat label="Contact submits" value={s?.contacts ?? '—'} accent="text-neon-lime" />
      </div>
    </div>
  );
}
