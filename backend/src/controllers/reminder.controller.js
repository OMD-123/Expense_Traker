import Reminder from "../models/Reminder.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { sendReminderEmail } from "../utils/mailer.js";

export const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id }).sort({ dueDate: 1 });
  res.json(reminders);
});

export const createReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.create({
    userId: req.user._id,
    title: req.body.title,
    amount: Number(req.body.amount || 0),
    category: req.body.category || "Bills",
    dueDate: req.body.dueDate,
    isRecurring: Boolean(req.body.isRecurring),
    emailEnabled: Boolean(req.body.emailEnabled)
  });

  if (reminder.emailEnabled) {
    await sendReminderEmail({
      to: req.user.email,
      title: reminder.title,
      dueDate: reminder.dueDate,
      amount: reminder.amount
    }).catch(() => null);
  }

  res.status(201).json(reminder);
});
