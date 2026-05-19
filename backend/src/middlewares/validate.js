const ApiError = require("../utils/ApiError");

module.exports = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.flatten().fieldErrors;
    return next(new ApiError(400, messages));
  }
  req.body = result.data;
  next();
};
