import { Helmet } from 'react-helmet-async';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function DocumentsPage() {
  const { properties, currentUser } = useMockBackend();
  const mine = properties.filter((p) => p.ownerId === currentUser?.id);
  const hasAny = mine.some((p) => (p.documents?.length || 0) > 0 || (p.images?.length || 0) > 0);

  return (
    <div>
      <Helmet>
        <title>Documents — NDEPMP</title>
      </Helmet>
      <h1 className="mb-6 font-display text-2xl font-semibold">Documents</h1>

      {!hasAny ? (
        <EmptyState
          icon={FileText}
          title="No documents uploaded"
          description="Ownership documents, ID uploads, and photographs from your property registrations will appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {mine
            .filter((p) => (p.documents?.length || 0) > 0 || (p.images?.length || 0) > 0)
            .map((p) => (
              <Card key={p.id}>
                <p className="font-medium">
                  {p.houseNumber} {p.street}
                </p>
                <div className="mt-3 flex flex-col gap-1.5">
                  {(p.documents || []).map((d, i) => (
                    <p key={`doc-${i}`} className="flex items-center gap-2 text-sm text-ink-muted">
                      <FileText size={13} /> {d.name}
                    </p>
                  ))}
                  {(p.images || []).map((img, i) => (
                    <p key={`img-${i}`} className="flex items-center gap-2 text-sm text-ink-muted">
                      <ImageIcon size={13} /> {img.name}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
