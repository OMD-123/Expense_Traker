import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/currency.js";

export default function SummaryCards({ summary }) {
  const cards = [
    {
      label: "Monthly Income",
      value: summary?.income || 0,
      accent: "income",
      icon: ArrowUpCircle
    },
    {
      label: "Monthly Expense",
      value: summary?.expense || 0,
      accent: "expense",
      icon: ArrowDownCircle
    },
    {
      label: "Current Balance",
      value: summary?.balance || 0,
      accent: "balance",
      icon: Wallet
    }
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.label} className={`summary-card ${card.accent}`}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Icon size={20} strokeWidth={2.5} />
              <p>{card.label}</p>
            </div>
            <h2>{formatCurrency(card.value)}</h2>
          </article>
        );
      })}
    </section>
  );
}
