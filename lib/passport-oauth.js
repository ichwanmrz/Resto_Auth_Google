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
    clientID: "171264909079-b51fl62r10ihn618m9lldfosmv32evdt.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
    // });
  }
));