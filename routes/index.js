const express = require('express');
const indexController = require('../controllers/index');

const router = express.Router();

// GET Index Page
router.get('/', indexController.getIndexPage);

module.exports = router;
