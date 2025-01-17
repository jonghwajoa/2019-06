import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import authService from '../v1/auth/service';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'id',
      passwordField: 'password',
    },
    async (id, password, done) => {
      let user;
      try {
        user = await authService.localLogin({ id, password });
        delete user.password;
      } catch (err) {
        return done(err);
      }
      return done(null, user);
    },
  ),
);

export default passport;
