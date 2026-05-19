const { Router } = require("express");
const authRoutes = require("../features/auth/routes");
const categoryRoutes = require("../features/categories/routes");
const productRoutes = require("../features/products/routes");
const inventoryRoutes = require("../features/inventory/routes");
const cartRoutes = require("../features/cart/routes");
const addressRoutes = require("../features/addresses/routes");
const orderRoutes = require("../features/orders/routes");
const userRoutes = require("../features/users/routes");
const paymentRoutes = require("../features/payments/routes");

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/cart", cartRoutes);
router.use("/addresses", addressRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
