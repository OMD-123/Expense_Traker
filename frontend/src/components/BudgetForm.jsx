import { useEffect, useState } from "react";
import { IndianRupee, Target } from "lucide-react";

export default function BudgetForm({ activeMonth, budget, onSubmit }) {
  const [amount, setAmount] = useState(budget?.amount || "");

  useEffect(() => {
    setAmount(budget?.amount || "");
  }, [budget?.amount]);

  return (
    <div className="glass-card">
      <div className="section-title">
        <h3>
          <Target size={18} />
          Set Monthly Budget
        </h3>
      </div>
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ month: activeMonth, amount: Number(amount) });
        }}
      >
        <label>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <IndianRupee size={16} /> Budget amount
          </span>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            placeholder="Enter budget amount"
          />
        </label>
        <button className="primary-button" type="submit">
          Save Budget
        </button>
      </form>
    </div>
  );
}
