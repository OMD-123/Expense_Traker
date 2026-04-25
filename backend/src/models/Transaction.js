import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      default: ""
    },
    isRecurringGenerated: {
      type: Boolean,
      default: false
    },
    recurringSourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reminder",
      default: null
    }
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });

export default mongoose.model("Transaction", transactionSchema);
