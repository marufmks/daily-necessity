const { Router } = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const ctrl = require("./controller");
const { createSchema, updateSchema } = require("./validation");

const router = Router();

router.get("/", auth, ctrl.list);
router.post("/", auth, validate(createSchema), ctrl.create);
router.put("/:id", auth, validate(updateSchema), ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
