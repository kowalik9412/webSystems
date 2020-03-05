// Import essentials
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

// Import routes
const authenticationRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const indexRoutes = require('./routes/index');

const app = express();

// Global Variables
const PORT = process.env.PORT || 8080;
const MONGODB_URI = `${process.env.MONGODB}`;
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

// Middleware
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/authentication', authenticationRoutes);
app.use('/user', userRoutes);
app.use('/', indexRoutes);

// Connect to DB
mongoose
  .connect(MONGODB_URI, OPTIONS)
  .then(result => {
    app.listen(PORT, () => {
      console.log(`\n\nServer running on PORT ${PORT}\n\n`);
    });
  })
  .catch(error => {
    console.log(error);
  });
