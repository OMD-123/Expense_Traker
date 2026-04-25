import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: "Bills"
    },
    dueDate: {
      type: Date,
      required: true
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurrence: {
      type: String,
      enum: ["monthly"],
      default: "monthly"
    },
    emailEnabled: {
      type: Boolean,
      default: false
    },
    lastTriggeredAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
