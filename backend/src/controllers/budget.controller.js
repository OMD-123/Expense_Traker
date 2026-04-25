import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { monthKey, monthRange } from "../utils/date.js";

export const getBudget = asyncHandler(async (req, res) => {
  const month = req.query.month || monthKey();
  const { start, end } = monthRange(month);

  const [budget, spentResult] = await Promise.all([
    Budget.findOne({ userId: req.user._id, month }),
    Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: "expense",
          date: { $gte: start, $lt: end }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
  ]);

  const spent = spentResult[0]?.total || 0;
  const amount = budget?.amount || 0;

  res.json({
    month,
    amount,
    spent,
    remaining: Math.max(amount - spent, 0),
    exceeded: amount > 0 && spent > amount,
    nearLimit: amount > 0 && spent / amount >= 0.8 && spent <= amount
  });
});

export const setBudget = asyncHandler(async (req, res) => {
  const month = req.body.month || monthKey();
  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id, month },
    { amount: Number(req.body.amount) },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json(budget);
});
