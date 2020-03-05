exports.getIndexPage = (req, res, next) => {
  res.render('index', {
    title: 'Sign In or Sign Up'
  });
};
