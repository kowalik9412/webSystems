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
