import { Link, Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgb(255_255_255/0.1),_transparent_55%)]" />
        <Link to="/" className="relative flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Zap size={18} />
          </span>
          NDEPMP
        </Link>

        <div className="relative">
          <h1 className="max-w-md font-display text-4xl font-semibold leading-tight">
            One verified identity for every property in Nigeria.
          </h1>
          <p className="mt-5 max-w-sm text-white/70">
            Your account gives you access to property registration, digital address certificates, meter linkage,
            billing history, and complaint tracking.
          </p>
        </div>

        <p className="relative text-xs text-white/50">Independent registry · Secured with encryption</p>
      </div>

      <div className="flex items-center justify-center bg-canvas px-4 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display font-semibold lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <Zap size={16} />
            </span>
            NDEPMP
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
