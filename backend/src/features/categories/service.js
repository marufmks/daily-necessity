const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

async function list() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

async function getBySlug(slug) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: { inventory: { select: { quantity: true } } },
      },
    },
  });
  if (!category) throw new ApiError(404, "Category not found");
  return category;
}

async function create(data) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "Category slug already exists");
  return prisma.category.create({ data });
}

async function update(id, data) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new ApiError(404, "Category not found");
  if (data.slug) {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) throw new ApiError(409, "Category slug already exists");
  }
  return prisma.category.update({ where: { id }, data });
}

async function remove(id) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new ApiError(404, "Category not found");
  await prisma.category.delete({ where: { id } });
}

module.exports = { list, getBySlug, create, update, remove };
