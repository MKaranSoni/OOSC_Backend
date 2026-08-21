import {
  useCallback,
  useState,
  type ReactNode,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
} from "lucide-react";

interface Props {
  data: unknown;
  title?: string;
}

interface JsonNodeProps {
  value: unknown;
  depth?: number;
}

function JsonNode({
  value,
  depth = 0,
}: JsonNodeProps): ReactNode {
  const [collapsed, setCollapsed] =
    useState(depth > 1);

  if (value === null) {
    return (
      <span className="json-value json-null">
        null
      </span>
    );
  }

  if (value === undefined) {
    return (
      <span className="json-value json-null">
        undefined
      </span>
    );
  }

  if (typeof value === "boolean") {
    return (
      <span className="json-value json-boolean">
        {String(value)}
      </span>
    );
  }

  if (typeof value === "number") {
    return (
      <span className="json-value json-number">
        {String(value)}
      </span>
    );
  }

  if (typeof value === "string") {
    return (
      <span className="json-value json-string">
        "{value}"
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <span className="json-value json-empty">
          []
        </span>
      );
    }

    return (
      <span className="json-node">
        <button
          type="button"
          onClick={() =>
            setCollapsed((current) => !current)
          }
          className="sandbox-json-toggle"
          aria-label={
            collapsed
              ? "Expand array"
              : "Collapse array"
          }
        >
          {collapsed ? (
            <ChevronRight size={13} />
          ) : (
            <ChevronDown size={13} />
          )}

          <span>
            Array ({value.length})
          </span>
        </button>

        {!collapsed && (
          <span className="json-children">
            {value.map((item, index) => (
              <span
                key={index}
                className="json-row"
                style={{
                  paddingLeft: `${(depth + 1) * 18}px`,
                }}
              >
                <span className="json-key json-index">
                  {index}
                </span>

                <span className="json-colon">
                  :
                </span>

                <JsonNode
                  value={item}
                  depth={depth + 1}
                />

                {index < value.length - 1 && (
                  <span className="json-punctuation">
                    ,
                  </span>
                )}
              </span>
            ))}
          </span>
        )}
      </span>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(
      value as Record<string, unknown>
    );

    if (entries.length === 0) {
      return (
        <span className="json-value json-empty">
          {"{}"}
        </span>
      );
    }

    return (
      <span className="json-node">
        <button
          type="button"
          onClick={() =>
            setCollapsed((current) => !current)
          }
          className="sandbox-json-toggle"
          aria-label={
            collapsed
              ? "Expand object"
              : "Collapse object"
          }
        >
          {collapsed ? (
            <ChevronRight size={13} />
          ) : (
            <ChevronDown size={13} />
          )}

          <span>
            Object ({entries.length})
          </span>
        </button>

        {!collapsed && (
          <span className="json-children">
            {entries.map(([key, item], index) => (
              <span
                key={key}
                className="json-row"
                style={{
                  paddingLeft: `${(depth + 1) * 18}px`,
                }}
              >
                <span className="json-key">
                  "{key}"
                </span>

                <span className="json-colon">
                  :
                </span>

                <JsonNode
                  value={item}
                  depth={depth + 1}
                />

                {index < entries.length - 1 && (
                  <span className="json-punctuation">
                    ,
                  </span>
                )}
              </span>
            ))}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="json-value json-null">
      {String(value)}
    </span>
  );
}

export function JsonViewer({
  data,
  title,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  const handleCopy = useCallback(async () => {
    try {
      const text = JSON.stringify(
        data,
        null,
        2
      );

      await navigator.clipboard.writeText(text);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, [data]);

  if (
    data === null ||
    data === undefined
  ) {
    return (
      <div className="json-viewer json-viewer-empty">
        <div>
          <strong>
            No execution trace available
          </strong>

          <p>
            Execution details will appear here
            after a test run produces trace data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="json-viewer">
      <div className="json-viewer-header">
        <div>
          <span className="json-viewer-label">
            EXECUTION DATA
          </span>

          <strong>
            {title ?? "JSON"}
          </strong>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="sandbox-btn sandbox-btn-secondary sandbox-btn-small"
        >
          {copied ? (
            <>
              <Check size={13} />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy JSON
            </>
          )}
        </button>
      </div>

      <div className="json-viewer-body">
        <JsonNode
          value={data}
          depth={0}
        />
      </div>
    </div>
  );
}