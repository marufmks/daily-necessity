const jwt = require("jsonwebtoken");
const config = require("../config");
const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");

module.exports = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return next(new ApiError(401, "User not found"));
    req.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
