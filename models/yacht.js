const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const yachtSchema = new Schema({
  name: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Yacht', yachtSchema);
