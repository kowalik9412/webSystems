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

// GET Search/:token
router.get(
  '/search/:imdbID',
  isUserAuthenticated,
  userController.getSearchDetails
);

// POST Save/:token
router.post(
  '/save/:imdbID',
  isUserAuthenticated,
  userController.postSaveToProfile
);

// Get Profile Page
router.get('/profile', isUserAuthenticated, userController.getProfilePage);

// Get Delete Saved/:id
router.get('/delete/:id', isUserAuthenticated, userController.getDeleteSaved);

module.exports = router;
