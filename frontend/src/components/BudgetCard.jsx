import { Target, AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency } from "../utils/currency.js";

export default function BudgetCard({ budget }) {
  const ratio = budget?.amount ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;

  const statusConfig = {
    exceeded: {
      label: "Budget exceeded",
      icon: AlertTriangle,
      className: "danger"
    },
    nearLimit: {
      label: "Almost exceeded",
      icon: AlertTriangle,
      className: "warning"
    },
    default: {
      label: "Within budget",
      icon: CheckCircle,
      className: "safe"
    }
  };

  const currentStatus = budget?.exceeded
    ? statusConfig.exceeded
    : budget?.nearLimit
    ? statusConfig.nearLimit
    : statusConfig.default;

  const StatusIcon = currentStatus.icon;

  return (
    <div className="glass-card">
      <div className="section-title">
        <h3>
          <Target size={18} />
          Budget Planning
        </h3>
      </div>
      <div className="budget-meta">
        <div>
          <p className="muted">Budget</p>
          <strong style={{ fontSize: "1.1rem" }}>{formatCurrency(budget?.amount)}</strong>
        </div>
        <div>
          <p className="muted">Spent</p>
          <strong style={{ fontSize: "1.1rem" }}>{formatCurrency(budget?.spent)}</strong>
        </div>
        <div>
          <p className="muted">Remaining</p>
          <strong style={{ fontSize: "1.1rem" }}>{formatCurrency(budget?.remaining)}</strong>
        </div>
      </div>
      <div className="budget-track">
        <div
          className="budget-fill"
          style={{
            width: `${ratio}%`,
            background: budget?.exceeded
              ? "linear-gradient(90deg, #dc2626, #ef4444)"
              : budget?.nearLimit
              ? "linear-gradient(90deg, #d97706, #f59e0b)"
              : "linear-gradient(90deg, #2563eb, #0ea5e9)"
          }}
        />
      </div>
      <p className={`budget-alert ${currentStatus.className}`}>
        <StatusIcon size={16} />
        {currentStatus.label}
      </p>
    </div>
  );
}
