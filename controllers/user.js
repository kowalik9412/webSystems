const axios = require('axios');
const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.getDashboardPage = (req, res, next) => {
  res.render('user/dashboard', {
    title: 'Dashboard',
    response: [],
    userEmail: req.user.email
  });
};

exports.postSearch = (req, res, next) => {
  const errors = validationResult(req);
  const name = req.body.searchInput;

  if (!errors.isEmpty()) {
    return res.render('user/dashboard', {
      title: 'Dashboard - Error',
      response: [],
      errors: errors.array(),
      userEmail: req.user.email
    });
  }

  axios({
    method: 'GET',
    url: 'http://www.omdbapi.com/?apikey=7d77863c&',
    params: {
      s: `${name}`
    }
  })
    .then(response => {
      const resp = response.data.Search;
      res.render('user/dashboard', {
        title: 'Dashboard',
        response: resp,
        userEmail: req.user.email
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getSearchDetails = (req, res, next) => {
  const imdbID = req.params.imdbID;

  axios({
    method: 'GET',
    url: 'http://www.omdbapi.com/?apikey=7d77863c&',
    params: {
      i: imdbID,
      plot: 'full'
    }
  })
    .then(response => {
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
        totalSeasons
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
        seasons: totalSeasons
      };

      res.render('user/searchdetails', {
        title: data.title,
        details: data,
        userEmail: req.user.email
      });
    })
    .catch(error => {
      console.log(error);
      res.redirect('/');
    });
};

exports.postSaveToProfile = (req, res, next) => {
  const imdbID = req.params.imdbID;
  const userId = req.user._id;
  let data = {};

  axios({
    method: 'GET',
    url: 'http://www.omdbapi.com/?apikey=7d77863c&',
    params: {
      i: imdbID,
      plot: 'full'
    }
  })
    .then(response => {
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
        totalSeasons
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
        seasons: totalSeasons
      };
    })
    .then(result => {
      User.findById({ _id: userId })
        .then(user => {
          // If profile does not exist redirect to /
          if (!user) {
            res.redirect('/');
          }
          // If profile exists
          else {
            const userData = user.saved;
            let idArray = [];
            userData.forEach(entry => {
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
        .catch(error => {
          res.redirect('/');
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
      res.redirect('/');
    });
};

exports.getProfilePage = (req, res, next) => {
  const userId = req.user._id;

  User.findById({ _id: userId })
    .then(user => {
      if (!user) {
        res.redirect('/');
      } else {
        resp = user.saved;
        res.render('user/profile', {
          title: 'User',
          response: resp,
          userEmail: req.user.email
        });
      }
    })
    .catch(error => {
      res.redirect('/');
      console.log(error);
    });
};

exports.getDeleteSaved = (req, res, next) => {
  let data = [];
  const imdbIDtoRemoved = req.params.id;
  const userId = req.user._id;

  User.findById({ _id: userId })
    .then(user => {
      if (!user) {
        res.redirect('/');
      } else {
        data = user.saved;
        user.saved = data.filter(entry => entry.imdbID !== imdbIDtoRemoved);
        user.saved.forEach(entry => {
          if (entry == {}) {
            entry.delete(entry);
          }
        });
        user.save();
        res.redirect('/user/profile');
      }
    })
    .catch(error => {
      console.log(error);
      res.redirect('/user/profile');
    });
};
