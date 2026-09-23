import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const platformLinks = [
  ['Services', '/services'],
  ['Coverage map', '/coverage'],
  ['Tariff bands', '/tariffs'],
  ['Citizen portal', '/login'],
];

const supportLinks = [
  ['About', '/about'],
  ['Frequently asked', '/faq'],
  ['Knowledge base', '/knowledge-base'],
  ['News & updates', '/updates'],
  ['Contact', '/contact'],
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-canvas-alt">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                <Zap size={16} />
              </span>
              NDEPMP
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink-muted">
              An independent digital registry for property addressing, metering, and utility service records.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Platform</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {platformLinks.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-ink-muted hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium">Support</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {supportLinks.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-ink-muted hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Developer- Code-Drazen.</span>
          <span>NDEPMP. Independent  platform</span>
        </div>
      </div>
    </footer>
  );
}
