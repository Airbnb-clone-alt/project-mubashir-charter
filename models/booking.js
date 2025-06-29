const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  yacht: { type: Schema.Types.ObjectId, ref: 'Yacht' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Booking', BookingSchema);
