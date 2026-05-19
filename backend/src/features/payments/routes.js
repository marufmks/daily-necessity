const { Router } = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const ctrl = require("./controller");
const { createSchema } = require("./validation");

const router = Router();

router.post("/", auth, validate(createSchema), ctrl.create);

module.exports = router;
