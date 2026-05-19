const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@daily-necessity.com" },
    update: {},
    create: {
      email: "admin@daily-necessity.com",
      passwordHash: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: customerPassword,
      name: "John Doe",
      role: "CUSTOMER",
    },
  });
  console.log("Customer user created:", customer.email);

  const categories = [
    { name: "Vegetables", slug: "vegetables", description: "Fresh vegetables" },
    { name: "Fruits", slug: "fruits", description: "Fresh fruits" },
    { name: "Dairy & Eggs", slug: "dairy-eggs", description: "Milk, cheese, eggs and more" },
    { name: "Bakery", slug: "bakery", description: "Fresh bread and baked goods" },
    { name: "Meat & Fish", slug: "meat-fish", description: "Fresh meat and seafood" },
    { name: "Beverages", slug: "beverages", description: "Drinks and juices" },
    { name: "Snacks", slug: "snacks", description: "Chips, cookies and treats" },
    { name: "Pantry", slug: "pantry", description: "Rice, oil, spices and staples" },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log("Categories created:", Object.keys(createdCategories).length);

  const products = [
    { name: "Tomato", slug: "tomato", price: 2.49, unit: "kg", categorySlug: "vegetables", imageUrl: "/images/tomato.jpg" },
    { name: "Potato", slug: "potato", price: 1.99, unit: "kg", categorySlug: "vegetables", imageUrl: "/images/potato.jpg" },
    { name: "Onion", slug: "onion", price: 1.49, unit: "kg", categorySlug: "vegetables", imageUrl: "/images/onion.jpg" },
    { name: "Spinach", slug: "spinach", price: 3.99, unit: "bunch", categorySlug: "vegetables", imageUrl: "/images/spinach.jpg" },
    { name: "Carrot", slug: "carrot", price: 2.99, unit: "kg", categorySlug: "vegetables", imageUrl: "/images/carrot.jpg" },

    { name: "Banana", slug: "banana", price: 1.29, unit: "dozen", categorySlug: "fruits", imageUrl: "/images/banana.jpg" },
    { name: "Apple", slug: "apple", price: 4.99, unit: "kg", categorySlug: "fruits", imageUrl: "/images/apple.jpg" },
    { name: "Orange", slug: "orange", price: 3.49, unit: "kg", categorySlug: "fruits", imageUrl: "/images/orange.jpg" },
    { name: "Grapes", slug: "grapes", price: 5.99, unit: "kg", categorySlug: "fruits", imageUrl: "/images/grapes.jpg" },
    { name: "Strawberry", slug: "strawberry", price: 6.99, unit: "box", categorySlug: "fruits", imageUrl: "/images/strawberry.jpg" },

    { name: "Whole Milk", slug: "whole-milk", price: 3.99, unit: "gallon", categorySlug: "dairy-eggs", imageUrl: "/images/milk.jpg" },
    { name: "Eggs (12 pcs)", slug: "eggs-12", price: 4.49, unit: "dozen", categorySlug: "dairy-eggs", imageUrl: "/images/eggs.jpg" },
    { name: "Cheddar Cheese", slug: "cheddar-cheese", price: 5.99, unit: "block", categorySlug: "dairy-eggs", imageUrl: "/images/cheddar.jpg" },
    { name: "Butter", slug: "butter", price: 4.49, unit: "block", categorySlug: "dairy-eggs", imageUrl: "/images/butter.jpg" },
    { name: "Greek Yogurt", slug: "greek-yogurt", price: 5.49, unit: "tub", categorySlug: "dairy-eggs", imageUrl: "/images/yogurt.jpg" },

    { name: "White Bread", slug: "white-bread", price: 2.99, unit: "loaf", categorySlug: "bakery", imageUrl: "/images/bread.jpg" },
    { name: "Croissant", slug: "croissant", price: 3.49, unit: "piece", categorySlug: "bakery", imageUrl: "/images/croissant.jpg" },

    { name: "Chicken Breast", slug: "chicken-breast", price: 8.99, unit: "kg", categorySlug: "meat-fish", imageUrl: "/images/chicken.jpg" },
    { name: "Salmon Fillet", slug: "salmon-fillet", price: 14.99, unit: "kg", categorySlug: "meat-fish", imageUrl: "/images/salmon.jpg" },

    { name: "Orange Juice", slug: "orange-juice", price: 4.99, unit: "bottle", categorySlug: "beverages", imageUrl: "/images/orange-juice.jpg" },
    { name: "Mineral Water", slug: "mineral-water", price: 1.49, unit: "bottle", categorySlug: "beverages", imageUrl: "/images/water.jpg" },

    { name: "Potato Chips", slug: "potato-chips", price: 3.49, unit: "bag", categorySlug: "snacks", imageUrl: "/images/chips.jpg" },
    { name: "Chocolate Bar", slug: "chocolate-bar", price: 2.49, unit: "piece", categorySlug: "snacks", imageUrl: "/images/chocolate.jpg" },

    { name: "Basmati Rice", slug: "basmati-rice", price: 12.99, unit: "kg", categorySlug: "pantry", imageUrl: "/images/rice.jpg" },
    { name: "Olive Oil", slug: "olive-oil", price: 9.99, unit: "bottle", categorySlug: "pantry", imageUrl: "/images/olive-oil.jpg" },
  ];

  for (const product of products) {
    const categoryId = createdCategories[product.categorySlug];
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        unit: product.unit,
        imageUrl: product.imageUrl,
        categoryId,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: created.id },
      update: {},
      create: { productId: created.id, quantity: 100, lowStockThreshold: 10 },
    });
  }
  console.log("Products created:", products.length);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
