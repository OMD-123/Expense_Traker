import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency } from "../utils/currency.js";

const COLORS = ["#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function ChartsPanel({ dashboard }) {
  const tooltipFormatter = (value) => formatCurrency(value);

  return (
    <section className="charts-grid">
      <div className="glass-card chart-card">
        <div className="section-title">
          <h3>Category-wise Spending</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={dashboard.categorySpending}
              dataKey="value"
              nameKey="name"
              outerRadius={95}
              fill="#f97316"
              labelLine={false}
            >
              {dashboard.categorySpending?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(15, 23, 42, 0.1)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card chart-card">
        <div className="section-title">
          <h3>Monthly Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dashboard.monthlyComparison}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.08)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => formatCurrency(value)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(15, 23, 42, 0.1)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "16px" }} />
            <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card chart-card chart-card-full">
        <div className="section-title">
          <h3>Daily Spending Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dashboard.dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.08)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => formatCurrency(value)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(15, 23, 42, 0.1)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
