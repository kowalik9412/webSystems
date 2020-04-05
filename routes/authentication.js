const express = require('express');
const authenticationController = require('../controllers/authentication');
const { check } = require('express-validator');

const router = express.Router();

// GET Index Page
router.get('/', authenticationController.getIndexPage);

// GET Login Page
router.get('/login', authenticationController.getIndexPage);

// GET Logout
router.get('/logout', authenticationController.getLogout);

// POST Login
router.post(
  '/login',
  check('email')
    .isEmail()
    .withMessage('Enter valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('The password has to be at least 6 characters long'),
  authenticationController.postLogin
);

// GET Register Page
router.get('/register', authenticationController.getRegisterPage);

// POST Register
router.post(
  '/register',
  check('email')
    .isEmail()
    .withMessage('Enter valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('The password has to be at least 6 characters long'),

  authenticationController.postRegister
);

module.exports = router;
