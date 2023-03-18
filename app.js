const config = require("dotenv").config;
config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errors");
const apiRouter = require("./routes/api");

const app = express();

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_STRING)
  .then((result) => {
    app.listen(process.env.PORT);
    console.log("\x1b[36m", "👍👍👍", "database started");
  })
  .catch((err) => {
    console.error("\x1b[31m", " 👎👎👎 :", err);
  });
