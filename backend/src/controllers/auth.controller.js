import User from "../models/User.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { signToken } from "../utils/jwt.js";
import { seedDefaultCategories } from "../utils/seedCategories.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({ name, email, password });
  await seedDefaultCategories(user._id);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
    token: signToken(user._id)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    user: { id: user._id, name: user.name, email: user.email },
    token: signToken(user._id)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
