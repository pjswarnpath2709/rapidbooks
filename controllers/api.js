const { setDefaultStatus } = require("../utils/error");

const Invoice = require("../models/invoice");
const Account = require("../models/account");

exports.createAccount = async (req, res, next) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(200).json({ message: "account created", account });
  } catch (err) {
    setDefaultStatus(err);
    next(err);
  }
};

exports.createInvoice = async (req, res, next) => {
  try {
    console.log("\x1b[35m", "👉👉👉 req.body :", req.body);
    const invoice = new Invoice(req.body);
    await invoice.validate();
    await invoice.save();

    const { accountArray, year } = invoice;
    for (const account of accountArray) {
      const { accountId, amount } = account;
      const filter = { _id: accountId, "balances.year": year };
      const update = { $inc: { "balances.$.balance": amount } };
      await Account.updateOne(filter, update);
    }
    res.status(200).json({ message: "invoice generated", invoice });
  } catch (err) {
    setDefaultStatus(err);
    next(err);
  }
};
exports.getInvoiceList = async (req, res) => {
  try {
    const { skip = 0, limit = 10, searchText = "" } = req.query;

    const invoices = await Invoice.aggregate([
      {
        $match: {
          $or: [
            { invoiceNumber: { $regex: searchText, $options: "i" } },
            {
              accountArray: {
                $elemMatch: {
                  $or: [
                    { accountId: { $regex: searchText, $options: "i" } },
                    {
                      amount: {
                        $regex: searchText.replace(/\./g, "\\."),
                        $options: "i",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({
      message: "Invoices fetched successfully",
      invoices,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
