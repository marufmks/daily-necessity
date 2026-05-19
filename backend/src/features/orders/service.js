const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

async function create(userId, { addressId, notes }) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { select: { id: true, price: true, name: true } } },
  });

  if (cartItems.length === 0) throw new ApiError(400, "Cart is empty");

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) throw new ApiError(404, "Address not found");

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + tax + shippingCost;

  const order = await prisma.$transaction(async (tx) => {
    const orderNumber = generateOrderNumber();

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        tax,
        shippingCost,
        total,
        addressId,
        notes,
        items: {
          create: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price,
            total: Number(item.product.price) * item.quantity,
          })),
        },
      },
      include: { items: { include: { product: { select: { name: true } } } } },
    });

    for (const item of cartItems) {
      await tx.inventory.update({
        where: { productId: item.product.id },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return order;
  });

  return order;
}

async function listByUser(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: { select: { name: true, slug: true, imageUrl: true } } } },
      payment: { select: { status: true, method: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getById(userId, orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { select: { name: true, slug: true, imageUrl: true } } } },
      address: true,
      payment: true,
    },
  });
  if (!order || order.userId !== userId) throw new ApiError(404, "Order not found");
  return order;
}

async function listAll() {
  return prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
      payment: { select: { status: true, method: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function updateStatus(orderId, status) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError(404, "Order not found");
  return prisma.order.update({ where: { id: orderId }, data: { status } });
}

module.exports = { create, listByUser, getById, listAll, updateStatus };
