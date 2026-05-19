const { z } = require("zod");

const createSchema = z.object({
  orderId: z.string().min(1),
  method: z.string().min(1),
});

module.exports = { createSchema };
