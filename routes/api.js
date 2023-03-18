const router = require("express").Router();
const apiController = require("../controllers/api");

router.post("/createaccount", apiController.createAccount);

router.post("/createinvoice", apiController.createInvoice);

router.get("/invoicelist", apiController.getInvoiceList);

module.exports = router;
