import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  icon: ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)]">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">{message}</p>
      </div>
      {action && (
        action.to ? (
          <Link
            to={action.to}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
