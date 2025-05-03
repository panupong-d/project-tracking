const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.index);

router.get("/:id", userController.show);

router.get("/:email/:password", userController.login);

// router.post('/', userController.insert);
router.post("/", userController.register);

router.put("/:id", userController.update);

router.delete("/:id", userController.destroy);

module.exports = router;
