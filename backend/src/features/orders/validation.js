const { z } = require("zod");

const createSchema = z.object({
  addressId: z.string().min(1),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

module.exports = { createSchema, updateStatusSchema };
