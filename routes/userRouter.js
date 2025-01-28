import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/sign-up', userController.signUpGet);

router.post(
  '/sign-up',
  userController.validateSignUp,
  userController.signUpPost,
);

router.get('/sign-in', userController.signInGet);

router.post(
  '/sign-in',
  userController.validateSignIn,
  userController.signInPost,
);

export default router;
