const axios = require('axios');
const { validationResult } = require('express-validator');

exports.getDashboardPage = (req, res, next) => {
  res.render('user/dashboard', {
    title: 'Dashboard',
    response: []
  });
};

exports.postSearch = (req, res, next) => {
  const errors = validationResult(req);
  const name = req.body.searchInput;

  if (!errors.isEmpty()) {
    return res.render('user/dashboard', {
      title: 'Dashboard - Error',
      response: [],
      errors: errors.array()
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
        response: resp
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getSearchDetails = (req, res, next) => {
  const imdbID = req.params.imdbID;
  console.log(imdbID);

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
      console.log(data.seasons);

      res.render('user/searchdetails', {
        title: data.title,
        details: data
      });
    })
    .catch(error => {
      console.log(error);
    });
};
