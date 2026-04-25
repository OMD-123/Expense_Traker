import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { monthKey, monthRange } from "../utils/date.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const month = req.query.month || monthKey();
  const { start, end } = monthRange(month);

  const [monthlySummary, categorySpending, monthlyComparison, dailyTrend, latestTransactions, budget] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" }
        }
      },
      { $sort: { value: -1 } }
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]),
    Transaction.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(7),
    Budget.findOne({ userId: req.user._id, month })
  ]);

  const income = monthlySummary.find((item) => item._id === "income")?.total || 0;
  const expense = monthlySummary.find((item) => item._id === "expense")?.total || 0;
  const budgetAmount = budget?.amount || 0;

  res.json({
    summary: {
      month,
      income,
      expense,
      balance: income - expense
    },
    budget: {
      amount: budgetAmount,
      spent: expense,
      remaining: Math.max(budgetAmount - expense, 0),
      exceeded: budgetAmount > 0 && expense > budgetAmount
    },
    categorySpending: categorySpending.map((item) => ({ name: item._id, value: item.value })),
    monthlyComparison: monthlyComparison.reduce((acc, item) => {
      const label = `${item._id.year}-${`${item._id.month}`.padStart(2, "0")}`;
      const existing = acc.find((entry) => entry.month === label);

      if (existing) {
        existing[item._id.type] = item.total;
        return acc;
      }

      acc.push({
        month: label,
        income: item._id.type === "income" ? item.total : 0,
        expense: item._id.type === "expense" ? item.total : 0
      });
      return acc;
    }, []),
    dailyTrend: dailyTrend.map((item) => ({ day: item._id, amount: item.amount })),
    latestTransactions
  });
});
