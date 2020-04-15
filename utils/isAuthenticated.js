// MIDDLEWARE check if user is currently logged in
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }
  next();
};
