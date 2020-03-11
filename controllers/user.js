exports.getDashboardPage = (req, res, next) => {
  res.render('user/dashboard', {
    title: 'Dashboard'
  });
};
