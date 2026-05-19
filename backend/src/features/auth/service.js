const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../../lib/prisma");
const config = require("../../config");
const ApiError = require("../../utils/ApiError");

async function register({ email, password, name, phone }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, phone },
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });

  return { user };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const accessToken = jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken: refreshToken.token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

async function refresh(refreshTokenStr) {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenStr },
    include: { user: { select: { id: true, email: true, name: true, role: true } } },
  });

  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const accessToken = jwt.sign(
    { userId: stored.user.id, role: stored.user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN }
  );

  return { accessToken, user: stored.user };
}

async function logout(refreshTokenStr) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshTokenStr } });
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

async function createRefreshToken(userId) {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
}

module.exports = { register, login, refresh, logout, getProfile };
