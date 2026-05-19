const asyncHandler = require("../../utils/asyncHandler");
const cartService = require("./service");

exports.list = asyncHandler(async (req, res) => {
  const items = await cartService.list(req.user.id);
  res.json(items);
});

exports.add = asyncHandler(async (req, res) => {
  const item = await cartService.add(req.user.id, req.body);
  res.status(201).json(item);
});

exports.updateQuantity = asyncHandler(async (req, res) => {
  const item = await cartService.updateQuantity(req.user.id, req.params.itemId, req.body);
  res.json(item);
});

exports.remove = asyncHandler(async (req, res) => {
  await cartService.remove(req.user.id, req.params.itemId);
  res.status(204).end();
});
