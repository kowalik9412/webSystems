// Import essentials
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('cookie-session');
const passport = require('passport');
const passportLocal = require('passport-local');
require('./utils/passport')(passport);
require('dotenv').config();

// Import route
const authenticationRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const indexRoutes = require('./routes/index');

const app = express();

// Global Variables
const PORT = process.env.PORT || 8080;
// const MONGODB_URI = `${process.env.MONGODB}`;
const MONGODB_URI = `${process.env.MONGODBLOCAL}`;
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// Middleware
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: `${process.env.SESSIONSTRING}`,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/authentication', authenticationRoutes);
app.use('/user', userRoutes);
app.use('/', indexRoutes);

// Connect to DB
mongoose
  .connect(MONGODB_URI, OPTIONS)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`\n\nServer running on PORT ${PORT}\n\n`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
