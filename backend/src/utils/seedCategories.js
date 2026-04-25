import Category from "../models/Category.js";

const defaultCategories = [
  { name: "Food", type: "expense", color: "#ef4444" },
  { name: "Travel", type: "expense", color: "#f97316" },
  { name: "Rent", type: "expense", color: "#8b5cf6" },
  { name: "Bills", type: "expense", color: "#0ea5e9" },
  { name: "Shopping", type: "expense", color: "#14b8a6" },
  { name: "Salary", type: "income", color: "#16a34a" },
  { name: "Freelance", type: "income", color: "#84cc16" }
];

export async function seedDefaultCategories(userId) {
  const payload = defaultCategories.map((category) => ({
    ...category,
    userId,
    isDefault: true
  }));

  await Category.insertMany(payload, { ordered: false }).catch(() => null);
}
