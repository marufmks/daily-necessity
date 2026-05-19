const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

async function list(userId) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          imageUrl: true,
          unit: true,
          inventory: { select: { quantity: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

async function add(userId, { productId, quantity }) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: { userId, productId, quantity },
  });
}

async function updateQuantity(userId, itemId, { quantity }) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId) throw new ApiError(404, "Cart item not found");

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

async function remove(userId, itemId) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId) throw new ApiError(404, "Cart item not found");

  await prisma.cartItem.delete({ where: { id: itemId } });
}

module.exports = { list, add, updateQuantity, remove };
