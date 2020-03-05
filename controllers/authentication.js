exports.getIndexPage = (req, res, next) => {
  res.render('index', {
    title: 'Sign In'
  });
};

exports.getRegisterPage = (req, res, next) => {
  res.render('register', {
    title: 'Sign Up'
  });
};
