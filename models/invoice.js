const mongoose = require("mongoose");
const Account = require("./account");

const invoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  accountArray: {
    type: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    validate: [
      (accountArray) => accountArray.length > 0,
      "{PATH} must have at least one account",
    ],
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    enum: ["2022-23", "2023-24", "2024-25"],
    required: true,
  },
});

invoiceSchema.path("year").validate(function (year) {
  const regex = /^(20)\d{2}-\d{2}$/;
  return regex.test(year);
}, 'Year should be in the format of "YYYY-YY"');

invoiceSchema.path("accountArray").validate(function (arr) {
  const total = arr.reduce((acc, curr) => acc + curr.amount, 0);
  return total === this.totalAmount;
}, "Total of amount in AccountArray should be equal to Total Amount.");

invoiceSchema.path("accountArray").validate(function (arr) {
  return arr.every(async ({ accountId }) => {
    const account = await Account.findById(accountId);
    if (!account) {
      return false;
    }
    return true;
  });
}, "accountId should exist in Database.");

invoiceSchema.path("invoiceNumber").validate(async function (invoiceNumber) {
  const count = await this.constructor.countDocuments({
    year: this.year,
    invoiceNumber,
  });
  return !count;
}, "Invoice number should be unique for the same year.");

module.exports = mongoose.model("Invoice", invoiceSchema);
