const { Router } = require("express");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const validate = require("../../middlewares/validate");
const ctrl = require("./controller");
const { updateSchema } = require("./validation");

const router = Router();

router.get("/:productId", auth, admin, ctrl.getByProductId);
router.put("/:productId", auth, admin, validate(updateSchema), ctrl.update);

module.exports = router;
