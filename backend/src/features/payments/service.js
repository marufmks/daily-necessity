const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

async function create(userId, { orderId, method }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throw new ApiError(404, "Order not found");
  if (order.status !== "PENDING") throw new ApiError(400, "Order is not pending");

  const existing = await prisma.payment.findUnique({ where: { orderId } });
  if (existing) throw new ApiError(409, "Payment already exists for this order");

  return prisma.payment.create({
    data: {
      orderId,
      method,
      amount: order.total,
      status: "PENDING",
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    },
  });
}

module.exports = { create };
