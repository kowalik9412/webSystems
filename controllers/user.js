const axios = require('axios');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// GET Dashboard
exports.getDashboardPage = (req, res, next) => {
  res.render('user/dashboard', {
    title: 'Dashboard',
    response: [],
    userEmail: req.user.email,
    specError: [],
  });
};

// POST Search
exports.postSearch = (req, res, next) => {
  const errors = validationResult(req);
  const name = req.body.searchInput;

  if (!errors.isEmpty()) {
    return res.render('user/dashboard', {
      title: 'Dashboard - Error',
      response: [],
      errors: errors.array(),
      userEmail: req.user.email,
      specError: [],
    });
  }

  axios({
    method: 'GET',
    url: 'http://www.omdbapi.com/?apikey=7d77863c&',
    params: {
      s: `${name}`,
    },
  })
    .then((response) => {
      const resp = response.data.Search;
      res.render('user/dashboard', {
        title: 'Dashboard',
        response: resp,
        userEmail: req.user.email,
        specError: [],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// GET Target's details
exports.getSearchDetails = (req, res, next) => {
  const imdbID = req.params.imdbID;

  axios({
    method: 'GET',
    url: 'http://www.omdbapi.com/?apikey=7d77863c&',
    params: {
      i: imdbID,
      plot: 'full',
    },
  })
    .then((response) => {
      const resp = response.data;
      const {
        Title,
        Year,
        Released,
        Genre,
        Runtime,
        Director,
        Writer,
        Actors,
        Plot,
        Language,
        Country,
        Awards,
        Poster,
        imdbRating,
        imdbVotes,
        imdbID,
        Type,
        totalSeasons,
      } = resp;
      const data = {
        title: Title,
        year: Year,
        released: Released,
        runtime: Runtime,
        genre: Genre,
        director: Director,
        writer: Writer,
        actors: Actors,
        plot: Plot,
        lang: Language,
        country: Country,
        awards: Awards,
        posterUrl: Poster,
        rating: imdbRating,
        votes: imdbVotes,
        imdbID: imdbID,
        type: Type,
        seasons: totalSeasons,
      };

      res.render('user/searchdetails', {
        title: data.title,
        details: data,
        userEmail: req.user.email,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/');
    });
};

// POST Save target to profile
exports.postSaveToProfile = (req, res, next) => {
  const imdbID = req.params.imdbID;
  const userId = req.user._id;
  let data = {};

  axios({
    method: 'GET',
    url: 'http://www.omdbapi.com/?apikey=7d77863c&',
    params: {
      i: imdbID,
      plot: 'full',
    },
  })
    .then((response) => {
      const resp = response.data;
      const {
        Title,
        Year,
        Released,
        Genre,
        Runtime,
        Director,
        Writer,
        Actors,
        Plot,
        Language,
        Country,
        Awards,
        Poster,
        imdbRating,
        imdbVotes,
        imdbID,
        Type,
        totalSeasons,
      } = resp;
      data = {
        title: Title,
        year: Year,
        released: Released,
        runtime: Runtime,
        genre: Genre,
        director: Director,
        writer: Writer,
        actors: Actors,
        plot: Plot,
        lang: Language,
        country: Country,
        awards: Awards,
        posterUrl: Poster,
        rating: imdbRating,
        votes: imdbVotes,
        imdbID: imdbID,
        type: Type,
        seasons: totalSeasons,
      };
    })
    .then((result) => {
      User.findById({ _id: userId })
        .then((user) => {
          // If profile does not exist redirect to /
          if (!user) {
            res.redirect('/');
          }
          // If profile exists
          else {
            const userData = user.saved;
            let idArray = [];
            userData.forEach((entry) => {
              idArray.push(entry.imdbID);
            });
            // If idArray DOES NOT HAVE imdbID, then push
            if (!idArray.includes(data.imdbID)) {
              user.saved.push(data);
              user.save();
              res.redirect('/user/profile');
            }
            // If idArray DOES include imdbID, then abandon
            else {
              res.redirect('/user/profile');
            }
          }
        })
        .catch((error) => {
          res.redirect('/');
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/');
    });
};

// GET Profile Page
exports.getProfilePage = (req, res, next) => {
  const userId = req.user._id;
  let resp = [];
  let other = [];
  let ola = [];
  let bef = [];

  User.find({ _id: { $ne: userId } })
    .then((users) => {
      users.forEach((entry) => {
        return other.push(entry.saved);
      });
      ola = [].concat.apply([], other);
    })
    .catch((errors) => {
      console.log(errors);
      next();
    });

  User.find({ _id: { $ne: userId } })
    .then((users) => {
      users.forEach((entry) => {
        return bef.push(entry.email);
      });
      users = [].concat.apply([], bef);
    })
    .catch((errors) => {
      console.log(errors);
      next();
    });

  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        res.redirect('/');
      } else {
        resp = user.saved;
        res.render('user/profile', {
          title: 'User',
          response: resp,
          userEmail: req.user.email,
          otherUser: ola,
          otherProfile: bef,
        });
      }
    })
    .catch((error) => {
      res.redirect('/');
      console.log(error);
    });
};

// GET Delete target by id
exports.getDeleteSaved = (req, res, next) => {
  let data = [];
  const imdbIDtoRemoved = req.params.id;
  const userId = req.user._id;

  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        res.redirect('/');
      } else {
        data = user.saved;
        user.saved = data.filter((entry) => entry.imdbID !== imdbIDtoRemoved);
        user.saved.forEach((entry) => {
          if (entry == {}) {
            entry.delete(entry);
          }
        });
        user.save();
        res.redirect('/user/profile');
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/user/profile');
    });
};

// Get target's page
exports.getSpecificProfilePage = (req, res, next) => {
  const email = req.params.email;
  let resp = [];

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.redirect('/user/profile');
      }
      resp = user.saved;
      res.render('user/specprofile', {
        title: `${user.email} Profile Page`,
        userEmail: req.user.email,
        otherEmail: user.email,
        response: resp,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/');
    });
};
