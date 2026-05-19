const asyncHandler = require("../../utils/asyncHandler");
const inventoryService = require("./service");

exports.getByProductId = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getByProductId(req.params.productId);
  res.json(inventory);
});

exports.update = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.update(req.params.productId, req.body);
  res.json(inventory);
});
