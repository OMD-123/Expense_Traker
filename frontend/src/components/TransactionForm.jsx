import { useEffect, useState } from "react";
import { IndianRupee, Type, Tag, Calendar, FileText, Hash } from "lucide-react";

const baseForm = {
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
  tags: ""
};

export default function TransactionForm({
  categories,
  onSubmit,
  editing,
  onCategoryCreate,
  onCancelEdit
}) {
  const [form, setForm] = useState(baseForm);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (!editing) {
      setForm(baseForm);
      return;
    }

    setForm({
      amount: editing.amount,
      type: editing.type,
      category: editing.category,
      date: new Date(editing.date).toISOString().slice(0, 10),
      note: editing.note || "",
      tags: editing.tags?.join(", ") || ""
    });
  }, [editing]);

  const filteredCategories = categories.filter((item) => item.type === form.type);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    });
    if (!editing) {
      setForm(baseForm);
    }
  }

  return (
    <div className="stack">
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <IndianRupee size={16} /> Amount
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            required
            placeholder="0.00"
          />
        </label>

        <label>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Type size={16} /> Type
          </span>
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Tag size={16} /> Category
          </span>
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            required
          >
            <option value="">Select category</option>
            {filteredCategories.map((item) => (
              <option key={`${item.type}-${item.name}`} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={16} /> Date
          </span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            required
          />
        </label>

        <label className="span-two">
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FileText size={16} /> Note
          </span>
          <input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Optional note" />
        </label>

        <label className="span-two">
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Hash size={16} /> Tags
          </span>
          <input
            value={form.tags}
            onChange={(event) => setForm({ ...form, tags: event.target.value })}
            placeholder="college, urgent, friends (comma separated)"
          />
        </label>

        <div className="form-actions span-two">
          <button className="primary-button" type="submit">
            {editing ? "Update Transaction" : "Add Transaction"}
          </button>
          {editing && (
            <button type="button" className="ghost-button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="inline-form">
        <input
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
          placeholder={`Create new ${form.type} category`}
          style={{ borderRadius: "12px" }}
        />
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            if (!newCategory.trim()) return;
            onCategoryCreate({ name: newCategory, type: form.type });
            setNewCategory("");
          }}
        >
          Create Category
        </button>
      </div>
    </div>
  );
}
