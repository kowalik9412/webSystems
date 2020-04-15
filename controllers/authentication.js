const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator');

exports.getIndexPage = (req, res, next) => {
  res.render('index', {
    title: 'Sign In',
  });
};

exports.getLogout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

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

exports.getRegisterPage = (req, res, next) => {
  const errors = validationResult(req);

  res.render('register', {
    title: 'Sign Up',
    errors: errors.array(),
  });
};

exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const password1 = req.body.password1;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.render('register', {
      title: 'Sign Up - Error',
      errors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.render('register', {
          title: 'Sign Up - User Exists',
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
    .catch((erorr) => {
      res.render('register', {
        title: 'Sign Up - Something went wrong',
      });
      console.log(error);
    });
};
