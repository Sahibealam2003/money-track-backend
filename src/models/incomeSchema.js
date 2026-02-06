const mongoose = require("mongoose")

const incomeSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

const Income = mongoose.model("Income", incomeSchema)

module.exports = Income
