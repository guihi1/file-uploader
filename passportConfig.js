import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import * as userQueries from './queries/userQueries.js';

function configurePassport(passport) {
  passport.use(
    new LocalStrategy(async (email, password, done) => {
      try {
        const user = await userQueries.getUserByEmail(email);

        if (!user) {
          return done(null, false, { message: "Email isn't registered" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userQueries.getUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

export default configurePassport;
