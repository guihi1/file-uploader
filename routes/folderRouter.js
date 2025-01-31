import express from 'express';
import * as folderController from '../controllers/folderController.js';

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/sign-in');
};

router.get('/folder/my-files', ensureAuthenticated, folderController.folderGet);

router.get(
  '/folder/:folderId',
  ensureAuthenticated,
  folderController.folderGet,
);

router.post(
  '/folder/create',
  ensureAuthenticated,
  folderController.folderCreatePost,
);

export default router;
