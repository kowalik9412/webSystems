const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

// GET Index Page
router.get('/', userController.getIndexPage);

module.exports = router;
