const { Router } = require("express");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const validate = require("../../middlewares/validate");
const ctrl = require("./controller");
const { createSchema, updateStatusSchema } = require("./validation");

const router = Router();

router.post("/", auth, validate(createSchema), ctrl.create);
router.get("/", auth, ctrl.list);
router.get("/admin", auth, admin, ctrl.listAll);
router.get("/:id", auth, ctrl.getById);
router.put("/:id/status", auth, admin, validate(updateStatusSchema), ctrl.updateStatus);

module.exports = router;
