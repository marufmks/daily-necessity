const asyncHandler = require("../../utils/asyncHandler");
const categoryService = require("./service");

exports.list = asyncHandler(async (_req, res) => {
  const categories = await categoryService.list();
  res.json(categories);
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getBySlug(req.params.slug);
  res.json(category);
});

exports.create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  res.status(201).json(category);
});

exports.update = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  res.json(category);
});

exports.remove = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  res.status(204).end();
});
