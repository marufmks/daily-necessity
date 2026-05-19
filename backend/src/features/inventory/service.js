const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

async function getByProductId(productId) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");

  let inventory = await prisma.inventory.findUnique({ where: { productId } });
  if (!inventory) {
    inventory = await prisma.inventory.create({ data: { productId, quantity: 0 } });
  }
  return inventory;
}

async function update(productId, data) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");

  return prisma.inventory.upsert({
    where: { productId },
    create: { productId, quantity: data.quantity, lowStockThreshold: data.lowStockThreshold ?? 10 },
    update: data,
  });
}

module.exports = { getByProductId, update };
