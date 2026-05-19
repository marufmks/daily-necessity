const { z } = require("zod");

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  imageUrl: z.string().optional(),
  unit: z.string().default("piece"),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
