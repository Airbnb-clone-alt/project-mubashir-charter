const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  googleId: String,   // Google से आएगा
  username: String    // Google displayName store करने के लिए (या manually भी डाल सकते हो)
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
