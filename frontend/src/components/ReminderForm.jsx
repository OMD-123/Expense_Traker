import { useState } from "react";
import { Bell, IndianRupee } from "lucide-react";

export default function ReminderForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Bills",
    dueDate: new Date().toISOString().slice(0, 10),
    isRecurring: true,
    emailEnabled: false
  });

  return (
    <div className="glass-card">
      <div className="section-title">
        <h3>
          <Bell size={18} />
          Add Reminder
        </h3>
      </div>
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ ...form, amount: Number(form.amount) });
        }}
      >
        <label>
          Title
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
            placeholder="e.g., Electricity bill"
          />
        </label>
        <label>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <IndianRupee size={16} /> Amount
          </span>
          <input
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            placeholder="0.00"
          />
        </label>
        <label>
          Due date
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            required
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isRecurring}
            onChange={(event) => setForm({ ...form, isRecurring: event.target.checked })}
          />
          Auto-add monthly expense
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.emailEnabled}
            onChange={(event) => setForm({ ...form, emailEnabled: event.target.checked })}
          />
          Email reminder
        </label>
        <button className="primary-button" type="submit">
          Create Reminder
        </button>
      </form>
    </div>
  );
}
