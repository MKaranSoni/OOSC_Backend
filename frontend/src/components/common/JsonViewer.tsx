import { useState, useCallback } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  data: unknown;
  title?: string;
}

function JsonNode({ value, depth = 0 }: { value: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 1);

  if (value === null) return <span className="text-[var(--color-text-muted)]">null</span>;
  if (value === undefined) return <span className="text-[var(--color-text-muted)]">undefined</span>;
  if (typeof value === 'boolean') return <span className="text-purple-400">{String(value)}</span>;
  if (typeof value === 'number') return <span className="text-blue-400">{String(value)}</span>;
  if (typeof value === 'string') return <span className="text-[var(--color-success)]">"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-[var(--color-text-secondary)]">[]</span>;
    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-0.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          <span className="text-[var(--color-text-secondary)]">[{value.length}]</span>
        </button>
        {!collapsed && (
          <span className="block">
            {value.map((item, i) => (
              <span key={i} className="block" style={{ paddingLeft: `${(depth + 1) * 16}px` }}>
                <span className="text-[var(--color-text-muted)]">{i}: </span>
                <JsonNode value={item} depth={depth + 1} />
                {i < value.length - 1 && <span className="text-[var(--color-text-muted)]">,</span>}
              </span>
            ))}
          </span>
        )}
      </span>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-[var(--color-text-secondary)]">{'{}'}</span>;
    return (
      <span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-0.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          <span className="text-[var(--color-text-secondary)]">{`{${entries.length}}`}</span>
        </button>
        {!collapsed && (
          <span className="block">
            {entries.map(([k, v], i) => (
              <span key={k} className="block" style={{ paddingLeft: `${(depth + 1) * 16}px` }}>
                <span className="text-[var(--color-accent-hover)]">"{k}"</span>
                <span className="text-[var(--color-text-muted)]">: </span>
                <JsonNode value={v} depth={depth + 1} />
                {i < entries.length - 1 && <span className="text-[var(--color-text-muted)]">,</span>}
              </span>
            ))}
          </span>
        )}
      </span>
    );
  }

  return <span className="text-[var(--color-text-secondary)]">{String(value)}</span>;
}

export function JsonViewer({ data, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  if (data === null || data === undefined) {
    return (
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4">
        <p className="text-sm text-[var(--color-text-muted)] italic">No execution trace available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          {title ?? 'JSON'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          {copied ? (
            <><Check size={12} className="text-[var(--color-success)]" /> Copied</>
          ) : (
            <><Copy size={12} /> Copy JSON</>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto font-mono-editor text-xs text-[var(--color-text-primary)] leading-relaxed">
        <JsonNode value={data} depth={0} />
      </div>
    </div>
  );
}
