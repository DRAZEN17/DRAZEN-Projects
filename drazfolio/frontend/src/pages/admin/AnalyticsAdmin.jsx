import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchAnalyticsSummary } from '../../services/analytics.js';

export default function AnalyticsAdmin() {
  const [s, setS] = useState(null);
  useEffect(() => { fetchAnalyticsSummary().then(setS).catch(() => {}); }, []);

  const series = useMemo(() => {
    if (!s?.byDay) return [];
    const map = {};
    for (const r of s.byDay) {
      map[r._id.d] ??= { day: r._id.d };
      map[r._id.d][r._id.t] = r.n;
    }
    return Object.values(map).sort((a, b) => a.day.localeCompare(b.day));
  }, [s]);

  return (
    <div>
      <h1 className="h2">Analytics</h1>
      <div className="glass p-6 mt-8 h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="day" stroke="#8a93a6" />
            <YAxis stroke="#8a93a6" />
            <Tooltip contentStyle={{ background: '#0b0d14', border: '1px solid rgba(255,255,255,0.1)' }} />
            <Legend />
            <Line type="monotone" dataKey="page_view" stroke="#22d3ee" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="project_click" stroke="#ff2bd6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="blog_view" stroke="#7c3aed" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="contact_submit" stroke="#a3e635" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
