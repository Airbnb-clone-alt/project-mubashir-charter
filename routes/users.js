const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Register form
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Register logic
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Charter!');
      res.redirect('/yachts');
    });
  } catch (e) {
    req.flash('error', e.message || 'Registration failed!');
    res.redirect('/register');
  }
});

// Login form
router.get('/login', (req, res) => {
  res.render('users/login');
});

// Login logic
router.post('/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
  (req, res) => {
    req.flash('success', 'Welcome back to Charter!');
    res.redirect('/yachts');
  }
);

// Google OAuth start
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
  (req, res) => {
    req.flash('success', 'Logged in with Google successfully!');
    res.redirect('/yachts');
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully!');
    res.redirect('/');
  });
});

module.exports = router;
