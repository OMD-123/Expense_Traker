import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/currency.js";

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
        <p style={{ fontSize: "1rem", margin: 0 }}>No transactions found for the current filters.</p>
        <p style={{ fontSize: "0.85rem", margin: "8px 0 0", opacity: 0.8 }}>Add a new transaction to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Tags</th>
            <th>Amount</th>
            <th>Note</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item._id}>
              <td style={{ color: "var(--text-light)" }}>{new Date(item.date).toLocaleDateString("en-IN")}</td>
              <td>
                <span className={`pill ${item.type}`}>{item.type}</span>
              </td>
              <td style={{ fontWeight: 500 }}>{item.category}</td>
              <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{item.tags?.join(", ") || "-"}</td>
              <td style={{ fontWeight: 600, color: item.type === "income" ? "var(--income)" : "var(--expense)" }}>
                {item.type === "income" ? "+" : "-"}{formatCurrency(item.amount)}
              </td>
              <td style={{ color: "var(--text-light)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.note || "-"}
              </td>
              <td className="row-actions" style={{ justifyContent: "flex-end" }}>
                <button className="icon-button" onClick={() => onEdit(item)} title="Edit">
                  <Pencil size={16} />
                </button>
                <button className="icon-button danger" onClick={() => onDelete(item._id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
