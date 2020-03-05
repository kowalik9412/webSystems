const express = require('express');
const authenticationController = require('../controllers/authentication');

const router = express.Router();

// GET Index Page
router.get('/', authenticationController.getIndexPage);

// GET Register Page
router.get('/register', authenticationController.getRegisterPage);

module.exports = router;
