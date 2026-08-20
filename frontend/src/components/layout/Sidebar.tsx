import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FlaskConical, BarChart3, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/suites/new', label: 'New Test Suite', icon: PlusCircle },
  { to: '/runs', label: 'Test Runs', icon: FlaskConical },
  { to: '/results', label: 'Results', icon: BarChart3 },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
      isActive
        ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-hover)] font-medium'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-60 flex flex-col bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
        aria-label="Sidebar navigation"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-bold tracking-widest text-[var(--color-text-primary)] uppercase">
              Reliability
            </div>
            <div className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase">
              Engine
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Workspace
          </p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3">
          <NavLink to="/settings" className={navLinkClass}>
            <Settings size={16} aria-hidden="true" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
