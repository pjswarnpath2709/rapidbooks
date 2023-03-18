exports.errorMessages = {
  AccountNotFound: {
    message: "account not found in the database",
    status: 404,
  },
  InvoiceNotFound: {
    message: "invoice not found in the database",
    status: 404,
  },
};

exports.setDefaultStatus = (error) => {
  error.statusCode = error.statusCode ?? 500;
};

exports.generateError = ({ message, status }) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};
