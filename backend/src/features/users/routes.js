const { Router } = require("express");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const ctrl = require("./controller");

const router = Router();

router.get("/", auth, admin, ctrl.list);
router.get("/:id", auth, admin, ctrl.getById);
router.put("/:id", auth, admin, ctrl.update);
router.delete("/:id", auth, admin, ctrl.remove);

module.exports = router;
