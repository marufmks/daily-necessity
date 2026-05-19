const { z } = require("zod");

const addSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

const updateSchema = z.object({
  quantity: z.number().int().min(1),
});

module.exports = { addSchema, updateSchema };
