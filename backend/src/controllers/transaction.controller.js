import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { monthKey, monthRange } from "../utils/date.js";

function buildQuery(userId, query) {
  const filter = { userId };

  if (query.type) {
    filter.type = query.type;
  }
  if (query.category) {
    filter.category = query.category;
  }
  if (query.keyword) {
    filter.$or = [
      { note: { $regex: query.keyword, $options: "i" } },
      { category: { $regex: query.keyword, $options: "i" } },
      { tags: { $elemMatch: { $regex: query.keyword, $options: "i" } } }
    ];
  }
  if (query.minAmount || query.maxAmount) {
    filter.amount = {};
    if (query.minAmount) filter.amount.$gte = Number(query.minAmount);
    if (query.maxAmount) filter.amount.$lte = Number(query.maxAmount);
  }
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  return filter;
}

async function buildBudgetStatus(userId, month) {
  const { start, end } = monthRange(month);
  const [budget, expenseTotalResult] = await Promise.all([
    Budget.findOne({ userId, month }),
    Transaction.aggregate([
      {
        $match: {
          userId,
          type: "expense",
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])
  ]);

  const spent = expenseTotalResult[0]?.total || 0;
  const budgetAmount = budget?.amount || 0;
  const remaining = Math.max(budgetAmount - spent, 0);
  const ratio = budgetAmount ? spent / budgetAmount : 0;

  return {
    month,
    budget: budgetAmount,
    spent,
    remaining,
    exceeded: budgetAmount > 0 && spent > budgetAmount,
    nearLimit: budgetAmount > 0 && ratio >= 0.8 && ratio <= 1
  };
}

export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find(buildQuery(req.user._id, req.query)).sort({ date: -1, createdAt: -1 });
  res.json(transactions);
});

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.create({
    userId: req.user._id,
    amount: Number(req.body.amount),
    type: req.body.type,
    category: req.body.category,
    tags: req.body.tags || [],
    date: req.body.date,
    note: req.body.note || ""
  });

  const budgetStatus = await buildBudgetStatus(req.user._id, monthKey(transaction.date));
  res.status(201).json({ transaction, budgetStatus });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      amount: Number(req.body.amount),
      type: req.body.type,
      category: req.body.category,
      tags: req.body.tags || [],
      date: req.body.date,
      note: req.body.note || ""
    },
    { new: true }
  );

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  const budgetStatus = await buildBudgetStatus(req.user._id, monthKey(transaction.date));
  res.json({ transaction, budgetStatus });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  const budgetStatus = await buildBudgetStatus(req.user._id, monthKey(transaction.date));
  res.json({ message: "Transaction deleted", budgetStatus });
});
