const express = require('express');
const userController = require('../controllers/user');
const isUserAuthenticated = require('../utils/isAuthenticated');

const router = express.Router();

// GET Index Page
router.get('/dashboard', isUserAuthenticated, userController.getDashboardPage);

module.exports = router;
