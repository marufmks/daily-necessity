const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

async function list() {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

async function update(id, data) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });
}

async function remove(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");
  await prisma.user.delete({ where: { id } });
}

module.exports = { list, getById, update, remove };
