const { Router } = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const ctrl = require("./controller");
const { registerSchema, loginSchema, refreshSchema } = require("./validation");

const router = Router();

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);
router.post("/refresh", validate(refreshSchema), ctrl.refresh);
router.post("/logout", ctrl.logout);
router.get("/me", auth, ctrl.me);

module.exports = router;
