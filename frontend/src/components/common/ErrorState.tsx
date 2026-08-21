import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Unable to load data",
  message,
  onRetry,
}: Props) {
  return (
    <div className="common-error-state">
      <div className="common-error-icon">
        <AlertTriangle size={19} />
      </div>

      <div className="common-error-copy">
        <h3>{title}</h3>

        <p>{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="sandbox-btn sandbox-btn-secondary"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}