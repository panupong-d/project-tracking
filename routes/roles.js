const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');

/* GET users listing. */
router.get('/', roleController.index);

module.exports = router;
