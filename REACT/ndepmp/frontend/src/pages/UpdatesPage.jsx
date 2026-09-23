import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Megaphone, Wrench, Zap, Newspaper } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { UPDATES } from '@/data/content';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'outage', label: 'Emergency outages' },
  { value: 'maintenance', label: 'Maintenance' },
];

const iconFor = { news: Newspaper, announcement: Megaphone, outage: Zap, maintenance: Wrench };
const toneFor = { news: 'neutral', announcement: 'brand', outage: 'danger', maintenance: 'neutral' };

export default function UpdatesPage() {
  const [filter, setFilter] = useState('all');
  const items = filter === 'all' ? UPDATES : UPDATES.filter((u) => u.category === filter);

  return (
    <>
      <Helmet>
        <title>News &amp; updates — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="Updates"
        title="News, announcements & outages"
        description="Platform news, maintenance windows, and emergency outage notices in one place."
      />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filter === c.value ? 'border-brand bg-brand text-white' : 'border-border text-ink-muted hover:text-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {items.map((u) => {
            const Icon = iconFor[u.category];
            return (
              <Card key={u.id}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-canvas-alt text-ink-muted">
                    <Icon size={15} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={toneFor[u.category]} className="capitalize">
                        {u.category}
                      </Badge>
                      <span className="text-xs text-ink-muted">{new Date(u.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold">{u.title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{u.body}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
