const asyncHandler = require("../../utils/asyncHandler");
const userService = require("./service");

exports.list = asyncHandler(async (_req, res) => {
  const users = await userService.list();
  res.json(users);
});

exports.getById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json(user);
});

exports.update = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  res.json(user);
});

exports.remove = asyncHandler(async (req, res) => {
  await userService.remove(req.params.id);
  res.status(204).end();
});
