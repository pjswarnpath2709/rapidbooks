const errorHandler = (error, req, res, next) => {
  console.error("\x1b[31m", " 👎👎👎 :", error);
  res.status(error.statusCode).json({
    message: "error has occurred",
    errorStatus: error.statusCode,
    errorMessage: error.message,
  });
  next();
};

module.exports = errorHandler;
