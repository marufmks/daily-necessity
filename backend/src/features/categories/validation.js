const { z } = require("zod");

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
