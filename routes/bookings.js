const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Yacht = require('../models/yacht');

router.post('/:yachtId', async (req, res) => {
  const yacht = await Yacht.findById(req.params.yachtId);
  const booking = new Booking({
    yacht: yacht._id,
    user: req.user._id,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  await booking.save();
  req.flash('success', 'Booking created!');
  res.redirect('/bookings');
});

router.get('/', async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('yacht');
  res.render('bookings/index', { bookings });
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  req.flash('success', 'Booking cancelled successfully!');
  res.redirect('/bookings');
});

module.exports = router;
