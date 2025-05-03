const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/uploadController");

/* GET users listing. */

// router.post('/', userController.insert);
// router.post("/", uploadController.index);

router.post('/upload', uploadController.uploadMiddleware, uploadController.index);

module.exports = router;



