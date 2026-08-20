interface Props {
  passed: boolean | null;
  size?: 'sm' | 'md';
}

export function PassFailBadge({ passed, size = 'md' }: Props) {
  if (passed === null || passed === undefined) {
    return (
      <span className={`inline-flex items-center gap-1 rounded font-medium ${size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]`}>
        N/A
      </span>
    );
  }
  return passed ? (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} bg-[var(--color-success-subtle)] text-[var(--color-success)] border border-[color:color-mix(in_srgb,var(--color-success)_20%,transparent)]`}>
      <span aria-hidden="true">●</span> PASS
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border border-[color:color-mix(in_srgb,var(--color-danger)_20%,transparent)]`}>
      <span aria-hidden="true">●</span> FAIL
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const upper = status.toUpperCase();
  let cls = 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]';
  if (upper === 'COMPLETED') cls = 'bg-[var(--color-success-subtle)] text-[var(--color-success)] border-[color:color-mix(in_srgb,var(--color-success)_20%,transparent)]';
  if (upper === 'RUNNING') cls = 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[color:color-mix(in_srgb,var(--color-accent)_20%,transparent)]';
  if (upper === 'CREATED') cls = 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border-[color:color-mix(in_srgb,var(--color-warning)_20%,transparent)]';
  if (upper === 'FAILED' || upper === 'ERROR') cls = 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border-[color:color-mix(in_srgb,var(--color-danger)_20%,transparent)]';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded font-medium border ${cls}`}>
      <span aria-hidden="true">●</span>
      {status}
    </span>
  );
}
