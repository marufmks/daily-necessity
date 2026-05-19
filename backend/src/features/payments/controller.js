const asyncHandler = require("../../utils/asyncHandler");
const paymentService = require("./service");

exports.create = asyncHandler(async (req, res) => {
  const payment = await paymentService.create(req.user.id, req.body);
  res.status(201).json(payment);
});
