const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator');

// GET Index page
exports.getIndexPage = (req, res, next) => {
  res.render('index', {
    title: 'Sign In',
    specError: [],
  });
};

// GET sign out
exports.getLogout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

// POST Sign up
exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('index', {
      title: 'Sign In - Error',
      errors: errors.array(),
    });
  } else {
    passport.authenticate('local', {
      successRedirect: '/user/dashboard',
      failureRedirect: '/',
      failureFlash: true,
    })(req, res, next);
  }
};

// GET Register page
exports.getRegisterPage = (req, res, next) => {
  const errors = validationResult(req);

  res.render('register', {
    title: 'Sign Up',
    errors: errors.array(),
    specError: [],
  });
};

// POST Register
exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const password1 = req.body.password1;

  const errors = validationResult(req);
  let errorArray = [];

  if (!errors.isEmpty()) {
    return res.render('register', {
      title: 'Sign Up - Error',
      errors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        errorArray.push({ msg: 'User with this email exists' });
        res.render('register', {
          title: 'Sign Up - User Exists',
          specError: errorArray,
        });
      } else {
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            const user = new User({
              email: email,
              password: hashedPassword,
            });
            user.save();
          })
          .then((result) => {
            req.flash('success_message', 'You can now sign in');
            res.redirect('/');
          })
          .catch((error) => {
            res.render('register', {
              title: 'Sign Up - Something went wrong',
            });
            console.log(error);
          });
      }
    })
    .catch((error) => {
      res.render('register', {
        title: 'Sign Up - Something went wrong',
      });
      console.log(error);
    });
};
