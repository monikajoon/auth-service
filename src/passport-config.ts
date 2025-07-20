import * as passport from 'passport';

  // Implement serializeUser and deserializeUser
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

export default passport;
