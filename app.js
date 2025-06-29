require('dotenv').config();


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const flash = require("connect-flash");


// const dbUrl = "mongodb://127.0.0.1:27017/charter-clone";
 const dbUrl = process.env.ATLASDB_URL;

main().catch(err => console.error("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ MongoDB connected");
}

// View + middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:  process.env.SECRET
  },
  touchAfter: 24 * 3600 // session update frequency in seconds (24 hours)
});

app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
  maxAge: 7 * 24 * 60 * 60 * 1000,              // 7 days in milliseconds
  httpOnly: true                                // cookie only accessible by the web server
},
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Local strategy
passport.use(new LocalStrategy(User.authenticate()));

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENTID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialize / Deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const yachtRoutes = require('./routes/yachts');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');

app.use('/yachts', yachtRoutes);
app.use('/bookings', bookingRoutes);
app.use('/', userRoutes);
app.use('/contact', contactRoutes);

app.get('/terms', (req, res) => {
  res.render('terms');
});

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => {
  console.log('✅ Server running on port 3000');
});
