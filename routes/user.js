const express = require('express');
const userController = require('../controllers/user');
const { check } = require('express-validator');
const isUserAuthenticated = require('../utils/isAuthenticated');

const router = express.Router();

// GET Index Page
router.get('/dashboard', isUserAuthenticated, userController.getDashboardPage);

// POST Search
router.post(
  '/search',
  check('searchInput')
    .notEmpty()
    .withMessage('Please enter a name'),
  isUserAuthenticated,
  userController.postSearch
);

// POST Search/:token
router.get(
  '/search/:imdbID',
  isUserAuthenticated,
  userController.getSearchDetails
);

module.exports = router;
