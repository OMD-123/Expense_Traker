import Transaction from "../models/Transaction.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { monthKey, monthRange } from "../utils/date.js";

export const getInsights = asyncHandler(async (req, res) => {
  const month = req.query.month || monthKey();
  const { start, end } = monthRange(month);

  const spending = await Transaction.aggregate([
    { $match: { userId: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    },
    { $sort: { total: -1 } }
  ]);

  const total = spending.reduce((sum, item) => sum + item.total, 0);
  const top = spending[0];
  const insights = [];

  if (top && total > 0) {
    const percent = Math.round((top.total / total) * 100);
    insights.push(`Your highest spending is ${top._id} at ${percent}% of this month's expenses.`);
  }

  const food = spending.find((item) => item._id.toLowerCase() === "food");
  if (food && total > 0 && food.total / total >= 0.3) {
    insights.push("Food spending is unusually high this month. Consider setting a smaller weekly meal budget.");
  }

  const travel = spending.find((item) => item._id.toLowerCase() === "travel");
  if (travel && total > 0 && travel.total / total >= 0.2) {
    insights.push("Travel expenses are a meaningful share of spending. Review whether rides or fuel can be optimized.");
  }

  if (insights.length === 0) {
    insights.push("Spending looks balanced this month. Keep tracking categories to improve future recommendations.");
  }

  res.json({ month, insights });
});
