import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      default: "expense"
    },
    color: {
      type: String,
      default: "#1d4ed8"
    },
    icon: {
      type: String,
      default: "wallet"
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
