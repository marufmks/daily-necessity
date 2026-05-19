const asyncHandler = require("../../utils/asyncHandler");
const orderService = require("./service");

exports.create = asyncHandler(async (req, res) => {
  const order = await orderService.create(req.user.id, req.body);
  res.status(201).json(order);
});

exports.list = asyncHandler(async (req, res) => {
  const orders = await orderService.listByUser(req.user.id);
  res.json(orders);
});

exports.getById = asyncHandler(async (req, res) => {
  const order = await orderService.getById(req.user.id, req.params.id);
  res.json(order);
});

exports.listAll = asyncHandler(async (_req, res) => {
  const orders = await orderService.listAll();
  res.json(orders);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status);
  res.json(order);
});
