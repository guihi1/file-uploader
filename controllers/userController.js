import passport from 'passport';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import * as userQueries from '../queries/userQueries.js';

const signUpGet = (req, res) => {
  res.render('user_form', { title: 'Sign Up', user: req.user });
};

const validateSignUp = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (email) => {
      const existingUser = await userQueries.getUserByEmail(email);

      if (existingUser) {
        throw new Error('Email is already registered');
      }

      return true;
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const signUpPost = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('user_form', {
      title: 'Sign Up',
      user: req.user,
      errors: errors.array(),
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };
    await userQueries.createUser(user);
    res.redirect('/sign-in');
  }
};

const signInGet = (req, res) => {
  res.render('user_form', { title: 'Sign In', user: req.user });
};

const validateSignIn = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (email) => {
      const existingUser = await userQueries.getUserByEmail(email);

      if (!existingUser) {
        throw new Error('Email is not registered');
      }

      return true;
    }),
];

const signInPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign-in',
});

export {
  signUpGet,
  signInGet,
  validateSignUp,
  signUpPost,
  validateSignIn,
  signInPost,
};
