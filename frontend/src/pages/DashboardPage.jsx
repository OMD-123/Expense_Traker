import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Download, LogOut, PlusCircle, Repeat, Sparkles } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import BudgetCard from "../components/BudgetCard.jsx";
import ChartsPanel from "../components/ChartsPanel.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import FiltersBar from "../components/FiltersBar.jsx";
import BudgetForm from "../components/BudgetForm.jsx";
import ReminderForm from "../components/ReminderForm.jsx";

const emptyFilters = {
  category: "",
  keyword: "",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: ""
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(null);
  const [insights, setInsights] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeMonth = useMemo(() => {
    const date = new Date();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    return `${date.getFullYear()}-${month}`;
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const [dashboardRes, transactionsRes, categoriesRes, budgetRes, insightsRes] = await Promise.all([
        api.get(`/dashboard?month=${activeMonth}`),
        api.get("/transactions", { params }),
        api.get("/categories"),
        api.get(`/budgets?month=${activeMonth}`),
        api.get(`/insights?month=${activeMonth}`)
      ]);

      setDashboard(dashboardRes.data);
      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
      setBudget(budgetRes.data);
      setInsights(insightsRes.data.insights);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [activeMonth, filters.category, filters.endDate, filters.keyword, filters.maxAmount, filters.minAmount, filters.startDate]);

  async function handleTransactionSubmit(payload) {
    try {
      if (editing) {
        const response = await api.put(`/transactions/${editing._id}`, payload);
        if (response.data.budgetStatus?.exceeded) {
          toast.error("Budget exceeded for this month");
        } else if (response.data.budgetStatus?.nearLimit) {
          toast("Budget almost exceeded");
        }
        toast.success("Transaction updated");
      } else {
        const response = await api.post("/transactions", payload);
        if (response.data.budgetStatus?.exceeded) {
          toast.error("Budget exceeded for this month");
        } else if (response.data.budgetStatus?.nearLimit) {
          toast("Budget almost exceeded");
        }
        toast.success("Transaction added");
      }

      setEditing(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save transaction");
    }
  }

  async function handleDeleteTransaction(id) {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  }

  async function handleBudgetSubmit(payload) {
    try {
      await api.post("/budgets", payload);
      toast.success("Budget updated");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Budget save failed");
    }
  }

  async function handleCategoryCreate(payload) {
    try {
      await api.post("/categories", payload);
      toast.success("Category created");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Category save failed");
    }
  }

  async function handleReminderSubmit(payload) {
    try {
      await api.post("/reminders", payload);
      toast.success("Reminder created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reminder creation failed");
    }
  }

  async function exportFile(kind) {
    try {
      const token = localStorage.getItem("expense-tracker-token");
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${baseUrl}/exports/${kind}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = kind === "pdf" ? "expense-report.pdf" : "expense-report.xlsx";
      link.click();
      URL.revokeObjectURL(href);
    } catch {
      toast.error("Export failed");
    }
  }

  if (loading && !dashboard) {
    return <div className="page-loader">Loading dashboard...</div>;
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Finance Control Panel</p>
          <h1>Hello, {user?.name?.split(" ")[0] || "User"}</h1>
          <p className="muted">Track income, spending patterns, budgets, and recurring bills.</p>
        </div>

        <div className="topbar-actions">
          <button className="secondary-button" onClick={() => exportFile("pdf")}>
            <Download size={16} /> PDF
          </button>
          <button className="secondary-button" onClick={() => exportFile("excel")}>
            <Download size={16} /> Excel
          </button>
          <button className="secondary-button" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <SummaryCards summary={dashboard.summary} />

      <section className="grid-two">
        <BudgetCard budget={budget} />
        <div className="glass-card insights-card">
          <div className="section-title">
            <h3>
              <Sparkles size={18} /> AI-Based Insights
            </h3>
          </div>
          <div className="insight-list">
            {insights.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </section>

      <ChartsPanel dashboard={dashboard} />

      <section className="workspace-grid">
        <div className="stack">
          <div className="glass-card">
            <div className="section-title">
              <h3>
                <PlusCircle size={18} /> {editing ? "Edit transaction" : "Add transaction"}
              </h3>
            </div>
            <TransactionForm
              categories={categories}
              onSubmit={handleTransactionSubmit}
              editing={editing}
              onCategoryCreate={handleCategoryCreate}
              onCancelEdit={() => setEditing(null)}
            />
          </div>

          <div className="grid-two compact-grid">
            <BudgetForm activeMonth={activeMonth} budget={budget} onSubmit={handleBudgetSubmit} />
            <ReminderForm onSubmit={handleReminderSubmit} />
          </div>
        </div>

        <div className="stack">
          <div className="glass-card">
            <div className="section-title">
              <h3>Advanced Filters</h3>
            </div>
            <FiltersBar filters={filters} setFilters={setFilters} categories={categories} />
          </div>

          <div className="glass-card">
            <div className="section-title">
              <h3>
                <Repeat size={18} /> Transactions
              </h3>
            </div>
            <TransactionTable
              transactions={transactions}
              onEdit={setEditing}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
