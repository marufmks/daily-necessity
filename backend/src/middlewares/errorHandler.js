const ApiError = require("../utils/ApiError");

module.exports = (err, _req, res, _next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: true,
    message,
    ...(statusCode === 400 && typeof message === "object" ? { fields: message } : {}),
  });
};
