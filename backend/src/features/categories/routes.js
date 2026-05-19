const { Router } = require("express");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const validate = require("../../middlewares/validate");
const ctrl = require("./controller");
const { createSchema, updateSchema } = require("./validation");

const router = Router();

router.get("/", ctrl.list);
router.get("/:slug", ctrl.getBySlug);
router.post("/", auth, admin, validate(createSchema), ctrl.create);
router.put("/:id", auth, admin, validate(updateSchema), ctrl.update);
router.delete("/:id", auth, admin, ctrl.remove);

module.exports = router;
