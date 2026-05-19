const prisma = require("../../lib/prisma");
const ApiError = require("../../utils/ApiError");

async function list(query) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 20,
    sort = "createdAt",
    order = "desc",
  } = query;

  const where = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.categoryId = category;
  if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        inventory: { select: { quantity: true } },
      },
      orderBy: { [sort]: order },
      skip,
      take: Number(limit),
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
}

async function getBySlug(slug) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      inventory: { select: { quantity: true } },
    },
  });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
}

async function create(data) {
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "Product slug already exists");
  return prisma.product.create({ data });
}

async function update(id, data) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError(404, "Product not found");
  if (data.slug) {
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) throw new ApiError(409, "Product slug already exists");
  }
  return prisma.product.update({ where: { id }, data });
}

async function remove(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError(404, "Product not found");
  await prisma.product.delete({ where: { id } });
}

module.exports = { list, getBySlug, create, update, remove };
