import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

export function EmptyState({
  icon,
  title,
  message,
  action,
}: Props) {
  return (
    <div className="common-empty-state">
      <div className="common-empty-icon">
        {icon}
      </div>

      <div className="common-empty-copy">
        <h3>{title}</h3>

        <p>{message}</p>
      </div>

      {action &&
        (action.to ? (
          <Link
            to={action.to}
            className="sandbox-btn sandbox-btn-primary"
          >
            {action.label}
            <ArrowRight size={15} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="sandbox-btn sandbox-btn-primary"
          >
            {action.label}
            <ArrowRight size={15} />
          </button>
        ))}
    </div>
  );
}