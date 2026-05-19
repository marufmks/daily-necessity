const { z } = require("zod");

const updateSchema = z.object({
  quantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(1).optional(),
});

module.exports = { updateSchema };
