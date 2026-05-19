const ApiError = require("../utils/ApiError");

module.exports = (_req, _res, next) => {
  if (_req.user?.role !== "ADMIN") {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
};
