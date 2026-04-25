import Category from "../models/Category.js";
import { asyncHandler } from "../middleware/async.middleware.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ userId: req.user._id }).sort({ type: 1, name: 1 });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    userId: req.user._id,
    name: req.body.name,
    type: req.body.type || "expense",
    color: req.body.color || "#1d4ed8",
    icon: req.body.icon || "wallet"
  });

  res.status(201).json(category);
});
