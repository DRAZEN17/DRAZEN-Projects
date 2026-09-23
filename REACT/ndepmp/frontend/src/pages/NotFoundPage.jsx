import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
      <Helmet>
        <title>Page not found — NDEPMP</title>
      </Helmet>
      <p className="font-display text-6xl font-semibold text-brand">404</p>
      <h1 className="font-display text-xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Button href="/" variant="primary" size="sm">
        Back home
      </Button>
    </div>
  );
}
