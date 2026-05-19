const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./service");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

exports.refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.json(result);
});

exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.json({ message: "Logged out" });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json(user);
});
