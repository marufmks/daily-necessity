const { Router } = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const ctrl = require("./controller");
const { addSchema, updateSchema } = require("./validation");

const router = Router();

router.get("/", auth, ctrl.list);
router.post("/", auth, validate(addSchema), ctrl.add);
router.put("/:itemId", auth, validate(updateSchema), ctrl.updateQuantity);
router.delete("/:itemId", auth, ctrl.remove);

module.exports = router;
