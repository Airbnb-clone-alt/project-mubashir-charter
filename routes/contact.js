const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('contact');
});

router.post('/', (req, res) => {
  console.log(req.body);  // Yeh test ke liye print karega jo user submit kare
  req.flash('success', 'Thank you for contacting us! We will get back to you soon.');
  res.redirect('/');
});

module.exports = router;
