const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.serializeUser(function(user,done) {
    // process.nextTick(function() {
      done(null, user);
    });

  
  passport.deserializeUser(function(user, done) {
    // process.nextTick(function() {
        done(null, user);
      })

passport.use(new GoogleStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
    // });
  }
));
