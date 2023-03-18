const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
  year: {
    type: String,
    enum: ["2022-23", "2023-24", "2024-25"],
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  balances: {
    type: [balanceSchema],
    validate: [
      (balances) => balances.length === 3,
      "{PATH} must have exactly 3 years of balances",
    ],
  },
});

module.exports = mongoose.model("Account", accountSchema);
