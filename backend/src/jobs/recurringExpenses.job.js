import cron from "node-cron";
import Reminder from "../models/Reminder.js";
import Transaction from "../models/Transaction.js";

async function processRecurringExpenses() {
  const today = new Date();
  const reminders = await Reminder.find({ isRecurring: true });

  for (const reminder of reminders) {
    const dueDate = new Date(reminder.dueDate);
    const sameDay = dueDate.getDate() === today.getDate();
    const alreadyTriggeredThisMonth =
      reminder.lastTriggeredAt &&
      reminder.lastTriggeredAt.getMonth() === today.getMonth() &&
      reminder.lastTriggeredAt.getFullYear() === today.getFullYear();

    if (!sameDay || alreadyTriggeredThisMonth) {
      continue;
    }

    await Transaction.create({
      userId: reminder.userId,
      amount: reminder.amount,
      type: "expense",
      category: reminder.category,
      date: today,
      note: `Auto-added recurring expense: ${reminder.title}`,
      isRecurringGenerated: true,
      recurringSourceId: reminder._id
    });

    reminder.lastTriggeredAt = today;
    await reminder.save();
  }
}

export function startRecurringExpenseJob() {
  cron.schedule("0 8 * * *", () => {
    processRecurringExpenses().catch((error) => {
      console.error("Recurring expense job failed", error);
    });
  });
}
