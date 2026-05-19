const { z } = require("zod");

const createSchema = z.object({
  label: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  isDefault: z.boolean().default(false),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
