import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Card } from '@/components/ui/Card';
import { KNOWLEDGE_ARTICLES } from '@/data/content';

export default function KnowledgeBasePage() {
  const [openSlug, setOpenSlug] = useState(null);

  return (
    <>
      <Helmet>
        <title>Knowledge base — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="Support"
        title="Knowledge base"
        description="Short explainers on registration, meters, billing, and tariffs."
      />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex flex-col gap-3">
          {KNOWLEDGE_ARTICLES.map((a) => {
            const open = openSlug === a.slug;
            return (
              <Card key={a.slug} className="cursor-pointer" onClick={() => setOpenSlug(open ? null : a.slug)}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <BookOpen size={15} />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{a.category}</p>
                    <h3 className="mt-0.5 font-display text-base font-semibold">{a.title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{a.summary}</p>
                    {open && <p className="mt-3 border-t border-border pt-3 text-sm text-ink-muted">{a.body}</p>}
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
