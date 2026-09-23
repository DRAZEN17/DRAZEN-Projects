import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Home, Zap, Receipt, MessageSquare, FileText, LifeBuoy, User, Users,
  ClipboardCheck, BarChart3, CreditCard, UserCog, ShieldCheck, History, MapPin, Building2, Sliders,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const citizenNav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/properties', label: 'Properties', icon: Home },
  { href: '/dashboard/electricity', label: 'Electricity', icon: Zap },
  { href: '/dashboard/bills', label: 'Bills', icon: Receipt },
  { href: '/dashboard/complaints', label: 'Complaints', icon: MessageSquare },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const adminNav = [
  { section: 'Admin', items: [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/properties', label: 'Property approvals', icon: ClipboardCheck },
    { href: '/admin/complaints', label: 'Complaints', icon: MessageSquare },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  ]},
  { section: 'System', items: [
    { href: '/admin/staff', label: 'Staff', icon: UserCog },
    { href: '/admin/roles', label: 'Roles', icon: ShieldCheck },
    { href: '/admin/states', label: 'States', icon: MapPin },
    { href: '/admin/utility-companies', label: 'Utility companies', icon: Building2 },
    { href: '/admin/tariffs', label: 'Tariffs', icon: Sliders },
    { href: '/admin/audit-log', label: 'Audit log', icon: History },
    { href: '/admin/settings', label: 'Settings', icon: Sliders },
  ]},
];

export function Sidebar({ variant = 'citizen' }) {
  const { pathname } = useLocation();

  const linkClasses = (href) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
      pathname === href ? 'bg-brand text-white' : 'text-ink-muted hover:bg-canvas hover:text-ink'
    );

  return (
    <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-canvas-alt p-4 md:flex">
      <Link to="/" className="mb-6 flex items-center gap-2 px-2 font-display font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
          <Zap size={16} />
        </span>
        <span>
          NDEPMP
          {variant === 'admin' && <span className="ml-1.5 text-xs font-normal text-ink-muted">Admin</span>}
        </span>
      </Link>

      {variant === 'admin' ? (
        <nav className="flex flex-1 flex-col gap-4">
          {adminNav.map((group) => (
            <div key={group.section}>
              <p className="px-3 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-muted/70">{group.section}</p>
              <div className="flex flex-col gap-1">
                {group.items.map(({ href, label, icon: Icon }) => (
                  <Link key={href} to={href} className={linkClasses(href)}>
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      ) : (
        <nav className="flex flex-1 flex-col gap-1">
          {citizenNav.map(({ href, label, icon: Icon }) => (
            <Link key={href} to={href} className={linkClasses(href)}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </aside>
  );
}
