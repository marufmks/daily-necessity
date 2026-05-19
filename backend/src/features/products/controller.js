const asyncHandler = require("../../utils/asyncHandler");
const productService = require("./service");

exports.list = asyncHandler(async (req, res) => {
  const result = await productService.list(req.query);
  res.json(result);
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getBySlug(req.params.slug);
  res.json(product);
});

exports.create = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);
  res.status(201).json(product);
});

exports.update = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.json(product);
});

exports.remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).end();
});
