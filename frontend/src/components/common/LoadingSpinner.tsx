import { Loader2 } from 'lucide-react';

interface Props {
  size?: number;
  label?: string;
  className?: string;
}

export function LoadingSpinner({ size = 20, label = 'Loading…', className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2 text-sm text-[var(--color-text-secondary)] ${className}`}>
      <Loader2 size={size} className="animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
