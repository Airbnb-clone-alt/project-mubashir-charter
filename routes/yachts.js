const express = require('express');
const router = express.Router();
const Yacht = require('../models/yacht');
const { isLoggedIn, isAuthor } = require('../utils/middleware'); // Make sure utils/middleware.js exists

// Show all yachts
router.get('/', async (req, res) => {
  const yachts = await Yacht.find({});
  res.render('yachts/index', { yachts, msg: req.query.msg || null });
});


// New yacht form (login required)
router.get('/new', isLoggedIn, (req, res) => {
  res.render('yachts/new');
});

// Create yacht (login required)
router.post('/', isLoggedIn, async (req, res) => {
  const yacht = new Yacht(req.body.yacht);
  yacht.author = req.user._id;  // Link yacht to logged-in user
  await yacht.save();
  req.flash('success', 'Successfully added a new yacht!');
  res.redirect("/yachts");
});

// Show yacht details
router.get('/:id', async (req, res) => {
  const yacht = await Yacht.findById(req.params.id).populate('author');
  if (!yacht) {
    req.flash('error', 'Yacht not found!');
    return res.redirect('/yachts');
  }
  res.render('yachts/show', { yacht });
});

// Edit yacht form (login + author required)
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
  const yacht = await Yacht.findById(req.params.id);
  if (!yacht) {
    req.flash('error', 'Yacht not found!');
    return res.redirect('/yachts');
  }
  res.render('yachts/edit', { yacht });
});

// Update yacht (login + author required)
router.put('/:id', isLoggedIn, isAuthor, async (req, res) => {
  await Yacht.findByIdAndUpdate(req.params.id, req.body.yacht);
  req.flash('success', 'Yacht updated successfully!');
  res.redirect(`/yachts/${req.params.id}`);
});

// Delete yacht (login + author required)
router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
  await Yacht.findByIdAndDelete(req.params.id);
  req.flash('success', 'Yacht deleted successfully!');
  res.redirect('/yachts');
});




module.exports = router;

