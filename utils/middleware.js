const Yacht = require('../models/yacht');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const yacht = await Yacht.findById(id);
  if (!yacht) {
    req.flash('error', 'Yacht not found!');
    return res.redirect('/yachts');
  }
  if (!yacht.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission!');
    return res.redirect(`/yachts/${id}`);
  }
  next();
};
