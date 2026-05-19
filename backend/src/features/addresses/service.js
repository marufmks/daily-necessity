const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

async function list(userId) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function create(userId, data) {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.address.create({ data: { ...data, userId } });
}

async function update(userId, id, data) {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== userId) throw new ApiError(404, "Address not found");

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({ where: { id }, data });
}

async function remove(userId, id) {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== userId) throw new ApiError(404, "Address not found");
  await prisma.address.delete({ where: { id } });
}

module.exports = { list, create, update, remove };
