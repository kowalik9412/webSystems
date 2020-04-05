exports.getIndexPage = (req, res, next) => {
  if (!req.user) {
    res.render('index', {
      title: 'Sign In'
    });
  } else {
    res.redirect('user/dashboard');
  }
};
