import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchAnalyticsSummary } from '../../services/analytics.js';

export default function AnalyticsAdmin() {
  const [s, setS] = useState(null);
  useEffect(() => { fetchAnalyticsSummary().then(setS).catch(() => {}); }, []);

  // Support both backend aggregation format `{ _id: { d, t }, n }` and
  // the frontend/local format `{ day: 'YYYY-MM-DD', page_view: 1, ... }`.
  const series = useMemo(() => {
    if (!s?.byDay) return [];
    const map = {};
    for (const r of s.byDay) {
      if (r?._id) {
        const day = r._id.d;
        const type = r._id.t;
        map[day] ??= { day };
        map[day][type] = r.n;
      } else if (r?.day) {
        const day = r.day;
        map[day] ??= { day };
        for (const [k, v] of Object.entries(r)) {
          if (k === 'day') continue;
          map[day][k] = v;
        }
      }
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
