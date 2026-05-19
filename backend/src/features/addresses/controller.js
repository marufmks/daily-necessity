const asyncHandler = require("../../utils/asyncHandler");
const addressService = require("./service");

exports.list = asyncHandler(async (req, res) => {
  const addresses = await addressService.list(req.user.id);
  res.json(addresses);
});

exports.create = asyncHandler(async (req, res) => {
  const address = await addressService.create(req.user.id, req.body);
  res.status(201).json(address);
});

exports.update = asyncHandler(async (req, res) => {
  const address = await addressService.update(req.user.id, req.params.id, req.body);
  res.json(address);
});

exports.remove = asyncHandler(async (req, res) => {
  await addressService.remove(req.user.id, req.params.id);
  res.status(204).end();
});
